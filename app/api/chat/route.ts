import { NextRequest } from "next/server";
import fs from "fs";
import PdfParse from "pdf-parse";
import {
  FeatureExtractionPipeline,
  pipeline,
  Tensor,
} from "@xenova/transformers";
import { createClient } from "@supabase/supabase-js";
import jsonData from "../../../src/utilities/json/details.json";

console.log(process.env.SUPABASE_URL);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

/**
 * Convert PDF parsed text into chunks of 500 characters with 50 characters interecting between 2 consecutive chunks
 * @param text pdf parsed text
 * @param chunkSize max size of characters to break the entire text
 * @param overlap common part between 2 consecutive parts of broken text
 * @returns
 */
function chunkText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

async function parsePdf(embedder: FeatureExtractionPipeline) {
  try {
    const dataBuffer = fs.readFileSync("public/files/sahilLokhandeCV.pdf");
    const pdfData = await PdfParse(dataBuffer);
    const fullText = pdfData.text;

    const chunks = chunkText(fullText);

    const pdfEmbeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const embedding2D: any = await embedder(chunk, {
          pooling: "mean",
          normalize: true,
        });
        return embedding2D.data;
      })
    );

    for (let i = 0; i < chunks.length; i++) {
      await supabase.from("documents").insert({
        content: chunks[i],
        embedding: Array.from(pdfEmbeddings[i]),
      });
    }
  } catch (error) {
    console.log(error, "errorrrr vectorising");
  }
}

const fetchMatchingEmbeddings = async (
  userEmbedding: Tensor,
  threshold: number
) => {
  // fetch the most similar documents based on user prompt
  const result = await supabase.rpc("match_documents", {
    query_embedding: Array.from(userEmbedding?.data),
    match_threshold: threshold,
    match_count: 5,
  });
  if (result?.data?.length > 1 || threshold <= 0.1) {
    console.log(threshold, "final threshold");
    return result;
  } else {
    return await fetchMatchingEmbeddings(userEmbedding, threshold - 0.2);
  }
};

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const supabaseDb = await supabase.from("documents").select();

  // initialize an embedder to embed pdf and puser input prompt
  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  console.log(supabaseDb?.data?.length, "supabaseDb?.data?.length");
  if (supabaseDb?.data?.length === 0) {
    // if embeddings are not already present, insert embeddings into the vector store first
    parsePdf(embedder);
  }

  const userEmbedding = await embedder(prompt, {
    pooling: "mean",
    normalize: true,
  });

  // fetch the most similar documents based on user prompt
  const matchResponse = await fetchMatchingEmbeddings(userEmbedding, 0.5);
  console.log(matchResponse?.data?.length, "matchResponse length");

  const processedPrompt = `
  You are a helpful assistant. Use the following context to answer:

  Context:
  ${matchResponse?.data?.map((m: any) => m.content).join("\n\n")}
  If there is anythng outside the above context, please respond politely with I have no context of outside world. If you dont have any context related to questions asked, then please share my contact details Email: ${
    jsonData.email
  }, Phone: ${jsonData.phone} and ask user to get back to me instead politely.

  Question:
  ${prompt}
  `;

  const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral",
      prompt: processedPrompt,
      stream: true, // ✅ Enable streaming
    }),
  });

  // Check if streaming is supported
  if (!ollamaResponse.body) {
    return new Response("No body in response from Ollama", { status: 500 });
  }

  // Proxy the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaResponse.body!.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      } catch (err) {
        console.error("Streaming error:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}

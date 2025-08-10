import { FeatureExtractionPipeline, Tensor } from "@xenova/transformers";
import PdfParse from "pdf-parse";
import { ArrayOfStringType } from "../commonInterface/commonInterfaces";
import { SupabaseClient } from "@supabase/supabase-js";

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

/**
 * Common place to embed chunks with constant configurations
 * @param embedder embedder tool used to embed chunks into vectors
 * @param chunk piece of text
 */
export async function embedChunks(embedder: FeatureExtractionPipeline, chunk: string) {
  try {
    const vectorResponse = await embedder(chunk, {
      pooling: "mean",
      normalize: true,
    });
    return vectorResponse;
  } catch (error) {}
}

/**
 * Process text, pdf file, json data etc and process them using chunkText function.
 * Convert them into chunks of 500 chars
 * @param data
 * @param dataType
 * @returns chunks of full text
 */
export async function parseDataIntoChunks(
  data: PdfParse.Result | string | any,
  dataType: "pdf" | "json" | "text"
) {
  let fullText = "";
  if (dataType === "pdf") {
    fullText = data.text;
  } else if (dataType === "json") {
    fullText = JSON.stringify(data);
  } else if (dataType === "text" && typeof data === "string") {
    fullText = data;
  }
  return chunkText(fullText);
}

export async function embedChunksIntoVectors(
  chunks: ArrayOfStringType,
  embedder: FeatureExtractionPipeline
) {
  try {
    const dataEmbeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const embedding2D: any = await embedChunks(embedder, chunk);
        return embedding2D.data;
      })
    );
    return dataEmbeddings;
  } catch (error) {
    console.log(error, "errorrrr vectorising");
  }
}

export async function storeVectorsIntoVectorStore(
  supabase: SupabaseClient<any, "public", any>,
  dataEmbeddings: any[],
  chunks: ArrayOfStringType
) {
  try {
    for (let i = 0; i < chunks.length; i++) {
      await supabase.from("documents").insert({
        content: chunks[i],
        embedding: Array.from(dataEmbeddings[i]),
      });
    }
  } catch (error) {}
}

/**
 * Based on user's prompt, fetch the matching data from the data base
 * @param userEmbedding user input prompt embeded
 * @param threshold matching threshold. 0.5 = 50% should match based on cosine / any other similarity
 * @returns
 */
export async function fetchMatchingEmbeddings(
  supabase: SupabaseClient<any, "public", any>,
  userEmbedding: Tensor,
  threshold: number
) {
  // fetch the most similar documents based on user prompt
  const result = await supabase.rpc("match_documents", {
    query_embedding: Array.from(userEmbedding?.data),
    match_threshold: threshold,
    match_count: 5,
  });
  if (result?.data?.length > 1 || threshold <= 0.1) {
    return result;
  } else {
    return await fetchMatchingEmbeddings(
      supabase,
      userEmbedding,
      threshold - 0.2
    );
  }
}

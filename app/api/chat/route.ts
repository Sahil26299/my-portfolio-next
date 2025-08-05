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
import csv from "csv-parser";

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

/**
 * Parse pdf / json / text -> embed it using embedder -> store its embeddings into vector store
 * @param embedder embedder used to embed data
 * @param fileType type of data being embedded
 * @param textualData if filetype is text -> provide textual data which contains text to embed
 */
async function parsePdf(
  embedder: FeatureExtractionPipeline,
  fileType: "pdf" | "json" | "text" = "pdf",
  textualData?: string
) {
  try {
    let fullText = "";
    if (fileType === "pdf") {
      const dataBuffer = fs.readFileSync("public/files/sahilLokhandeCV.pdf");
      const pdfData = await PdfParse(dataBuffer);
      fullText = pdfData.text;
    } else if (fileType === "json") {
      fullText = JSON.stringify(jsonData);
    } else if (fileType === "text" && textualData) {
      fullText = textualData as string;
    }
    // const fullText = pdfData.text;

    const chunks = chunkText(fullText);

    const dataEmbeddings = await Promise.all(
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
        embedding: Array.from(dataEmbeddings[i]),
      });
    }
  } catch (error) {
    console.log(error, "errorrrr vectorising");
  }
}

/**
 * Based on user's prompt, fetch the matching data from the data base
 * @param userEmbedding user input prompt embeded
 * @param threshold matching threshold. 0.5 = 50% should match based on cosine / any other similarity
 * @returns
 */
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

/**
 * Parse csv files
 * @param filePath 
 * @returns 
 */
const parseCSVFile = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};

/**
 * Gather csv data, convert it into processable text, and pass it into parsePdf function where text can also be parsed easily.
 * @param embedder 
 */
const processCsvFiles = async (embedder: FeatureExtractionPipeline) => {
  const Certifications = await parseCSVFile(
    "src/utilities/csvFiles/Certifications.csv"
  );
  const Education = await parseCSVFile("src/utilities/csvFiles/Education.csv");
  const Languages = await parseCSVFile("src/utilities/csvFiles/Languages.csv");
  const Positions = await parseCSVFile("src/utilities/csvFiles/Positions.csv");
  const Profile = await parseCSVFile("src/utilities/csvFiles/Profile.csv");
  const Skills = await parseCSVFile("src/utilities/csvFiles/Skills.csv");

  const summaryText = Profile?.[0]?.Summary || "";
  const headline = Profile?.[0]?.Headline || "";
  const experienceText = Positions.map(
    (exp: any) =>
      `${exp.Title} at ${exp["Company Name"]} from ${exp["Started On"]} to ${
        exp["Finished On"] || "Ongoing"
      } (${exp.Description || ""})`
  ).join("\n");
  const educationText = Education.map(
    (edu: any) => `${edu["Degree Name"]} from ${edu["School Name"]}`
  ).join("\n");
  const skillsText = Skills.map((skill: any) => skill.Name).join(", ");
  const coursesText = Certifications.map(
    (course: any) =>
      `Completed ${course.Name} course on ${course?.Authority} along with [certificate of completion](${course?.Url}).`
  ).join("\n");
  const languagesText = Languages.map(
    (language: any) =>
      `Proficient in ${language.Name} language with ${language.Proficiency}`
  ).join("\n");

  const fullText = `
    ${headline}
    ${summaryText}
    Experience:\n${experienceText}
    Education:\n${educationText}
    Skills:\n${skillsText}
    Courses:\n${coursesText}
    Languages Known:\n${languagesText}
  `
    .trim()
    ?.replace(
      `Also visit my portfolio website I've developed using React JS https://sahillokhande99.netlify.app/`,
      ""
    );
  await parsePdf(embedder, "text", fullText);
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
    // await processCsvFiles(embedder) // save embedded csvs into supabase
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
You are a professional and diplomatic assistant. Use only the information provided below to answer the user's question.

Knowledge Base:
${matchResponse?.data?.map((m: any) => m.content).join("\n\n")}

Additional Details:
- Current employer: Pyrack (since September 2023)
- Previous employer: Mobiloitte (April 2022 to July 2023)

Instructions:
- Only respond using the information from the knowledge base or additional details above.
- If someone asks any other confidential information like BANK BALANCE or SALARY or PERSONAL INFORMATION like FAMILY MEMBERS etc, then decline it politely by saying,
  “I am not allowed to have any kind of conversation on Sahil's personal / confidential information. Please contact him instead 😊 [${
    jsonData.email
  }](mailto:${jsonData.email}) or ${jsonData.phone}.”
- If the user greeting is something like "Hi", "Hello", "Thanks", "Thank you", or similar, respond briefly with a polite acknowledgment and mention: 
  “If you have any questions, please don't hesitate to reach out to Sahil at [${
    jsonData.email
  }](mailto:${jsonData.email}) or ${jsonData.phone}“
- If the question is outside the provided information or unrelated, respond professionally and say: 
  “As per my current knowledge, I do not have the information to answer that. Please feel free to contact Sahil directly at [${
    jsonData.email
  }](mailto:${jsonData.email}) or ${jsonData.phone} for further assistance.”
- Do not mention the word "context" in your responses.
- Avoid unnecessary elaboration, speculation, or unrelated content.
- Maintain a concise, helpful, and professional tone at all times.
- Use 1–3 emojis from the list below in appropriate responses to keep the tone professional and engaging. Do not skip this instruction unless the response is strictly a rejection or redirect.
  Emoji Meaning Key:
  😊 - Friendly / Polite tone  
  📈 - Growth / Progress / Success  
  💼 - Job / Work / Profession  
  🎯 - Goals / Focus / Achievements  
  🧠 - Skills / Knowledge / Expertise  
  🏢 - Company / Workplace  
  📩 - Contact / Communication  
  👍 - Confirmation / Agreement / Support

User Question:
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

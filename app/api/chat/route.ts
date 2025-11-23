import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";
import { createClient } from "@supabase/supabase-js";
import jsonData from "../../../src/utilities/json/details.json";
import {
  fetchMatchingEmbeddings,
  GenericObjectInterface,
} from "@/src/utilities";
import { embedChunks } from "@/src/utilities/commonFunctions/commonFunctions";
import Groq from "groq-sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const groq = new Groq({ apiKey: process.env.NEXT_GROQ_API_KEY });

type modelType =
  | "llama-3.3-70b-versatile"
  | "gemma2-9b-it"
  | "llama-3.1-8b-instant"
  | "llama-guard-3-8b"
  | "llama3-70b-8192"
  | "llama3-8b-8192";
const models: modelType[] = [
  "llama-3.3-70b-versatile",
  "gemma2-9b-it",
  "llama-3.1-8b-instant",
  "llama-guard-3-8b",
  "llama3-70b-8192",
  "llama3-8b-8192",
];

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    const userEmbedding = await embedChunks(embedder, prompt);

    //   // fetch the most similar documents based on user prompt
    let matchResponse: GenericObjectInterface = [];
    if (userEmbedding) {
      matchResponse = await fetchMatchingEmbeddings(
        supabase,
        userEmbedding,
        0.5
      );
    }

    const processedPrompt = `
      You are a professional, concise, and diplomatic assistant. Respond **only** using:
      - The Knowledge Base below
      - Additional Details provided
      - Sahil's LinkedIn and resume

      Knowledge Base:
      ${matchResponse?.data?.map((m: any) => m.content).join("\n\n")}

      Additional Details:
      - Consider Current Time Stamp: ${new Date()}
      - Current employer: Pyrack (since Sep 2023)
      - Previous employer: Mobiloitte (Apr 2022 – Jul 2023)

      Rules:
      1. For greetings (such as hi, hello, hey, good morning, good afternoon, good evening, good night, thanks, thank you, etc.):
        Respond briefly with a polite greeting.
        - For simple greetings (hi, hello, hey), reply with a similar polite word.
        - For time-based greetings (good morning, good afternoon, good evening, good night), reply appropriately according to the current time given above.
        - For gratitude expressions (thanks, thank you), reply politely with you’re welcome (or equivalent).
        After the greeting, always append the following message (and only this message):
        “If you have any questions, please reach out to Sahil:
        - 📩 Email: [${jsonData.email}](mailto:${jsonData.email})
        - 📲 Phone: ${jsonData.phone}
        - 🔗 LinkedIn: [Profile](${jsonData.linkedin})
        - 🔗 GitHub: [Profile](${jsonData.github})
        - 🔗 X: [Profile](${jsonData.x})”
      
      **Greetings (hi, hello, good morning, thanks, etc.)** → Reply briefly with a polite greeting (for eg. For greetings like Hi or Hello or Hey etc, reply with similar words politely; for greetings like good morning, good afternoon, good afternoon or good night, reply with appropriate words based on current time mentioned above; for words like thanks or thank you etc, please reply with welcome in a polite way) **and only**:
          “If you have any questions, please reach out to Sahil:
          - 📩 Email: [${jsonData.email}](mailto:${jsonData.email})
          - 📲 Phone: ${jsonData.phone}
          - 🔗 LinkedIn: [Profile](${jsonData.linkedin})
          - 🔗 GitHub: [Profile](${jsonData.github})
          - 🔗 X: [Profile](${jsonData.x})”
        Do **not** include any Knowledge Base content in greeting replies.

      2. **Confidential / personal questions** (e.g., salary, CTC, bank details, family info, passwords, etc.) → Decline politely:
        “I’m not allowed to share Sahil’s personal or confidential details. Please contact him instead 😊:
        - 📩 Email: [${jsonData.email}](mailto:${jsonData.email})
        - 📲 Phone: ${jsonData.phone}
        - 🔗 LinkedIn: [Profile](${jsonData.linkedin})
        - 🔗 GitHub: [Profile](${jsonData.github})
        - 🔗 X: [Profile](${jsonData.x})”

      3. **Unrelated / out-of-scope questions** → Reply:
        “As per my current knowledge, I do not have the information to answer that. Please contact Sahil:
        - 📩 Email: [${jsonData.email}](mailto:${jsonData.email})
        - 📲 Phone: ${jsonData.phone}
        - 🔗 LinkedIn: [Profile](${jsonData.linkedin})
        - 🔗 GitHub: [Profile](${jsonData.github})
        - 🔗 X: [Profile](${jsonData.x})”

      4. Do **not** say “context” in responses.
      5. Keep answers short, professional, and relevant.
      6. Please rephrase the above chunks mentioned in Knowledge Base and reply accordingly. Also while mentioning a quantitative value (for eg. 7 projects) please use the word "approximately" or "around".
      7. Use 1–3 emojis **max** from this list in applicable responses:
        😊 friendly | 📈 growth | 💼 work | 🎯 goals | 🧠 skills | 🏢 workplace | 📩 contact | 👍 support
      `;

    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: processedPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      // model: "llama3-70b-8192",
    });
    console.log(
      groqResponse,
      groqResponse.choices[0].message.content,
      "groqResponse"
    );
    return NextResponse.json({
      success: true,
      data: {
        message: groqResponse.choices[0].message.content,
      },
    });
  } catch (error: any) {
    console.log(error, "error");
    return NextResponse.json(
      { success: false, error },
      { status: error?.status }
    );
  }
}

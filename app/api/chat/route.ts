import { NextRequest } from "next/server";
import { pipeline } from "@xenova/transformers";
import { createClient } from "@supabase/supabase-js";
import jsonData from "../../../src/utilities/json/details.json";
import {
  fetchMatchingEmbeddings,
  GenericObjectInterface,
} from "@/src/utilities";
import { embedChunks } from "@/src/utilities/commonFunctions/commonFunctions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  const userEmbedding = await embedChunks(embedder, prompt);

  // fetch the most similar documents based on user prompt
  let matchResponse: GenericObjectInterface = [];
  if (userEmbedding) {
    matchResponse = await fetchMatchingEmbeddings(supabase, userEmbedding, 0.5);
  }
  console.log(matchResponse?.data?.length, "matchResponse length");

  const processedPrompt = `
You are a professional, concise, and diplomatic assistant. Respond **only** using:
- The Knowledge Base below
- Additional Details provided
- Sahil's LinkedIn and resume

Knowledge Base:
${matchResponse?.data?.map((m: any) => m.content).join("\n\n")}

Additional Details:
- Current employer: Pyrack (since Sep 2023)
- Previous employer: Mobiloitte (Apr 2022 – Jul 2023)

Rules:
1. **Greetings (hi, hello, good morning, thanks, etc.)** → Reply briefly with a polite greeting **and only**:  
   “If you have any questions, please reach out to Sahil at 📩[${
     jsonData.email
   }](mailto:${jsonData.email}) or 📲${
    jsonData.phone
  }. You can also connect on 🔗[LinkedIn](${jsonData.linkedin}).”  
   Do **not** include any Knowledge Base content in greeting replies.
   
2. **Confidential / personal questions** (e.g., salary, CTC, bank details, family info, passwords, etc.) → Decline politely:  
   “I’m not allowed to share Sahil’s personal or confidential details. Please contact him instead 😊 📩[${
     jsonData.email
   }](mailto:${jsonData.email}) or 📲${
    jsonData.phone
  }. You can also connect on 🔗[LinkedIn](${jsonData.linkedin}).”  

3. **Unrelated / out-of-scope questions** → Reply:  
   “As per my current knowledge, I do not have the information to answer that. Please contact Sahil at 📩[${
     jsonData.email
   }](mailto:${jsonData.email}), 📲${jsonData.phone}, or 🔗[LinkedIn](${
    jsonData.linkedin
  }).”

4. Do **not** say “context” in responses.  
5. Keep answers short, professional, and relevant.  
6. Use 1–3 emojis **max** from this list in applicable responses:  
   😊 friendly | 📈 growth | 💼 work | 🎯 goals | 🧠 skills | 🏢 workplace | 📩 contact | 👍 support

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

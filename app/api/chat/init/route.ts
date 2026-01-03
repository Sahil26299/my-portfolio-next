import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

const groq = new Groq({ apiKey: process.env.NEXT_GROQ_API_KEY });

export async function GET() {
  try {
    const readmePath = path.join(process.cwd(), "README.md");
    const readmeContent = fs.readFileSync(readmePath, "utf-8");

    const prompt = `
      Based on the following README content for Sahil's portfolio, generate a warm, welcoming initial message for a chat assistant.
      
      Requirements:
      1. Warmly welcome the user to the portfolio.
      2. Briefly summarize what this portfolio showcases (projects, skills, tech stack) based on the README.
      3. Keep it to 2-4 lines maximum.
      4. Be friendly and professional.
      5. Do not strictly copy the README, synthesize it naturally.
      6. At the end, add a line "Ask me anything about his skills, projects, past experiences or professional journey!"
      
      README Content:
      ${readmeContent}
    `;

    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful portfolio assistant. Generate a short, warm welcome message summarizing the portfolio.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({
      success: true,
      message: groqResponse.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error generating welcome message:", error);
    // Fallback message in case of error
    return NextResponse.json({
      success: false,
      message:
        "Hi there! Welcome to Sahil's portfolio. I'm here to help you explore his projects and skills. Ask me anything!",
    });
  }
}

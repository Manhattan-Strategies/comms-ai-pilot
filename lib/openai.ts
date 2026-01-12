import OpenAI from "openai";
import { SUMMARY_SYSTEM_PROMPT } from "./prompts";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummaryFromOpenAI(pdfText: string) {
  try {
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Transform this document into an engaging, easy-to-read summary with contextually relevant and proper markdown formatting formatting:\n\n${pdfText}`,
        },
      ],
      temperature: 0.7,
      max_output_tokens: 1500,
    });

    return response.output_text;
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
  }
}

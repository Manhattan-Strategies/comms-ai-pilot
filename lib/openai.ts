// lib/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummaryFromOpenAI(
  pdfText: string
): Promise<string> {
  try {
    console.log(
      "Generating summary from OpenAI for text length:",
      pdfText.length
    );

    // Truncate text if it's too long (OpenAI has token limits)
    const truncatedText = pdfText.substring(0, 12000); // Keep it reasonable

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano", // or "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes PDF documents. Provide clear, concise summaries that capture the main points.",
        },
        {
          role: "user",
          content: `Please summarize the following PDF content:\n\n${truncatedText}\n\nSummary:`,
        },
      ],
      // temperature: 0.7,
      // max_tokens: 500, // Limit the summary length
    });

    const summary = response.choices[0]?.message?.content?.trim();

    if (!summary || summary.length === 0) {
      console.error("OpenAI returned empty summary");
      throw new Error("OpenAI returned empty response");
    }

    console.log("OpenAI summary generated, length:", summary.length);
    return summary;
  } catch (error) {
    console.error("Error in generateSummaryFromOpenAI:", error);
    throw error;
  }
}

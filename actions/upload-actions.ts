"use server";

import { generateSummaryFromGemini } from "@/lib/gemini-ai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";

export async function generatePdfSummary({
  fileUrl,
  fileName,
}: {
  fileUrl: string;
  fileName: string;
}) {
  if (!fileUrl) {
    return {
      success: false,
      message: "File upload failed - No file URL provided",
      data: null,
    };
  }

  try {
    // Step 1: Extract text from PDF
    const pdfText = await fetchAndExtractPdfText(fileUrl);
    console.log("PDF Text extracted, length:", pdfText?.length || 0);

    if (!pdfText || pdfText.trim().length === 0) {
      return {
        success: false,
        message:
          "Failed to extract text from PDF. The file might be empty or unreadable.",
        data: null,
      };
    }

    let summary: string | undefined;

    // Step 2: Try OpenAI first
    try {
      console.log("Attempting to generate summary with OpenAI...");
      summary = await generateSummaryFromOpenAI(pdfText);
      console.log("OpenAI summary generated successfully");
    } catch (openAIError) {
      console.log("OpenAI failed:", openAIError);

      // If it's a rate limit error, try Gemini
      if (
        openAIError instanceof Error &&
        openAIError.message.includes("RATE_LIMIT")
      ) {
        console.log("Rate limit exceeded, trying Gemini as backup...");
        try {
          summary = await generateSummaryFromGemini(pdfText);
          console.log("Gemini summary generated successfully as backup");
        } catch (geminiError) {
          console.error("Gemini also failed:", geminiError);
          throw new Error("Both OpenAI and Gemini failed to generate summary");
        }
      } else {
        // If it's not a rate limit error, re-throw it
        throw openAIError;
      }
    }

    if (!summary || summary.trim().length === 0) {
      return {
        success: false,
        message: "Generated summary is empty",
        data: null,
      };
    }

    // Format the file name as title
    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        title: formattedFileName,
        summary,
      },
    };
  } catch (error) {
    console.error("Error in generatePdfSummary:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to generate summary";

    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error: Could not access the PDF file";
      } else if (error.message.includes("text layer")) {
        errorMessage =
          "PDF is scanned or image-based. Please upload a text-based PDF.";
      } else if (
        error.message.includes("rate limit") ||
        error.message.includes("quota")
      ) {
        errorMessage =
          "AI service rate limit exceeded. Please try again later.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
}

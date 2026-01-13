"use server";

import { generatePostsFromGemini } from "@/lib/gemini-ai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generatePostsFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import type { FilterState } from "@/types/filters";

export async function generatePosts({
  fileUrl,
  fileName,
  filters,
}: {
  fileUrl: string;
  fileName: string;
  filters: FilterState;
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

    let posts: any[] | undefined;

    // Step 2: Try OpenAI first (now for posts, not just summary)
    try {
      console.log("Attempting to generate posts with OpenAI...");
      posts = await generatePostsFromOpenAI(pdfText, filters);
      console.log("OpenAI posts generated successfully");
    } catch (openAIError) {
      console.log("OpenAI failed:", openAIError);

      // If it's a rate limit error, try Gemini
      if (
        openAIError instanceof Error &&
        openAIError.message.includes("RATE_LIMIT")
      ) {
        console.log("Rate limit exceeded, trying Gemini as backup...");
        try {
          posts = await generatePostsFromGemini(pdfText, filters);
          console.log("Gemini posts generated successfully as backup");
        } catch (geminiError) {
          console.error("Gemini also failed:", geminiError);
          throw new Error("Both OpenAI and Gemini failed to generate posts");
        }
      } else {
        // If it's not a rate limit error, re-throw it
        throw openAIError;
      }
    }

    if (!posts || posts.length === 0) {
      return {
        success: false,
        message: "Generated posts are empty",
        data: null,
      };
    }

    // Format the file name as title
    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "Posts generated successfully",
      data: {
        title: formattedFileName,
        posts,
        filters,
        fileName,
      },
    };
  } catch (error) {
    console.error("Error in generatePosts:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to generate posts";

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

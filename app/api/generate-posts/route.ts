import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  generateDynamicPrompt,
  buildGenerationPromptTemplate,
} from "@/utils/prompt-builder";
import { parseGeneratedPosts } from "@/utils/post-parser";
import { z } from "zod";

const BodySchema = z.object({
  filters: z.any(),
  brief: z.any().nullable().optional(),
});

/**
 * API endpoint to generate posts without a PDF file
 * Uses only the brief and filters to generate posts
 */
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const { filters, brief } = BodySchema.parse(json);

    // Generate system prompt without PDF (use empty string for PDF text)
    const systemPrompt = generateDynamicPrompt(filters, "");

    // Initialize OpenAI
    const llm = new ChatOpenAI({
      modelName: "gpt-5-nano",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const briefJson = JSON.stringify(brief ?? {}, null, 2);

    // Build prompt using centralized template
    const promptTemplate = buildGenerationPromptTemplate();
    const prompt = PromptTemplate.fromTemplate(promptTemplate);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    const result = await chain.invoke({
      system_prompt: systemPrompt,
      brief_json: briefJson,
      document_content: "", // No PDF content
    });

    const postsArray = parseGeneratedPosts(result);

    return NextResponse.json({
      success: true,
      posts: postsArray,
      filters,
      brief: brief ?? null,
      fileName: null,
      fileKey: null,
      fileUrl: null,
    });
  } catch (error) {
    console.error("Error generating posts:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate posts",
      },
      { status: 500 }
    );
  }
}

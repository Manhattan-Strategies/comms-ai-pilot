import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  generateDynamicPrompt,
  buildGenerationPromptTemplate,
  formatChatMessages,
} from "@/utils/prompt-builder";
import { parseGeneratedPosts } from "@/utils/post-parser";
import { z } from "zod";

const BodySchema = z.object({
  filters: z.any(),
  brief: z.any().nullable().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
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
    const { filters, brief, messages } = BodySchema.parse(json);

    // Generate system prompt without PDF (use empty string for PDF text)
    const systemPrompt = generateDynamicPrompt(filters, "");

    // Initialize OpenAI
    const llm = new ChatOpenAI({
      modelName: "gpt-5-nano",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const briefJson = JSON.stringify(brief ?? {}, null, 2);

    // Debug messages BEFORE formatting
    console.log("=== Generate Posts API Debug ===");
    console.log("Messages received (raw):", messages?.length || 0);
    if (messages && messages.length > 0) {
      console.log("Messages content (raw):", JSON.stringify(messages, null, 2));
    }

    const chatMessages = formatChatMessages(messages);

    // Debug after formatting
    console.log("Filters received:", JSON.stringify(filters, null, 2));
    console.log("Chat messages formatted:", chatMessages ? "YES" : "NO");
    console.log("Chat messages length:", chatMessages?.length || 0);
    if (chatMessages) {
      console.log("Chat messages full content:", chatMessages);
    } else {
      console.log(
        "⚠️ WARNING: No chat messages formatted! This means posts won't include user's chat content!"
      );
    }
    console.log("Brief received:", brief);
    console.log("Brief JSON:", briefJson);
    if (briefJson === "{}" || briefJson === "null") {
      console.warn(
        "⚠️ WARNING: Brief is empty! This means the brief generation may have failed or returned empty."
      );
    }
    console.log("System prompt:", systemPrompt);

    // Build prompt using centralized template
    const promptTemplate = buildGenerationPromptTemplate();
    const prompt = PromptTemplate.fromTemplate(promptTemplate);

    // Prepare the full prompt for debugging
    const promptVariables = {
      system_prompt: systemPrompt,
      brief_json: briefJson,
      chat_messages: chatMessages || "",
      document_content: "", // No PDF content
    };

    // Log the FULL prompt being sent to OpenAI
    console.log("\n=== FULL PROMPT BEING SENT TO OPENAI ===");
    const fullPrompt = promptTemplate
      .replace("{system_prompt}", promptVariables.system_prompt)
      .replace("{chat_messages}", promptVariables.chat_messages)
      .replace("{brief_json}", promptVariables.brief_json)
      .replace("{document_content}", promptVariables.document_content);
    console.log(fullPrompt);
    console.log("=== END OF FULL PROMPT ===\n");

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    const result = await chain.invoke(promptVariables);

    console.log("Generated result preview:", result.substring(0, 500));

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

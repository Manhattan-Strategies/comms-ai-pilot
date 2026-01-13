// uploadthing/core.ts
import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import {
  generateDynamicPrompt,
  buildGenerationPromptTemplate,
} from "@/utils/prompt-builder";
import { parseGeneratedPosts } from "@/utils/post-parser";

const f = createUploadthing();

/**
 * Filters (existing)
 */
const FilterSchema = z.object({
  executive: z.string().default("ceo"),
  department: z.string().default("engineering"),
  voice: z.array(z.string()).default(["clear", "confident", "pragmatic"]),
  audience: z.array(z.string()).default(["peers", "operators", "partners"]),
  platform: z.string().default("linkedin"),
});

/**
 * NEW: Brief (from chat) to control scope/content of posts
 * - Keep it optional so your current flow still works without chat.
 */
const BriefSchema = z
  .object({
    topic: z.string().min(1).default(""),
    goals: z.array(z.string()).default([]),
    keyPoints: z.array(z.string()).default([]),
    exclusions: z.array(z.string()).default([]),
    audienceContext: z.string().default(""),
    proofPoints: z.array(z.string()).default([]),
    CTA: z.string().nullable().optional(),
    constraints: z
      .object({
        postCount: z.number().default(5),
        sentencesPerPost: z.tuple([z.number(), z.number()]).default([2, 4]),
        noHashtags: z.boolean().default(true),
        noEmojis: z.boolean().default(true),
      })
      .default({
        postCount: 5,
        sentencesPerPost: [2, 4],
        noHashtags: true,
        noEmojis: true,
      }),
  })
  .strict();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    .input(
      z.object({
        filters: FilterSchema.optional().default({}),
        // NEW: accept brief from client (generated via chat)
        brief: BriefSchema.optional().nullable(),
      })
    )
    .middleware(async ({ input }) => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user.id,
        filters: input.filters,
        brief: input.brief ?? null,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload completed for user id", metadata.userId);
      console.log("File info:", {
        url: file.url,
        ufsUrl: file.ufsUrl,
        key: file.key,
        name: file.name,
      });

      try {
        /**
         * Use file.url first (CDN), fall back to ufsUrl.
         */
        const fileUrl = file.url || file.ufsUrl;
        if (!fileUrl) throw new Error("No file URL returned by UploadThing.");

        console.log("Fetching PDF from URL:", fileUrl);

        // Use centralized PDF extraction function
        console.log("Extracting PDF text...");
        const pdfText = await fetchAndExtractPdfText(fileUrl);
        console.log("PDF text extracted, length:", pdfText.length);

        /**
         * Generate tone prompt from filters + PDF excerpts
         */
        const systemPrompt = generateDynamicPrompt(metadata.filters, pdfText);
        console.log("System prompt generated");

        // Initialize OpenAI
        console.log("Initializing OpenAI...");
        const llm = new ChatOpenAI({
          modelName: "gpt-5-nano",
          openAIApiKey: process.env.OPENAI_API_KEY,
          // temperature: 0.4,
        });

        /**
         * NEW: Brief is the source of truth for scope/content.
         * PDF is tone-only unless items also appear in the brief.
         */
        const briefJson = JSON.stringify(metadata.brief ?? {}, null, 2);

        // Limit text to avoid token limits
        const limitedText = pdfText.substring(
          0,
          Math.min(pdfText.length, 8000)
        );
        console.log("Using text of length:", limitedText.length);

        // Build prompt using centralized template
        const promptTemplate = buildGenerationPromptTemplate();
        const prompt = PromptTemplate.fromTemplate(promptTemplate);

        console.log("Generating posts with OpenAI...");
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        const result = await chain.invoke({
          system_prompt: systemPrompt,
          brief_json: briefJson,
          document_content: limitedText,
        });

        console.log("Posts generated successfully");

        const postsArray = parseGeneratedPosts(result);
        console.log("Parsed posts:", postsArray.length);

        return {
          userId: metadata.userId,
          // Return the URL you actually used (or at least the CDN URL)
          fileUrl,
          fileName: file.name,
          fileKey: file.key,
          posts: postsArray,
          filters: metadata.filters,
          brief: metadata.brief ?? null, // NEW: return brief for UI display/retry
          summary: postsArray.join("\n\n"),
          success: true,
        };
      } catch (error) {
        console.error("Error processing PDF:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });

        return {
          userId: metadata.userId,
          fileUrl: file.url || file.ufsUrl,
          fileName: file.name,
          fileKey: file.key,
          filters: metadata.filters,
          brief: metadata.brief ?? null,
          error:
            error instanceof Error ? error.message : "Failed to generate posts",
          success: false,
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// uploadthing/core.ts
import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const f = createUploadthing();

// Define filter schema
const FilterSchema = z.object({
  executive: z.string().default("ceo"),
  department: z.string().default("engineering"),
  voice: z.array(z.string()).default(["clear", "confident", "pragmatic"]),
  audience: z.array(z.string()).default(["peers", "operators", "partners"]),
  platform: z.string().default("linkedin"),
});

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    .input(
      z.object({
        filters: FilterSchema.optional().default({}),
      })
    )
    .middleware(async ({ req, input }) => {
      // Get user info
      const user = await currentUser();

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        userId: user.id,
        filters: input.filters,
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
        // FIX: Use the correct URL property
        // Based on logs, the file is uploaded to UFS (UploadThing File Storage)
        // We should use file.url (the CDN URL) or fetch from UFS directly

        let pdfBuffer: ArrayBuffer;

        // Try to fetch from the URL provided by UploadThing
        const fileUrl = file.url || file.ufsUrl;
        console.log("Fetching PDF from URL:", fileUrl);

        const response = await fetch(fileUrl, {
          // Add headers to avoid SSL issues
          headers: {
            Accept: "application/pdf",
          },
          // Increase timeout for large files
          signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch PDF: ${response.status} ${response.statusText}`
          );
        }

        pdfBuffer = await response.arrayBuffer();
        console.log("PDF fetched successfully, size:", pdfBuffer.byteLength);

        // Parse PDF text
        console.log("Parsing PDF text...");
        const loader = new PDFLoader(new Blob([pdfBuffer]));
        const docs = await loader.load();
        const pdfText = docs.map((doc) => doc.pageContent).join("\n\n");
        console.log("PDF text extracted, length:", pdfText.length);

        // Generate dynamic prompt based on filters
        const systemPrompt = generateDynamicPrompt(metadata.filters);
        console.log("System prompt generated");

        // Initialize OpenAI
        console.log("Initializing OpenAI...");
        const llm = new ChatOpenAI({
          modelName: "gpt-5-nano",
          // temperature: 0.7,
          openAIApiKey: process.env.OPENAI_API_KEY,
          timeout: 60000, // 60 second timeout
          maxRetries: 2,
        });

        // Create prompt template
        const prompt = PromptTemplate.fromTemplate(`
          {system_prompt}

          DOCUMENT CONTENT TO ANALYZE:
          {document_content}

          YOUR TASK:
          Create 5 social media posts based on the document content.

          REQUIREMENTS:
          1. Generate EXACTLY 5 posts
          2. Each post should be 2-4 sentences
          3. Make them professional but conversational
          4. Focus on key insights from the document
          5. Each post should be a complete, standalone message
          6. Do not use hashtags, emojis, or markdown

          RESPONSE FORMAT:
          Start each post with its number followed by a period and space.
          Example:
          1. Content of first post goes here.
          2. Content of second post goes here.
          3. Content of third post goes here.
          4. Content of fourth post goes here.
          5. Content of fifth post goes here.

          DO NOT include any other text in your response.
        `);

        // Create chain and generate posts
        console.log("Generating posts with OpenAI...");
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        // Limit text to avoid token limits
        const limitedText = pdfText.substring(
          0,
          Math.min(pdfText.length, 8000)
        );
        console.log("Using text of length:", limitedText.length);

        const result = await chain.invoke({
          system_prompt: systemPrompt,
          document_content: limitedText,
        });

        console.log("Posts generated successfully");

        // Parse the posts from the result
        const postsArray = parseGeneratedPosts(result);
        console.log("Parsed posts:", postsArray.length);

        // Return both file info and generated posts
        return {
          userId: metadata.userId,
          fileUrl: file.ufsUrl,
          fileName: file.name,
          fileKey: file.key,
          posts: postsArray,
          filters: metadata.filters,
          summary: postsArray.join("\n\n"), // For backward compatibility
          success: true,
        };
      } catch (error) {
        console.error("Error processing PDF:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });

        // Still return file info even if processing fails
        return {
          userId: metadata.userId,
          fileUrl: file.url,
          fileName: file.name,
          fileKey: file.key,
          error:
            error instanceof Error ? error.message : "Failed to generate posts",
          success: false,
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Helper function to generate dynamic prompt
function generateDynamicPrompt(filters: z.infer<typeof FilterSchema>): string {
  // Map filter IDs to display values
  const getDisplayValue = (
    value: string,
    type: "executive" | "department" | "platform"
  ): string => {
    const maps = {
      executive: {
        ceo: "CEO",
        cto: "CTO",
        cmo: "CMO",
        cpo: "CPO",
        cfo: "CFO",
        coo: "COO",
      },
      department: {
        engineering: "Engineering",
        product: "Product",
        marketing: "Marketing",
        sales: "Sales",
        operations: "Operations",
        finance: "Finance",
      },
      platform: {
        linkedin: "LinkedIn",
        internal_update: "internal update",
        product_announcement: "product announcement",
        twitter: "Twitter/X",
      },
    };

    return maps[type][value as keyof (typeof maps)[typeof type]] || value;
  };

  const getVoiceDisplay = (voices: string[]): string => {
    const voiceMap: Record<string, string> = {
      clear: "clear",
      confident: "confident",
      pragmatic: "pragmatic",
      business_focused: "business focused",
    };
    return voices.map((v) => voiceMap[v] || v).join(", ");
  };

  const getAudienceDisplay = (audiences: string[]): string => {
    const audienceMap: Record<string, string> = {
      peers: "peers",
      operators: "operators",
      partners: "partners",
      internal_leaders: "internal leaders",
    };
    return audiences.map((a) => audienceMap[a] || a).join(", ");
  };

  return `You are writing social posts on behalf of a senior executive.

Executive title: ${getDisplayValue(filters.executive, "executive")}
Department or function: ${getDisplayValue(filters.department, "department")}
Voice and tone: ${getVoiceDisplay(filters.voice)} (clear, confident, pragmatic, business focused)
Audience: ${getAudienceDisplay(filters.audience)}
Social platform type: ${getDisplayValue(filters.platform, "platform")}

Writing guidelines:
- Sound human and experienced, not promotional or AI generated
- Use direct language and short paragraphs
- Focus on outcomes, learning and momentum
- Avoid hype words and buzzword stacking
- Do not use em dashes
- Do not use the Oxford comma
- Write as if sharing real progress, not marketing copy

Content context:
- Topic is based on the uploaded document
- Emphasize real world use, speed to value and operational learning
- Reference iteration, validation and delivery
- Keep it grounded and credible

Output:
- 5 complete social posts
- No hashtags unless explicitly requested
- Professional but conversational tone`;
}

// Helper function to parse generated posts
function parseGeneratedPosts(text: string): string[] {
  console.log("Raw response from ChatGPT:", text);

  const posts: string[] = [];

  // Try multiple parsing strategies

  // Strategy 1: Look for numbered posts (Post 1:, 1., etc.)
  const lines = text.split("\n");
  let currentPost = "";

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) continue;

    // Check if this line starts a new post
    const postMatch = trimmedLine.match(/^(?:Post\s*)?(\d+)[:.)]\s*(.+)$/i);
    const postMatch2 = trimmedLine.match(/^(\d+)[:.)]\s*(.+)$/i);

    if ((postMatch || postMatch2) && currentPost) {
      // Save the previous post
      posts.push(currentPost.trim());
      currentPost = "";
    }

    // Add content to current post
    if (postMatch) {
      currentPost = postMatch[2];
    } else if (postMatch2) {
      currentPost = postMatch2[2];
    } else if (currentPost) {
      // Continue existing post
      currentPost += " " + trimmedLine;
    } else {
      // Start new post
      currentPost = trimmedLine;
    }

    // If we have 5 posts, break
    if (posts.length >= 5) break;
  }

  // Add the last post if we have one
  if (currentPost.trim() && posts.length < 5) {
    posts.push(currentPost.trim());
  }

  // Strategy 2: Split by common separators if we don't have enough posts
  if (posts.length < 5) {
    const separators = ["\n\n---\n\n", "\n---\n", "\n\n\n", "\n\n"];
    for (const separator of separators) {
      if (text.includes(separator)) {
        const splitPosts = text
          .split(separator)
          .map((p) => p.trim())
          .filter((p) => p.length > 0)
          .slice(0, 5);

        if (splitPosts.length > posts.length) {
          posts.length = 0; // Clear array
          posts.push(...splitPosts);
          break;
        }
      }
    }
  }

  // Strategy 3: Split by numbered patterns with newlines
  if (posts.length < 5) {
    const numberedPattern = /\n(?=\d+[.:])/;
    if (numberedPattern.test(text)) {
      const splitPosts = text
        .split(numberedPattern)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .slice(0, 5);

      if (splitPosts.length > posts.length) {
        posts.length = 0;
        posts.push(...splitPosts);
      }
    }
  }

  // Strategy 4: Last resort - split by double newlines
  if (posts.length < 5) {
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20) // Filter out very short paragraphs
      .slice(0, 5);

    if (paragraphs.length > posts.length) {
      posts.length = 0;
      posts.push(...paragraphs);
    }
  }

  console.log(
    "Parsed posts:",
    posts.map((p, i) => `Post ${i + 1}: ${p.substring(0, 50)}...`)
  );

  return posts.slice(0, 5);
}

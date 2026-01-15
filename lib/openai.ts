import OpenAI from "openai";
import type { FilterState } from "@/types/filters";
import {
  generateDynamicPrompt,
  buildGenerationPromptTemplate,
  formatChatMessages,
} from "@/utils/prompt-builder";
import { parseGeneratedPosts } from "@/utils/post-parser";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePostsFromOpenAI(
  pdfText: string,
  filters: FilterState,
  brief?: any,
  messages?: Array<{ role: string; content: string }>
): Promise<any[]> {
  try {
    console.log(
      "Generating posts from OpenAI for text length:",
      pdfText.length
    );

    // Use centralized prompt builder instead of custom prompt
    // Cast filters to match FilterSchema type (both have optional fields)
    const systemPrompt = generateDynamicPrompt(filters as any, pdfText);

    // Initialize LangChain OpenAI (consistent with other endpoints)
    const llm = new ChatOpenAI({
      modelName: "gpt-5-nano",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const briefJson = JSON.stringify(brief ?? {}, null, 2);

    // Debug messages BEFORE formatting
    console.log("=== OpenAI Post Generation Debug ===");
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
    console.log("Brief:", briefJson);
    console.log("System prompt:", systemPrompt);

    // Limit text to avoid token limits
    const limitedText = pdfText.substring(0, Math.min(pdfText.length, 8000));

    // Build prompt using centralized template
    const promptTemplate = buildGenerationPromptTemplate();
    const prompt = PromptTemplate.fromTemplate(promptTemplate);

    // Prepare the full prompt for debugging
    const promptVariables = {
      system_prompt: systemPrompt,
      brief_json: briefJson,
      chat_messages: chatMessages || "",
      document_content: limitedText,
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
    console.log("OpenAI posts generated:", postsArray.length);
    return postsArray;
  } catch (error) {
    console.error("Error in generatePostsFromOpenAI:", error);
    throw error;
  }
}

// Post summary
export async function generateSummaryFromOpenAI(
  pdfText: string
): Promise<string> {
  try {
    console.log(
      "Generating summary from OpenAI for text length:",
      pdfText.length
    );

    const truncatedText = pdfText.substring(0, 12000);

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
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
      // max_tokens: 500,
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

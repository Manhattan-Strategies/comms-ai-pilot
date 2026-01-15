import { NextResponse } from "next/server";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const BodySchema = z.object({
  filters: z.any(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    console.log("=== Generate Brief API - Request Received ===");
    console.log("Request body keys:", Object.keys(json));
    console.log("Messages in request:", json.messages?.length || 0);
    if (json.messages && json.messages.length > 0) {
      console.log("Messages content:", JSON.stringify(json.messages, null, 2));
    }

    const { filters, messages } = BodySchema.parse(json);

    console.log("Parsed messages:", messages?.length || 0);

    const llm = new ChatOpenAI({
      modelName: "gpt-5-nano",
      openAIApiKey: process.env.OPENAI_API_KEY,
      // temperature: 0.2,
    });

    // Filter to only user messages for the brief
    const userMessages = messages.filter(
      (m) => m.role === "user" && m.content.trim().length > 0
    );

    console.log("User messages after filtering:", userMessages.length);
    if (userMessages.length > 0) {
      console.log(
        "User messages content:",
        userMessages.map((m) => m.content)
      );
    }

    if (userMessages.length === 0) {
      console.error("ERROR: No user messages found after filtering!");
      return NextResponse.json(
        {
          success: false,
          error: "No user messages found to generate brief from",
        },
        { status: 400 }
      );
    }

    const chatTranscript = userMessages
      .map((m) => `USER: ${m.content.trim()}`)
      .join("\n\n");

    console.log("=== Generate Brief Debug ===");
    console.log("Messages received:", messages.length);
    console.log("User messages:", userMessages.length);
    console.log("Chat transcript:", chatTranscript);

    const prompt = PromptTemplate.fromTemplate(`
You are helping an executive draft a generation brief for professional social posts.

User's chat messages (this is what the posts should be about - EXTRACT ALL KEY INFORMATION FROM THIS):
{chat}

Task:
Extract ALL key information from the user's chat messages above. The user wants posts about what they described in their chat messages.
Return a JSON object ONLY (no markdown, no code blocks) with this exact shape:

{{
  "topic": string,
  "goals": string[],
  "keyPoints": string[],
  "exclusions": string[],
  "audienceContext": string,
  "proofPoints": string[],
  "CTA": string | null,
  "constraints": {{
    "postCount": 5,
    "sentencesPerPost": [5],
    "noHashtags": true,
    "noEmojis": true
  }}
}}

Rules:
- Extract the main topic from the user's chat messages - this is REQUIRED
- Extract goals, key points, and requirements from what the user said
- Keep it concrete and falsifiable. Avoid marketing fluff.
- If the user mentions a specific topic (e.g., "Martin Luther King Jr. Day"), that MUST be in the topic field
- If the user hasn't provided details, infer carefully and keep assumptions minimal.
- Put anything that would risk overclaiming into "exclusions".
- The topic field MUST NOT be empty - extract it from the user's chat messages

IMPORTANT: The user's chat messages contain the primary content direction. Extract the topic and key information from those messages.
`);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    const result = await chain.invoke({
      chat: chatTranscript,
    });

    console.log("Brief generation result (raw):", result);
    console.log("Brief generation result length:", result?.length || 0);
    console.log("Brief generation result type:", typeof result);

    if (!result || result.trim().length === 0) {
      console.error("ERROR: Brief generation returned empty result!");
      return NextResponse.json(
        { success: false, error: "Model returned empty response." },
        { status: 200 }
      );
    }

    // Parse JSON safely - try to extract JSON from markdown code blocks if present
    let brief: unknown;
    try {
      // Remove markdown code blocks if present
      let jsonString = result.trim();
      console.log(
        "JSON string after trim (first 500 chars):",
        jsonString.substring(0, 500)
      );

      if (jsonString.startsWith("```")) {
        jsonString = jsonString
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "");
        console.log("Removed markdown code blocks");
      }

      brief = JSON.parse(jsonString);
      console.log("Brief parsed successfully:", brief);
      console.log("Brief type:", typeof brief);
      console.log(
        "Brief keys:",
        brief && typeof brief === "object" ? Object.keys(brief) : "N/A"
      );
    } catch (parseError) {
      console.error("Failed to parse brief JSON:", parseError);
      console.error(
        "Raw result (first 1000 chars):",
        result.substring(0, 1000)
      );
      return NextResponse.json(
        { success: false, error: "Model did not return valid JSON." },
        { status: 200 }
      );
    }

    // Validate brief has required structure
    if (!brief || typeof brief !== "object") {
      console.error("Brief is not an object:", brief);
      return NextResponse.json(
        { success: false, error: "Invalid brief structure." },
        { status: 200 }
      );
    }

    // Validate that topic is not empty
    const briefObj = brief as any;
    console.log("Brief object before topic check:", briefObj);
    console.log("Brief topic value:", briefObj.topic);
    console.log("Brief topic type:", typeof briefObj.topic);

    if (
      !briefObj.topic ||
      (typeof briefObj.topic === "string" && briefObj.topic.trim() === "")
    ) {
      console.warn(
        "Brief topic is empty or invalid, extracting from chat messages"
      );
      // If topic is empty, try to extract it from chat messages
      const firstUserMessage = userMessages[0]?.content || "";
      briefObj.topic =
        firstUserMessage.substring(0, 200) || "Social media posts";
      console.log("Extracted topic from chat:", briefObj.topic);
    }

    console.log(
      "Final brief being returned:",
      JSON.stringify(briefObj, null, 2)
    );

    return NextResponse.json({
      success: true,
      brief: briefObj,
      assistantMessage:
        "Draft brief created. If you want, tell me what to emphasize or avoid.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

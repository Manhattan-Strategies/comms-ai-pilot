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
    const { filters, messages } = BodySchema.parse(json);

    const llm = new ChatOpenAI({
      modelName: "gpt-5-nano",
      openAIApiKey: process.env.OPENAI_API_KEY,
      // temperature: 0.2,
    });

    const chatTranscript = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const prompt = PromptTemplate.fromTemplate(`
You are helping an executive draft a generation brief for professional social posts.

Filters:
{filters}

Chat:
{chat}

Task:
Return a JSON object ONLY (no markdown) with this exact shape:

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
    "sentencesPerPost": [2, 4],
    "noHashtags": true,
    "noEmojis": true
  }}
}}

Rules:
- Keep it concrete and falsifiable. Avoid marketing fluff.
- If the user hasn’t provided details, infer carefully and keep assumptions minimal.
- Put anything that would risk overclaiming into "exclusions".
`);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    const result = await chain.invoke({
      filters: JSON.stringify(filters, null, 2),
      chat: chatTranscript,
    });

    // Parse JSON safely
    let brief: unknown;
    try {
      brief = JSON.parse(result);
    } catch {
      return NextResponse.json(
        { success: false, error: "Model did not return valid JSON." },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      brief,
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

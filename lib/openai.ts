import OpenAI from "openai";
import type { FilterState } from "@/types/filters";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePostsFromOpenAI(
  pdfText: string,
  filters: FilterState
): Promise<any[]> {
  try {
    console.log(
      "Generating posts from OpenAI for text length:",
      pdfText.length
    );

    // Truncate text if it's too long (OpenAI has token limits)
    const truncatedText = pdfText.substring(0, 12000); // Keep it reasonable

    // Create a prompt based on filters
    const prompt = createPostPrompt(truncatedText, filters);

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: `You are a social media content creator specializing in executive communication. 
          Create engaging social media posts based on document content.
          Format your response as a JSON array with 5 objects, each containing:
          - title: string (catchy title for the post)
          - content: string (the actual post content)
          - hashtags: string[] (relevant hashtags)
          - platform: string (one of: linkedin, twitter, facebook, instagram)
          - tone: string (matching the selected voice tones)`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      // temperature: 0.8,
      // max_tokens: 3000,
      response_format: { type: "json_object" },
    });
    console.log(response.choices[0].message);
    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      console.error("OpenAI returned empty response");
      throw new Error("OpenAI returned empty response");
    }

    // Parse the JSON response
    const result = JSON.parse(content);
    const posts = result.posts || result; // Handle both structures

    console.log("OpenAI posts generated:", posts.length);
    return Array.isArray(posts) ? posts : [posts];
  } catch (error) {
    console.error("Error in generatePostsFromOpenAI:", error);
    throw error;
  }
}

function createPostPrompt(pdfText: string, filters: FilterState): string {
  const { executive, department, voice, audience, platform } = filters;

  // Map executive roles to proper titles
  const executiveTitles: Record<string, string> = {
    ceo: "Chief Executive Officer",
    cto: "Chief Technology Officer",
    cmo: "Chief Marketing Officer",
    cpo: "Chief Product Officer",
    cfo: "Chief Financial Officer",
    coo: "Chief Operating Officer",
  };

  return `
    As a social media content creator specializing in executive communication, create 5 engaging social media posts using this document as reference:

    DOCUMENT CONTENT (reference for tone and insights):
    ${pdfText.substring(0, 10000)}...

    EXECUTIVE CONTEXT:
    - Role: ${executiveTitles[executive] || executive.toUpperCase()}
    - Department: ${department.charAt(0).toUpperCase() + department.slice(1)}
    - Voice: ${voice.join(", ")}
    - Audience: ${audience.join(", ")}
    - Platform: ${platform}

    FOR EACH POST (create 5 total):
    1. Make it authentic to the executive's perspective
    2. Extract 1-2 key insights from the document
    3. Write in a conversational but professional tone
    4. Keep it concise (2-4 sentences)
    5. Include relevant hashtags (3-5 max)
    6. Make it platform-appropriate for ${platform}

    RESPONSE FORMAT:
    Return a JSON object with a "posts" array containing 5 objects:
    [
      {
        "title": "Catchy title for the post",
        "content": "The actual post content (2-4 sentences)",
        "hashtags": ["#relevant", "#hashtags"],
        "tone": "${voice[0]}" // primary tone from selection
      }
    ]

    IMPORTANT:
    - Do not use markdown in the content
    - Keep sentences short and impactful
    - Avoid buzzwords and hype
    - Focus on real insights, not marketing fluff
  `;
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

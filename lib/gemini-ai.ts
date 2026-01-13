// lib/gemini-ai.ts
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const cleanedPdfText = pdfText.replace(/\s{2,}/g, " ").trim();

    // You can import this from prompts.ts or define it here
    const SUMMARY_SYSTEM_PROMPT = `You are an expert communication executive. Create a clear, concise summary that captures all key points, insights, and important details from the provided document. Use markdown formatting for better readability and add relevant emojis where appropriate to make the summary engaging.`;

    const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${cleanedPdfText}`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001", // You can also use "gemini-1.5-pro" for better quality
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Empty response from Gemini API");
    }

    const summary = result.candidates[0].content.parts[0].text;
    console.log("Gemini summary generated successfully");
    return summary;
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw error;
  }
};

export const generatePostsFromGemini = async (
  pdfText: string,
  filters: any
) => {
  try {
    const cleanedPdfText = pdfText.replace(/\s{2,}/g, " ").trim();

    // System prompt for posts generation
    const POSTS_SYSTEM_PROMPT = `You are a professional social media content strategist for tech executives. Create engaging social media posts based on the document content, tailored to the specified platform, audience, and tone.`;

    // Build the user prompt with filters
    const userPrompt = `
${POSTS_SYSTEM_PROMPT}

DOCUMENT CONTENT (excerpt):
${cleanedPdfText.substring(0, 10000)}

CREATION SPECIFICATIONS:
- Executive Role: ${filters.executive.toUpperCase()}
- Department Focus: ${filters.department}
- Desired Voice/Tone: ${filters.voice.join(", ")}
- Target Audience: ${filters.audience.join(", ")}
- Platform: ${filters.platform}

INSTRUCTIONS:
Create exactly 5 social media posts based on the document content above. Each post should:
1. Extract key insights, announcements, or innovations from the document
2. Be 100-300 words long
3. Use appropriate tone for the specified voice (${filters.voice.join(", ")})
4. Include relevant hashtags for the platform (${filters.platform})
5. Have a clear call-to-action or engagement element
6. Be formatted appropriately for ${filters.platform}

FORMAT REQUIREMENTS:
- Separate each post with "---POST_SEPARATOR---"
- Include hashtags at the end of each post
- Use emojis where appropriate to increase engagement
- Maintain professional yet engaging language

Generate 5 distinct posts that cover different aspects of the document content.
`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001", // or "gemini-1.5-pro" for better quality
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        temperature: 0.8,
        maxOutputTokens: 2000,
        topK: 40,
        topP: 0.95,
      },
    });

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Empty response from Gemini API for posts generation");
    }

    const responseText = result.candidates[0].content.parts[0].text;

    // Parse the posts from the response
    const posts = responseText
      .split("---POST_SEPARATOR---")
      .map((post) => post.trim())
      .filter(
        (post) =>
          post.length > 0 &&
          !post.includes("INSTRUCTIONS:") &&
          !post.includes("FORMAT REQUIREMENTS:")
      );

    console.log(`Gemini generated ${posts.length} posts successfully`);

    // Ensure we have exactly 5 posts
    if (posts.length < 5) {
      console.warn(
        `Expected 5 posts but got ${posts.length}. Using available posts.`
      );
    }

    return posts.slice(0, 5); // Return up to 5 posts
  } catch (error: any) {
    console.error("Gemini API error for posts generation:", error);
    throw error;
  }
};

// Optional: Create a function for backup/fallback summary generation
export const generateBackupSummaryFromGemini = async (pdfText: string) => {
  try {
    const cleanedPdfText = pdfText.replace(/\s{2,}/g, " ").trim();

    const prompt = `Create a concise summary of the following document. Focus on the main points and key takeaways:\n\n${cleanedPdfText.substring(0, 5000)}`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.5,
        maxOutputTokens: 800,
      },
    });

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Empty response from Gemini backup API");
    }

    return result.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error("Gemini backup API error:", error);
    throw error;
  }
};

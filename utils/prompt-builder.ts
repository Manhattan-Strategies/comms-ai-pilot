/**
 * Utility functions for building dynamic prompts for post generation
 */

import {
  getDisplayValue,
  getVoiceDisplay,
  getAudienceDisplay,
} from "./filter-mappings";

export type FilterSchema = {
  executive: string;
  department: string;
  voice: string[];
  audience: string[];
  platform: string;
};

// Re-export for convenience
export type { FilterSchema as FilterState };

/**
 * Extract example posts from PDF text for tone reference
 */
function getExamplePosts(pdfText: string): string {
  if (!pdfText || !pdfText.trim()) return "No example content available.";

  const cleaned = pdfText
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const take = (start: number, len: number) =>
    cleaned.substring(start, Math.min(cleaned.length, start + len)).trim();

  if (cleaned.length <= 900) {
    return `Here are excerpts from the document to use as tone examples:\n\n${cleaned}`;
  }

  const third = Math.floor(cleaned.length / 3);
  const ex1 = take(0, 300);
  const ex2 = take(third, 300);
  const ex3 = take(cleaned.length - 300, 300);

  return `Here are excerpts from the document to use as tone examples:\n\n1) ${ex1}\n\n2) ${ex2}\n\n3) ${ex3}`;
}

/**
 * Generate dynamic prompt (tone/voice guidance) based on filters and PDF text
 * - PDF text is used only for tone examples.
 */
export function generateDynamicPrompt(
  filters: FilterSchema,
  pdfText: string
): string {
  return `You are writing social posts on behalf of an executive.

Executive title: ${getDisplayValue(filters.executive, "executive")}
Department or function: ${getDisplayValue(filters.department, "department")}
Voice and tone: ${getVoiceDisplay(filters.voice)} (clear, confident, pragmatic, business focused)
Audience: ${getAudienceDisplay(filters.audience)}
Social platform type: ${getDisplayValue(filters.platform, "platform")}
Example posts: ${getExamplePosts(pdfText)}

Writing guidelines:
- Sound human and experienced, not promotional or AI generated
- Use direct language and short paragraphs
- Focus on outcomes, learning and momentum
- Avoid hype words and buzzword stacking
- Do not use em dashes
- Do not use the Oxford comma
- Write as if sharing real progress, not marketing copy

Content context:
${pdfText ? "- Topic is based on the uploaded document" : "- Topic is based on the generation brief and chat conversation"}
- Emphasize real world use, speed to value and operational learning
- Reference iteration, validation and delivery
- Keep it grounded and credible

Output:
- 5 complete social posts
- No hashtags unless explicitly requested
- Professional but conversational tone`;
}

/**
 * Build the main generation prompt template
 */
export function buildGenerationPromptTemplate(): string {
  return `
{system_prompt}

GENERATION BRIEF (SCOPE AND CONTENT REQUIREMENTS):
{brief_json}

DOCUMENT CONTENT TO USE AS TONE ONLY (DO NOT INTRODUCE NEW FACTS FROM IT):
{document_content}

YOUR TASK:
Create EXACTLY 5 social media posts that follow the Generation Brief.
If the brief is empty and no document is provided, create posts based on general best practices for the specified executive role and platform.
If a document is provided but the brief is empty, infer reasonable key insights from the document, but avoid specific claims, metrics, customer names, or timelines.

REQUIREMENTS:
1. Generate EXACTLY 5 posts
2. Each post should be 2-4 sentences
3. Professional but conversational
4. Each post is a complete, standalone message
5. Do not use hashtags, emojis, or markdown
6. No invented metrics, customer names, timelines, or quotes
7. Prefer short paragraphs and direct language

RESPONSE FORMAT:
Start each post with its number followed by a period and space.
Example:
1. Content of first post goes here.
2. Content of second post goes here.
3. Content of third post goes here.
4. Content of fourth post goes here.
5. Content of fifth post goes here.

DO NOT include any other text in your response.
  `;
}

/**
 * Utility functions for building dynamic prompts for post generation
 */

import {
  getDisplayValue,
  getVoiceDisplay,
  getAudienceDisplay,
} from "./filter-mappings";
import { getExecutiveBySlug } from "@/lib/executive-data";

/**
 * Helper to infer department from executive title
 */
function inferDepartmentFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  if (
    titleLower.includes("engineering") ||
    titleLower.includes("technology") ||
    titleLower.includes("cto")
  )
    return "Engineering";
  if (titleLower.includes("product") || titleLower.includes("cpo"))
    return "Product";
  if (titleLower.includes("marketing") || titleLower.includes("cmo"))
    return "Marketing";
  if (titleLower.includes("sales") || titleLower.includes("commercial"))
    return "Sales";
  if (titleLower.includes("operations") || titleLower.includes("coo"))
    return "Operations";
  if (titleLower.includes("finance") || titleLower.includes("cfo"))
    return "Finance";
  return "General";
}

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
 * - If selectedExecutive is provided, uses executive-specific tone, positioning, and frequently used words
 */
export function generateDynamicPrompt(
  filters: FilterSchema & { selectedExecutive?: string },
  pdfText: string
): string {
  const executive = filters.selectedExecutive
    ? getExecutiveBySlug(filters.selectedExecutive)
    : null;

  // Build executive-specific context if an executive is selected
  let executiveContext = "";
  if (executive) {
    executiveContext = `
EXECUTIVE PROFILE:
Name: ${executive.name}
Title: ${executive.title}
Company: ${executive.company}

Executive Positioning & Focus Areas:
${executive.executivePositioning || "N/A"}

Tone & Style: ${executive.tone || "Professional"}

Frequently Used Words/Phrases (incorporate naturally): ${executive.frequentlyUsedWords || "N/A"}

IMPORTANT: Write in the voice and style of ${executive.name}. Match their tone, incorporate their frequently used words naturally, and align with their positioning themes.
`;
  }

  const executiveTitle = filters.executive
    ? getDisplayValue(filters.executive, "executive")
    : executive
      ? executive.title
      : "Executive";
  const department = filters.department
    ? getDisplayValue(filters.department, "department")
    : executive
      ? inferDepartmentFromTitle(executive.title)
      : "General";
  const voiceTone =
    filters.voice && filters.voice.length > 0
      ? getVoiceDisplay(filters.voice)
      : executive && executive.tone
        ? executive.tone
        : "Professional";
  const audience =
    filters.audience && filters.audience.length > 0
      ? getAudienceDisplay(filters.audience)
      : "General audience";
  const platform = filters.platform
    ? getDisplayValue(filters.platform, "platform")
    : "LinkedIn";

  const basePrompt = `You are writing social posts on behalf of an executive.

Executive title: ${executiveTitle}
Department or function: ${department}
Voice and tone: ${voiceTone}
Audience: ${audience}
Social platform type: ${platform}
Example posts: ${getExamplePosts(pdfText)}
${executiveContext}
Writing guidelines:
- Sound human and experienced, not promotional or AI generated
- Use direct language and short paragraphs
- Focus on outcomes, learning and momentum
- Avoid hype words and buzzword stacking
- Do not use em dashes
- Do not use the Oxford comma
- Write as if sharing real progress, not marketing copy
${executive ? `- Match the tone and style of ${executive.name}: ${executive.tone || "Professional"}` : ""}

Content context:
${pdfText ? "- Topic is based on the uploaded document" : "- Topic is based on the generation brief and chat conversation"}
- Emphasize real world use, speed to value and operational learning
- Reference iteration, validation and delivery
- Keep it grounded and credible

Output:
- 5 complete social posts
- No hashtags unless explicitly requested
- Professional but conversational tone`;

  return basePrompt;
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

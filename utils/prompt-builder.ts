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
  if (
    titleLower.includes("sales") ||
    titleLower.includes("commercial") ||
    titleLower.includes("md") ||
    titleLower.includes("latin america") ||
    titleLower.includes("region") ||
    titleLower.includes("managing director")
  )
    return "Sales"; // MD often means Managing Director in sales/regional roles
  if (titleLower.includes("operations") || titleLower.includes("coo"))
    return "Operations";
  if (titleLower.includes("finance") || titleLower.includes("cfo"))
    return "Finance";
  return "General";
}

export type FilterSchema = {
  executive?: string;
  department?: string;
  voice?: string[];
  audience?: string[];
  platform?: string;
  selectedExecutive?: string;
};

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
  // NOTE: Executive data is for TONE/STYLE only, NOT content direction
  let executiveContext = "";
  if (executive) {
    executiveContext = `
EXECUTIVE PROFILE (FOR TONE AND STYLE REFERENCE ONLY):
Name: ${executive.name}
Title: ${executive.title}
Company: ${executive.company}

Tone & Style: ${executive.tone || "Professional"}

IMPORTANT: Use ${executive.name}'s tone and style, but the CONTENT and TOPICS must come from the user's chat messages and brief. Executive positioning is secondary to user requirements.
`;
  }

  // When selectedExecutive is set, use the executive's actual title, not the inferred role
  // Only use filters.executive if no executive is selected
  const executiveTitle = executive
    ? executive.title
    : filters.executive
      ? getDisplayValue(filters.executive, "executive")
      : "Executive";

  // When selectedExecutive is set, infer department from executive's title
  // Only use filters.department if no executive is selected
  const department = executive
    ? inferDepartmentFromTitle(executive.title)
    : filters.department
      ? getDisplayValue(filters.department, "department")
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
{chat_messages}

{system_prompt}

GENERATION BRIEF (SCOPE AND CONTENT REQUIREMENTS):
{brief_json}

DOCUMENT CONTENT TO USE AS TONE ONLY (DO NOT INTRODUCE NEW FACTS FROM IT):
{document_content}

YOUR TASK:
Create EXACTLY 5 social media posts that directly address the user's chat requirements above.

🚨🚨🚨 STOP AND READ THIS FIRST 🚨🚨🚨
1. Look at the USER CHAT MESSAGES section above - this is what the posts MUST be about
2. If the user mentions "Martin Luther King Jr. Day", ALL 5 posts must be about Martin Luther King Jr. Day
3. If the user mentions any specific topic, ALL 5 posts must address that topic
4. Do NOT generate generic posts about engineering, company initiatives, or executive positioning if the user specified a different topic
5. The user's chat messages are MANDATORY - they define WHAT to write about
6. Executive tone/style is only for HOW to write it, not WHAT to write about

PRIORITY ORDER (MOST IMPORTANT FIRST):
1. USER CHAT MESSAGES - These define WHAT the posts should be about. The topics, themes, and requirements in the chat messages are MANDATORY and must be the primary focus of all posts.
2. Generation Brief - Use this to refine scope and add structure to the chat requirements.
3. Executive tone/style - Use the executive's voice and style, but DO NOT let executive positioning override the user's chat requirements.
4. Document content - Use only for tone reference, not for introducing new topics.

REQUIREMENTS:
1. Generate EXACTLY 5 posts
2. Each post should be 2-4 sentences
3. Professional but conversational
4. Each post is a complete, standalone message
5. Do not use hashtags, emojis, or markdown
6. No invented metrics, customer names, timelines, or quotes
7. Prefer short paragraphs and direct language
8. MANDATORY: Every post must address the topics and themes from the user's chat messages - this is non-negotiable
9. If user chat mentions a specific topic (e.g., "Martin Luther King Jr. Day"), ALL posts must relate to that topic in some way
10. If the user wants posts about a specific holiday, event, or topic, ALL 5 posts must be about that topic

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

/**
 * Format chat messages for inclusion in prompt
 */
export function formatChatMessages(
  messages: Array<{ role: string; content: string }> | undefined
): string {
  console.log(
    "formatChatMessages called with:",
    messages?.length || 0,
    "messages"
  );

  if (!messages || messages.length === 0) {
    console.log(
      "formatChatMessages: No messages provided, returning empty string"
    );
    return "";
  }

  // Filter to only user messages (they contain the actual requirements)
  const userMessages = messages.filter(
    (m) => m.role === "user" && m.content.trim().length > 0
  );

  console.log(
    "formatChatMessages: Found",
    userMessages.length,
    "user messages"
  );
  if (userMessages.length > 0) {
    console.log(
      "formatChatMessages: User messages content:",
      userMessages.map((m) => m.content)
    );
  }

  if (userMessages.length === 0) {
    console.log(
      "formatChatMessages: No user messages found, returning empty string"
    );
    return "";
  }

  const chatContent = userMessages
    .map((m) => `USER: ${m.content.trim()}`)
    .join("\n\n");

  const formatted = `CRITICAL: USER CHAT MESSAGES ARE THE PRIMARY CONTENT SOURCE

USER CHAT MESSAGES (MANDATORY - ALL POSTS MUST ADDRESS THESE):
${chatContent}

⚠️ ABSOLUTE REQUIREMENTS - NON-NEGOTIABLE ⚠️:
1. EVERY SINGLE POST must address the topics mentioned in the user's chat messages above
2. If the user mentions "Martin Luther King Jr. Day" or any specific topic, ALL 5 posts must be about that topic
3. Do NOT generate generic posts about company initiatives, engineering, or executive positioning if the user specified a different topic
4. The user's chat messages define WHAT to write about - this is the PRIMARY content direction
5. Executive tone/style is HOW to write it, but the CONTENT must come from the user's chat messages
6. If you see "Martin Luther King Jr. Day" in the chat, every post must mention or relate to Martin Luther King Jr. Day
7. Do NOT ignore the user's chat messages and generate generic business posts

EXAMPLE: If user asks for posts about "Martin Luther King Jr. Day", generate 5 posts about Martin Luther King Jr. Day, NOT about engineering or company initiatives.

The user's chat messages are MANDATORY. Everything else (executive style, brief, document) is secondary.`;

  console.log(
    "formatChatMessages: Returning formatted messages, length:",
    formatted.length
  );
  return formatted;
}

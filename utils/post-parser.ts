/**
 * Utility function to parse generated posts from AI response text
 */

export function parseGeneratedPosts(text: string): string[] {
  console.log("Raw response from ChatGPT:", text);

  const posts: string[] = [];
  const lines = text.split("\n");
  let currentPost = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const postMatch = trimmedLine.match(/^(?:Post\s*)?(\d+)[:.)]\s*(.+)$/i);
    const postMatch2 = trimmedLine.match(/^(\d+)[:.)]\s*(.+)$/i);

    if ((postMatch || postMatch2) && currentPost) {
      posts.push(currentPost.trim());
      currentPost = "";
    }

    if (postMatch) currentPost = postMatch[2];
    else if (postMatch2) currentPost = postMatch2[2];
    else if (currentPost) currentPost += " " + trimmedLine;
    else currentPost = trimmedLine;

    if (posts.length >= 5) break;
  }

  if (currentPost.trim() && posts.length < 5) posts.push(currentPost.trim());

  if (posts.length < 5) {
    const separators = ["\n\n---\n\n", "\n---\n", "\n\n\n", "\n\n"];
    for (const separator of separators) {
      if (!text.includes(separator)) continue;
      const splitPosts = text
        .split(separator)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .slice(0, 5);

      if (splitPosts.length > posts.length) {
        posts.length = 0;
        posts.push(...splitPosts);
        break;
      }
    }
  }

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

  if (posts.length < 5) {
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20)
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

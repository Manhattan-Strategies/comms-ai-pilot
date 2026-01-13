export type GenerationBrief = {
  topic: string; // What the posts are about
  goals: string[]; // What success looks like
  keyPoints: string[]; // Must-include talking points
  exclusions: string[]; // Must-avoid topics/claims
  audienceContext: string; // Extra nuance beyond filters
  proofPoints: string[]; // Evidence/examples to reference
  CTA?: string; // Optional call-to-action style
  constraints: {
    postCount: number; // 5
    sentencesPerPost: [number, number]; // [2,4]
    noHashtags: boolean;
    noEmojis: boolean;
  };
};

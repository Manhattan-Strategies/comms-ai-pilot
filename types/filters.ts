export type FilterState = {
  executive?: string; // CEO, CTO, etc. - optional, can be inferred from selectedExecutive
  department?: string; // Optional, can be inferred from selectedExecutive
  voice?: string[]; // Optional, can be inferred from selectedExecutive
  audience?: string[]; // Optional
  platform?: string; // Optional
  selectedExecutive?: string; // Slug of selected executive from executive-lib.csv
};

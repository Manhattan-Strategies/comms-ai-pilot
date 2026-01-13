/**
 * Utility functions for mapping filter values to display names
 */

export type FilterType = "executive" | "department" | "platform";

const EXECUTIVE_MAP: Record<string, string> = {
  ceo: "CEO",
  cto: "CTO",
  cmo: "CMO",
  cpo: "CPO",
  cfo: "CFO",
  coo: "COO",
};

const DEPARTMENT_MAP: Record<string, string> = {
  engineering: "Engineering",
  product: "Product",
  marketing: "Marketing",
  sales: "Sales",
  operations: "Operations",
  finance: "Finance",
};

const PLATFORM_MAP: Record<string, string> = {
  linkedin: "LinkedIn",
  internal_update: "Internal Update",
  product_announcement: "Product Announcement",
  twitter: "Twitter/X",
};

const VOICE_MAP: Record<string, string> = {
  clear: "Clear",
  confident: "Confident",
  pragmatic: "Pragmatic",
  business_focused: "Business Focused",
};

const AUDIENCE_MAP: Record<string, string> = {
  peers: "Peers",
  operators: "Operators",
  partners: "Partners",
  internal_leaders: "Internal Leaders",
};

/**
 * Get display value for executive, department, or platform
 */
export function getDisplayValue(value: string, type: FilterType): string {
  const maps = {
    executive: EXECUTIVE_MAP,
    department: DEPARTMENT_MAP,
    platform: PLATFORM_MAP,
  };

  return maps[type][value] || value;
}

/**
 * Get display string for voice array
 */
export function getVoiceDisplay(voices: string[]): string {
  return voices.map((v) => VOICE_MAP[v] || v).join(", ");
}

/**
 * Get display string for audience array
 */
export function getAudienceDisplay(audiences: string[]): string {
  return audiences.map((a) => AUDIENCE_MAP[a] || a).join(", ");
}

/**
 * Export maps for direct access if needed
 */
export { EXECUTIVE_MAP, DEPARTMENT_MAP, PLATFORM_MAP, VOICE_MAP, AUDIENCE_MAP };

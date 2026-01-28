"use client";

import { FilterState } from "@/types/filters";
import { getActiveExecutives, getExecutiveBySlug } from "@/lib/executive-data";
import { cn } from "@/lib/utils";
import styles from "./filter-control.module.css";

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function FilterControls({
  filters,
  onFiltersChange,
}: FilterControlsProps) {
  const updateFilter = (
    key: keyof FilterState,
    value: string | string[] | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const executives = getActiveExecutives();

  const handleExecutiveChange = (executiveSlug: string | undefined) => {
    if (executiveSlug) {
      const executive = getExecutiveBySlug(executiveSlug);
      if (executive) {
        // When an executive is selected, populate fields from executive data
        // Dynamically set executive and department based on the executive's title
        onFiltersChange({
          ...filters,
          selectedExecutive: executiveSlug,
          // Infer and set executive role from title (for display purposes)
          executive: inferExecutiveRole(executive.title),
          // Infer and set department from title (for display purposes)
          department: inferDepartment(executive.title),
          // Use executive's tone for voice (convert tone string to array)
          voice: executive.tone
            ? [
                executive.tone.toLowerCase().split(/[,\s&]+/)[0] ||
                  "professional",
              ]
            : undefined,
        });
      }
    } else {
      // When "None" is selected, clear executive-specific fields and show manual selection
      onFiltersChange({
        ...filters,
        selectedExecutive: undefined,
        executive: undefined,
        department: undefined,
        voice: undefined,
      });
    }
  };

  // Helper to infer executive role from title
  const inferExecutiveRole = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("ceo") || titleLower.includes("chief executive"))
      return "ceo";
    if (titleLower.includes("cto") || titleLower.includes("chief technology"))
      return "cto";
    if (titleLower.includes("cmo") || titleLower.includes("chief marketing"))
      return "cmo";
    if (titleLower.includes("cpo") || titleLower.includes("chief product"))
      return "cpo";
    if (titleLower.includes("cfo") || titleLower.includes("chief financial"))
      return "cfo";
    if (titleLower.includes("coo") || titleLower.includes("chief operating"))
      return "coo";
    if (
      titleLower.includes("president") ||
      titleLower.includes("svp") ||
      titleLower.includes("md")
    )
      return "ceo"; // SVP, MD, President -> CEO
    return "ceo"; // Default fallback
  };

  // Helper to infer department from title
  const inferDepartment = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (
      titleLower.includes("engineering") ||
      titleLower.includes("technology") ||
      titleLower.includes("cto")
    )
      return "engineering";
    if (titleLower.includes("product") || titleLower.includes("cpo"))
      return "product";
    if (titleLower.includes("marketing") || titleLower.includes("cmo"))
      return "marketing";
    if (
      titleLower.includes("sales") ||
      titleLower.includes("commercial") ||
      titleLower.includes("md") ||
      titleLower.includes("latin america") ||
      titleLower.includes("region")
    )
      return "sales"; // MD often means Managing Director in sales/regional roles
    if (titleLower.includes("operations") || titleLower.includes("coo"))
      return "operations";
    if (titleLower.includes("finance") || titleLower.includes("cfo"))
      return "finance";
    return "general"; // Default to general instead of engineering
  };

  const toggleMultiFilter = (key: keyof FilterState, value: string) => {
    const current = (filters[key] as string[]) || [];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, newValue.length > 0 ? newValue : undefined);
  };

  // Show manual selection fields only when no executive is selected
  const showManualFields = !filters.selectedExecutive;

  const filterOptions = {
    executive: [
      { id: "ceo", label: "CEO" },
      { id: "cto", label: "CTO" },
      { id: "cmo", label: "CMO" },
      { id: "cpo", label: "CPO" },
      { id: "cfo", label: "CFO" },
      { id: "coo", label: "COO" },
    ],
    department: [
      { id: "engineering", label: "Engineering" },
      { id: "product", label: "Product" },
      { id: "marketing", label: "Marketing" },
      { id: "sales", label: "Sales" },
      { id: "operations", label: "Operations" },
      { id: "finance", label: "Finance" },
    ],
    voice: [
      { id: "clear", label: "Clear" },
      { id: "confident", label: "Confident" },
      { id: "pragmatic", label: "Pragmatic" },
      { id: "business_focused", label: "Business Focused" },
    ],
    audience: [
      { id: "peers", label: "Peers" },
      { id: "operators", label: "Operators" },
      { id: "partners", label: "Partners" },
      { id: "internal_leaders", label: "Internal Leaders" },
    ],
    platform: [
      { id: "linkedin", label: "LinkedIn" },
      { id: "twitter", label: "Twitter/X" },
      { id: "internal_update", label: "Internal Update" },
      { id: "product_announcement", label: "Product Announcement" },
    ],
  };

  return (
    <div className={cn("card card--paddedMd", styles.root)}>
      <h3 className={styles.title}>Content Style Settings</h3>

      <div className={styles.group}>
        {/* Executive Selector */}
        <div>
          <label className={styles.label}>Select Executive (Optional)</label>
          <select
            value={filters.selectedExecutive || ""}
            onChange={(e) => handleExecutiveChange(e.target.value || undefined)}
            className={styles.select}
          >
            <option value="">None - Use generic executive role</option>
            {executives.map((exec) => (
              <option key={exec.slug} value={exec.slug}>
                {exec.name} - {exec.title}
              </option>
            ))}
          </select>
          {filters.selectedExecutive && (
            <p className={styles.hint}>
              Selected:{" "}
              {
                executives.find((e) => e.slug === filters.selectedExecutive)
                  ?.name
              }
            </p>
          )}
        </div>

        {/* Executive Title - Only show when no executive is selected */}
        {showManualFields && (
          <div>
            <label className={styles.label}>Executive Title</label>
            <div className={styles.grid2}>
              {filterOptions.executive.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateFilter("executive", option.id)}
                  className={cn(
                    styles.chip,
                    filters.executive === option.id && styles.chipActive
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Department - Only show when no executive is selected */}
        {showManualFields && (
          <div>
            <label className={styles.label}>Department</label>
            <div className={styles.grid2}>
              {filterOptions.department.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateFilter("department", option.id)}
                  className={cn(
                    styles.chip,
                    filters.department === option.id && styles.chipActive
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Voice & Tone - Only show when no executive is selected */}
        {showManualFields && (
          <div>
            <label className={styles.label}>Voice &amp; Tone</label>
            <div className={styles.grid2}>
              {filterOptions.voice.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleMultiFilter("voice", option.id)}
                  className={cn(
                    styles.chip,
                    styles.chipMulti,
                    (filters.voice || []).includes(option.id) && styles.chipActive
                  )}
                >
                  {option.label}
                  {(filters.voice || []).includes(option.id) && (
                    <span className={styles.chipCheck}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Audience (Multiple) */}
        <div>
          <label className={styles.label}>Audience</label>
          <div className={styles.grid2}>
            {filterOptions.audience.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleMultiFilter("audience", option.id)}
                className={cn(
                  styles.chip,
                  styles.chipMulti,
                  (filters.audience || []).includes(option.id) && styles.chipActive
                )}
              >
                {option.label}
                {(filters.audience || []).includes(option.id) && (
                  <span className={styles.chipCheck}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <label className={styles.label}>Social Platform</label>
          <div className={styles.grid2}>
            {filterOptions.platform.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateFilter("platform", option.id)}
                className={cn(
                  styles.chip,
                  filters.platform === option.id && styles.chipActive
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

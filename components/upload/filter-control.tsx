"use client";

import { FilterState } from "@/types/filters";
import { getActiveExecutives, getExecutiveBySlug } from "@/lib/executive-data";

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function FilterControls({
  filters,
  onFiltersChange,
}: FilterControlsProps) {
  const updateFilter = (key: keyof FilterState, value: string | string[] | undefined) => {
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
        // and hide manual selection fields
        onFiltersChange({
          ...filters,
          selectedExecutive: executiveSlug,
          // Infer executive role from title (e.g., "President" -> CEO, "CTO" -> CTO)
          executive: inferExecutiveRole(executive.title),
          // Infer department from title
          department: inferDepartment(executive.title),
          // Use executive's tone for voice (convert tone string to array)
          voice: executive.tone ? [executive.tone.toLowerCase().split(/[,\s&]+/)[0] || "professional"] : ["professional"],
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
    if (titleLower.includes("ceo") || titleLower.includes("chief executive")) return "ceo";
    if (titleLower.includes("cto") || titleLower.includes("chief technology")) return "cto";
    if (titleLower.includes("cmo") || titleLower.includes("chief marketing")) return "cmo";
    if (titleLower.includes("cpo") || titleLower.includes("chief product")) return "cpo";
    if (titleLower.includes("cfo") || titleLower.includes("chief financial")) return "cfo";
    if (titleLower.includes("coo") || titleLower.includes("chief operating")) return "coo";
    if (titleLower.includes("president")) return "ceo"; // Default president to CEO
    return "ceo"; // Default fallback
  };

  // Helper to infer department from title
  const inferDepartment = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("engineering") || titleLower.includes("technology") || titleLower.includes("cto")) return "engineering";
    if (titleLower.includes("product") || titleLower.includes("cpo")) return "product";
    if (titleLower.includes("marketing") || titleLower.includes("cmo")) return "marketing";
    if (titleLower.includes("sales") || titleLower.includes("commercial")) return "sales";
    if (titleLower.includes("operations") || titleLower.includes("coo")) return "operations";
    if (titleLower.includes("finance") || titleLower.includes("cfo")) return "finance";
    return "engineering"; // Default fallback
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Content Style Settings
      </h3>

      <div className="space-y-6">
        {/* Executive Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Executive (Optional)
          </label>
          <select
            value={filters.selectedExecutive || ""}
            onChange={(e) => handleExecutiveChange(e.target.value || undefined)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">None - Use generic executive role</option>
            {executives.map((exec) => (
              <option key={exec.slug} value={exec.slug}>
                {exec.name} - {exec.title}
              </option>
            ))}
          </select>
          {filters.selectedExecutive && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Selected: {executives.find((e) => e.slug === filters.selectedExecutive)?.name}
            </p>
          )}
        </div>

        {/* Executive Title - Only show when no executive is selected */}
        {showManualFields && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Executive Title
            </label>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.executive.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateFilter("executive", option.id)}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-colors
                    ${
                      filters.executive === option.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                    }
                  `}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.department.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateFilter("department", option.id)}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-colors
                    ${
                      filters.department === option.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                    }
                  `}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Voice & Tone
            </label>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.voice.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleMultiFilter("voice", option.id)}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between
                    ${
                      (filters.voice || []).includes(option.id)
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                    }
                  `}
                >
                  {option.label}
                  {(filters.voice || []).includes(option.id) && (
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Audience (Multiple) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Audience
          </label>
          <div className="grid grid-cols-2 gap-2">
            {filterOptions.audience.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleMultiFilter("audience", option.id)}
                className={`
                  px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between
                  ${
                    (filters.audience || []).includes(option.id)
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                  }
                `}
              >
                {option.label}
                {(filters.audience || []).includes(option.id) && (
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Social Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            {filterOptions.platform.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateFilter("platform", option.id)}
                className={`
                  px-3 py-2 text-sm rounded-lg transition-colors
                  ${
                    filters.platform === option.id
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                  }
                `}
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

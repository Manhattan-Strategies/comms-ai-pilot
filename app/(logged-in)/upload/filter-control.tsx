// components/upload/filter-controls.tsx
"use client";

import { FilterState } from "@/types/filters";

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function FilterControls({
  filters,
  onFiltersChange,
}: FilterControlsProps) {
  const updateFilter = (key: keyof FilterState, value: string | string[]) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleMultiFilter = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, newValue);
  };

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
      { id: "internal_update", label: "Internal Update" },
      { id: "product_announcement", label: "Product Announcement" },
      { id: "twitter", label: "Twitter/X" },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Content Style Settings
      </h3>

      <div className="space-y-6">
        {/* Executive */}
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

        {/* Department */}
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

        {/* Voice & Tone (Multiple) */}
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
                    (filters.voice as string[]).includes(option.id)
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                  }
                `}
              >
                {option.label}
                {(filters.voice as string[]).includes(option.id) && (
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

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
                    (filters.audience as string[]).includes(option.id)
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                  }
                `}
              >
                {option.label}
                {(filters.audience as string[]).includes(option.id) && (
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

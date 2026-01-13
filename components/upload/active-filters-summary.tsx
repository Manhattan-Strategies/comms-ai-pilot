import type { FilterState } from "@/types/filters";

/**
 * Component displaying a summary of active filter settings
 */
interface ActiveFiltersSummaryProps {
  filters: FilterState;
}

export default function ActiveFiltersSummary({
  filters,
}: ActiveFiltersSummaryProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
        Active Settings
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Executive:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {filters.executive.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Department:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
            {filters.department}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Platform:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
            {filters.platform.replace("_", " ")}
          </span>
        </div>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            These settings are applied during post generation
          </p>
        </div>
      </div>
    </div>
  );
}

import type { FilterState } from "@/types/filters";
import { getExecutiveBySlug } from "@/lib/executive-data";

/**
 * Component displaying a summary of active filter settings
 */
interface ActiveFiltersSummaryProps {
  filters: FilterState;
}

export default function ActiveFiltersSummary({
  filters,
}: ActiveFiltersSummaryProps) {
  const selectedExecutive = filters.selectedExecutive
    ? getExecutiveBySlug(filters.selectedExecutive)
    : null;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
        Active Settings
      </h4>
      <div className="space-y-2 text-sm">
        {selectedExecutive ? (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Executive:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {selectedExecutive.name}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-gray-600 dark:text-gray-400">Title:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100 text-xs text-right ml-2">
                {selectedExecutive.title}
              </span>
            </div>
            {selectedExecutive.tone && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Tone & Style:
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  {selectedExecutive.tone}
                </p>
              </div>
            )}
            {selectedExecutive.otherNotes && selectedExecutive.otherNotes.trim() && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Notes:
                  </span>
                </div>
                <div
                  className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4 [&_li]:mb-1 [&_strong]:font-semibold [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: selectedExecutive.otherNotes }}
                />
              </div>
            )}
            {selectedExecutive.executivePositioning && selectedExecutive.executivePositioning.trim() && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Positioning:
                  </span>
                </div>
                <div
                  className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4 [&_li]:mb-1 [&_strong]:font-semibold [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: selectedExecutive.executivePositioning }}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {filters.executive && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {filters.executive.toUpperCase()}
                </span>
              </div>
            )}
            {filters.department && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Department:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {filters.department}
                </span>
              </div>
            )}
          </>
        )}
        {filters.platform && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Platform:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
              {filters.platform.replace("_", " ")}
            </span>
          </div>
        )}
        {filters.audience && filters.audience.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Audience:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
              {filters.audience.join(", ")}
            </span>
          </div>
        )}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            These settings are applied during post generation
          </p>
        </div>
      </div>
    </div>
  );
}

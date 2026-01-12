// @components/upload/summary-display.tsx
interface SummaryDisplayProps {
  title?: string;
  summary: string;
  message?: string;
}

export function SummaryDisplay({
  title,
  summary,
  message,
}: SummaryDisplayProps) {
  return (
    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-left">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-gray-50 dark:bg-gray-900 px-3 text-sm font-medium text-gray-900 dark:text-gray-100">
            Generated Summary
          </span>
        </div>
      </div>

      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-left">
          {title}
        </h3>
      )}

      <div className="prose prose-sm dark:prose-invert max-w-none text-left">
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {summary}
        </div>
      </div>

      {message && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-left">
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
      )}
    </div>
  );
}

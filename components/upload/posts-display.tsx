// components/upload/posts-display.tsx
import { getExecutiveBySlug } from "@/lib/executive-data";
import { getDisplayValue } from "@/utils/filter-mappings";

interface PostsDisplayProps {
  posts: string[];
  filters: any;
  fileName: string | null;
  title?: string;
}

export function PostsDisplay({
  posts,
  filters,
  fileName,
  title,
}: PostsDisplayProps) {
  const formatFilterValue = (key: string, value: string | string[]): string => {
    if (Array.isArray(value)) {
      // Format arrays based on key
      if (key === "voice") {
        return value
          .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
          .join(", ");
      }
      if (key === "audience") {
        return value
          .map((v) => v.charAt(0).toUpperCase() + v.slice(1).replace("_", " "))
          .join(", ");
      }
      return value.join(", ");
    }

    // Format single values based on key
    if (key === "executive" && typeof value === "string") {
      return getDisplayValue(value, "executive");
    }
    if (key === "department" && typeof value === "string") {
      return getDisplayValue(value, "department");
    }
    if (key === "platform" && typeof value === "string") {
      return getDisplayValue(value, "platform");
    }
    if (key === "selectedExecutive" && typeof value === "string") {
      const executive = getExecutiveBySlug(value);
      return executive ? executive.name : value;
    }

    return String(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Generated Social Posts
        </h3>
        {fileName && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Based on: {fileName}
          </p>
        )}
      </div>

      {/* Filters used */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
          Settings Used:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {(() => {
            // If selectedExecutive is set, show executive info first, then other filters
            const selectedExecutive = filters.selectedExecutive
              ? getExecutiveBySlug(filters.selectedExecutive)
              : null;

            const filterEntries = Object.entries(filters).filter(
              ([key, value]) => {
                // Skip selectedExecutive and executive/department if we have a selected executive
                // (we'll show them separately with actual executive data)
                if (selectedExecutive) {
                  if (
                    key === "selectedExecutive" ||
                    key === "executive" ||
                    key === "department"
                  ) {
                    return false;
                  }
                }
                // Filter out undefined, null, empty arrays
                if (value === undefined || value === null) return false;
                if (Array.isArray(value) && value.length === 0) return false;
                if (typeof value === "string" && value.trim() === "")
                  return false;
                return true;
              }
            );

            // If we have a selected executive, show their actual title and department first
            const executiveDisplay = selectedExecutive ? (
              <>
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-1">
                    Executive:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedExecutive.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 mr-1">
                    Title:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedExecutive.title}
                  </span>
                </div>
                {filters.department && (
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 mr-1">
                      Department:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatFilterValue("department", filters.department)}
                    </span>
                  </div>
                )}
              </>
            ) : null;

            return (
              <>
                {executiveDisplay}
                {filterEntries.map(([key, value]) => {
                  // Format key for display
                  let displayKey = key;
                  if (key === "executive") {
                    displayKey = "Executive Role";
                  } else {
                    displayKey = key.charAt(0).toUpperCase() + key.slice(1);
                  }

                  return (
                    <div key={key} className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 mr-1">
                        {displayKey}:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatFilterValue(key, value as string | string[])}
                      </span>
                    </div>
                  );
                })}
              </>
            );
          })()}
        </div>
      </div>

      {/* Posts list */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Post {index + 1}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(post);
                  // You can add a toast here
                }}
                className="bg-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Copy
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-left">
              {post}
            </p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => {
            const allPosts = posts.join("\n\n---\n\n");
            navigator.clipboard.writeText(allPosts);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Copy All Posts
        </button>
        <button
          onClick={() => {
            const text = posts
              .map((post, i) => `Post ${i + 1}:\n${post}`)
              .join("\n\n");
            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `social-posts-${new Date().toISOString().split("T")[0]}.txt`;
            a.click();
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          Download as TXT
        </button>
      </div>
    </div>
  );
}

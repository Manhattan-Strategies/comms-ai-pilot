// components/upload/posts-display.tsx
import { getExecutiveBySlug } from "@/lib/executive-data";
import { getDisplayValue } from "@/utils/filter-mappings";
import { cn } from "@/lib/utils";
import styles from "./posts-display.module.css";

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
    <div className={cn("card card--paddedMd", "textLeft")}>
      <div className={styles.header}>
        <h3 className={styles.title}>Generated Social Posts</h3>
        {fileName && (
          <p className={styles.subtitle}>Based on: {fileName}</p>
        )}
      </div>

      {/* Filters used */}
      <div className={styles.settingsBox}>
        <h4 className={styles.settingsTitle}>Settings Used:</h4>
        <div className={styles.settingsGrid}>
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
                <div className={styles.kvRow}>
                  <span className={styles.kvKey}>Executive:</span>
                  <span className={styles.kvValue}>{selectedExecutive.name}</span>
                </div>
                <div className={styles.kvRow}>
                  <span className={styles.kvKey}>Title:</span>
                  <span className={styles.kvValue}>{selectedExecutive.title}</span>
                </div>
                {filters.department && (
                  <div className={styles.kvRow}>
                    <span className={styles.kvKey}>Department:</span>
                    <span className={styles.kvValue}>
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
                    <div key={key} className={styles.kvRow}>
                      <span className={styles.kvKey}>{displayKey}:</span>
                      <span className={styles.kvValue}>
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
      <div className={styles.postsList}>
        {posts.map((post, index) => (
          <div
            key={index}
            className={styles.postCard}
          >
            <div className={styles.postHeader}>
              <span className={styles.postTag}>Post {index + 1}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(post);
                  // You can add a toast here
                }}
                className={styles.copyButton}
              >
                Copy
              </button>
            </div>
            <p className={styles.postText}>{post}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className={styles.actions}>
        <button
          onClick={() => {
            const allPosts = posts.join("\n\n---\n\n");
            navigator.clipboard.writeText(allPosts);
          }}
          className={cn("btn", "btn--sm")}
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
          className={cn("btn", "btn--secondary", "btn--sm")}
        >
          Download as TXT
        </button>
      </div>
    </div>
  );
}

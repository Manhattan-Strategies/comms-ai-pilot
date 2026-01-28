import type { FilterState } from "@/types/filters";
import { getExecutiveBySlug } from "@/lib/executive-data";
import { cn } from "@/lib/utils";
import styles from "./active-filters-summary.module.css";

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
    <div className={cn("card card--paddedMd card--soft", styles.root)}>
      <h4 className={styles.title}>Active Settings</h4>
      <div className={styles.items}>
        {selectedExecutive ? (
          <>
            <div className={cn(styles.row, styles.section, styles["section--none"])}>
              <span className={styles.label}>Executive:</span>
              <span className={styles.value}>{selectedExecutive.name}</span>
            </div>
            <div className={cn(styles.row, styles.rowTop)}>
              <span className={styles.label}>Title:</span>
              <span className={cn(styles.value, styles.valueSmall)}>
                {selectedExecutive.title}
              </span>
            </div>
            {selectedExecutive.tone && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Tone &amp; Style:</span>
                <p className={cn(styles.sectionText, styles.sectionTextItalic)}>
                  {selectedExecutive.tone}
                </p>
              </div>
            )}
            {selectedExecutive.otherNotes && selectedExecutive.otherNotes.trim() && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Notes:</span>
                <div
                  className={cn(styles.sectionText, styles.richText)}
                  dangerouslySetInnerHTML={{ __html: selectedExecutive.otherNotes }}
                />
              </div>
            )}
            {selectedExecutive.executivePositioning && selectedExecutive.executivePositioning.trim() && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Positioning:</span>
                <div
                  className={cn(styles.sectionText, styles.richText)}
                  dangerouslySetInnerHTML={{ __html: selectedExecutive.executivePositioning }}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {filters.executive && (
              <div className={styles.row}>
                <span className={styles.label}>Role:</span>
                <span className={styles.value}>{filters.executive.toUpperCase()}</span>
              </div>
            )}
            {filters.department && (
              <div className={styles.row}>
                <span className={styles.label}>Department:</span>
                <span className={styles.value}>{filters.department}</span>
              </div>
            )}
          </>
        )}
        {filters.platform && (
          <div className={styles.row}>
            <span className={styles.label}>Platform:</span>
            <span className={styles.value}>{filters.platform.replace("_", " ")}</span>
          </div>
        )}
        {filters.audience && filters.audience.length > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>Audience:</span>
            <span className={styles.value}>{filters.audience.join(", ")}</span>
          </div>
        )}
        <div className={styles.section}>
          <p className={styles.footnote}>These settings are applied during post generation</p>
        </div>
      </div>
    </div>
  );
}

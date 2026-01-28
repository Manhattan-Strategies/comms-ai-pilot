// @components/upload/summary-display.tsx
import { cn } from "@/lib/utils";
import styles from "./summary-display.module.css";

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
    <div className="card card--paddedMd card--soft spacerTopLg textLeft">
      <div className="divider">
        <span className="divider__label divider__label--surface">
          Generated Summary
        </span>
      </div>

      {title && (
        <h3 className={styles.title}>{title}</h3>
      )}

      <div className="prose prose--sm">
        <div className={styles.summaryText}>{summary}</div>
      </div>

      {message && (
        <div className={styles.footer}>
          <p className={cn("textMuted", styles.footerMessage)}>{message}</p>
        </div>
      )}
    </div>
  );
}

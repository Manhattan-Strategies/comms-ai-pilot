import { cn } from "@/lib/utils";
import styles from "./bg-gradient.module.css";

export default function BgGradient({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={styles.wrapper}
    >
      <div
        style={{
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        }}
        className={cn(
          styles.shape,
          className
        )}
      />
    </div>
  );
}

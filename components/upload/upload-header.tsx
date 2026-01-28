import { Sparkles } from "lucide-react";

import { Badge } from "../ui/badge";
import { MotionDiv } from "../common/motion-wrapper";
import { itemVariants } from "@/utils/constants";
import { cn } from "@/lib/utils";
import styles from "./upload-header.module.css";
export default function UploadHeader() {
  return (
    <div className={styles.root}>
      <MotionDiv
        variants={itemVariants}
        className={cn("gradientPillBorder animateGradientX")}
      >
        <Badge
          variant="secondary"
          className={cn("gradientPillInner", styles.pillInner)}
        >
          <Sparkles className="icon icon--lg icon--pulse" />
          <p className={styles.pillText}>AI-Powered Content Creation</p>
        </Badge>
      </MotionDiv>
      <MotionDiv
        variants={itemVariants}
        className={styles.title}
      >
        Start Planning{" "}
        <span className={styles.highlightWord}>
          <span className={styles.highlightWordText}>Your Content</span>
          <span
            className={styles.highlightBackdrop}
            aria-hidden="true"
          ></span>
        </span>{" "}
      </MotionDiv>
      <MotionDiv
        variants={itemVariants}
        className={styles.subtitle}
      >
        {" "}
      </MotionDiv>
    </div>
  );
}

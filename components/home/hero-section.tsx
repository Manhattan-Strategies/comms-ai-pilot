import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  MotionDiv,
  MotionH1,
  MotionH2,
  MotionSection,
  MotionSpan,
} from "../common/motion-wrapper";
import { containerVariants, itemVariants } from "@/utils/constants";
import { cn } from "@/lib/utils";
import styles from "./hero-section.module.css";

const hoverAnimation = {
  scale: 1.05,
  transition: {
    type: "spring" as const,
    damping: 10,
    stiffness: 300,
  },
} as const;

export default function Hebluection() {
  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.root}
    >
      {/* Badge */}
      <MotionDiv
        variants={itemVariants}
        className={cn("gradientPillBorder animateGradientX")}
      >
        <Badge
          variant={"secondary"}
          className={cn("gradientPillInner", styles.pillInner)}
        >
          {/* <Sparkles className="icon icon--lg icon--pulse" /> */}
          <p className={styles.pillText}>Powered by AI</p>
        </Badge>
      </MotionDiv>

      {/* Title */}
      <MotionH1 variants={itemVariants} className={styles.title}>
        Transform ideas into{" "}
        <span className={styles.highlightWord}>
          <MotionSpan
            whileHover={hoverAnimation}
            className={styles.highlightWordText}
          >
            real
          </MotionSpan>
          <span
            className={styles.highlightBackdrop}
            aria-hidden="true"
          ></span>
        </span>{" "}
        solutions
      </MotionH1>

      {/* Description */}
      <MotionH2
        variants={itemVariants}
        className={styles.description}
      >
        Get a comprehensive list of social posts in seconds.
      </MotionH2>

      {/* Button */}
      <MotionDiv variants={itemVariants}>
        <Button
          variant={"default"}
          className={styles.ctaButton}
        >
          <Link href="/upload" className={styles.ctaLink}>
            <span>Try AI Pilot</span>
            <ArrowRight className="icon icon--md icon--pulse" />
          </Link>
        </Button>
      </MotionDiv>
    </MotionSection>
  );
}

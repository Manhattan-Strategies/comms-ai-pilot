import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import styles from "./cta-section.module.css";
import { cn } from "@/lib/utils";

export default function CTASection() {
  return (
    <section className={styles.root}>
      <div className="sectionInner">
        <div className={styles.content}>
          <div>
            <h2 className={styles.heading}>Ready?</h2>
            <p className={styles.subheading}>Let's try it now.</p>
          </div>

          <div className={styles.actions}>
            <Button size={"lg"} variant={"link"} className={styles.ctaButton}>
              <Link href="/sign-in" className={styles.ctaLink}>
                Get Started{" "}
                <ArrowRight className={cn(styles.ctaIcon, "icon icon--sm icon--pulse")} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

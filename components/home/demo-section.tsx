import { Pizza } from "lucide-react";
import { MotionDiv, MotionH3 } from "../common/motion-wrapper";
import styles from "./demo-section.module.css";
// import { SummaryViewer } from "../summaries/summary-viewer";

export default function DemoSection() {
  return (
    <section className={styles.section}>
      <div className="sectionInner">
        <div
          aria-hidden="true"
          className={styles.decorWrapper}
        >
          <div
            className={styles.decorShape}
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%,74.1% 44.1%)",
            }}
          ></div>
        </div>

        <div className={styles.intro}>
          <div className={styles.iconTile}>
            <Pizza className={`icon icon--lg ${styles.pizzaIcon}`} />
          </div>
          <div className={styles.headlineWrap}>
            <MotionH3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={styles.headline}
            >
              Watch how AI Pilot transforms{" "}
              <span className={styles.gradientText}>
                executive drafts
              </span>{" "}
              into social posts!
            </MotionH3>
          </div>
        </div>

        <div className={styles.viewerWrap}>
          {/* Summary Viewer */}
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* <SummaryViewer summary={DEMO_SUMMARY} /> */}
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}

import { BrainCircuit, FileOutput, FileText, MoveRight } from "lucide-react";
import { ReactNode } from "react";
import { MotionDiv, MotionH2, MotionH3 } from "../common/motion-wrapper";
import styles from "./how-it-works-section.module.css";

type Step = {
  icon: ReactNode;
  label: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: <FileText size={64} strokeWidth={1.5} />,
    label: "Plan your content",
    description:
      "Write a brief for your content or upload a document, then filter by executive and audience",
  },
  {
    icon: <BrainCircuit size={64} strokeWidth={1.5} />,
    label: "AI Analysis",
    description:
      "Our advanced AI processes and analyzes your document instantly",
  },
  {
    icon: <FileOutput size={64} strokeWidth={1.5} />,
    label: "Get Posts",
    description: "Receive 5 Social Posts",
  },
];

export default function HowItWorksSection() {
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
          />
        </div>
        <div className={styles.intro}>
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.kicker}
          >
            How it works
          </MotionH2>
          <MotionH3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={styles.headline}
          >
            Transform any PDF into an easy-to-digest summary in three simple
            steps
          </MotionH3>
        </div>

        <div className={styles.grid}>
          {steps.map((step, idx) => (
            <MotionDiv
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={styles.stepWrap}
            >
              <StepItem {...step} />
              {idx < steps.length - 1 && (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 + 0.3 }}
                  className={styles.arrow}
                >
                  <MoveRight
                    size={32}
                    strokeWidth={1}
                    className={styles.arrow}
                  ></MoveRight>
                </MotionDiv>
              )}
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({ icon, label, description }: Step) {
  return (
    <div className={styles.stepCard}>
      <div className={styles.stepInner}>
        <div className={styles.iconBox}>
          <div className={styles.icon}>{icon}</div>
        </div>
        <div>
          <h4 className={styles.stepTitle}>{label}</h4>
          <p className={styles.stepText}>{description}</p>
        </div>
      </div>
    </div>
  );
}

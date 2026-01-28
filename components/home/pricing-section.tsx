import { cn } from "@/lib/utils";
import {
  containerVariants,
  itemVariants,
  pricingPlans,
} from "@/utils/constants";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";
import styles from "./pricing-section.module.css";

interface PriceType {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
  paymentLink: string;
  priceId: string;
}

const listVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
} as const;

const PricingCard = ({
  name,
  price,
  description,
  items,
  id,
  paymentLink,
}: PriceType) => {
  return (
    <MotionDiv
      variants={listVariant}
      whileHover={{ scale: 1.02 }}
      className={styles.cardWrap}
    >
      <div
        className={cn(
          styles.card,
          id === "pro" && styles.cardPro
        )}
      >
        <MotionDiv
          variants={listVariant}
          className={styles.topRow}
        >
          <div>
            <p className={styles.name}>{name}</p>
            <p className={styles.description}>{description}</p>
          </div>
        </MotionDiv>

        <MotionDiv variants={listVariant} className={styles.priceRow}>
          <p className={styles.price}>{price} Diet Cokes</p>
          <div className={styles.perMonth}>
            <p>/month</p>
          </div>
        </MotionDiv>

        <MotionDiv
          variants={listVariant}
          className={styles.features}
        >
          {items.map((item, idx) => (
            <li key={idx} className={styles.feature}>
              <CheckIcon size={18} className="icon icon--sm" />
              <span>{item}</span>
            </li>
          ))}
        </MotionDiv>

        <MotionDiv
          variants={listVariant}
          className={styles.ctaRow}
        >
          <Link
            href={paymentLink}
            className={cn(
              styles.buyLink,
              id === "pro"
                ? styles.buyLinkPro
                : undefined
            )}
          >
            Buy Now <ArrowRight size={18} className="icon icon--sm" />
          </Link>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};

export default function PricingSection() {
  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={styles.section}
      id="pricing"
    >
      <div className="sectionInner">
        <MotionDiv variants={itemVariants} className={styles.headerRow}>
          <h2 className={styles.headerTitle}>Pricing</h2>
        </MotionDiv>
        <div className={styles.plans}>
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

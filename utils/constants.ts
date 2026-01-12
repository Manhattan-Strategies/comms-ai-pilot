import type { Variants } from "motion/react";

export const pricingPlans = [
  {
    name: "Basic",
    price: 2,
    description: "Perfect for occasional use",
    items: [
      "5 queries per month",
      "Standard processing speed",
      "Email support",
    ],
    id: "basic",
    paymentLink: "#",
    // priceId: "price_1RA9yVCTlpmJdURCo5eDA5T5",
  },
  {
    name: "Pro",
    price: 5,
    description: "For professionals and teams",
    items: [
      "Unlimited queries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    id: "pro",
    paymentLink: "#",
    // priceId: "price_1RA9yVCTlpmJdURCk8Oi1pwO",
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
} satisfies Variants;

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 50,
      duration: 0.8,
    },
  },
} satisfies Variants;

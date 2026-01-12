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
      className="relative mx-auto flex flex-col z-0 items-center justify-center py-16 sm:py-20 lg:pb-28 transition-all animate-in lg:px-12 max-w-7xl"
    >
      {/* Badge */}
      <MotionDiv
        variants={itemVariants}
        className="relative p-px overflow-hidden rounded-full bg-linear-to-r from-blue-200 via-blue-500 to-blue-800 animate-gradient-x group"
      >
        <Badge
          variant={"secondary"}
          className="relative px-6 py-2 text-base font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors duration-200"
        >
          <Sparkles className="h-6 w-6 mr-1 min-w-[28px] min-h-[28px] text-blue-600 animate-pulse" />
          <p className="text-base text-blue-600">Powered by AI</p>
        </Badge>
      </MotionDiv>

      {/* Title */}
      <MotionH1 variants={itemVariants} className="font-bold py-6 text-center">
        Transform ideas into{" "}
        <span className="relative inline-block">
          <MotionSpan
            whileHover={hoverAnimation}
            className="relative z-10 px-2"
          >
            real
          </MotionSpan>
          <span
            className="absolute inset-0 bg-blue-200/50 -rotate-2 rounded-lg transform -skew-y-1"
            aria-hidden="true"
          ></span>
        </span>{" "}
        solutions
      </MotionH1>

      {/* Description */}
      <MotionH2
        variants={itemVariants}
        className="text-lg sm:text-xl lg:text-2xl text-center px-4 lg:px-0 lg:max-w-4xl text-gray-600"
      >
        Get a comprehensive list of social posts in seconds.
      </MotionH2>

      {/* Button */}
      <MotionDiv variants={itemVariants}>
        <Button
          variant={"link"}
          className="text-white mt-6 text-base sm:text-lg lg:text-xl rounded-full px-8 sm:px-10 lg:px-12 py-6 sm:py-7 lg:py-8 lg:mt-16 bg-linear-to-r from-slate-900 to-blue-500 hover:from-blue-500 hover:to-slate-900 hover:no-underline font-bold shadow-lg transition-all duration-300"
        >
          <Link href="/#pricing" className="flex gap-2 items-center">
            <span>Try AI Pilot</span>
            <ArrowRight className="animate-pulse" />
          </Link>
        </Button>
      </MotionDiv>
    </MotionSection>
  );
}

import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/hero-section";
import DemoSection from "@/components/home/demo-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import PricingSection from "@/components/home/pricing-section";
import CTASection from "@/components/home/cta-section";
export default function Home() {
  return (
    <div className="relative w-full">
      {/* <h1 className="text-4xl font-bold animate-pulse">Manhattan AI Pilot</h1>
      <Button variant="outline" size="lg">Click me</Button> */}
      <HeroSection />
      <DemoSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}

import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/hero-section";
export default function Home() {
  return (
    <div className="">
      {/* <h1 className="text-4xl font-bold animate-pulse">Manhattan AI Pilot</h1>
      <Button variant="outline" size="lg">Click me</Button> */}
      <HeroSection />
      {/* <DemoSection/> */}
      {/* <HotItWorksSection/> */}
      {/* <PricingSection/> */}
      {/* <CTASection/> */}
    </div>
  );
}

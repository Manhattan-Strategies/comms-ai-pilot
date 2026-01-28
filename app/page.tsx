import HeroSection from "@/components/home/hero-section";
import DemoSection from "@/components/home/demo-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import PricingSection from "@/components/home/pricing-section";
import CTASection from "@/components/home/cta-section";
export default function Home() {
  return (
    <div>
      <HeroSection />
      <DemoSection />
      <HowItWorksSection />
      {/* <PricingSection /> */}
      <CTASection />
    </div>
  );
}

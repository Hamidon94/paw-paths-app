import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { FeaturesSection } from "@/components/ui/features-section";
import { HowItWorksSection } from "@/components/ui/how-it-works-section";
import { TrustSection } from "@/components/ui/trust-section";
import { UserTypesSection } from "@/components/ui/user-types-section";
import { Footer } from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TrustSection />
        <UserTypesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

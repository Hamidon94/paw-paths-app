import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { SearchForm } from "@/components/ui/search-form";
import { FeaturesSection } from "@/components/ui/features-section";
import { HowItWorksSection } from "@/components/ui/how-it-works-section";
import { DogWalkingProtect } from "@/components/ui/dogwalking-protect";
import { TrustSection } from "@/components/ui/trust-section";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { UserTypesSection } from "@/components/ui/user-types-section";
import { Footer } from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <section className="py-12 px-4 -mt-20 relative z-10">
          <div className="container mx-auto">
            <SearchForm />
          </div>
        </section>
        <FeaturesSection />
        <HowItWorksSection />
        <DogWalkingProtect />
        <TrustSection />
        <TestimonialsSection />
        <UserTypesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

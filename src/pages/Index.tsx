import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { SearchForm } from "@/components/ui/search-form";
import { ThreeStepsSection } from "@/components/ui/three-steps-section";
import { ServicesSection } from "@/components/ui/services-section";
import { SecuritySection } from "@/components/ui/security-section";
import { TrustSection } from "@/components/ui/trust-section";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { UserTypesSection } from "@/components/ui/user-types-section";
import { FAQSection } from "@/components/ui/faq-section";
import { CitiesSection } from "@/components/ui/cities-section";
import { Footer } from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* 1. Hero */}
        <HeroSection />
        
        {/* 2. Search Form */}
        <section className="py-12 px-4 -mt-20 relative z-10">
          <div className="container mx-auto">
            <SearchForm />
          </div>
        </section>
        
        {/* 3. 3 Étapes animées */}
        <ThreeStepsSection />
        
        {/* 4. Nos 6 services */}
        <ServicesSection />
        
        {/* 5. Sécurité & Garanties */}
        <SecuritySection />
        
        {/* 6. Stats & Confiance */}
        <TrustSection />
        
        {/* 7. Avis clients */}
        <TestimonialsSection />
        
        {/* 8. FAQ */}
        <FAQSection />
        
        {/* 9. Rejoindre la communauté */}
        <UserTypesSection />
        
        {/* 10. Villes / SEO local */}
        <CitiesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dog-walking.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Votre chien mérite la{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              meilleure promenade
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Trouvez des promeneurs de confiance près de chez vous et offrez à votre compagnon 
            l'exercice et l'attention qu'il mérite.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4 h-auto">
              Réserver une promenade
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
              Devenir promeneur
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center items-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-sage rounded-full"></div>
              <span>Promeneurs vérifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ocean rounded-full"></div>
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-sage rounded-full"></div>
              <span>Suivi en temps réel</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
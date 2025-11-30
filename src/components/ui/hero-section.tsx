import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dog-walking.jpg";
import { MapPin, Search } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Trouvez un promeneur de{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              confiance
            </span>
            {" "}près de chez vous
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Promenades, visites, gardes et hébergement pour votre compagnon. 
            Paiement sécurisé, preuves photo/vidéo obligatoires.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-4 h-auto min-w-[220px]" 
              onClick={() => window.location.href = '/walkers'}
            >
              <Search className="h-5 w-5 mr-2" />
              Trouver un promeneur
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 h-auto min-w-[220px] bg-white/10 border-white/30 text-white hover:bg-white/20" 
              onClick={() => window.location.href = '/walkers?view=map'}
            >
              <MapPin className="h-5 w-5 mr-2" />
              Voir la carte
            </Button>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-sage rounded-full"></div>
              <span>Promeneurs vérifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ocean rounded-full"></div>
              <span>Paiement sécurisé escrow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-sage rounded-full"></div>
              <span>Preuves photo/vidéo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin } from "lucide-react";

export const CitiesSection = () => {
  const regions = [
    {
      name: "Île-de-France",
      cities: ["Paris", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil", "Montreuil", "Nanterre", "Créteil", "Versailles", "Courbevoie", "Vitry-sur-Seine"]
    },
    {
      name: "Auvergne-Rhône-Alpes",
      cities: ["Lyon", "Grenoble", "Saint-Étienne", "Villeurbanne", "Clermont-Ferrand", "Annecy", "Chambéry", "Valence"]
    },
    {
      name: "Provence-Alpes-Côte d'Azur",
      cities: ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Avignon", "Cannes", "Antibes", "La Seyne-sur-Mer"]
    },
    {
      name: "Nouvelle-Aquitaine",
      cities: ["Bordeaux", "Limoges", "Poitiers", "Pau", "Mérignac", "La Rochelle", "Pessac", "Angoulême"]
    },
    {
      name: "Occitanie",
      cities: ["Toulouse", "Montpellier", "Nîmes", "Perpignan", "Béziers", "Carcassonne", "Sète", "Albi"]
    },
    {
      name: "Hauts-de-France",
      cities: ["Lille", "Amiens", "Roubaix", "Tourcoing", "Dunkerque", "Calais", "Valenciennes", "Boulogne-sur-Mer"]
    },
    {
      name: "Grand Est",
      cities: ["Strasbourg", "Reims", "Metz", "Mulhouse", "Nancy", "Colmar", "Troyes", "Charleville-Mézières"]
    },
    {
      name: "Pays de la Loire",
      cities: ["Nantes", "Angers", "Le Mans", "Saint-Nazaire", "La Roche-sur-Yon", "Cholet", "Laval", "Saumur"]
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-sage-light/5">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ocean-light/50 mb-4">
            <MapPin className="h-7 w-7 text-ocean" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Disponible partout en{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              France
            </span>
          </h2>
          <p className="text-muted-foreground">
            Trouvez des promeneurs de confiance dans votre ville
          </p>
        </div>

        <Accordion type="multiple" className="w-full space-y-3">
          {regions.map((region, index) => (
            <AccordionItem 
              key={index} 
              value={`region-${index}`}
              className="border rounded-lg px-6 bg-gradient-card shadow-soft"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {region.name}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="flex flex-wrap gap-2">
                  {region.cities.map((city, cityIndex) => (
                    <a
                      key={cityIndex}
                      href={`/walkers?city=${encodeURIComponent(city)}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                      {city}
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

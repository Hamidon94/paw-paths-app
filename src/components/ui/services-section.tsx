import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dog, Home, Moon, Sun, Stethoscope, Sparkles, ArrowRight } from "lucide-react";

export const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Dog,
      title: "Promenade",
      description: "Balades quotidiennes adaptées aux besoins de votre chien. Durée libre selon vos envies.",
      minPrice: "8€",
      color: "sage"
    },
    {
      icon: Home,
      title: "Visite à domicile",
      description: "Passage à domicile pour nourrir, câliner et sortir brièvement votre compagnon.",
      minPrice: "8€",
      color: "ocean"
    },
    {
      icon: Moon,
      title: "Hébergement nuit",
      description: "Garde de nuit chez le promeneur dans un environnement familial et sécurisé.",
      minPrice: "10€",
      color: "sage"
    },
    {
      icon: Sun,
      title: "Hébergement jour",
      description: "Accueil en journée chez le promeneur avec promenades et compagnie.",
      minPrice: "10€",
      color: "ocean"
    },
    {
      icon: Sparkles,
      title: "Garde à domicile",
      description: "Présence 24h chez vous pour une surveillance et des soins complets.",
      minPrice: "12€",
      color: "sage"
    },
    {
      icon: Stethoscope,
      title: "Visite sanitaire",
      description: "Soins d'hygiène, entretien et administration de médicaments si nécessaire.",
      minPrice: "16€",
      color: "ocean"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des prestations adaptées à tous les besoins de votre compagnon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colorClass = service.color === 'sage' ? 'bg-sage' : 'bg-ocean';
            const lightColorClass = service.color === 'sage' ? 'bg-sage-light/50' : 'bg-ocean-light/50';
            
            return (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-lg transition-all duration-300 bg-gradient-card border-0 group hover:-translate-y-1 overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${lightColorClass} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${service.color === 'sage' ? 'text-sage' : 'text-ocean'}`} />
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">à partir de</span>
                      <p className={`text-2xl font-bold ${service.color === 'sage' ? 'text-sage' : 'text-ocean'}`}>
                        {service.minPrice}
                      </p>
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 min-h-[60px]">
                    {service.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-sm font-medium group/btn"
                    onClick={() => navigate(`/services/${service.title.toLowerCase().replace(/ /g, '-')}`)}
                  >
                    En savoir plus
                    <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional service - Veterinary accompaniment */}
        <div className="mt-8 max-w-md mx-auto">
          <Card className="shadow-card bg-gradient-card border-0">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Accompagnement vétérinaire</h3>
                <p className="text-sm text-muted-foreground">Transport et accompagnement chez le vétérinaire</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">min.</span>
                <p className="text-xl font-bold text-primary">13€</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Button 
            variant="default" 
            size="lg"
            onClick={() => navigate('/tarifs')}
          >
            Voir tous les tarifs
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

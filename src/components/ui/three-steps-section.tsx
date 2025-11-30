import { Card, CardContent } from "@/components/ui/card";
import { MapPin, CalendarCheck, Camera } from "lucide-react";

export const ThreeStepsSection = () => {
  const steps = [
    {
      number: "1",
      icon: MapPin,
      title: "Choisir sur la carte",
      description: "Trouvez un promeneur vérifié près de chez vous selon vos critères et disponibilités."
    },
    {
      number: "2",
      icon: CalendarCheck,
      title: "Réserver via le formulaire",
      description: "Sélectionnez le service, la date et les options. Paiement sécurisé avec système escrow."
    },
    {
      number: "3",
      icon: Camera,
      title: "Recevoir les preuves",
      description: "Photos/vidéos + message obligatoires pendant la prestation. Paiement débloqué après validation."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-sage-light/10">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comment ça{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              fonctionne
            </span>
            ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple et sécurisé en 3 étapes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index} 
                className="relative shadow-card hover:shadow-lg transition-all duration-500 bg-gradient-card border-0 group hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step number badge */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-button z-10 group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                
                {/* Connector line (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-sage/50 to-ocean/50" />
                )}
                
                <CardContent className="pt-10 pb-8 px-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage-light/50 mb-4 group-hover:bg-sage-light transition-colors duration-300">
                    <Icon className="h-7 w-7 text-sage" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

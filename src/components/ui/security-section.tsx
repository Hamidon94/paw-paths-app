import { Card, CardContent } from "@/components/ui/card";
import { Shield, Camera, Lock, HeadphonesIcon, FileCheck, UserCheck } from "lucide-react";

export const SecuritySection = () => {
  const securities = [
    {
      icon: UserCheck,
      title: "Identité vérifiée",
      description: "CNI et casier judiciaire vérifiés pour tous les promeneurs"
    },
    {
      icon: Camera,
      title: "Preuves obligatoires",
      description: "Photo/vidéo + message requis pendant chaque prestation"
    },
    {
      icon: Lock,
      title: "Paiement escrow",
      description: "Argent bloqué jusqu'à validation de la preuve"
    },
    {
      icon: HeadphonesIcon,
      title: "Support & modération",
      description: "Équipe réactive 7j/7 pour gérer tout litige"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-sage-light/10 to-ocean-light/10">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sécurité &{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Garanties
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Votre tranquillité d'esprit est notre priorité absolue
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {securities.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-gradient-card group hover:-translate-y-1"
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCheck className="h-5 w-5 text-sage" />
            <span className="text-sm">Assurance RC incluse</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="h-5 w-5 text-ocean" />
            <span className="text-sm">Données chiffrées</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-5 w-5 text-sage" />
            <span className="text-sm">Conforme RGPD</span>
          </div>
        </div>
      </div>
    </section>
  );
};

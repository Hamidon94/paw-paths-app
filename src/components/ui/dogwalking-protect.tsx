import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, Lock, FileCheck } from "lucide-react";

export const DogWalkingProtect = () => {
  const protections = [
    {
      icon: Shield,
      title: "Assurance complète",
      description: "Tous nos promeneurs sont assurés en responsabilité civile professionnelle"
    },
    {
      icon: Lock,
      title: "Paiement sécurisé",
      description: "Transactions 100% sécurisées avec garantie de remboursement"
    },
    {
      icon: FileCheck,
      title: "Vérification stricte",
      description: "Carte d'identité et casier judiciaire B2 vierge obligatoires"
    },
    {
      icon: CheckCircle,
      title: "Satisfaction garantie",
      description: "98% de clients satisfaits ou remboursé"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-sage-light/20 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              DogWalking Protect
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Votre tranquillité d'esprit est notre priorité absolue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {protections.map((protection, index) => {
            const Icon = protection.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-gradient-card">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{protection.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {protection.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Toutes les prestations sont couvertes par notre garantie
              </p>
              <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DogWalking Protect
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const FeaturesSection = () => {
  const features = [
    {
      title: "Promeneurs certifiés",
      description: "Vérification d'identité, casier judiciaire et assurance responsabilité civile pour tous nos promeneurs.",
      icon: "🛡️"
    },
    {
      title: "Suivi géolocalisé", 
      description: "Recevez photos et localisation en temps réel pendant la promenade pour votre tranquillité.",
      icon: "📍"
    },
    {
      title: "Réservation instantanée",
      description: "Trouvez et réservez un promeneur disponible en quelques clics selon votre zone.",
      icon: "📱"
    },
    {
      title: "Paiement 100% sécurisé",
      description: "Transactions protégées, pas de paiement en espèces, remboursement garanti.",
      icon: "💳"
    },
    {
      title: "Avis clients vérifiés",
      description: "Consultez les vrais avis et notes des propriétaires pour choisir en confiance.",
      icon: "⭐"
    },
    {
      title: "Service 7j/7",
      description: "Disponibilité tous les jours de la semaine, même le weekend et jours fériés.",
      icon: "🗓️"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pourquoi choisir{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              DogWalking
            </span>
            ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une solution complète et sécurisée pour le bien-être de votre chien
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 bg-gradient-card border-0">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
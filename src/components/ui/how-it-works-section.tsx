import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const HowItWorksSection = () => {
  const stepsOwner = [
    {
      number: "1",
      title: "Créez votre compte",
      description: "Inscrivez-vous en quelques clics et ajoutez les informations de votre chien.",
      icon: "📝"
    },
    {
      number: "2",
      title: "Trouvez votre promeneur",
      description: "Recherchez parmi nos promeneurs certifiés près de chez vous.",
      icon: "🔍"
    },
    {
      number: "3",
      title: "Réservez en ligne",
      description: "Choisissez le créneau qui vous convient et validez votre réservation.",
      icon: "📅"
    },
    {
      number: "4",
      title: "Suivez la promenade",
      description: "Recevez photos et localisation en temps réel pendant la promenade.",
      icon: "📱"
    }
  ];

  const stepsWalker = [
    {
      number: "1",
      title: "Inscription",
      description: "Créez votre profil et complétez les documents requis (identité, casier judiciaire).",
      icon: "📋"
    },
    {
      number: "2",
      title: "Vérification",
      description: "Notre équipe vérifie vos documents et valide votre profil sous 48h.",
      icon: "✅"
    },
    {
      number: "3",
      title: "Disponibilités",
      description: "Définissez vos créneaux de disponibilité et votre zone d'intervention.",
      icon: "🗓️"
    },
    {
      number: "4",
      title: "Commencez à gagner",
      description: "Acceptez les missions et profitez de 80% du montant des promenades.",
      icon: "💰"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-sage-light/10">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Comment ça{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              fonctionne
            </span>
            ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple et sécurisé pour tous
          </p>
        </div>

        {/* For Owners */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-sage">Pour les propriétaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsOwner.map((step, index) => (
              <Card key={index} className="relative shadow-card hover:shadow-lg transition-all duration-300 bg-gradient-card border-0">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-button">
                  {step.number}
                </div>
                <CardHeader className="pt-8 text-center">
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* For Walkers */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-ocean">Pour les promeneurs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsWalker.map((step, index) => (
              <Card key={index} className="relative shadow-card hover:shadow-lg transition-all duration-300 bg-gradient-card border-0">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-ocean to-ocean/80 flex items-center justify-center text-white font-bold text-xl shadow-button">
                  {step.number}
                </div>
                <CardHeader className="pt-8 text-center">
                  <div className="text-4xl mb-2">{step.icon}</div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
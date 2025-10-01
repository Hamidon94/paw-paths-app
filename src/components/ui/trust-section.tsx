import { Card, CardContent } from "@/components/ui/card";

export const TrustSection = () => {
  const stats = [
    {
      number: "5000+",
      label: "Promenades réalisées",
      icon: "🐾"
    },
    {
      number: "98%",
      label: "Clients satisfaits",
      icon: "⭐"
    },
    {
      number: "500+",
      label: "Promeneurs certifiés",
      icon: "🛡️"
    },
    {
      number: "24/7",
      label: "Support disponible",
      icon: "💬"
    }
  ];

  const guarantees = [
    {
      title: "100% sécurisé",
      description: "Tous nos promeneurs sont vérifiés et assurés",
      icon: "🔒"
    },
    {
      title: "Paiement protégé",
      description: "Transactions sécurisées et remboursement garanti",
      icon: "💳"
    },
    {
      title: "Suivi en temps réel",
      description: "Géolocalisation et photos pendant la promenade",
      icon: "📍"
    },
    {
      title: "Service client réactif",
      description: "Une équipe à votre écoute 7j/7",
      icon: "🎧"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-ocean-light/10 to-background">
      <div className="container mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-card border-0 bg-gradient-card">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guarantees */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nos{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              garanties
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Votre tranquillité d'esprit est notre priorité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((guarantee, index) => (
            <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="text-5xl mb-4">{guarantee.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{guarantee.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {guarantee.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
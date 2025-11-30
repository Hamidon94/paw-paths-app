import { Card, CardContent } from "@/components/ui/card";

export const TrustSection = () => {
  const stats = [
    {
      number: "5000+",
      label: "Prestations réalisées",
      icon: "🐾"
    },
    {
      number: "98%",
      label: "Clients satisfaits",
      icon: "⭐"
    },
    {
      number: "500+",
      label: "Promeneurs vérifiés",
      icon: "🛡️"
    },
    {
      number: "7j/7",
      label: "Support disponible",
      icon: "💬"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-ocean-light/10 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            La confiance en{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              chiffres
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
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
      </div>
    </section>
  );
};

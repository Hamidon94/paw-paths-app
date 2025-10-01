import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const Tarifs = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Promenade 30 minutes",
      price: "7€",
      description: "Promenade courte idéale pour les pauses quotidiennes",
      features: [
        "Promenade de 30 minutes",
        "Dans votre quartier",
        "Photos envoyées",
        "Rapport de promenade"
      ]
    },
    {
      title: "Promenade 60 minutes",
      price: "13€",
      description: "Promenade complète pour l'exercice quotidien",
      features: [
        "Promenade d'1 heure",
        "Parcours varié",
        "Photos et vidéos",
        "Rapport détaillé",
        "Jeux et socialisation"
      ],
      popular: true
    },
    {
      title: "Visite à domicile",
      price: "19€",
      description: "Visite simple de 30 minutes à votre domicile",
      features: [
        "Nourriture et eau",
        "Sortie rapide",
        "Compagnie",
        "Surveillance"
      ]
    },
    {
      title: "Visite avec soins",
      price: "35€",
      description: "Visite complète avec soins et entretien",
      features: [
        "Tout ce qui précède",
        "Administration médicaments",
        "Soins d'hygiène",
        "Entretien sanitaire"
      ]
    },
    {
      title: "Garde à domicile (24h)",
      price: "31€",
      description: "Garde de nuit chez vous",
      features: [
        "Présence sur 24h",
        "Promenades incluses",
        "Soins complets",
        "Sécurité maximale"
      ]
    },
    {
      title: "Pension canine (24h)",
      price: "26€",
      description: "Garde chez le promeneur",
      features: [
        "Garde 24h",
        "Promenades multiples",
        "Environnement familial",
        "Photos quotidiennes"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-4xl font-bold mb-4">Nos Tarifs</h1>
            <p className="text-xl text-muted-foreground">
              Des prix compétitifs pour des services de qualité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <Card key={index} className={service.popular ? "border-primary shadow-lg" : ""}>
                {service.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Plus populaire
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <div className="text-3xl font-bold text-primary mt-2">{service.price}</div>
                  <p className="text-muted-foreground mt-2">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Services vétérinaires</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Consultation / soins vétérinaires</h3>
                  <p className="text-2xl font-bold text-primary">35€</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Consultation vétérinaire de base ou soins simples
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Accompagnement vétérinaire</h3>
                  <p className="text-2xl font-bold text-primary">35€</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Accompagnement de votre chien chez le vétérinaire
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à réserver ?</h2>
            <p className="text-muted-foreground mb-6">
              Trouvez le promeneur parfait pour votre compagnon
            </p>
            <Button size="lg" onClick={() => navigate('/auth?type=owner')}>
              Réserver une promenade
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tarifs;
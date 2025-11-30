import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Info } from 'lucide-react';
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const Tarifs = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Promenade",
      minPrice: "8€",
      unit: "durée libre",
      description: "Balades adaptées aux besoins de votre chien",
      features: [
        "Durée selon vos besoins",
        "Dans votre quartier ou parc",
        "Photos/vidéos envoyées",
        "Rapport après prestation"
      ]
    },
    {
      title: "Visite à domicile",
      minPrice: "8€",
      unit: "par visite",
      description: "Passage à domicile pour s'occuper de votre chien",
      features: [
        "Nourriture et eau",
        "Sortie rapide hygiénique",
        "Compagnie et câlins",
        "Surveillance de la maison"
      ]
    },
    {
      title: "Hébergement nuit",
      minPrice: "10€",
      unit: "par nuit",
      description: "Garde de nuit chez le promeneur",
      features: [
        "Environnement familial",
        "Promenades incluses",
        "Surveillance 24h",
        "Photos quotidiennes"
      ],
      popular: true
    },
    {
      title: "Hébergement jour",
      minPrice: "10€",
      unit: "par jour",
      description: "Accueil en journée chez le promeneur",
      features: [
        "Garde journalière",
        "Promenades multiples",
        "Jeux et socialisation",
        "Repas inclus si prévu"
      ]
    },
    {
      title: "Garde à domicile",
      minPrice: "12€",
      unit: "par nuit",
      description: "Le promeneur vient chez vous",
      features: [
        "Présence 24h à votre domicile",
        "Promenades incluses",
        "Soins complets",
        "Surveillance maison"
      ]
    },
    {
      title: "Visite sanitaire",
      minPrice: "16€",
      unit: "par visite",
      description: "Soins d'hygiène et entretien",
      features: [
        "Administration médicaments",
        "Soins d'hygiène",
        "Entretien sanitaire",
        "Produits du propriétaire utilisés"
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
              Les promeneurs fixent leurs tarifs en respectant ces minimums
            </p>
          </div>

          {/* Info banner */}
          <div className="bg-sage-light/30 border border-sage/20 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Info className="h-5 w-5 text-sage flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sage">Commission de 13%</p>
              <p className="text-sm text-muted-foreground">
                Les promeneurs reçoivent 87% du montant de chaque prestation. 
                Les tarifs affichés sont les minimums obligatoires, chaque promeneur peut définir ses propres prix au-dessus de ces minimums.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <Card key={index} className={`relative ${service.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : "shadow-card"}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Plus populaire
                    </span>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-xs text-muted-foreground">min.</span>
                    <span className="text-3xl font-bold text-primary">{service.minPrice}</span>
                    <span className="text-sm text-muted-foreground">/ {service.unit}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional services */}
          <Card className="bg-muted/50 mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Services complémentaires</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-background rounded-lg p-6 shadow-soft">
                  <h3 className="font-semibold text-lg mb-2">Accompagnement vétérinaire</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xs text-muted-foreground">min.</span>
                    <span className="text-2xl font-bold text-primary">13€</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Transport et accompagnement de votre chien chez le vétérinaire
                  </p>
                </div>
                <div className="bg-background rounded-lg p-6 shadow-soft">
                  <h3 className="font-semibold text-lg mb-2">Pourboire promeneur</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-ocean">Libre</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Possibilité de laisser un pourboire au promeneur après une prestation réussie
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Escrow explanation */}
          <Card className="border-ocean/20 bg-ocean-light/10 mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Paiement sécurisé (Escrow)</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-ocean/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-ocean">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Paiement bloqué</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre paiement est sécurisé lors de la réservation
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-ocean/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-ocean">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Preuve envoyée</h3>
                  <p className="text-sm text-muted-foreground">
                    Le promeneur envoie photos/vidéos pendant la prestation
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-ocean/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-ocean">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Paiement débloqué</h3>
                  <p className="text-sm text-muted-foreground">
                    Après validation, le promeneur reçoit son paiement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à réserver ?</h2>
            <p className="text-muted-foreground mb-6">
              Trouvez le promeneur parfait pour votre compagnon
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/walkers')}>
                Trouver un promeneur
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/walker/register')}>
                Devenir promeneur
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tarifs;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const UserTypesSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-sage-light/20 to-ocean-light/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Rejoignez notre{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              communauté
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Que vous soyez propriétaire d'un chien ou passionné d'animaux, nous avons la solution pour vous
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Propriétaires */}
          <Card className="shadow-card hover:shadow-lg transition-all duration-300 bg-gradient-card border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-sage/10 to-sage/5 pb-8">
              <div className="text-6xl mb-4 text-center">🐕</div>
              <CardTitle className="text-3xl text-center mb-2">Propriétaires</CardTitle>
              <CardDescription className="text-center text-lg">
                Votre chien a besoin d'exercice et vous manquez de temps ?
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sage rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Trouvez des promeneurs près de chez vous</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sage rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Réservez en fonction de vos disponibilités</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sage rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Suivez la promenade en temps réel</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sage rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Tarif à partir de 15€ les 30 minutes</p>
                </div>
              </div>
              <Button variant="sage" size="lg" className="w-full" onClick={() => window.location.href = '/auth?type=owner'}>
                Trouver un promeneur
              </Button>
            </CardContent>
          </Card>

          {/* Promeneurs */}
          <Card className="shadow-card hover:shadow-lg transition-all duration-300 bg-gradient-card border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-ocean/10 to-ocean/5 pb-8">
              <div className="text-6xl mb-4 text-center">🚶</div>
              <CardTitle className="text-3xl text-center mb-2">Promeneurs</CardTitle>
              <CardDescription className="text-center text-lg">
                Vous aimez les chiens et souhaitez gagner de l'argent ?
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-ocean rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Gérez vos disponibilités facilement</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-ocean rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Acceptez les missions qui vous conviennent</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-ocean rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Gagnez jusqu'à 80% du tarif de base</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-ocean rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Paiements sécurisés et réguliers</p>
                </div>
              </div>
              <Button variant="ocean" size="lg" className="w-full" onClick={() => window.location.href = '/walker/register'}>
                Devenir promeneur
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
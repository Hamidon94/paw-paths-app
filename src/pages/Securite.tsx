import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, UserCheck, FileCheck, AlertCircle } from 'lucide-react';
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const Securite = () => {
  const navigate = useNavigate();

  const securityMeasures = [
    {
      icon: <UserCheck className="h-12 w-12 text-primary" />,
      title: "Vérification d'identité",
      description: "Tous nos promeneurs doivent fournir une pièce d'identité valide. Nous vérifions l'authenticité de chaque document avant validation du profil."
    },
    {
      icon: <FileCheck className="h-12 w-12 text-primary" />,
      title: "Casier judiciaire vérifié",
      description: "Chaque promeneur doit fournir un extrait de casier judiciaire vierge. La sécurité de vos compagnons est notre priorité absolue."
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Assurance professionnelle",
      description: "Tous nos promeneurs sont couverts par une assurance responsabilité civile professionnelle. Vos animaux sont protégés en toutes circonstances."
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "Formation et certification",
      description: "Nos promeneurs suivent une formation sur le comportement canin, les premiers secours et les bonnes pratiques de promenade."
    }
  ];

  const guarantees = [
    "Vérification complète de tous les promeneurs",
    "Système de notation et d'avis clients",
    "Support client disponible 7j/7",
    "Suivi en temps réel des promenades",
    "Photos et rapports après chaque balade",
    "Paiement sécurisé et protection des données"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
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
            <h1 className="text-4xl font-bold mb-4">Sécurité et Confiance</h1>
            <p className="text-xl text-muted-foreground">
              Votre tranquillité d'esprit est notre priorité
            </p>
          </div>

          <div className="mb-12">
            <Card className="bg-primary/5 border-primary">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Notre engagement sécurité</h3>
                    <p className="text-muted-foreground">
                      Chez DogWalking, nous comprenons que confier votre animal à quelqu'un d'autre est une décision importante. 
                      C'est pourquoi nous mettons en place un processus de vérification rigoureux pour tous nos promeneurs professionnels.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {securityMeasures.map((measure, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-4">{measure.icon}</div>
                  <CardTitle>{measure.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{measure.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Nos garanties</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {guarantees.map((guarantee, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>{guarantee}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Le processus de validation des promeneurs</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold">Inscription et profil</h4>
                    <p className="text-sm text-muted-foreground">Le promeneur crée son profil et fournit ses informations personnelles</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold">Vérification d'identité</h4>
                    <p className="text-sm text-muted-foreground">Upload et validation de la pièce d'identité officielle</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold">Casier judiciaire</h4>
                    <p className="text-sm text-muted-foreground">Vérification de l'extrait de casier judiciaire (bulletin n°3)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</span>
                  <div>
                    <h4 className="font-semibold">Assurance et certifications</h4>
                    <p className="text-sm text-muted-foreground">Validation de l'assurance RC Pro et des éventuelles certifications</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">5</span>
                  <div>
                    <h4 className="font-semibold">Validation finale</h4>
                    <p className="text-sm text-muted-foreground">Notre équipe valide l'ensemble du dossier avant activation du profil</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à faire confiance ?</h2>
            <p className="text-muted-foreground mb-6">
              Rejoignez des milliers de propriétaires qui nous font confiance
            </p>
            <Button size="lg" onClick={() => navigate('/auth?type=owner')}>
              Trouver un promeneur
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Securite;
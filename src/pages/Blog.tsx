import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const navigate = useNavigate();

  const articles = [
    {
      title: "10 conseils pour la première promenade de votre chien",
      excerpt: "Découvrez comment bien préparer et réussir la première sortie de votre nouveau compagnon à quatre pattes.",
      category: "Conseils",
      date: "15 Mars 2024",
      author: "Marie Dupont",
      image: "/placeholder.svg",
      slug: "premiere-promenade-chien"
    },
    {
      title: "Comment choisir le bon promeneur pour votre chien",
      excerpt: "Les critères essentiels à considérer pour trouver le promeneur idéal adapté aux besoins de votre animal.",
      category: "Guide",
      date: "10 Mars 2024",
      author: "Thomas Martin",
      image: "/placeholder.svg",
      slug: "choisir-promeneur"
    },
    {
      title: "Les bienfaits de la promenade quotidienne",
      excerpt: "Pourquoi une promenade régulière est essentielle pour la santé physique et mentale de votre chien.",
      category: "Santé",
      date: "5 Mars 2024",
      author: "Sophie Bernard",
      image: "/placeholder.svg",
      slug: "bienfaits-promenade"
    },
    {
      title: "Sécurité : que vérifier avant de confier votre chien",
      excerpt: "Les points de contrôle indispensables pour garantir la sécurité de votre animal lors des promenades.",
      category: "Sécurité",
      date: "1 Mars 2024",
      author: "Julie Laurent",
      image: "/placeholder.svg",
      slug: "securite-chien"
    },
    {
      title: "Devenir promeneur professionnel : le guide complet",
      excerpt: "Tout ce que vous devez savoir pour débuter votre carrière de promeneur de chiens certifié.",
      category: "Carrière",
      date: "25 Février 2024",
      author: "Pierre Durand",
      image: "/placeholder.svg",
      slug: "devenir-promeneur"
    },
    {
      title: "Les races de chiens et leurs besoins en exercice",
      excerpt: "Comprendre les besoins spécifiques de chaque race pour adapter les promenades et activités.",
      category: "Éducation",
      date: "20 Février 2024",
      author: "Claire Morel",
      image: "/placeholder.svg",
      slug: "races-besoins-exercice"
    }
  ];

  const categories = ["Tous", "Conseils", "Guide", "Santé", "Sécurité", "Carrière", "Éducation"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 mt-16">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                DogWalking
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Conseils, guides et actualités pour les propriétaires et promeneurs de chiens
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Tous" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Article */}
          <Card className="mb-8 overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 border-0">
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-auto bg-gradient-primary"></div>
              <CardHeader className="p-8">
                <Badge className="w-fit mb-4">{articles[0].category}</Badge>
                <CardTitle className="text-3xl mb-4">{articles[0].title}</CardTitle>
                <CardDescription className="text-base mb-6">
                  {articles[0].excerpt}
                </CardDescription>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {articles[0].date}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {articles[0].author}
                  </div>
                </div>
                <Button>
                  Lire l'article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardHeader>
            </div>
          </Card>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((article, index) => (
              <Card key={index} className="overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-gradient-card">
                <div className="h-48 bg-gradient-primary"></div>
                <CardHeader>
                  <Badge className="w-fit mb-2">{article.category}</Badge>
                  <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                  <CardDescription className="mb-4">
                    {article.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {article.author}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Lire la suite
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter */}
          <Card className="mt-12 bg-gradient-card shadow-card border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Restez informé</h2>
              <p className="text-muted-foreground mb-6">
                Inscrivez-vous à notre newsletter pour recevoir nos derniers articles et conseils
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre email..."
                  className="flex-1 px-4 py-2 border rounded-md"
                />
                <Button>S'inscrire</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marie Dupont",
      location: "Paris 15ème",
      rating: 5,
      text: "Excellent service ! Mon chien Rex adore ses promenades avec Julie. Je reçois des photos à chaque fois et le système de preuves me rassure énormément.",
      avatar: "/placeholder.svg"
    },
    {
      name: "Thomas Martin",
      location: "Lyon 6ème",
      rating: 5,
      text: "Très professionnel et ponctuel. Le paiement escrow est vraiment rassurant. Mon border collie a enfin trouvé son promeneur idéal !",
      avatar: "/placeholder.svg"
    },
    {
      name: "Sophie Bernard",
      location: "Marseille 8ème",
      rating: 5,
      text: "Je recommande à 100% ! Le système de vérification des promeneurs et les preuves obligatoires font toute la différence. Parfait pour les propriétaires qui travaillent.",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-ocean-light/10">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              clients
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Rejoignez des milliers de propriétaires satisfaits
          </p>
          
          {/* Rating badge */}
          <div className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gradient-card rounded-full shadow-soft">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="font-semibold">4.8/5</span>
            <span className="text-muted-foreground text-sm">basé sur +500 avis</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-gradient-card relative">
              <CardContent className="pt-8 pb-6">
                <Quote className="h-10 w-10 text-primary/20 absolute top-4 right-4" />
                
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{testimonial.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

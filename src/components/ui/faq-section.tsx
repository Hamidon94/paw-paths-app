import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ArrowRight } from "lucide-react";

export const FAQSection = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Comment fonctionne le système de paiement ?",
      answer: "Le paiement est sécurisé via notre système escrow. Votre argent est bloqué jusqu'à ce que le promeneur envoie une preuve (photo/vidéo + message) confirmant la réalisation de la prestation. Une fois validé, le paiement est débloqué. En cas de problème, notre support intervient rapidement."
    },
    {
      question: "Comment sont vérifiés les promeneurs ?",
      answer: "Chaque promeneur doit fournir sa carte d'identité, un extrait de casier judiciaire vierge (B2) et une attestation d'assurance responsabilité civile. Notre équipe vérifie manuellement tous les documents avant validation du profil."
    },
    {
      question: "Que se passe-t-il en cas de problème pendant la prestation ?",
      answer: "Toutes les preuves (photos, vidéos, messages) sont conservées et horodatées. En cas de litige, notre équipe support analyse les éléments et peut procéder à un remboursement si nécessaire. Le système de preuves obligatoires garantit la transparence."
    },
    {
      question: "Comment les tarifs sont-ils fixés ?",
      answer: "Chaque promeneur définit ses propres tarifs en respectant nos tarifs minimums (ex: 8€ minimum pour une promenade). Cela garantit une rémunération juste tout en laissant la flexibilité aux prestataires expérimentés."
    },
    {
      question: "Comment recevoir les preuves de la prestation ?",
      answer: "Pendant la prestation, le promeneur envoie obligatoirement des photos ou vidéos accompagnées d'un court message via notre messagerie intégrée. Ces preuves sont stockées et accessibles dans l'historique de votre réservation."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage-light/50 mb-4">
            <HelpCircle className="h-7 w-7 text-sage" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              fréquentes
            </span>
          </h2>
          <p className="text-muted-foreground">
            Tout ce que vous devez savoir pour commencer
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-6 bg-gradient-card shadow-soft"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-10">
          <Button 
            variant="outline"
            onClick={() => navigate('/faq')}
          >
            Voir toutes les questions
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

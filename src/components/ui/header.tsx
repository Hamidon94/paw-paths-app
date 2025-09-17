import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🐕</div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            DogWalking
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#comment-ca-marche" className="text-sm hover:text-primary transition-colors">
            Comment ça marche
          </a>
          <a href="#tarifs" className="text-sm hover:text-primary transition-colors">
            Tarifs
          </a>
          <a href="#promeneurs" className="text-sm hover:text-primary transition-colors">
            Nos promeneurs
          </a>
          <a href="#contact" className="text-sm hover:text-primary transition-colors">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/auth'}>
            Connexion
          </Button>
          <Button variant="hero" size="sm" onClick={() => window.location.href = '/auth?type=owner'}>
            S'inscrire
          </Button>
        </div>
      </div>
    </header>
  );
};
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
          <a href="/#comment-ca-marche" className="text-sm hover:text-primary transition-colors">
            Comment ça marche
          </a>
          <a href="/tarifs" className="text-sm hover:text-primary transition-colors">
            Tarifs
          </a>
          <a href="/blog" className="text-sm hover:text-primary transition-colors">
            Blog
          </a>
          <a href="/securite" className="text-sm hover:text-primary transition-colors">
            Sécurité
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && <NotificationBell />}
          <Button variant="ghost" size="sm" onClick={() => window.location.href = isAuthenticated ? '/dashboard' : '/auth'}>
            {isAuthenticated ? 'Dashboard' : 'Connexion'}
          </Button>
          {!isAuthenticated && (
            <Button variant="hero" size="sm" onClick={() => window.location.href = '/auth?type=owner'}>
              S'inscrire
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
export const Footer = () => {
  return (
    <footer className="bg-earthy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🐕</div>
              <span className="text-xl font-bold">DogWalking</span>
            </div>
            <p className="text-white/80 mb-4 text-sm">
              La plateforme de confiance pour les services de garde et promenade de chiens. 
              Paiement sécurisé, preuves obligatoires.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="/services/promenade" className="hover:text-white transition-colors">Promenade</a></li>
              <li><a href="/services/visite" className="hover:text-white transition-colors">Visite à domicile</a></li>
              <li><a href="/services/hebergement" className="hover:text-white transition-colors">Hébergement</a></li>
              <li><a href="/services/garde" className="hover:text-white transition-colors">Garde à domicile</a></li>
              <li><a href="/tarifs" className="hover:text-white transition-colors">Tous les tarifs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Accès</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="/auth?type=owner" className="hover:text-white transition-colors">Inscription propriétaire</a></li>
              <li><a href="/walker/register" className="hover:text-white transition-colors">Devenir promeneur</a></li>
              <li><a href="/auth" className="hover:text-white transition-colors">Connexion</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog & Conseils</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Sécurité & Confiance</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="/securite" className="hover:text-white transition-colors">Notre engagement sécurité</a></li>
              <li><a href="/comment-ca-marche" className="hover:text-white transition-colors">Comment ça marche</a></li>
              <li><a href="/aide" className="hover:text-white transition-colors">Centre d'aide</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-white/60 mb-4 md:mb-0">
              © 2024 DogWalking. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-4 text-white/60 text-sm">
              <a href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</a>
              <span className="hidden md:inline">•</span>
              <a href="/cgu" className="hover:text-white transition-colors">CGU/CGV</a>
              <span className="hidden md:inline">•</span>
              <a href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</a>
              <span className="hidden md:inline">•</span>
              <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
              <span className="hidden md:inline">•</span>
              <a href="mailto:contact@dogwalking.fr" className="hover:text-white transition-colors">contact@dogwalking.fr</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

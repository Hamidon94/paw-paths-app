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
            <p className="text-white/80 mb-4">
              La plateforme de confiance pour les promenades de chiens en toute sécurité.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="/auth?type=owner" className="hover:text-white transition-colors">Réserver une promenade</a></li>
              <li><a href="/walker/register" className="hover:text-white transition-colors">Devenir promeneur</a></li>
              <li><a href="/auth" className="hover:text-white transition-colors">Connexion</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Nos Tarifs</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="/tarifs" className="hover:text-white transition-colors">Promenade 30min : 7€</a></li>
              <li><a href="/tarifs" className="hover:text-white transition-colors">Promenade 60min : 13€</a></li>
              <li><a href="/tarifs" className="hover:text-white transition-colors">Visite à domicile : dès 19€</a></li>
              <li><a href="/tarifs" className="hover:text-white transition-colors">Garde 24h : 31€</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Sécurité & Confiance</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="/securite" className="hover:text-white transition-colors">Promeneurs certifiés</a></li>
              <li><a href="/securite" className="hover:text-white transition-colors">Vérification identité</a></li>
              <li><a href="/securite" className="hover:text-white transition-colors">Casier judiciaire vérifié</a></li>
              <li><a href="/securite" className="hover:text-white transition-colors">Assurance incluse</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-white/60 mb-4 md:mb-0">
              © 2024 DogWalking. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-white/60">
              <span>Conditions d'utilisation</span>
              <span>Politique de confidentialité</span>
              <span>Contact: contact@dogwalking.fr</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
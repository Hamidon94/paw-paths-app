export const Footer = () => {
  return (
    <footer className="bg-earthy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🐕</div>
              <span className="text-xl font-bold">DogWalking</span>
            </div>
            <p className="text-white/80 mb-4">
              La plateforme de confiance pour les promenades de chiens.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="/auth?type=owner" className="hover:text-white transition-colors">Réserver une promenade</a></li>
              <li><a href="/auth" className="hover:text-white transition-colors">Connexion</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Informations</h3>
            <ul className="space-y-2 text-white/80">
              <li><span className="hover:text-white transition-colors">Tarifs dès 15€ / 30min</span></li>
              <li><span className="hover:text-white transition-colors">Promeneurs vérifiés</span></li>
              <li><span className="hover:text-white transition-colors">Paiement sécurisé</span></li>
              <li><span className="hover:text-white transition-colors">Service 7j/7</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/60 text-sm">
            © 2024 DogWalking. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
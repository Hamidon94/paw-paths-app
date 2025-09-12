export const Footer = () => {
  return (
    <footer className="bg-earthy text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🐕</div>
              <span className="text-xl font-bold">DogWalking</span>
            </div>
            <p className="text-white/80 mb-4">
              La plateforme de confiance pour les promenades de chiens.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm">
                f
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm">
                t
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm">
                in
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Pour les propriétaires</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Trouver un promeneur</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Pour les promeneurs</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Devenir promeneur</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rémunération</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Formation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nous contacter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Signaler un problème</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2024 DogWalking. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-white/60 text-sm mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
// Commission rate for the platform
export const PLATFORM_COMMISSION_RATE = 0.13; // 13%
export const WALKER_SHARE_RATE = 0.87; // 87%

// Minimum prices for services (in euros)
export const MIN_PRICES = {
  promenade: 8,
  visite_domicile: 8,
  hebergement_nuit: 10,
  hebergement_jour: 10,
  garde_domicile: 12,
  visite_sanitaire: 16,
  accompagnement_veterinaire: 13,
} as const;

// Service types
export const SERVICE_TYPES = [
  { id: 'promenade', label: 'Promenade', minPrice: 8, unit: 'durée libre' },
  { id: 'visite_domicile', label: 'Visite à domicile', minPrice: 8, unit: 'par visite' },
  { id: 'hebergement_nuit', label: 'Hébergement nuit', minPrice: 10, unit: 'par nuit' },
  { id: 'hebergement_jour', label: 'Hébergement jour', minPrice: 10, unit: 'par jour' },
  { id: 'garde_domicile', label: 'Garde à domicile', minPrice: 12, unit: 'par nuit' },
  { id: 'visite_sanitaire', label: 'Visite sanitaire', minPrice: 16, unit: 'par visite' },
  { id: 'accompagnement_veterinaire', label: 'Accomp. vétérinaire', minPrice: 13, unit: 'par prestation' },
] as const;

// Calculate walker amount from total price
export const calculateWalkerAmount = (totalPrice: number): number => {
  return totalPrice * WALKER_SHARE_RATE;
};

// Calculate platform commission from total price
export const calculateCommission = (totalPrice: number): number => {
  return totalPrice * PLATFORM_COMMISSION_RATE;
};

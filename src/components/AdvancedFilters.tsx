import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterOptions {
  priceRange: number[];
  minRating: number;
  maxDistance: number;
  certifications: string[];
  languages: string[];
  availability: string;
  experience: number;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
}

export const AdvancedFilters = ({ onFiltersChange }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [10, 50],
    minRating: 0,
    maxDistance: 10,
    certifications: [],
    languages: [],
    availability: 'all',
    experience: 0
  });

  const certificationOptions = [
    'Premiers secours canins',
    'Éducation canine',
    'Comportementaliste',
    'Toilettage'
  ];

  const languageOptions = ['Français', 'Anglais', 'Espagnol', 'Allemand'];

  const handleCertificationToggle = (cert: string) => {
    const newCerts = filters.certifications.includes(cert)
      ? filters.certifications.filter(c => c !== cert)
      : [...filters.certifications, cert];
    
    const newFilters = { ...filters, certifications: newCerts };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleLanguageToggle = (lang: string) => {
    const newLangs = filters.languages.includes(lang)
      ? filters.languages.filter(l => l !== lang)
      : [...filters.languages, lang];
    
    const newFilters = { ...filters, languages: newLangs };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDistanceChange = (value: number[]) => {
    const newFilters = { ...filters, maxDistance: value[0] };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (value: number[]) => {
    const newFilters = { ...filters, minRating: value[0] };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [10, 50],
      minRating: 0,
      maxDistance: 10,
      certifications: [],
      languages: [],
      availability: 'all',
      experience: 0
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Filtres avancés</span>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Réinitialiser
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Prix horaire (€)</Label>
          <div className="pt-2">
            <Slider
              min={10}
              max={100}
              step={5}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{filters.priceRange[0]}€</span>
              <span>{filters.priceRange[1]}€</span>
            </div>
          </div>
        </div>

        <div>
          <Label>Note minimale</Label>
          <div className="pt-2">
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filters.minRating]}
              onValueChange={handleRatingChange}
            />
            <div className="text-sm text-muted-foreground mt-2">
              {filters.minRating > 0 ? `${filters.minRating}★ et plus` : 'Toutes les notes'}
            </div>
          </div>
        </div>

        <div>
          <Label>Distance maximale (km)</Label>
          <div className="pt-2">
            <Slider
              min={1}
              max={50}
              step={1}
              value={[filters.maxDistance]}
              onValueChange={handleDistanceChange}
            />
            <div className="text-sm text-muted-foreground mt-2">
              Dans un rayon de {filters.maxDistance} km
            </div>
          </div>
        </div>

        <div>
          <Label>Expérience minimale (années)</Label>
          <Input
            type="number"
            min="0"
            value={filters.experience}
            onChange={(e) => {
              const newFilters = { ...filters, experience: parseInt(e.target.value) || 0 };
              setFilters(newFilters);
              onFiltersChange(newFilters);
            }}
          />
        </div>

        <div>
          <Label>Certifications</Label>
          <div className="space-y-2 mt-2">
            {certificationOptions.map((cert) => (
              <div key={cert} className="flex items-center space-x-2">
                <Checkbox
                  id={`cert-${cert}`}
                  checked={filters.certifications.includes(cert)}
                  onCheckedChange={() => handleCertificationToggle(cert)}
                />
                <label htmlFor={`cert-${cert}`} className="text-sm cursor-pointer">
                  {cert}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Langues parlées</Label>
          <div className="space-y-2 mt-2">
            {languageOptions.map((lang) => (
              <div key={lang} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${lang}`}
                  checked={filters.languages.includes(lang)}
                  onCheckedChange={() => handleLanguageToggle(lang)}
                />
                <label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer">
                  {lang}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Disponibilité</Label>
          <Select
            value={filters.availability}
            onValueChange={(value) => {
              const newFilters = { ...filters, availability: value };
              setFilters(newFilters);
              onFiltersChange(newFilters);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="weekend">Week-end</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

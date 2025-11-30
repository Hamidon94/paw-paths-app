import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

export const SearchForm = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("");
  const [address, setAddress] = useState("");
  const [dogSize, setDogSize] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (serviceType) params.set('service', serviceType);
    if (address) params.set('location', address);
    if (dogSize) params.set('size', dogSize);
    navigate(`/walkers?${params.toString()}`);
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  };

  return (
    <Card className="shadow-card border-0 bg-white/95 backdrop-blur">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1">
            <label className="text-sm font-medium mb-2 block">Type de service</label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promenade">Promenade (min. 8€)</SelectItem>
                <SelectItem value="visite">Visite à domicile (min. 8€)</SelectItem>
                <SelectItem value="hebergement-nuit">Hébergement nuit (min. 10€)</SelectItem>
                <SelectItem value="hebergement-jour">Hébergement jour (min. 10€)</SelectItem>
                <SelectItem value="garde-domicile">Garde à domicile (min. 12€)</SelectItem>
                <SelectItem value="visite-sanitaire">Visite sanitaire (min. 16€)</SelectItem>
                <SelectItem value="veterinaire">Accomp. vétérinaire (min. 13€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2">
            <label className="text-sm font-medium mb-2 block">Adresse ou code postal</label>
            <div className="relative">
              <Input
                placeholder="Entrez votre adresse..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={handleGeolocation}
                title="Utiliser ma position"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="text-sm font-medium mb-2 block">Taille du chien</label>
            <Select value={dogSize} onValueChange={setDogSize}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petit">Petit (&lt;10kg)</SelectItem>
                <SelectItem value="moyen">Moyen (10-25kg)</SelectItem>
                <SelectItem value="grand">Grand (&gt;25kg)</SelectItem>
                <SelectItem value="tres-grand">Très grand (&gt;40kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-1 flex items-end">
            <Button onClick={handleSearch} className="w-full h-10">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

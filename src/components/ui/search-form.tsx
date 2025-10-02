import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Clock, Search } from "lucide-react";

export const SearchForm = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("");
  const [address, setAddress] = useState("");
  const [dogSize, setDogSize] = useState("");

  const handleSearch = () => {
    // Redirect to walkers page with search params
    navigate('/walkers');
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress(`${position.coords.latitude}, ${position.coords.longitude}`);
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
                <SelectItem value="promenade-30">Promenade 30 min</SelectItem>
                <SelectItem value="promenade-60">Promenade 60 min</SelectItem>
                <SelectItem value="visite-simple">Visite simple</SelectItem>
                <SelectItem value="visite-sanitaire">Visite sanitaire</SelectItem>
                <SelectItem value="garde-domicile">Garde à domicile</SelectItem>
                <SelectItem value="pension">Pension canine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-1">
            <label className="text-sm font-medium mb-2 block">Adresse</label>
            <div className="relative">
              <Input
                placeholder="Votre adresse..."
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
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-1">
            <label className="text-sm font-medium mb-2 block">Date & Heure</label>
            <Input type="datetime-local" />
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

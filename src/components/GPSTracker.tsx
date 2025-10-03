import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { useGPSTracking } from '@/hooks/useGPSTracking';
import { useToast } from '@/hooks/use-toast';

interface GPSTrackerProps {
  bookingId: string;
  isWalker: boolean;
}

export const GPSTracker = ({ bookingId, isWalker }: GPSTrackerProps) => {
  const { locations, currentLocation, isTracking, startTracking, stopTracking } = useGPSTracking(bookingId);
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    // Initialize map with the first location or current location
    const initialLocation = currentLocation || {
      lat: Number(locations[0]?.latitude) || 48.8566,
      lng: Number(locations[0]?.longitude) || 2.3522
    };

    // Create a simple map visualization
    // Note: In production, use a proper map library like Mapbox or Google Maps
    mapRef.current.innerHTML = `
      <div class="w-full h-full bg-muted rounded-lg flex items-center justify-center relative">
        <div class="absolute top-4 left-4 bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
          <p class="text-sm font-medium">
            ${locations.length} points enregistrés
          </p>
        </div>
        <div class="text-center">
          <MapPin class="w-16 h-16 mx-auto text-primary mb-2" />
          <p class="text-sm text-muted-foreground">
            Lat: ${initialLocation.lat.toFixed(6)}
          </p>
          <p class="text-sm text-muted-foreground">
            Lng: ${initialLocation.lng.toFixed(6)}
          </p>
        </div>
      </div>
    `;
  }, [locations, currentLocation]);

  const handleStartTracking = () => {
    startTracking();
    toast({
      title: "Suivi GPS activé",
      description: "Votre position est maintenant suivie en temps réel",
    });
  };

  const handleStopTracking = () => {
    stopTracking();
    toast({
      title: "Suivi GPS arrêté",
      description: "Le suivi de votre position a été arrêté",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Suivi GPS en temps réel
        </h3>
        {isWalker && (
          <Button
            onClick={isTracking ? handleStopTracking : handleStartTracking}
            variant={isTracking ? "destructive" : "default"}
            size="sm"
          >
            {isTracking ? "Arrêter le suivi" : "Démarrer le suivi"}
          </Button>
        )}
      </div>
      
      <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden">
        {/* Map will be rendered here */}
      </div>

      {currentLocation && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Position actuelle :</p>
          <p className="text-sm text-muted-foreground">
            Latitude: {currentLocation.lat.toFixed(6)}
          </p>
          <p className="text-sm text-muted-foreground">
            Longitude: {currentLocation.lng.toFixed(6)}
          </p>
        </div>
      )}

      {!isWalker && locations.length === 0 && (
        <div className="mt-4 p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            En attente du début de la promenade...
          </p>
        </div>
      )}
    </Card>
  );
};

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Euro, CheckCircle, Shield, Dog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Walker {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  hourly_rate: number;
  average_rating: number;
  total_reviews?: number;
  is_verified?: boolean;
  background_checked?: boolean;
  experience_years?: number;
  services?: string[];
}

interface WalkerProfileCardProps {
  walker: Walker;
  variant?: 'default' | 'compact' | 'detailed';
  onBook?: () => void;
  onMessage?: () => void;
}

export const WalkerProfileCard = ({ 
  walker, 
  variant = 'default',
  onBook,
  onMessage
}: WalkerProfileCardProps) => {
  const navigate = useNavigate();

  const handleBook = () => {
    if (onBook) {
      onBook();
    } else {
      navigate(`/book/${walker.user_id}`);
    }
  };

  const handleMessage = () => {
    if (onMessage) {
      onMessage();
    } else {
      navigate(`/messages?user=${walker.user_id}`);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={handleBook}>
        <Avatar className="h-12 w-12">
          <AvatarImage src={walker.avatar_url} alt={`${walker.first_name} ${walker.last_name}`} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {walker.first_name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{walker.first_name} {walker.last_name}</span>
            {walker.is_verified && (
              <CheckCircle className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span>{walker.average_rating.toFixed(1)}</span>
            <span>•</span>
            <span>{walker.hourly_rate}€/h</span>
          </div>
        </div>
        <Button size="sm">Réserver</Button>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={walker.avatar_url} alt={`${walker.first_name} ${walker.last_name}`} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {walker.first_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">{walker.first_name} {walker.last_name}</h3>
              {walker.is_verified && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Vérifié
                </Badge>
              )}
              {walker.background_checked && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Shield className="h-3 w-3" />
                  Casier vérifié
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(walker.average_rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-medium">
                {walker.average_rating.toFixed(1)}
              </span>
              {walker.total_reviews && (
                <span className="text-sm text-muted-foreground">
                  ({walker.total_reviews} avis)
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {walker.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{walker.bio}</p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Euro className="h-4 w-4" />
            <span className="font-medium text-foreground">{walker.hourly_rate}€/h</span>
          </div>
          {walker.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{walker.location}</span>
            </div>
          )}
          {walker.experience_years && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{walker.experience_years} ans d'exp.</span>
            </div>
          )}
          {walker.total_reviews && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Dog className="h-4 w-4" />
              <span>{walker.total_reviews}+ balades</span>
            </div>
          )}
        </div>

        {walker.services && walker.services.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {walker.services.slice(0, 3).map((service) => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
            {walker.services.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{walker.services.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button onClick={handleBook} className="flex-1">
          Réserver
        </Button>
        <Button variant="outline" onClick={handleMessage}>
          Message
        </Button>
      </CardFooter>
    </Card>
  );
};

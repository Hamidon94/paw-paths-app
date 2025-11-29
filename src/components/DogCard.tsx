import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dog, Calendar, Weight, Heart, AlertCircle, Edit, Trash2 } from 'lucide-react';

interface DogData {
  id: string;
  name: string;
  breed?: string;
  age?: number;
  weight?: number;
  size?: string;
  photo_url?: string;
  description?: string;
  medical_notes?: string;
  behavior_notes?: string;
  is_active?: boolean;
}

interface DogCardProps {
  dog: DogData;
  variant?: 'default' | 'compact' | 'selectable';
  selected?: boolean;
  onSelect?: (dog: DogData) => void;
  onEdit?: (dog: DogData) => void;
  onDelete?: (dog: DogData) => void;
}

export const DogCard = ({
  dog,
  variant = 'default',
  selected = false,
  onSelect,
  onEdit,
  onDelete
}: DogCardProps) => {
  const getSizeLabel = (size?: string) => {
    switch (size?.toLowerCase()) {
      case 'small':
      case 'petit':
        return 'Petit';
      case 'medium':
      case 'moyen':
        return 'Moyen';
      case 'large':
      case 'grand':
        return 'Grand';
      default:
        return size || 'Non spécifié';
    }
  };

  const getSizeColor = (size?: string) => {
    switch (size?.toLowerCase()) {
      case 'small':
      case 'petit':
        return 'bg-green-100 text-green-800';
      case 'medium':
      case 'moyen':
        return 'bg-blue-100 text-blue-800';
      case 'large':
      case 'grand':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (variant === 'selectable') {
    return (
      <div
        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
          selected 
            ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
            : 'hover:border-primary/50 hover:bg-accent/50'
        }`}
        onClick={() => onSelect?.(dog)}
      >
        <Avatar className="h-14 w-14">
          <AvatarImage src={dog.photo_url} alt={dog.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            <Dog className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-medium">{dog.name}</h4>
          <p className="text-sm text-muted-foreground">
            {dog.breed || 'Race non spécifiée'}
            {dog.age && ` • ${dog.age} ans`}
          </p>
        </div>
        <Badge className={getSizeColor(dog.size)}>
          {getSizeLabel(dog.size)}
        </Badge>
        {selected && (
          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <Avatar className="h-10 w-10">
          <AvatarImage src={dog.photo_url} alt={dog.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            <Dog className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{dog.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {dog.breed} • {getSizeLabel(dog.size)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 rounded-lg">
            <AvatarImage src={dog.photo_url} alt={dog.name} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary rounded-lg">
              <Dog className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xl">{dog.name}</h3>
              <Badge className={getSizeColor(dog.size)}>
                {getSizeLabel(dog.size)}
              </Badge>
            </div>
            <p className="text-muted-foreground">{dog.breed || 'Race non spécifiée'}</p>
            {dog.is_active === false && (
              <Badge variant="secondary" className="mt-2">Inactif</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {dog.age && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{dog.age} ans</span>
            </div>
          )}
          {dog.weight && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Weight className="h-4 w-4" />
              <span>{dog.weight} kg</span>
            </div>
          )}
        </div>

        {dog.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {dog.description}
          </p>
        )}

        {(dog.medical_notes || dog.behavior_notes) && (
          <div className="space-y-2">
            {dog.medical_notes && (
              <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg text-sm">
                <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Notes médicales</p>
                  <p className="text-red-600 line-clamp-2">{dog.medical_notes}</p>
                </div>
              </div>
            )}
            {dog.behavior_notes && (
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-700">Comportement</p>
                  <p className="text-yellow-600 line-clamp-2">{dog.behavior_notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {(onEdit || onDelete) && (
        <CardFooter className="gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(dog)} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={() => onDelete(dog)} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

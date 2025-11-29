import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    is_verified?: boolean;
    photo_urls?: string[];
    author?: {
      first_name: string;
      last_name: string;
      avatar_url?: string;
    };
    booking?: {
      dog_name?: string;
      duration?: number;
    };
  };
  compact?: boolean;
}

export const ReviewCard = ({ review, compact = false }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-4 border-b last:border-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.author?.avatar_url} />
          <AvatarFallback>
            {review.author?.first_name?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {review.author?.first_name} {review.author?.last_name?.[0]}.
            </span>
            {renderStars(review.rating)}
            {review.is_verified && (
              <CheckCircle className="h-4 w-4 text-primary" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {review.comment}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: fr })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={review.author?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {review.author?.first_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {review.author?.first_name} {review.author?.last_name}
                </span>
                {review.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(review.rating)}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: fr })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{review.comment}</p>
        
        {review.booking?.dog_name && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span>🐕 {review.booking.dog_name}</span>
            {review.booking.duration && (
              <span>• Promenade de {review.booking.duration}h</span>
            )}
          </div>
        )}

        {review.photo_urls && review.photo_urls.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {review.photo_urls.slice(0, 3).map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                  src={url} 
                  alt={`Photo ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: { rating: number; count: number }[];
}

export const ReviewSummary = ({ averageRating, totalReviews, ratingDistribution }: ReviewSummaryProps) => {
  const defaultDistribution = [
    { rating: 5, count: Math.round(totalReviews * 0.6) },
    { rating: 4, count: Math.round(totalReviews * 0.25) },
    { rating: 3, count: Math.round(totalReviews * 0.1) },
    { rating: 2, count: Math.round(totalReviews * 0.03) },
    { rating: 1, count: Math.round(totalReviews * 0.02) },
  ];

  const distribution = ratingDistribution || defaultDistribution;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalReviews} avis
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {distribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-2">
                <span className="text-sm w-3">{item.rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ 
                      width: totalReviews > 0 
                        ? `${(item.count / totalReviews) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

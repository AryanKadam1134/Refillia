import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GamificationService, { ActivityType } from '@/services/GamificationService';

interface ReviewSectionProps {
  stationId: string;
  userId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ stationId, userId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { toast } = useToast();

  const submitReview = async () => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          station_id: stationId,
          rating,
          content: review,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      await GamificationService.addPoints(
        userId,
        ActivityType.REVIEW_ADDED,
        "Added a station review"
      );

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });

      setReview('');
      setRating(0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[1,2,3,4,5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <Textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your experience..."
        rows={4}
      />
      <Button 
        onClick={submitReview}
        disabled={!rating || !review.trim()}
      >
        Submit Review
      </Button>
    </div>
  );
};
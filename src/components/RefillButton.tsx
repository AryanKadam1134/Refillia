import React from 'react';
import { Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GamificationService, { ActivityType } from '@/services/GamificationService';

interface RefillButtonProps {
  stationId: string;
  userId: string;
}

export const RefillButton: React.FC<RefillButtonProps> = ({ stationId, userId }) => {
  const { toast } = useToast();

  const logRefill = async () => {
    try {
      // Log the refill
      const { error } = await supabase
        .from('refills')
        .insert({
          user_id: userId,
          station_id: stationId,
          refilled_at: new Date().toISOString()
        });

      if (error) throw error;

      // Add points and update stats
      await GamificationService.addPoints(
        userId, 
        ActivityType.REFILL_LOGGED,
        "Logged a water bottle refill"
      );

      toast({
        title: "Refill Logged",
        description: "Thank you for using reusable bottles!",
      });
    } catch (error) {
      // ... error handling ...
    }
  };

  return (
    <Button 
      onClick={logRefill}
      variant="outline" 
      size="sm" 
      className="flex items-center"
    >
      <Droplet className="h-4 w-4 mr-1" />
      Log Refill
    </Button>
  );
};
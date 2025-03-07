
import { supabase } from "@/integrations/supabase/client";

// Activity types for the gamification system
export enum ActivityType {
  STATION_ADDED = "station_added",
  REVIEW_ADDED = "review_added",
  REFILL_LOGGED = "refill_logged",
  PROFILE_UPDATED = "profile_updated",
  ACHIEVEMENT_UNLOCKED = "achievement_unlocked",
}

// Point values for different actions
const POINTS = {
  [ActivityType.STATION_ADDED]: 50,
  [ActivityType.REVIEW_ADDED]: 15,
  [ActivityType.REFILL_LOGGED]: 5,
  [ActivityType.PROFILE_UPDATED]: 10,
  [ActivityType.ACHIEVEMENT_UNLOCKED]: 0, // Points come from the achievement itself
};

// Action descriptions
const ACTION_DESCRIPTIONS = {
  [ActivityType.STATION_ADDED]: "Added a new refill station",
  [ActivityType.REVIEW_ADDED]: "Wrote a review for a station",
  [ActivityType.REFILL_LOGGED]: "Logged a water bottle refill",
  [ActivityType.PROFILE_UPDATED]: "Updated your profile",
  [ActivityType.ACHIEVEMENT_UNLOCKED]: "Unlocked an achievement",
};

class GamificationService {
  /**
   * Add points for a user activity and check for unlocked achievements
   */
  async addPoints(userId: string, activityType: ActivityType, customDescription?: string) {
    if (!userId) return;
    
    try {
      const points = POINTS[activityType];
      const description = customDescription || ACTION_DESCRIPTIONS[activityType];
      
      // Call the Supabase function to update points
      await supabase.rpc('update_user_points', {
        user_id: userId,
        points_to_add: points,
        activity_type: activityType,
        description: description
      });
      
      // Update the specific count based on activity type
      if (activityType === ActivityType.STATION_ADDED) {
        await supabase
          .from('profiles')
          .update({ stations_added: supabase.rpc('increment', { x: 1 }) })
          .eq('id', userId);
      } else if (activityType === ActivityType.REVIEW_ADDED) {
        await supabase
          .from('profiles')
          .update({ reviews_added: supabase.rpc('increment', { x: 1 }) })
          .eq('id', userId);
      } else if (activityType === ActivityType.REFILL_LOGGED) {
        await supabase
          .from('profiles')
          .update({ refills_logged: supabase.rpc('increment', { x: 1 }) })
          .eq('id', userId);
      }
      
      // Check for new achievements
      await this.checkAchievements(userId);
      
      return { success: true };
    } catch (error) {
      console.error('Error adding points:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Check if user has unlocked any new achievements
   */
  async checkAchievements(userId: string) {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) throw profileError;
      
      // Get all achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*');
        
      if (achievementsError) throw achievementsError;
      
      // Get user's already unlocked achievements
      const { data: unlockedAchievements, error: unlockedError } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);
        
      if (unlockedError) throw unlockedError;
      
      const unlockedIds = unlockedAchievements.map((a) => a.achievement_id);
      
      // Check each achievement to see if it should be unlocked
      for (const achievement of achievements) {
        // Skip if already unlocked
        if (unlockedIds.includes(achievement.id)) continue;
        
        let shouldUnlock = false;
        
        // Check achievement type and required value
        switch (achievement.achievement_type) {
          case 'stations_added':
            shouldUnlock = profile.stations_added >= achievement.required_value;
            break;
          case 'reviews_added':
            shouldUnlock = profile.reviews_added >= achievement.required_value;
            break;
          case 'refills_logged':
            shouldUnlock = profile.refills_logged >= achievement.required_value;
            break;
          case 'total_points':
            shouldUnlock = profile.total_points >= achievement.required_value;
            break;
        }
        
        // If achievement should be unlocked, add it and award points
        if (shouldUnlock) {
          // Insert the achievement for the user
          const { error: insertError } = await supabase
            .from('user_achievements')
            .insert({ user_id: userId, achievement_id: achievement.id });
            
          if (insertError) throw insertError;
          
          // Award points for unlocking the achievement
          await supabase.rpc('update_user_points', {
            user_id: userId,
            points_to_add: achievement.points_reward,
            activity_type: ActivityType.ACHIEVEMENT_UNLOCKED,
            description: `Unlocked achievement: ${achievement.name}`
          });
          
          // Check if user should level up (every 1000 points)
          const newTotalPoints = profile.total_points + achievement.points_reward;
          const newLevel = Math.floor(newTotalPoints / 1000) + 1;
          
          if (newLevel > profile.level) {
            await supabase
              .from('profiles')
              .update({ level: newLevel })
              .eq('id', userId);
          }
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error checking achievements:', error);
      return { success: false, error };
    }
  }
}

export default new GamificationService();

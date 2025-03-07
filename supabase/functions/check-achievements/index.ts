
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create a Supabase client with the project URL and service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Get all achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*");

    if (achievementsError) {
      throw achievementsError;
    }

    // Get user's already unlocked achievements
    const { data: unlockedAchievements, error: unlockedError } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user_id);

    if (unlockedError) {
      throw unlockedError;
    }

    const unlockedIds = unlockedAchievements.map((a) => a.achievement_id);
    const newlyUnlocked = [];

    // Check each achievement to see if it should be unlocked
    for (const achievement of achievements) {
      // Skip if already unlocked
      if (unlockedIds.includes(achievement.id)) continue;

      let shouldUnlock = false;

      // Check achievement type and required value
      switch (achievement.achievement_type) {
        case "stations_added":
          shouldUnlock = profile.stations_added >= achievement.required_value;
          break;
        case "reviews_added":
          shouldUnlock = profile.reviews_added >= achievement.required_value;
          break;
        case "refills_logged":
          shouldUnlock = profile.refills_logged >= achievement.required_value;
          break;
        case "total_points":
          shouldUnlock = profile.total_points >= achievement.required_value;
          break;
      }

      // If achievement should be unlocked, add it and award points
      if (shouldUnlock) {
        // Insert the achievement for the user
        const { error: insertError } = await supabase
          .from("user_achievements")
          .insert({ user_id, achievement_id: achievement.id });

        if (insertError) {
          throw insertError;
        }

        // Award points for unlocking the achievement
        await supabase.rpc("update_user_points", {
          user_id,
          points_to_add: achievement.points_reward,
          activity_type: "achievement_unlocked",
          description: `Unlocked achievement: ${achievement.name}`,
        });

        newlyUnlocked.push(achievement);
      }
    }

    // Check if user should level up (every 1000 points)
    const newTotalPoints = profile.total_points + 
      newlyUnlocked.reduce((total, a) => total + a.points_reward, 0);
    const newLevel = Math.floor(newTotalPoints / 1000) + 1;

    if (newLevel > profile.level) {
      await supabase
        .from("profiles")
        .update({ level: newLevel })
        .eq("id", user_id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        newAchievements: newlyUnlocked,
        levelUp: newLevel > profile.level ? { oldLevel: profile.level, newLevel } : null 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

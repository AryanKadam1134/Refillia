
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, BadgeCheck, Droplet, Edit, LogOut, MapPin, Star, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  id: string;
  name: string;
  description: string;
  achievement_type: string;
  required_value: number;
  points_reward: number;
  icon_name: string;
  unlocked?: boolean;
  unlocked_at?: string;
}

const ProfilePage: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const { toast } = useToast();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || '');
      fetchUserAchievements();
      fetchRecentActivities();
    }
  }, [userProfile]);

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      // Get all achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('required_value');

      if (achievementsError) throw achievementsError;

      // Get user's unlocked achievements
      const { data: userUnlocked, error: unlockedError } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id);

      if (unlockedError) throw unlockedError;

      // Mark achievements as unlocked if the user has them
      const enhancedAchievements = achievements.map((achievement: Achievement) => {
        const unlocked = userUnlocked.find(ua => ua.achievement_id === achievement.id);
        return {
          ...achievement,
          unlocked: !!unlocked,
          unlocked_at: unlocked?.unlocked_at
        };
      });

      setUserAchievements(enhancedAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchRecentActivities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getNextLevelPoints = (level: number) => {
    return level * 1000;
  };

  const getProgressToNextLevel = (points: number, level: number) => {
    const nextLevelPoints = getNextLevelPoints(level);
    const prevLevelPoints = getNextLevelPoints(level - 1);
    const levelProgress = points - prevLevelPoints;
    const levelRange = nextLevelPoints - prevLevelPoints;
    return Math.floor((levelProgress / levelRange) * 100);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={userProfile?.avatar_url || ''} alt={userProfile?.username || 'User'} />
                <AvatarFallback className="bg-refillia-primary text-white text-xl">
                  {getInitials(userProfile?.username || user.email || 'U')}
                </AvatarFallback>
              </Avatar>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              ) : (
                <CardTitle>{userProfile?.username || user.email}</CardTitle>
              )}
              
              <CardDescription className="mt-2">
                Member since {new Date(userProfile?.created_at || '').toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {userProfile && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Level {userProfile.level}</span>
                    <span className="text-sm text-gray-600">
                      {userProfile.total_points.toLocaleString()} points
                    </span>
                  </div>
                  <Progress 
                    value={getProgressToNextLevel(userProfile.total_points, userProfile.level)} 
                    className="h-2 bg-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {getNextLevelPoints(userProfile.level) - userProfile.total_points} points to level {userProfile.level + 1}
                  </p>
                </div>
              )}
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-refillia-primary mr-2" />
                  <span>{userProfile?.stations_added || 0} stations added</span>
                </div>
                <div className="flex items-center">
                  <Droplet className="h-5 w-5 text-refillia-primary mr-2" />
                  <span>{userProfile?.refills_logged || 0} refills logged</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-refillia-primary mr-2" />
                  <span>{userProfile?.reviews_added || 0} reviews added</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    className="flex-1 bg-refillia-primary hover:bg-refillia-primary/90"
                    onClick={handleUpdateProfile}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-200 text-red-500 hover:bg-red-50"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>

          {/* Achievements and Activities */}
          <div className="md:col-span-2 space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Collect achievements by participating in the Refillia community
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userAchievements.map((achievement) => {
                    // Dynamically choose the icon based on the icon_name field
                    let AchievementIcon;
                    switch (achievement.icon_name) {
                      case 'award': AchievementIcon = Award; break;
                      case 'star': AchievementIcon = Star; break;
                      case 'trophy': AchievementIcon = Trophy; break;
                      case 'medal': AchievementIcon = BadgeCheck; break;
                      case 'heart': AchievementIcon = Award; break;
                      default: AchievementIcon = Award;
                    }
                    
                    return (
                      <div 
                        key={achievement.id}
                        className={`p-4 rounded-lg border ${
                          achievement.unlocked 
                            ? 'bg-refillia-light-green border-green-200' 
                            : 'bg-gray-50 border-gray-200 opacity-70'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            achievement.unlocked ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                          }`}>
                            <AchievementIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            {achievement.unlocked ? (
                              <p className="text-xs text-green-600 mt-1">
                                Unlocked {new Date(achievement.unlocked_at || '').toLocaleDateString()}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500 mt-1">
                                Reward: {achievement.points_reward} points
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplet className="h-5 w-5 text-refillia-primary mr-2" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border-b">
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString()} • {activity.activity_type}
                          </p>
                        </div>
                        <span className="text-refillia-primary font-semibold">+{activity.points} pts</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>You don't have any activities yet.</p>
                    <p className="text-sm mt-1">Start adding stations and interacting with the app!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

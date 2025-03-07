import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import OperatingHoursSection from '@/components/OperatingHoursSection';

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

// Add this inside the Station interface
interface Station {
  id: string;
  name: string;
  address: string;
  description: string;
  verification_status: string;
  is_private: boolean;
  created_at: string;
  user_id: string;
  operating_hours?: Record<string, { isOpen: boolean; openTime: string; closeTime: string; }>;
  features?: {
    isFiltered: boolean;
    isBottleFriendly: boolean;
    isAccessible: boolean;
    isColdWater: boolean;
  };
}

const ProfilePage: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add this state
  const [userStations, setUserStations] = useState<Station[]>([]);

  // Add new state for editing
  const [editingStationId, setEditingStationId] = useState<string | null>(null);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || '');
      fetchUserAchievements();
      fetchRecentActivities();
      fetchUserStations(); // Add this line
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

  // Add this function to fetch user's stations
  const fetchUserStations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('water_stations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserStations(data || []);
    } catch (error) {
      console.error('Error fetching user stations:', error);
    }
  };

  // Add new function to handle station updates
  const handleUpdateStation = async (stationId: string, updates: Partial<Station>) => {
    try {
      const station = userStations.find(s => s.id === stationId);
      if (!station) return;

      const { error } = await supabase
        .from('water_stations')
        .update({
          name: updates.name,
          description: updates.description,
          operating_hours: updates.operating_hours,
          features: updates.features,
          updated_at: new Date().toISOString()
        })
        .eq('id', stationId)
        .eq('user_id', user?.id); // Ensure user can only update their own stations

      if (error) throw error;

      toast({
        title: "Station Updated",
        description: "The station details have been updated successfully."
      });

      setEditingStationId(null);
      fetchUserStations(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
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
            {/* Add this section to the JSX before the Achievements card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 text-refillia-primary mr-2" />
                  Your Refill Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userStations.length > 0 ? (
                  <div className="space-y-4">
                    {userStations.map((station) => (
                      <div key={station.id} className="flex flex-col p-3 border-b">
                        <div className="flex justify-between items-start">
                          <div className="w-full">
                            {editingStationId === station.id ? (
                              <div className="space-y-4">
                                <div>
                                  <Label>Station Name</Label>
                                  <Input
                                    value={station.name}
                                    onChange={(e) => {
                                      const updatedStations = userStations.map(s =>
                                        s.id === station.id ? { ...s, name: e.target.value } : s
                                      );
                                      setUserStations(updatedStations);
                                    }}
                                    className="mb-2"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Description</Label>
                                  <Textarea
                                    value={station.description}
                                    onChange={(e) => {
                                      const updatedStations = userStations.map(s =>
                                        s.id === station.id ? { ...s, description: e.target.value } : s
                                      );
                                      setUserStations(updatedStations);
                                    }}
                                    className="mb-2"
                                  />
                                </div>
                            
                                {station.is_private && (
                                  <div>
                                    <Label>Operating Hours</Label>
                                    <OperatingHoursSection
                                      schedule={station.operating_hours || {}}
                                      onScheduleChange={(day, updates) => {
                                        const updatedStations = userStations.map(s =>
                                          s.id === station.id ? {
                                            ...s,
                                            operating_hours: {
                                              ...s.operating_hours,
                                              [day]: { ...s.operating_hours?.[day], ...updates }
                                            }
                                          } : s
                                        );
                                        setUserStations(updatedStations);
                                      }}
                                    />
                                  </div>
                                )}
                            
                                <div className="flex gap-2 mt-4">
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateStation(station.id, station)}
                                  >
                                    Save Changes
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingStationId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Link 
                                  to={`/station/${station.id}`} 
                                  className="font-medium hover:text-refillia-primary"
                                >
                                  {station.name}
                                </Link>
                                <p className="text-sm text-gray-500">{station.address}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={station.is_private ? 'outline' : 'default'}>
                                    {station.is_private ? 'Private' : 'Public'}
                                  </Badge>
                                  <Badge variant={
                                    station.verification_status === 'approved' ? 'success' :
                                    station.verification_status === 'rejected' ? 'destructive' :
                                    'default'
                                  }>
                                    {station.verification_status.charAt(0).toUpperCase() + 
                                     station.verification_status.slice(1)}
                                  </Badge>
                                  {station.is_private && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingStationId(station.id)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>You haven't added any refill stations yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigate('/add-station')}
                    >
                      Add Your First Station
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

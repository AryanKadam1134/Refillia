import React, { useEffect, useState } from 'react';
import { ChevronLeft, Star, Clock, MapPin, Droplet, ThumbsUp, ThumbsDown, Share2, Navigation, Loader2, Edit } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import OperatingHoursSection from '@/components/OperatingHoursSection';

interface Station {
  id: string;
  name: string;
  address: string;
  description: string;
  verification_status: string;
  created_at: string;
  latitude: number;
  longitude: number;
  water_quality: string;
  access_type: string;
  is_private: boolean;
  operating_hours?: Record<string, { isOpen: boolean; openTime: string; closeTime: string; }>;
  features?: {
    isFiltered: boolean;
    isBottleFriendly: boolean;
    isAccessible: boolean;
    isColdWater: boolean;
  };
}

const StationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth(); // Get both user and userProfile from auth context
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const canEdit = () => {
    if (!user || !userProfile) return false;
    // Admin can edit public stations
    if (userProfile.role === 'admin' && !station?.is_private) return true;
    // Users can edit their own private stations
    if (station?.is_private && station?.user_id === user.id) return true;
    return false;
  };

  const handleEdit = async () => {
    if (!canEdit()) return;
    
    try {
      const updates = {
        name: station.name,
        description: station.description,
        water_quality: station.water_quality,
        features: {
          isFiltered: station.water_quality === 'Filtered',
          isBottleFriendly: station.features?.isBottleFriendly || false,
          isAccessible: station.features?.isAccessible || false,
          isColdWater: station.features?.isColdWater || false
        },
        operating_hours: station.is_private ? station.operating_hours : null
      };

      const { error } = await supabase
        .from('water_stations')
        .update(updates)
        .eq('id', station.id)
        .single();

      if (error) throw error;

      toast({
        title: "Station Updated",
        description: "The station details have been updated successfully."
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchStationDetails = async () => {
      if (!id) {
        navigate('/map');
        return;
      }

      try {
        // Simplify the query to fetch only necessary fields
        const { data, error } = await supabase
          .from('water_stations')
          .select(`
            id,
            name,
            address,
            description,
            verification_status,
            created_at,
            latitude,
            longitude,
            water_quality,
            access_type,
            user_id,
            features,
            operating_hours
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data) {
          navigate('/map');
          return;
        }

        // Transform the data with proper type checking
        const stationData: Station = {
          ...data,
          features: typeof data.features === 'object' ? data.features : {
            isFiltered: false,
            isBottleFriendly: false,
            isAccessible: false,
            isColdWater: false
          },
          operating_hours: typeof data.operating_hours === 'object' ? data.operating_hours : {},
          is_private: data.access_type === 'private',
        };

        setStation(stationData);
      } catch (error) {
        console.error('Error fetching station:', error);
        toast({
          title: "Error",
          description: "Failed to load station details",
          variant: "destructive"
        });
        navigate('/map');
      } finally {
        setLoading(false);
      }
    };

    fetchStationDetails();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!station) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Station not found
      </div>
    );
  }

  const getStationHours = () => {
    if (!station.is_private) return "Public Access";
    if (!station.operating_hours) return "Hours not specified";

    return Object.entries(station.operating_hours)
      .map(([day, schedule]) => 
        schedule.isOpen 
          ? `${day}: ${schedule.openTime} - ${schedule.closeTime}`
          : `${day}: Closed`
      )
      .join('\n');
  };

  const getFeatures = () => {
    const features = [];
    if (station.water_quality === 'Filtered' || station.features?.isFiltered) {
      features.push('Filtered Water');
    }
    if (station.features?.isBottleFriendly) {
      features.push('Bottle Friendly');
    }
    if (station.features?.isAccessible) {
      features.push('Wheelchair Accessible');
    }
    if (station.features?.isColdWater) {
      features.push('Cold Water');
    }
    return features;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/map" className="inline-flex items-center text-gray-600 hover:text-refillia-primary mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Map
      </Link>

      {/* Station Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isEditing ? (
              <Input
                value={station.name}
                onChange={(e) => setStation(prev => prev ? {...prev, name: e.target.value} : prev)}
                className="font-bold text-2xl"
              />
            ) : (
              station.name
            )}
          </h1>
          {canEdit() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditing ? handleEdit() : setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? 'Save Changes' : 'Edit Station'}
            </Button>
          )}
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{station.address}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{station.is_private ? 'Private' : 'Public'} Station</span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            station.verification_status === 'approved' 
              ? 'bg-green-100 text-green-800'
              : station.verification_status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {station.verification_status.charAt(0).toUpperCase() + station.verification_status.slice(1)}
          </span>
        </div>

        {/* Get Directions Button */}
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-3 bg-refillia-primary text-white px-4 py-2 rounded-md hover:bg-refillia-primary/90 transition-colors"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Get Directions
        </a>
      </div>

      {/* Station Description and Features */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">About this Station</h2>
          
          {isEditing ? (
            <>
              <div className="mb-4">
                <Label>Description</Label>
                <Textarea
                  value={station.description}
                  onChange={(e) => setStation(prev => prev ? {...prev, description: e.target.value} : prev)}
                  className="mb-4"
                  rows={4}
                />
              </div>

              <div className="mb-4">
                <Label>Features</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filtered" 
                      checked={station.water_quality === 'Filtered'}
                      onCheckedChange={(checked) => setStation(prev => prev ? {
                        ...prev,
                        water_quality: checked ? 'Filtered' : 'Regular'
                      } : prev)}
                    />
                    <Label htmlFor="filtered">Filtered Water</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="bottleFriendly" 
                      checked={station.features?.isBottleFriendly}
                      onCheckedChange={(checked) => setStation(prev => prev ? {
                        ...prev,
                        features: { ...prev.features, isBottleFriendly: checked as boolean }
                      } : prev)}
                    />
                    <Label htmlFor="bottleFriendly">Bottle Friendly</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="accessible" 
                      checked={station.features?.isAccessible}
                      onCheckedChange={(checked) => setStation(prev => prev ? {
                        ...prev,
                        features: { ...prev.features, isAccessible: checked as boolean }
                      } : prev)}
                    />
                    <Label htmlFor="accessible">Wheelchair Accessible</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="coldWater" 
                      checked={station.features?.isColdWater}
                      onCheckedChange={(checked) => setStation(prev => prev ? {
                        ...prev,
                        features: { ...prev.features, isColdWater: checked as boolean }
                      } : prev)}
                    />
                    <Label htmlFor="coldWater">Cold Water</Label>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-700">{station.description}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Features:</h3>
                <div className="flex flex-wrap gap-2">
                  {getFeatures().map((feature, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-refillia-light-blue text-refillia-primary"
                    >
                      <Droplet className="h-3 w-3 mr-1" />
                      {feature}
                    </span>
                  ))}
                  {getFeatures().length === 0 && (
                    <span className="text-gray-500">No features specified</span>
                  )}
                </div>
              </div>
            </>
          )}

          {station.is_private && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Operating Hours:</h3>
              {isEditing ? (
                <OperatingHoursSection
                  schedule={station.operating_hours || {}}
                  onScheduleChange={(day, updates) => {
                    setStation(prev => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        operating_hours: {
                          ...prev.operating_hours,
                          [day]: {
                            ...prev.operating_hours?.[day],
                            ...updates
                          }
                        }
                      };
                    });
                  }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-gray-600">
                  {getStationHours()}
                </pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons - Only show if user is logged in */}
      {user && (
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" size="sm" className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" />
            Helpful
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <ThumbsDown className="h-4 w-4 mr-1" />
            Report Issue
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      )}

      {/* Show login prompt if user is not authenticated */}
      {!user && (
        <div className="text-center py-4 bg-gray-50 rounded-lg mb-8">
          <p className="text-gray-600 mb-2">Sign in to rate and review this station</p>
          <Link to="/auth" className="text-refillia-primary hover:underline">
            Log in or Sign up
          </Link>
        </div>
      )}
    </div>
  );
};

export default StationDetail;
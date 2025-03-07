import React, { useEffect, useState } from 'react';
import { ChevronLeft, Star, Clock, MapPin, Droplet, ThumbsUp, ThumbsDown, Share2, Navigation, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

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

  useEffect(() => {
    const fetchStationDetails = async () => {
      if (!id) {
        navigate('/map');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('water_stations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) {
          navigate('/map');
          return;
        }

        setStation(data);
      } catch (error) {
        console.error('Error fetching station:', error);
        navigate('/map');
      } finally {
        setLoading(false);
      }
    };

    fetchStationDetails();
  }, [id, navigate]);

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
    if (station.water_quality === 'Filtered') features.push('Filtered Water');
    if (station.features?.isBottleFriendly) features.push('Bottle Friendly');
    if (station.features?.isAccessible) features.push('Wheelchair Accessible');
    if (station.features?.isColdWater) features.push('Cold Water');
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{station.name}</h1>
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

      {/* Station Description & Features */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">About this Station</h2>
          <p className="text-gray-700 mb-4">{station.description}</p>

          {station.is_private && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Operating Hours:</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-600">
                {getStationHours()}
              </pre>
            </div>
          )}

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
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
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
    </div>
  );
};

export default StationDetail;

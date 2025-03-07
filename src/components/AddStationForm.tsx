import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Info, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import GamificationService, { ActivityType } from '@/services/GamificationService';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to set initial map center to user location
const SetViewOnUserLocation = () => {
  const map = useMap();
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
          console.log("Set view to user location for adding station:", latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default center if geolocation fails
        }
      );
    }
  }, [map]);
  
  return null;
};

// Component for selecting location on map
const LocationSelector = ({ position, setPosition }: { position: [number, number], setPosition: React.Dispatch<React.SetStateAction<[number, number]>> }) => {
  const map = useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  // Set user's current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location for position setting:", error);
        }
      );
    }
  }, [setPosition]);

  return (
    <Marker position={position}>
    </Marker>
  );
};

const AddStationForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [position, setPosition] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [stationType, setStationType] = useState('');
  const [isOpen24_7, setIsOpen24_7] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isBottleFriendly, setIsBottleFriendly] = useState(false);
  const [isAccessible, setIsAccessible] = useState(false);
  const [isColdWater, setIsColdWater] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add a refill station.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add a refill station.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    // Form validation
    if (!name || !address || !city || !state || !stationType || !description || !agreedToTerms) {
      toast({
        title: "Please fill in all required fields",
        description: "Make sure to complete all required information and agree to the terms.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare station data - Remove features object and add relevant fields directly
      const stationData = {
        name,
        description,
        user_id: user.id,
        address: `${address}, ${city}, ${state}`,
        latitude: position[0],
        longitude: position[1],
        access_type: stationType,
        water_quality: isFiltered ? 'Filtered' : 'Standard',
        // Store features in description instead
        description: `${description}\n\nFeatures:\n${[
          isOpen24_7 ? '- Open 24/7' : '',
          isFiltered ? '- Filtered water' : '',
          isBottleFriendly ? '- Bottle friendly' : '',
          isAccessible ? '- Wheelchair accessible' : '',
          isColdWater ? '- Cold water' : ''
        ].filter(Boolean).join('\n')}`
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('water_stations')
        .insert(stationData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add points for adding a station
      await GamificationService.addPoints(
        user.id,
        ActivityType.STATION_ADDED,
        `Added a new refill station: ${name}`
      );
      
      // Also add to local storage for compatibility with existing code
      try {
        const storedStations = localStorage.getItem('refillia-stations');
        const existingStations = storedStations ? JSON.parse(storedStations) : [];
        
        const newLocalStation = {
          id: Date.now(),
          name,
          address: `${address}, ${city}, ${state}`,
          type: stationType,
          rating: 0,
          distance: "0 mi",
          position,
          description,
          features: {
            isOpen24_7,
            isFiltered,
            isBottleFriendly,
            isAccessible,
            isColdWater
          }
        };
        
        localStorage.setItem('refillia-stations', JSON.stringify([...existingStations, newLocalStation]));
      } catch (localError) {
        console.error('Error updating localStorage:', localError);
      }
      
      toast({
        title: "Station added successfully!",
        description: "Thank you for contributing to Refillia. Your submission has been added and you've earned points!",
      });
      
      // Navigate to the map after a short delay
      setTimeout(() => {
        navigate('/map');
      }, 1500);
    } catch (error: any) {
      console.error('Error adding station:', error);
      toast({
        title: "Error adding station",
        description: error.message || "There was a problem saving your station. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add a Refill Station</h1>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Map for selecting location */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-refillia-primary" />
                Select Location on Map
              </h2>
              <div className="h-[300px] w-full rounded-md overflow-hidden border border-gray-300">
                <MapContainer 
                  center={position} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationSelector position={position} setPosition={setPosition} />
                  <SetViewOnUserLocation />
                </MapContainer>
              </div>
              <p className="text-sm text-gray-500 mt-2">Click on the map to mark the refill station location. By default, your current location is selected.</p>
            </div>
            
            {/* Location Information Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-refillia-primary" />
                Location Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Station Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Central Park Fountain" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address" 
                    placeholder="Street address" 
                    required 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="City" 
                      required 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state" 
                      placeholder="State/Province" 
                      required 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="stationType">Station Type</Label>
                  <select 
                    id="stationType" 
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                    value={stationType}
                    onChange={(e) => setStationType(e.target.value)}
                  >
                    <option value="">Select station type</option>
                    <option value="Public Fountain">Public Fountain</option>
                    <option value="Bottle Filling Station">Bottle Filling Station</option>
                    <option value="Water Fountain">Water Fountain</option>
                    <option value="Cafe/Restaurant">Cafe/Restaurant</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Station Details Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-refillia-primary" />
                Station Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the refill station (location details, water quality, etc.)" 
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Operating Hours</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allDay" 
                      checked={isOpen24_7}
                      onCheckedChange={(checked) => setIsOpen24_7(checked as boolean)}
                    />
                    <label htmlFor="allDay" className="text-sm text-gray-700 cursor-pointer">
                      Open 24/7
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filtered" 
                        checked={isFiltered}
                        onCheckedChange={(checked) => setIsFiltered(checked as boolean)}
                      />
                      <label htmlFor="filtered" className="text-sm text-gray-700 cursor-pointer">
                        Filtered Water
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bottleFriendly" 
                        checked={isBottleFriendly}
                        onCheckedChange={(checked) => setIsBottleFriendly(checked as boolean)}
                      />
                      <label htmlFor="bottleFriendly" className="text-sm text-gray-700 cursor-pointer">
                        Bottle Friendly
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="accessible" 
                        checked={isAccessible}
                        onCheckedChange={(checked) => setIsAccessible(checked as boolean)}
                      />
                      <label htmlFor="accessible" className="text-sm text-gray-700 cursor-pointer">
                        Wheelchair Accessible
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="coldWater" 
                        checked={isColdWater}
                        onCheckedChange={(checked) => setIsColdWater(checked as boolean)}
                      />
                      <label htmlFor="coldWater" className="text-sm text-gray-700 cursor-pointer">
                        Cold Water
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Photos Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-refillia-primary" />
                Photos
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop photos here, or click to browse</p>
                <p className="text-xs text-gray-400">Maximum 5 photos, 5MB each</p>
                <Input type="file" multiple className="hidden" />
                <Button type="button" variant="outline" size="sm" className="mt-4">
                  Upload Photos
                </Button>
              </div>
            </div>
            
            {/* Terms and Submit */}
            <div className="pt-4 border-t">
              <div className="flex items-start space-x-3 mb-6">
                <div className="mt-1">
                  <Checkbox 
                    id="terms" 
                    required
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                </div>
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I confirm that this information is accurate to the best of my knowledge and I have the right to share these photos. I understand that submissions are reviewed for quality.
                </label>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Your submission will be reviewed by our team before being published. This usually takes 1-2 days.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-refillia-primary hover:bg-refillia-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Refill Station'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStationForm;

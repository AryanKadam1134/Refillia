
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Info, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const AddStationForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For the MVP, just show a success toast and redirect
    toast({
      title: "Station submitted successfully!",
      description: "Thank you for contributing to Refillia. Your submission will be reviewed soon.",
    });
    
    // In a real app, you would submit the form data to an API
    setTimeout(() => {
      navigate('/map');
    }, 2000);
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add a Refill Station</h1>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Information Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-refillia-primary" />
                Location Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Station Name</Label>
                  <Input id="name" placeholder="e.g., Central Park Fountain" required />
                </div>
                
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="Street address" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" required />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" placeholder="State/Province" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="stationType">Station Type</Label>
                  <select 
                    id="stationType" 
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
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
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Operating Hours</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allDay" />
                    <label htmlFor="allDay" className="text-sm text-gray-700 cursor-pointer">
                      Open 24/7
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="filtered" />
                      <label htmlFor="filtered" className="text-sm text-gray-700 cursor-pointer">
                        Filtered Water
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="bottleFriendly" />
                      <label htmlFor="bottleFriendly" className="text-sm text-gray-700 cursor-pointer">
                        Bottle Friendly
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="accessible" />
                      <label htmlFor="accessible" className="text-sm text-gray-700 cursor-pointer">
                        Wheelchair Accessible
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="coldWater" />
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
                  <Checkbox id="terms" required />
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
              
              <Button type="submit" className="w-full bg-refillia-primary hover:bg-refillia-primary/90">
                Submit Refill Station
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStationForm;

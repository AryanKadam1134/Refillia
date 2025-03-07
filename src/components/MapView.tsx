
import React, { useState } from 'react';
import { MapPin, Navigation, Filter, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

// Dummy data for stations
const dummyStations = [
  {
    id: 1,
    name: "Central Park Fountain",
    address: "Central Park, New York, NY",
    type: "Public Fountain",
    rating: 4.5,
    distance: "0.3 mi"
  },
  {
    id: 2,
    name: "City Library Refill Station",
    address: "Main St & 5th Ave, Seattle, WA",
    type: "Indoor Station",
    rating: 4.8,
    distance: "0.7 mi"
  },
  {
    id: 3,
    name: "Green Cafe",
    address: "123 Market St, San Francisco, CA",
    type: "Cafe",
    rating: 4.2,
    distance: "1.2 mi"
  },
  {
    id: 4,
    name: "Community Center",
    address: "500 Community Dr, Portland, OR",
    type: "Indoor Station",
    rating: 4.0,
    distance: "1.5 mi"
  }
];

const MapView: React.FC = () => {
  const [showList, setShowList] = useState(false);

  return (
    <div className="h-[calc(100vh-64px)] relative">
      {/* This would be replaced with a real map implementation */}
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 rounded-lg max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Map Placeholder</h2>
          <p className="mb-6">
            In the full implementation, this would be an interactive map showing water refill stations. 
            For this MVP, we're using placeholders to demonstrate the UI.
          </p>
          
          {/* Map pins for demonstration */}
          <div className="relative h-64 w-full bg-refillia-light-blue rounded-lg mb-4 overflow-hidden">
            {dummyStations.map((station, index) => (
              <div 
                key={station.id}
                className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                style={{ 
                  top: `${20 + (index * 15)}%`, 
                  left: `${15 + (index * 20)}%`
                }}
              >
                <Link to={`/station/${station.id}`}>
                  <MapPin className="h-8 w-8 text-refillia-primary" fill="#D3E4FD" strokeWidth={2} />
                </Link>
              </div>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm">
            The actual implementation would use a mapping API like OpenStreetMap or Mapbox.
          </p>
        </div>
      </div>
      
      {/* Search and filter overlay */}
      <div className="absolute top-4 left-4 right-4 flex gap-2">
        <Input 
          className="bg-white shadow-md" 
          placeholder="Search for refill stations..." 
        />
        <Button variant="outline" className="bg-white shadow-md">
          <Filter className="h-5 w-5" />
        </Button>
        <Button className="bg-refillia-primary hover:bg-refillia-primary/90 shadow-md">
          <Navigation className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Toggle list view button */}
      <Button 
        className="absolute bottom-4 right-4 bg-white text-gray-800 hover:bg-gray-100 shadow-md"
        onClick={() => setShowList(!showList)}
      >
        <List className="h-5 w-5 mr-2" />
        {showList ? 'Hide List' : 'Show List'}
      </Button>
      
      {/* Station list overlay */}
      {showList && (
        <div className="absolute bottom-16 right-4 w-80 bg-white rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Nearby Refill Stations</h3>
          </div>
          
          <div className="divide-y">
            {dummyStations.map(station => (
              <Link to={`/station/${station.id}`} key={station.id}>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{station.name}</h4>
                      <p className="text-sm text-gray-500">{station.address}</p>
                      <p className="text-xs text-gray-400 mt-1">{station.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-refillia-primary">{station.distance}</span>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-600 mr-1">{station.rating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;

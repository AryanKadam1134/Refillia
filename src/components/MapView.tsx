
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Filter, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

// Dummy data for stations
const dummyStations = [
  {
    id: 1,
    name: "Central Park Fountain",
    address: "Central Park, New York, NY",
    type: "Public Fountain",
    rating: 4.5,
    distance: "0.3 mi",
    position: [40.785091, -73.968285] // New York
  },
  {
    id: 2,
    name: "City Library Refill Station",
    address: "Main St & 5th Ave, Seattle, WA",
    type: "Indoor Station",
    rating: 4.8,
    distance: "0.7 mi",
    position: [47.606209, -122.332071] // Seattle
  },
  {
    id: 3,
    name: "Green Cafe",
    address: "123 Market St, San Francisco, CA",
    type: "Cafe",
    rating: 4.2,
    distance: "1.2 mi",
    position: [37.774929, -122.419416] // San Francisco
  },
  {
    id: 4,
    name: "Community Center",
    address: "500 Community Dr, Portland, OR",
    type: "Indoor Station",
    rating: 4.0,
    distance: "1.5 mi",
    position: [45.523064, -122.676483] // Portland
  }
];

// Component to handle getting user's location and setting map view
const LocationButton = () => {
  const map = useMap();
  
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 13);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  
  return (
    <Button 
      className="absolute top-4 right-16 z-[1000] bg-refillia-primary hover:bg-refillia-primary/90 shadow-md"
      onClick={getLocation}
    >
      <Navigation className="h-5 w-5" />
    </Button>
  );
};

// Component to set initial map center to user location
const SetViewOnUserLocation = () => {
  const map = useMap();
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
          console.log("Set view to user location:", latitude, longitude);
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

const MapView: React.FC = () => {
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStations, setFilteredStations] = useState(dummyStations);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]); // Default center of the US
  const [mapZoom, setMapZoom] = useState(4);

  useEffect(() => {
    // Filter stations based on search query
    if (searchQuery.trim() === '') {
      setFilteredStations(dummyStations);
    } else {
      const filtered = dummyStations.filter(station => 
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStations(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="h-[calc(100vh-64px)] relative">
      {/* Map Component */}
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredStations.map(station => (
          <Marker 
            key={station.id} 
            position={station.position as [number, number]}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold">{station.name}</h3>
                <p className="text-sm">{station.address}</p>
                <p className="text-xs text-gray-600">{station.type}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Rating: {station.rating} ★</span>
                  <Link 
                    to={`/station/${station.id}`} 
                    className="text-refillia-primary hover:underline"
                  >
                    Details
                  </Link>
                </div>
                <div className="mt-2">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${station.position[0]},${station.position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-refillia-primary hover:underline text-sm flex items-center"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Get Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <SetViewOnUserLocation />
        <LocationButton />
      </MapContainer>
      
      {/* Search and filter overlay */}
      <div className="absolute top-4 left-4 right-24 flex gap-2 z-[1000]">
        <Input 
          className="bg-white shadow-md" 
          placeholder="Search for refill stations..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline" className="bg-white shadow-md">
          <Filter className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Toggle list view button */}
      <Button 
        className="absolute bottom-4 right-4 bg-white text-gray-800 hover:bg-gray-100 shadow-md z-[1000]"
        onClick={() => setShowList(!showList)}
      >
        <List className="h-5 w-5 mr-2" />
        {showList ? 'Hide List' : 'Show List'}
      </Button>
      
      {/* Add Station button */}
      <Link to="/add-station">
        <Button 
          className="absolute bottom-4 left-4 bg-refillia-primary hover:bg-refillia-primary/90 shadow-md z-[1000]"
        >
          <MapPin className="h-5 w-5 mr-2" />
          Add Station
        </Button>
      </Link>
      
      {/* Station list overlay */}
      {showList && (
        <div className="absolute bottom-16 right-4 w-80 bg-white rounded-lg shadow-lg max-h-[70vh] overflow-y-auto z-[1000]">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Nearby Refill Stations</h3>
          </div>
          
          <div className="divide-y">
            {filteredStations.length > 0 ? (
              filteredStations.map(station => (
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
                    <div className="mt-2">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${station.position[0]},${station.position[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-refillia-primary hover:underline text-sm flex items-center"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Get Directions
                      </a>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No stations found. Try adjusting your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;

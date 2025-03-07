
import React from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, Star, Clock, MapPin, Droplet, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Dummy data for demonstration
const stationDetails = {
  id: 1,
  name: "Central Park Fountain",
  address: "Central Park, New York, NY",
  type: "Public Fountain",
  rating: 4.5,
  status: "Open",
  hours: "24/7",
  description: "A public drinking fountain located near the entrance of Central Park. Clean water available for all visitors. The fountain provides cold, filtered water.",
  features: ["Wheelchair Accessible", "Bottle Friendly", "Filtered Water"],
  reviews: [
    {
      id: 1,
      user: "Jamie S.",
      date: "2 weeks ago",
      rating: 5,
      comment: "Great water pressure and the water tastes clean. Very convenient location!",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      id: 2,
      user: "Alex M.",
      date: "1 month ago",
      rating: 4,
      comment: "Water is cold and refreshing. The area around the fountain could be cleaner though.",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg"
    }
  ],
  images: [
    "https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1616903474236-ba3578973e3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  ]
};

const StationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // In a real app, you would fetch the station details based on the ID
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/map" className="inline-flex items-center text-gray-600 hover:text-refillia-primary mb-6">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Map
      </Link>
      
      {/* Station Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{stationDetails.name}</h1>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{stationDetails.address}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
            <span>{stationDetails.rating} (24 reviews)</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{stationDetails.hours}</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {stationDetails.status}
          </span>
        </div>
      </div>
      
      {/* Station Images */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {stationDetails.images.map((image, index) => (
          <img 
            key={index}
            src={image} 
            alt={`${stationDetails.name} - Image ${index + 1}`} 
            className="h-48 w-full object-cover rounded-lg"
          />
        ))}
      </div>
      
      {/* Station Description & Features */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">About this Station</h2>
          <p className="text-gray-700 mb-4">{stationDetails.description}</p>
          
          <h3 className="font-medium mb-2">Features:</h3>
          <div className="flex flex-wrap gap-2">
            {stationDetails.features.map((feature, index) => (
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
          Not Accurate
        </Button>
        <Button variant="outline" size="sm" className="flex items-center">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
      
      {/* Reviews */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-4">
          {stationDetails.reviews.map(review => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-start">
                <img 
                  src={review.avatar} 
                  alt={review.user} 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <div className="flex items-center mb-1">
                    <h4 className="font-medium text-gray-800 mr-2">{review.user}</h4>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className="h-4 w-4 mr-1" 
                        fill={i < review.rating ? '#FFD700' : 'none'} 
                        stroke={i < review.rating ? '#FFD700' : 'currentColor'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-6 bg-refillia-primary hover:bg-refillia-primary/90">
          Write a Review
        </Button>
      </div>
    </div>
  );
};

export default StationDetail;

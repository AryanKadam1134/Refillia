
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-refillia-light-blue to-refillia-light-green">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Refill, Reduce, Repeat
              <span className="block text-refillia-primary">Find Free Water Refill Stations Near You</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Join our community to discover nearby water refill stations, reduce plastic waste, and stay hydrated on the go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-refillia-primary hover:bg-refillia-primary/90">
                <Search className="mr-2 h-5 w-5" />
                <Link to="/map">Find Refill Stations</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-refillia-secondary text-refillia-secondary hover:bg-refillia-light-green">
                <PlusCircle className="mr-2 h-5 w-5" />
                <Link to="/add-station">Add a Refill Station</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1536939459926-301728717817?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Person refilling water bottle" 
              className="rounded-lg shadow-xl max-h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

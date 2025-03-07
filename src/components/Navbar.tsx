
import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="border-b py-4 px-6 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Droplet className="h-6 w-6 text-refillia-primary" />
          <span className="font-bold text-xl text-gray-800">Refillia</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/map" className="text-gray-600 hover:text-refillia-primary transition-colors">
            Find Stations
          </Link>
          <Link to="/add-station" className="text-gray-600 hover:text-refillia-primary transition-colors">
            Add Station
          </Link>
          <Link to="/" className="text-gray-600 hover:text-refillia-primary transition-colors">
            About
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button className="bg-refillia-primary hover:bg-refillia-primary/90">
            <Link to="/map">Find Water</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

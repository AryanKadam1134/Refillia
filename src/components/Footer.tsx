
import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Droplet className="h-6 w-6 text-refillia-primary" />
              <span className="font-bold text-xl text-gray-800">Refillia</span>
            </div>
            <p className="text-gray-600">
              Helping you find free water refill stations to reduce plastic waste and stay hydrated.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-refillia-primary">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-refillia-primary">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-refillia-primary">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-refillia-primary">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-refillia-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-600 hover:text-refillia-primary">
                  Find Stations
                </Link>
              </li>
              <li>
                <Link to="/add-station" className="text-gray-600 hover:text-refillia-primary">
                  Add a Station
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-refillia-primary">
                  About Plastic Pollution
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-refillia-primary">
                  Impact Reports
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-refillia-primary">
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-refillia-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-refillia-primary">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-refillia-primary">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Refillia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

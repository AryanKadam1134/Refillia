
import React from 'react';
import { Search, MapPin, Droplet, ThumbsUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Find',
    description: 'Search for water refill stations near your location or anywhere in the world.'
  },
  {
    icon: MapPin,
    title: 'Visit',
    description: 'Get directions to the nearest refill station and refill your bottle for free.'
  },
  {
    icon: Droplet,
    title: 'Refill',
    description: 'Enjoy free, clean water and track how many plastic bottles you\'ve saved.'
  },
  {
    icon: ThumbsUp,
    title: 'Review',
    description: 'Rate your experience and help others find great refill stations.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Refillia makes it easy to find water refill stations and reduce plastic waste. Here's how you can get started.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-refillia-light-blue mb-4">
                <step.icon className="h-8 w-8 text-refillia-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

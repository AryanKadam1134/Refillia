
import React from 'react';
import { Recycle, Droplet, Users } from 'lucide-react';

const stats = [
  {
    icon: Recycle,
    value: '125K+',
    label: 'Plastic Bottles Saved',
    description: 'Single-use plastic bottles avoided by our community'
  },
  {
    icon: Droplet,
    value: '3K+',
    label: 'Refill Stations',
    description: 'Free water refill points mapped worldwide'
  },
  {
    icon: Users,
    value: '10K+',
    label: 'Active Users',
    description: 'People committed to reducing plastic waste'
  }
];

const ImpactStats: React.FC = () => {
  return (
    <section className="py-16 bg-refillia-light-green">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Impact</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Together, we're making a difference. See how our community is helping to reduce plastic waste and promote sustainable hydration.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-refillia-light-blue rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-refillia-primary" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</h3>
              <p className="text-lg font-medium text-refillia-secondary mb-2">{stat.label}</p>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;

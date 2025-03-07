
import React from 'react';
import { Trophy, Droplet, Heart, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const GamificationPreview: React.FC = () => {
  return (
    <section className="py-16 bg-refillia-light-blue">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Earn Points, Make an Impact</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our gamification system to earn points, unlock achievements, and track your positive environmental impact.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 bg-refillia-primary text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
              50 pts
            </div>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-refillia-light-green mb-4">
                <Droplet className="h-8 w-8 text-refillia-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Refill Stations</h3>
              <p className="text-gray-600">
                Earn points by adding new water refill stations to our global map. Help others find free water!
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 bg-refillia-primary text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
              15 pts
            </div>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-refillia-light-green mb-4">
                <Heart className="h-8 w-8 text-refillia-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Write Reviews</h3>
              <p className="text-gray-600">
                Share your experience and help others by reviewing water stations you've visited.
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 bg-refillia-primary text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
              5 pts
            </div>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-refillia-light-green mb-4">
                <Droplet className="h-8 w-8 text-refillia-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Log Refills</h3>
              <p className="text-gray-600">
                Track your plastic savings by logging every time you refill your bottle instead of buying plastic.
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
              <Trophy className="h-4 w-4 inline-block mr-1" />
            </div>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-refillia-light-green mb-4">
                <Gift className="h-8 w-8 text-refillia-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unlock Achievements</h3>
              <p className="text-gray-600">
                Complete challenges to earn special badges and bonus points as you progress.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <Button className="bg-refillia-primary hover:bg-refillia-primary/90" size="lg">
            <Link to="/auth" className="flex items-center">
              Get Started Now 
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GamificationPreview;

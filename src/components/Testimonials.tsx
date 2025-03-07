
import React from 'react';

const testimonials = [
  {
    quote: "Refillia has changed how I stay hydrated. I've saved money and reduced my environmental impact by using refill stations instead of buying bottled water.",
    name: "Sarah K.",
    title: "Avid Hiker",
    image: "https://randomuser.me/api/portraits/women/79.jpg"
  },
  {
    quote: "As a runner, I need to stay hydrated. The Refillia app helps me plan my routes around refill stations, so I never have to worry about running out of water.",
    name: "Michael T.",
    title: "Marathon Runner",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "I've contributed over 20 refill stations to the app. It feels great to be part of a community that's working together to reduce plastic waste.",
    name: "Emma L.",
    title: "Environmental Advocate",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Community Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from people who are making a difference in their communities with Refillia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg border border-gray-100">
              <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

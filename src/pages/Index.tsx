
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import ImpactStats from '@/components/ImpactStats';
import Testimonials from '@/components/Testimonials';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <HowItWorks />
      <ImpactStats />
      <Testimonials />
    </Layout>
  );
};

export default Index;

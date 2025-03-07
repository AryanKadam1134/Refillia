
import React from 'react';
import Layout from '@/components/Layout';
import MapView from '@/components/MapView';

const MapPage = () => {
  return (
    <Layout>
      <div className="h-full">
        <MapView />
      </div>
    </Layout>
  );
};

export default MapPage;

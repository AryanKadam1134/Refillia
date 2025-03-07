import React from 'react';
import Layout from '@/components/Layout';
import StationDetail from '@/components/StationDetail';

const StationDetailPage = () => {
  // Remove the ProtectedRoute wrapper
  return (
    <Layout>
      <StationDetail />
    </Layout>
  );
};

export default StationDetailPage;

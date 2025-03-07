
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import StationDetail from '@/components/StationDetail';

const StationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const stationId = id ? parseInt(id, 10) : null;
  
  return (
    <Layout>
      <StationDetail stationId={stationId} />
    </Layout>
  );
};

export default StationDetailPage;

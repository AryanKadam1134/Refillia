
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import StationDetail from '@/components/StationDetail';

const StationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [stationId, setStationId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      setStationId(parseInt(id));
    }
  }, [id]);

  return (
    <Layout>
      <StationDetail stationId={stationId} />
    </Layout>
  );
};

export default StationDetailPage;

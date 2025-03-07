import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, RefreshCcw } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  address: string;
  description: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_notes?: string;
  user_id: string;
  latitude: number;
  longitude: number;
  profiles?: {
    username?: string;
    id?: string;
    role?: string;
  };
}

const AdminDashboard = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState(false);

  const fetchPendingStations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('water_stations')
        .select(`
          *,
          creator:user_id (
            username,
            id,
            role
          )
        `)
        // Remove any filters to show all stations
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = data?.map(station => ({
        ...station,
        profiles: station.creator || { username: 'Unknown' }
      })) || [];

      setStations(transformedData);
    } catch (error: any) {
      console.error('Error fetching stations:', error);
      setConnectionError(true);
      toast({
        title: "Error fetching stations",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || profile?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      fetchPendingStations();
    } catch (error: any) {
      setConnectionError(true);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const handleVerification = async (stationId: string, status: 'approved' | 'rejected', notes: string) => {
    try {
      const { error } = await supabase
        .from('water_stations')
        .update({
          verification_status: status,
          admin_notes: notes,
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', stationId);

      if (error) throw error;

      toast({
        title: "Station Updated",
        description: `Station has been ${status}`
      });
      
      fetchPendingStations();
    } catch (error: any) {
      toast({
        title: "Error updating station",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold text-red-600">Connection Error</h2>
        <p className="text-gray-600">Unable to connect to the server</p>
        <Button 
          onClick={() => {
            setConnectionError(false);
            checkAdminAccess();
          }}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => supabase.auth.signOut()}>Logout</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead className="w-[200px]">Address</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead className="w-[150px]">Added By</TableHead>
            <TableHead className="w-[150px]">Location</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[150px]">Created At</TableHead>
            <TableHead className="w-[250px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station.id}>
              <TableCell>{station.name}</TableCell>
              <TableCell>{station.address}</TableCell>
              <TableCell className="max-w-[300px]">
                <div className="line-clamp-3">{station.description}</div>
              </TableCell>
              <TableCell>
                {station.creator?.username || station.profiles?.username || 'Unknown User'}
              </TableCell>
              <TableCell>
                <a
                  href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  View on Map
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={
                  station.verification_status === 'approved' ? 'success' :
                  station.verification_status === 'rejected' ? 'destructive' :
                  'default'
                }>
                  {station.verification_status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(station.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Admin notes..."
                    className="mb-2"
                    defaultValue={station.admin_notes || ''}
                    onChange={(e) => {
                      const updatedStations = stations.map(s => 
                        s.id === station.id ? {...s, admin_notes: e.target.value} : s
                      );
                      setStations(updatedStations);
                    }}
                  />
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleVerification(
                        station.id,
                        'approved',
                        stations.find(s => s.id === station.id)?.admin_notes || ''
                      )}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleVerification(
                        station.id,
                        'rejected',
                        stations.find(s => s.id === station.id)?.admin_notes || ''
                      )}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
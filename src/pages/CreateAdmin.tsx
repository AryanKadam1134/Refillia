import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const createAdmin = async () => {
    setIsLoading(true);
    setConnectionError(false);
    const adminEmail = 'admin@refillia.com';
    const adminPassword = 'Admin@123';

    try {
      // Sign out any existing session
      await supabase.auth.signOut();

      // Create new admin user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            role: 'admin' // Add role to user metadata
          }
        }
      });

      if (signUpError) throw signUpError;

      if (!data.user?.id) {
        throw new Error('Failed to create user');
      }

      // Wait for profile creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update profile with admin role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Admin Created Successfully",
        description: "Please check your email to confirm your account."
      });

      navigate('/auth');
    } catch (error: any) {
      console.error('Admin creation error:', error);
      setConnectionError(true);
      toast({
        title: "Error Creating Admin",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold mb-4">Create Admin User</h1>
      <p className="text-gray-600 mb-4">
        This will create an admin user with email: admin@refillia.com
      </p>
      {connectionError ? (
        <div className="text-center space-y-4">
          <p className="text-red-600">Connection failed. Please check your internet connection.</p>
          <Button 
            onClick={() => {
              setConnectionError(false);
              createAdmin();
            }}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : (
        <Button 
          onClick={createAdmin} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating Admin...' : 'Create Admin User'}
        </Button>
      )}
    </div>
  );
};

export default CreateAdmin;
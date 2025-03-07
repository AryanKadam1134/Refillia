
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, LogIn, UserPlus } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email, password);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(email, password, username);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-refillia-light-blue to-refillia-light-green">
      <div className="m-auto max-w-md w-full p-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <Droplet className="h-10 w-10 text-refillia-primary mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Refillia</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to Refillia</CardTitle>
            <CardDescription className="text-center">
              Join our community to reduce plastic waste and find free water refill stations
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-refillia-primary hover:bg-refillia-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <LogIn className="mr-2 h-5 w-5" />
                        Sign In
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-refillia-primary hover:bg-refillia-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create Account
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

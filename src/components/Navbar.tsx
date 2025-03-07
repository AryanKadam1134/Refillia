
import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger, 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <nav className="border-b py-4 px-6 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Droplet className="h-6 w-6 text-refillia-primary" />
          <span className="font-bold text-xl text-gray-800">Refillia</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/map" className="text-gray-600 hover:text-refillia-primary transition-colors">
            Find Stations
          </Link>
          <Link to="/add-station" className="text-gray-600 hover:text-refillia-primary transition-colors">
            Add Station
          </Link>
          <Link to="/" className="text-gray-600 hover:text-refillia-primary transition-colors">
            About
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-refillia-primary text-white">
                      {getInitials(userProfile?.username || user.email || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  {userProfile && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-800">
                      {userProfile.level}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.username || user.email}</p>
                    {userProfile && (
                      <p className="text-xs text-muted-foreground">{userProfile.total_points} points</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500"
                  onClick={() => signOut()}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="bg-refillia-primary hover:bg-refillia-primary/90">
              <Link to="/auth" className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
          <Button className="bg-refillia-primary hover:bg-refillia-primary/90 md:block hidden">
            <Link to="/map">Find Water</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

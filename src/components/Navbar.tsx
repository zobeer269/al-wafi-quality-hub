
import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="hidden md:block">
            <div className="text-2xl font-bold text-qms-primary">AL-WAFI QMS</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`relative ${searchOpen ? 'w-64' : 'w-10'} transition-all duration-300`}>
            {searchOpen ? (
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qms-primary"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-2.5 h-4 w-4 text-gray-500"
                >
                  ×
                </button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto py-2">
                {[1, 2, 3].map(i => (
                  <DropdownMenuItem key={i} className="py-3 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">Document QP-SOP-023 awaiting your review</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-qms-primary justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

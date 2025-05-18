
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarComponent from '@/components/Sidebar';

export const MobileNav = () => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2">
            <Menu className="h-6 w-6 text-gray-500" />
            <span className="sr-only">Open menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SidebarComponent />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;

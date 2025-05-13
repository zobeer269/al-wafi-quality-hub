
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
          <main className="flex-1 bg-gray-50 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

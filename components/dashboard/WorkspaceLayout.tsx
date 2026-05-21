'use client';

import React from 'react';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { DashboardSidebar } from './Sidebar';
import { DashboardNavbar } from './Navbar';
import { MobileNavigation } from './MobileNav';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const { isLoading, user } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center font-sans text-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-[#FF2D2D] rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
            Rehydrating Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-sans text-gray-900 overflow-x-hidden pb-16 md:pb-0">
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <DashboardNavbar />

        {/* Dynamic Content Grid */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigator */}
      <MobileNavigation />
    </div>
  );
}

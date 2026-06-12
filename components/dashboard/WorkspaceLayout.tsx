'use client';

import React, { useState } from 'react';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { DashboardSidebar } from './Sidebar';
import { DashboardNavbar } from './Navbar';
import { useAuthStore } from '../../store/authStore';
import { MobileNavigation } from './MobileNav';
import { MechanicSidebar } from './MechanicSidebar';
import { MechanicMobileNav } from './MechanicMobileNav';
import { MerchantSidebar } from './MerchantSidebar';
import { MerchantMobileNav } from './MerchantMobileNav';
import { AdminSidebar } from './AdminSidebar';
import { AdminMobileNav } from './AdminMobileNav';
import { useStorageSyncListener } from '../../store/localDB';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const { isLoading, user } = useRequireAuth();
  const logout = useAuthStore((s) => s.logout);
  const [showDev, setShowDev] = useState(false);
  
  // Hydrate localDB from localStorage and subscribe to cross-tab storage events
  useStorageSyncListener();

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
    <div className="h-screen w-screen overflow-hidden flex bg-[#FAFAFA] font-sans text-gray-900 pb-16 md:pb-0">
      {/* Desktop Sidebar */}
      {user?.role === 'Admin' ? <AdminSidebar /> : user?.role === 'Mechanic' ? <MechanicSidebar /> : user?.role === 'Merchant' ? <MerchantSidebar /> : <DashboardSidebar />}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <DashboardNavbar />

        {/* Dynamic Content Grid */}
        <main className="flex-1 h-full overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigator */}
      {user?.role === 'Admin' ? <AdminMobileNav /> : user?.role === 'Mechanic' ? <MechanicMobileNav /> : user?.role === 'Merchant' ? <MerchantMobileNav /> : <MobileNavigation />}

      {/* Dev Utility Settings */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
        {showDev && (
          <div className="bg-black/90 text-white p-3 rounded-lg text-xs font-mono shadow-xl flex flex-col gap-2">
            <button 
              onClick={() => {
                logout();
                window.location.href = '/signin';
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-left transition-colors"
            >
              Clear Current Session
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded text-left transition-colors"
            >
              Hard Factory Reset
            </button>
          </div>
        )}
        <button 
          onClick={() => setShowDev(!showDev)}
          className="bg-black/80 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-lg opacity-50 hover:opacity-100 transition-all"
        >
          Dev ⚙️
        </button>
      </div>
    </div>
  );
}

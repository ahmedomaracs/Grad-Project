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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-[#E62424] rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
            Rehydrating Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#F8FAFC] font-sans text-slate-900 pb-16 md:pb-0">
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
          <div className="bg-white/95 border border-slate-200 text-slate-800 p-3 rounded-lg text-xs font-mono shadow-xl flex flex-col gap-2 backdrop-blur-md">
            <button 
              onClick={() => {
                logout();
                window.location.href = '/signin';
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-left transition-colors"
            >
              Clear Current Session
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-left transition-colors"
            >
              Hard Factory Reset
            </button>
          </div>
        )}
        <button 
          onClick={() => setShowDev(!showDev)}
          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-md opacity-80 hover:opacity-100 transition-all"
        >
          Dev ⚙️
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminDashboardContent } from '../../components/sections/AdminDashboardContent';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      if (!isAuthenticated || user?.role !== 'Partner') {
        addToast({ type: 'error', title: 'Access Denied', message: 'You must be a Partner to access the Admin panel.' });
        router.push('/signin');
      }
    }
  }, [hydrated, isAuthenticated, user, router, addToast]);

  if (!hydrated || !isAuthenticated || user?.role !== 'Partner') {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9FAFB] items-center justify-center font-sans">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#FB2C36] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] w-full font-sans">
      {/* Top Navigation */}
      <Header />
      
      {/* Main Layout Area */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-[48px]">
          <AdminDashboardContent />
        </main>
      </div>
    </div>
  );
}

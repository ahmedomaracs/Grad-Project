import React from 'react';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { AdminDashboardContent } from '../../components/sections/AdminDashboardContent';

export default function AdminDashboardPage() {
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

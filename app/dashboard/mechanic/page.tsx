'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceLayout } from '../../../components/dashboard/WorkspaceLayout';
import { useRequireRole } from '../../../hooks/useRequireRole';
import { useAuthStore, MechanicBooking, MechanicBookingStatus } from '../../../store/authStore';
import { useLocalDB } from '../../../store/localDB';
import { Button } from '../../../components/ui/Button';
import { Clock, CheckCircle, Package, Calendar, Star, DollarSign, Wrench, TrendingUp, AlertTriangle } from 'lucide-react';

function MechanicDashboardContent() {
  const { isLoading, user } = useRequireRole('Mechanic');
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { updateBookingStatus } = useAuthStore();
  const allBookings = useLocalDB(s => s.globalBookings);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#FF2D2D] rounded-full animate-spin" />
      </div>
    );
  }

  // Account-isolated dynamic data retrieval
  const mechanicBookings = allBookings
    .filter(b => b.mechanicId === user.email || b.mechanicName === user.email)
    .map(b => ({
      id: b.id,
      customerName: b.clientName,
      clientUserId: b.clientUserId,
      vehicle: b.vehicle,
      serviceType: b.serviceType,
      time: b.scheduledAt,
      status: b.status as MechanicBookingStatus,
      partsShipped: false,
    }));

  // Computed values
  const activeBookingsCount = mechanicBookings.filter((b) => b.status === 'Pending' || b.status === 'In-Progress').length;
  const completedTodayCount = 2; // Mocked
  const earnings = 1250.00; // Mocked
  const rating = 4.9; // Mocked

  const renderStatusBadge = (status: MechanicBookingStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold">Pending</span>;
      case 'Confirmed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold">Confirmed</span>;
      case 'Checked-In':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold">Checked-In</span>;
      case 'In-Progress':
        return <span className="px-2 py-1 bg-[#FF2D2D]/10 text-[#FF2D2D] rounded-md text-[10px] font-bold">In-Progress</span>;
      case 'Ready for Pickup':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-bold">Ready for Pickup</span>;
      default:
        return null;
    }
  };

  const handleStatusChange = (id: string, currentStatus: MechanicBookingStatus) => {
    const statusFlow: MechanicBookingStatus[] = ['Pending', 'Confirmed', 'Checked-In', 'In-Progress', 'Ready for Pickup'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      updateBookingStatus(id, statusFlow[currentIndex + 1]);
    }
  };

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Header banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome to the bay, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">
          Here is what's happening at your workshop today.
        </p>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{activeBookingsCount}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{completedTodayCount}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF2D2D]/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#FF2D2D]" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Earnings</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900">${earnings.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Star className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{rating}</div>
        </div>
      </div>

      {/* Bookings Preview */}
      <div className="bg-white rounded-3xl border border-gray-150 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#FF2D2D]" />
          Today's Schedule
        </h3>
        <div className="space-y-4">
          {mechanicBookings.slice(0, 3).map((b) => (
            <div key={b.id} className="flex flex-col sm:flex-row justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-extrabold text-gray-900 text-sm">{b.customerName}</h4>
                  {renderStatusBadge(b.status)}
                  {b.partsShipped && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-[10px] font-bold">
                      <Package className="w-3 h-3" /> Parts Ready
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-bold">{b.vehicle} • {b.serviceType}</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">Scheduled: {b.time}</p>
              </div>
              <div className="flex items-center self-start sm:self-center">
                <Button 
                  variant={b.status === 'Ready for Pickup' ? 'secondary' : 'default'} 
                  className={`h-8 px-4 text-xs font-bold ${b.status !== 'Ready for Pickup' ? 'bg-[#FF2D2D] hover:bg-red-600 text-white border-none' : ''}`}
                  onClick={() => handleStatusChange(b.id, b.status)}
                  disabled={b.status === 'Ready for Pickup'}
                >
                  {b.status === 'Pending' ? 'Accept Booking' : b.status === 'Ready for Pickup' ? 'Finished' : 'Advance Status'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderBookings = () => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Active Bookings</h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">Manage all your upcoming and active jobs.</p>
      </div>
      <div className="bg-white rounded-3xl border border-gray-150 p-6">
        <div className="space-y-4">
          {mechanicBookings.map((b) => (
            <div key={b.id} className="flex flex-col sm:flex-row justify-between p-5 rounded-2xl bg-white border border-gray-200 shadow-sm gap-4 hover:border-[#FF2D2D]/30 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-extrabold text-gray-900 text-base">{b.customerName}</h4>
                  {renderStatusBadge(b.status)}
                  {b.partsShipped && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-[10px] font-bold">
                      <Package className="w-3 h-3" /> Parts Delivered to Shop
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-bold">{b.vehicle}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">Service: {b.serviceType}</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-gray-400">
                  <Clock className="w-4 h-4" />
                  {b.time}
                </div>
              </div>
              <div className="flex items-center self-start sm:self-center">
                <Button 
                  variant={b.status === 'Ready for Pickup' ? 'secondary' : 'default'} 
                  className={`h-10 px-5 text-xs font-bold ${b.status !== 'Ready for Pickup' ? 'bg-[#FF2D2D] hover:bg-red-600 text-white border-none shadow-md shadow-red-500/20' : ''}`}
                  onClick={() => handleStatusChange(b.id, b.status)}
                  disabled={b.status === 'Ready for Pickup'}
                >
                  {b.status === 'Pending' ? 'Accept Booking' : b.status === 'Ready for Pickup' ? 'Completed' : 'Advance Status'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderServices = () => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Services & Leads</h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">Configure your offered services and bid on local customer leads.</p>
      </div>
      <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3">
        <Wrench className="w-12 h-12 text-gray-300" />
        <p className="font-bold text-gray-900">Services Configuration Coming Soon</p>
        <p className="text-xs text-gray-400 max-w-sm">This module will allow you to set custom pricing and dynamically bid on leads.</p>
      </div>
    </motion.div>
  );

  const renderEarnings = () => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Earnings & Payouts</h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">Track your workshop revenue and pending transfers.</p>
      </div>
      <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3">
        <TrendingUp className="w-12 h-12 text-gray-300" />
        <p className="font-bold text-gray-900">Earnings Dashboard Coming Soon</p>
        <p className="text-xs text-gray-400 max-w-sm">Detailed invoice breakdowns and Stripe payout management will be available here.</p>
      </div>
    </motion.div>
  );

  return (
    <WorkspaceLayout>
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <motion.div key="overview">{renderOverview()}</motion.div>}
        {activeTab === 'bookings' && <motion.div key="bookings">{renderBookings()}</motion.div>}
        {activeTab === 'services' && <motion.div key="services">{renderServices()}</motion.div>}
        {activeTab === 'earnings' && <motion.div key="earnings">{renderEarnings()}</motion.div>}
      </AnimatePresence>
    </WorkspaceLayout>
  );
}

export default function MechanicDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#FF2D2D] rounded-full animate-spin" />
      </div>
    }>
      <MechanicDashboardContent />
    </Suspense>
  );
}

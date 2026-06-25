'use client';

import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useRequireRole } from '@/hooks/useRequireRole';
import { useLocalDB, GlobalBooking } from '@/store/localDB';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle, Calendar, Star, DollarSign, ChevronDown } from 'lucide-react';
import Link from 'next/link';

function MechanicDashboardContent() {
  const { isLoading, user } = useRequireRole('Mechanic');
  const allBookings = useLocalDB((s) => s.globalBookings);
  const advanceBookingStatus = useLocalDB((s) => s.advanceBookingStatus);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" />
      </div>
    );
  }

  const mechanicBookings = allBookings.filter(
    (b) => b.mechanicId === user.email || b.mechanicName === user.email
  );

  const activeBookingsCount = mechanicBookings.filter((b) => b.status === 'Pending' || b.status === 'In-Progress').length;
  const completedTodayCount = mechanicBookings.filter((b) => b.status === 'Completed').length;
  
  // Earnings calc based on completed bookings
  const earnings = mechanicBookings
    .filter((b) => b.status === 'Completed')
    .reduce((acc, curr) => acc + (curr.invoice?.laborTotal || 0) + (curr.invoice?.parts?.reduce((pAcc, p) => pAcc + p.price, 0) || 0), 0);
  
  const rating = 4.9;

  const renderStatusBadge = (status: GlobalBooking['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold">Pending</span>;
      case 'Confirmed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold">Confirmed</span>;
      case 'Checked-In':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold">Checked-In</span>;
      case 'In-Progress':
        return <span className="px-2 py-1 bg-[#E12F2F]/10 text-[#E12F2F] rounded-md text-[10px] font-bold">In-Progress</span>;
      case 'Ready for Pickup':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-bold">Ready for Pickup</span>;
      case 'Completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold">Completed</span>;
      default:
        return null;
    }
  };

  const handleStatusChange = (b: GlobalBooking) => {
    const statusFlow: GlobalBooking['status'][] = ['Pending', 'Confirmed', 'Checked-In', 'In-Progress', 'Ready for Pickup', 'Completed'];
    const currentIndex = statusFlow.indexOf(b.status);
    if (currentIndex < statusFlow.length - 1) {
      advanceBookingStatus(b.id, statusFlow[currentIndex + 1], b.clientUserId, b.serviceType);
    }
  };

  return (
    <WorkspaceLayout>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div>
          <h1 className="text-3xl font-display text-gray-900">
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
              <div className="w-8 h-8 rounded-lg bg-[#E12F2F]/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[#E12F2F]" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Earnings</span>
            </div>
            <div className="text-2xl font-extrabold text-gray-900">EGP {earnings.toFixed(2)}</div>
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

        {/* Bookings Timeline Scheduler */}
        <div className="bg-white rounded-3xl border border-gray-150 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E12F2F]" />
              Today's Schedule
            </h3>
            <Link href="/mechanic/bookings">
              <Button variant="outline" className="h-8 text-xs font-bold">View All Jobs</Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {mechanicBookings.length === 0 && (
               <p className="text-sm text-gray-500 font-semibold">No appointments scheduled for today.</p>
            )}
            {mechanicBookings.slice(0, 5).map((b) => {
              const isExpanded = expandedBooking === b.id;
              
              return (
                <div key={b.id} className="flex flex-col p-4 rounded-2xl bg-gray-50 border border-gray-100 gap-4 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 cursor-pointer" onClick={() => setExpandedBooking(isExpanded ? null : b.id)}>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-extrabold text-gray-900 text-sm">{b.clientName}</h4>
                        {renderStatusBadge(b.status)}
                      </div>
                      <p className="text-xs text-gray-500 font-bold">{b.vehicle} • {b.serviceType}</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">Scheduled: {new Date(b.scheduledAt).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setExpandedBooking(isExpanded ? null : b.id)}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </Button>
                      <Button
                        variant={b.status === 'Ready for Pickup' || b.status === 'Completed' ? 'secondary' : 'default'}
                        className={`h-8 px-4 text-xs font-bold ${b.status !== 'Ready for Pickup' && b.status !== 'Completed' ? 'bg-[#E12F2F] hover:bg-red-600 text-white border-none' : ''}`}
                        onClick={() => handleStatusChange(b)}
                        disabled={b.status === 'Completed'}
                      >
                        {b.status === 'Pending' ? 'Accept Booking' : b.status === 'Ready for Pickup' ? 'Finished' : b.status === 'Completed' ? 'Completed' : 'Advance Status'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expandable Service Notes Accordion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-1 border-t border-gray-200">
                          <p className="text-xs font-bold text-gray-700 mb-1">Service Notes:</p>
                          <div className="bg-white p-3 rounded-xl border border-gray-100 text-xs text-gray-600">
                            Customer requested a comprehensive check for {b.serviceType.toLowerCase()}. Parts needed might include replacement components. Ensure to log all inventory used in the <Link href="/mechanic/bookings" className="text-blue-600 underline">Active Jobs Tracker</Link>.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </WorkspaceLayout>
  );
}

export default function MechanicDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" />
      </div>
    }>
      <MechanicDashboardContent />
    </Suspense>
  );
}

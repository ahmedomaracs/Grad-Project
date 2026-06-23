'use client';

import React, { useState, useEffect } from 'react';
import { useLocalDB, GlobalBooking } from '../../../store/localDB';
import { useToastStore } from '../../../store/toastStore';

type ColumnStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'READY_FOR_PICKUP';

interface ServicePriceMap {
  [service: string]: number;
}

const SERVICE_PRICES: ServicePriceMap = {
  'Performance Exhaust Remap': 5400,
  'EV Tuning & Battery Calibration': 8500,
  'Full Oil Flush': 1950,
  'Brake Pad Replacement': 3200,
  'Full Engine Diagnostics': 2500,
  'Suspension Alignment': 2900,
  'Default Service': 1500,
};

export default function AdminBookingsPage() {
  const { globalBookings, advanceBookingStatus, appendBooking } = useLocalDB();
  const addToast = useToastStore((s) => s.addToast);
  const [hydrated, setHydrated] = useState(false);

  // Seed sample bookings if database is empty on load
  useEffect(() => {
    setHydrated(true);
    if (globalBookings.length === 0) {
      // Append some realistic mock bookings to seed the database
      appendBooking({
        clientUserId: 'client_tariq',
        clientName: 'Tariq Al-Fayed',
        mechanicId: 'm1',
        mechanicName: 'Marcus Vance',
        vehicle: 'Porsche 911 GT3 RS (2022)',
        serviceType: 'Performance Exhaust Remap',
        scheduledAt: 'Today, 10:00 AM',
        status: 'Pending',
      });

      appendBooking({
        clientUserId: 'client_ahmad',
        clientName: 'Ahmad Zaki',
        mechanicId: 'm3',
        mechanicName: 'Dinesh Chawla',
        vehicle: 'Mercedes-AMG G63 (2021)',
        serviceType: 'Full Oil Flush',
        scheduledAt: 'Tomorrow, 9:00 AM',
        status: 'Confirmed',
      });

      appendBooking({
        clientUserId: 'client_sarah',
        clientName: 'Sarah Connor',
        mechanicId: 'm2',
        mechanicName: 'Sarah Connor',
        vehicle: 'Audi e-tron GT (2023)',
        serviceType: 'EV Tuning & Battery Calibration',
        scheduledAt: 'Today, 2:30 PM',
        status: 'In-Progress',
      });

      appendBooking({
        clientUserId: 'client_leila',
        clientName: 'Leila Hassan',
        mechanicId: 'm4',
        mechanicName: 'Lena Müller',
        vehicle: 'BMW M4 Competition (2024)',
        serviceType: 'Brake Pad Replacement',
        scheduledAt: 'Today, 8:00 AM',
        status: 'Ready for Pickup',
      });
    }
  }, [globalBookings.length, appendBooking]);

  const getPrice = (serviceType: string): string => {
    const price = SERVICE_PRICES[serviceType] || SERVICE_PRICES['Default Service'] || 1500;
    return `EGP ${price.toLocaleString()}`;
  };

  // Helper to map DB status to Kanban column
  const getColumnForStatus = (status: string): ColumnStatus | null => {
    switch (status) {
      case 'Pending':
        return 'PENDING';
      case 'Confirmed':
        return 'CONFIRMED';
      case 'In-Progress':
      case 'Checked-In':
        return 'IN_PROGRESS';
      case 'Ready for Pickup':
        return 'READY_FOR_PICKUP';
      default:
        return null; // Completed or Cancelled doesn't show in active Kanban board
    }
  };

  // Status progression map
  const advanceStatus = (booking: GlobalBooking) => {
    let nextStatus: GlobalBooking['status'] | null = null;
    let actionLabel = '';

    if (booking.status === 'Pending') {
      nextStatus = 'Confirmed';
      actionLabel = 'confirmed';
    } else if (booking.status === 'Confirmed') {
      nextStatus = 'In-Progress';
      actionLabel = 'started servicing';
    } else if (booking.status === 'In-Progress' || booking.status === 'Checked-In') {
      nextStatus = 'Ready for Pickup';
      actionLabel = 'completed and marked ready';
    } else if (booking.status === 'Ready for Pickup') {
      nextStatus = 'Completed';
      actionLabel = 'marked as picked up and closed';
    }

    if (nextStatus) {
      advanceBookingStatus(booking.id, nextStatus, booking.clientUserId, booking.serviceType);
      addToast({
        type: 'success',
        title: 'Status Advanced',
        message: `Booking #${booking.id.toUpperCase()} has been ${actionLabel}.`,
      });
    }
  };

  const cancelBooking = (booking: GlobalBooking) => {
    advanceBookingStatus(booking.id, 'Cancelled', booking.clientUserId, booking.serviceType);
    addToast({
      type: 'info',
      title: 'Booking Cancelled',
      message: `Booking #${booking.id.toUpperCase()} was cancelled by system administrator.`,
    });
  };

  // Group columns
  const columns: { id: ColumnStatus; label: string; bg: string; border: string; text: string }[] = [
    { id: 'PENDING', label: 'Pending Requests', bg: 'bg-slate-50', border: 'border-slate-200/80', text: 'text-slate-500' },
    { id: 'CONFIRMED', label: 'Confirmed Slots', bg: 'bg-blue-50/20', border: 'border-blue-100', text: 'text-blue-600' },
    { id: 'IN_PROGRESS', label: 'Active Repairs', bg: 'bg-purple-50/20', border: 'border-purple-100', text: 'text-purple-600' },
    { id: 'READY_FOR_PICKUP', label: 'Ready for Pickup', bg: 'bg-green-50/20', border: 'border-green-100', text: 'text-green-600' },
  ];

  if (!hydrated) {
    return (
      <div className="flex flex-col h-96 bg-[#F8FAFC] items-center justify-center font-sans">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* HEADER SECTION */}
      <div>
        <span className="text-[10px] font-black uppercase text-[#E62424] bg-red-50 px-3 py-1 rounded-full tracking-wider">
          Workshop Logistics Control
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 uppercase">Bookings Board</h1>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Active appointments workflow board managing client service allocations.
        </p>
      </div>

      {/* KANBAN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colBookings = globalBookings.filter((b) => getColumnForStatus(b.status) === col.id);
          
          return (
            <div 
              key={col.id} 
              className={`p-6 rounded-[32px] border ${col.bg} ${col.border} min-h-[500px] flex flex-col space-y-4`}
            >
              
              {/* Column Title and Counter */}
              <div className="flex items-center justify-between pb-2">
                <span className={`text-[10px] font-black uppercase tracking-wider ${col.text}`}>
                  {col.label}
                </span>
                <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-900 px-2 py-0.5 rounded-full shadow-sm">
                  {colBookings.length}
                </span>
              </div>

              {/* Column Card Stack */}
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {colBookings.length > 0 ? (
                  colBookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                    >
                      {/* Vehicle & Client Info */}
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] bg-slate-950 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
                            {booking.id.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            {booking.scheduledAt}
                          </span>
                        </div>

                        <h3 className="text-xs font-black text-slate-900 mt-3 uppercase tracking-tight">
                          {booking.vehicle}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          Client: {booking.clientName}
                        </p>
                      </div>

                      {/* Service Spec Card */}
                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                          🔧 {booking.serviceType}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase">
                          Tech: {booking.mechanicName}
                        </p>
                      </div>

                      {/* Pricing and Actions Layout */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Base Rate</p>
                          <p className="text-xs font-black text-slate-900 mt-0.5">
                            {getPrice(booking.serviceType)}
                          </p>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => cancelBooking(booking)}
                            className="p-2 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-[#E62424] rounded-lg transition-colors cursor-pointer text-xs"
                            title="Cancel Booking"
                          >
                            🚫
                          </button>
                          <button
                            onClick={() => advanceStatus(booking)}
                            className="px-2.5 py-1.5 bg-slate-950 hover:bg-[#E62424] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            {col.id === 'READY_FOR_PICKUP' ? 'Release' : 'Advance'}
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="h-40 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-center p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      No active slots
                    </p>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

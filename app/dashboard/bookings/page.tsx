'use client';

import React, { useState, useEffect } from 'react';
import { useLocalDB, GlobalBooking } from '../../../store/localDB';
import { useToastStore } from '../../../store/toastStore';

type ColumnStatus = 'PENDING' | 'WAITING_FOR_REPAIR' | 'UNDER_REPAIR' | 'READY_FOR_PICKUP' | 'CANCELLED';

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
  const {
    globalBookings,
    advanceBookingStatus,
    appendBooking,
    mechanicsRegistry,
    updateBookingInvoice,
  } = useLocalDB();
  const addToast = useToastStore((s) => s.addToast);

  const [hydrated, setHydrated] = useState(false);

  // Drag over columns tracking
  const [isDraggingOverCol, setIsDraggingOverCol] = useState<Record<ColumnStatus, boolean>>({
    PENDING: false,
    WAITING_FOR_REPAIR: false,
    UNDER_REPAIR: false,
    READY_FOR_PICKUP: false,
    CANCELLED: false,
  });

  // Client user directory lookup
  const [users, setUsers] = useState<any[]>([]);

  // Selected booking in modal
  const [selectedBooking, setSelectedBooking] = useState<GlobalBooking | null>(null);

  // Invoice draft editor inside modal
  const [editingInvoice, setEditingInvoice] = useState<{
    parts: Array<{ id: string; name: string; price: number }>;
    laborTotal: number;
    isPaid: boolean;
  } | null>(null);

  // Add Part inputs inside modal
  const [partName, setPartName] = useState('');
  const [partPrice, setPartPrice] = useState<number | ''>('');

  // Seed sample bookings if database is empty on load + load client profiles
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
        status: 'Waiting for Repair',
      });

      appendBooking({
        clientUserId: 'client_sarah',
        clientName: 'Sarah Connor',
        mechanicId: 'm2',
        mechanicName: 'Sarah Connor',
        vehicle: 'Audi e-tron GT (2023)',
        serviceType: 'EV Tuning & Battery Calibration',
        scheduledAt: 'Today, 2:30 PM',
        status: 'Under Repair',
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

    const storedUsers = localStorage.getItem('automate-admin-users-list');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (err) {
        console.error('Error loading users:', err);
      }
    }
  }, [globalBookings.length, appendBooking]);

  // Keep modal view in sync with state changes
  useEffect(() => {
    if (selectedBooking) {
      const updated = globalBookings.find((b) => b.id === selectedBooking.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedBooking)) {
        setSelectedBooking(updated);
      }
    }
  }, [globalBookings]);

  // Look up client details
  const getClientDetails = (booking: GlobalBooking) => {
    const matched = users.find(
      (u) =>
        u.id === booking.clientUserId ||
        u.name.toLowerCase() === booking.clientName.toLowerCase()
    );
    return {
      phone: matched?.phone || '+20 10 9988 7766',
      email: matched?.email || `${booking.clientName.toLowerCase().replace(/\s+/g, '')}@automate.com`,
      role: matched?.role || 'Client',
      status: matched?.status || 'Active',
    };
  };

  // Look up mechanic details
  const getMechanicDetails = (booking: GlobalBooking) => {
    const matched = mechanicsRegistry.find(
      (m) =>
        m.id === booking.mechanicId ||
        m.name.toLowerCase() === booking.mechanicName.toLowerCase()
    );
    return {
      specialization: matched?.specialization || 'General Repair & Diagnostic',
      garage: matched?.garageName || 'Automate Partner Hub',
      rating: matched?.rating || 4.9,
    };
  };

  const openBookingModal = (booking: GlobalBooking) => {
    setSelectedBooking(booking);
    setEditingInvoice(
      booking.invoice || {
        parts: [],
        laborTotal: 0,
        isPaid: false,
      }
    );
    setPartName('');
    setPartPrice('');
  };

  const handleAddPart = () => {
    if (!partName.trim() || partPrice === '' || partPrice <= 0 || !editingInvoice) return;
    const newPart = {
      id: 'part_' + Math.random().toString(36).substr(2, 9),
      name: partName.trim(),
      price: Number(partPrice),
    };
    setEditingInvoice({
      ...editingInvoice,
      parts: [...editingInvoice.parts, newPart],
    });
    setPartName('');
    setPartPrice('');
  };

  const handleRemovePart = (partId: string) => {
    if (!editingInvoice) return;
    setEditingInvoice({
      ...editingInvoice,
      parts: editingInvoice.parts.filter((p) => p.id !== partId),
    });
  };

  const handleSaveInvoice = () => {
    if (!selectedBooking || !editingInvoice) return;
    updateBookingInvoice(selectedBooking.id, editingInvoice);
    addToast({
      type: 'success',
      title: 'Invoice Saved',
      message: `Invoice for booking #${selectedBooking.id.toUpperCase()} has been updated successfully.`,
    });
  };

  const getPrice = (serviceType: string): string => {
    const price = SERVICE_PRICES[serviceType] || SERVICE_PRICES['Default Service'] || 1500;
    return `EGP ${price.toLocaleString()}`;
  };

  const getInvoiceTotal = (booking: GlobalBooking, currentInvoice: typeof editingInvoice) => {
    const basePrice = SERVICE_PRICES[booking.serviceType] || SERVICE_PRICES['Default Service'] || 1500;
    const partsTotal = currentInvoice?.parts.reduce((sum, p) => sum + p.price, 0) || 0;
    const labor = currentInvoice?.laborTotal || 0;
    return basePrice + partsTotal + labor;
  };

  // Helper to map DB status to Kanban column
  const getColumnForStatus = (status: string): ColumnStatus | null => {
    switch (status) {
      case 'Pending':
        return 'PENDING';
      case 'Confirmed':
      case 'Waiting for Repair':
        return 'WAITING_FOR_REPAIR';
      case 'In-Progress':
      case 'Checked-In':
      case 'Under Repair':
        return 'UNDER_REPAIR';
      case 'Ready for Pickup':
        return 'READY_FOR_PICKUP';
      case 'Cancelled':
        return 'CANCELLED';
      default:
        return null; // Completed doesn't show in active Kanban board columns
    }
  };

  // Status progression map
  const advanceStatus = (booking: GlobalBooking) => {
    let nextStatus: GlobalBooking['status'] | null = null;
    let actionLabel = '';

    if (booking.status === 'Pending') {
      nextStatus = 'Waiting for Repair';
      actionLabel = 'marked as waiting for repair';
    } else if (booking.status === 'Confirmed' || booking.status === 'Waiting for Repair') {
      nextStatus = 'Under Repair';
      actionLabel = 'started repair';
    } else if (booking.status === 'In-Progress' || booking.status === 'Checked-In' || booking.status === 'Under Repair') {
      nextStatus = 'Ready for Pickup';
      actionLabel = 'completed and marked ready for pickup';
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

  const handleModalAdvance = () => {
    if (!selectedBooking) return;
    advanceStatus(selectedBooking);
  };

  const handleModalCancel = () => {
    if (!selectedBooking) return;
    cancelBooking(selectedBooking);
    setSelectedBooking(null);
  };

  const STATUS_MAP: Record<ColumnStatus, GlobalBooking['status']> = {
    PENDING: 'Pending',
    WAITING_FOR_REPAIR: 'Waiting for Repair',
    UNDER_REPAIR: 'Under Repair',
    READY_FOR_PICKUP: 'Ready for Pickup',
    CANCELLED: 'Cancelled',
  };

  const handleDragStart = (e: React.DragEvent, bookingId: string) => {
    e.dataTransfer.setData('text/plain', bookingId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: ColumnStatus) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, colId: ColumnStatus) => {
    e.preventDefault();
    setIsDraggingOverCol((prev) => ({ ...prev, [colId]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, colId: ColumnStatus) => {
    e.preventDefault();
    setIsDraggingOverCol((prev) => ({ ...prev, [colId]: false }));
  };

  const handleDrop = (e: React.DragEvent, colId: ColumnStatus) => {
    e.preventDefault();
    setIsDraggingOverCol((prev) => ({ ...prev, [colId]: false }));

    const bookingId = e.dataTransfer.getData('text/plain');
    const booking = globalBookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const targetStatus = STATUS_MAP[colId];
    if (booking.status !== targetStatus) {
      advanceBookingStatus(booking.id, targetStatus, booking.clientUserId, booking.serviceType);
      addToast({
        type: 'success',
        title: 'Booking Relocated',
        message: `Booking #${booking.id.toUpperCase()} moved to "${targetStatus}".`,
      });
    }
  };

  // Group columns
  const columns: { id: ColumnStatus; label: string; bg: string; border: string; text: string }[] = [
    { id: 'PENDING', label: 'Pending', bg: 'bg-slate-50', border: 'border-slate-200/80', text: 'text-slate-500' },
    { id: 'WAITING_FOR_REPAIR', label: 'Waiting for Repair', bg: 'bg-blue-50/20', border: 'border-blue-100', text: 'text-blue-600' },
    { id: 'UNDER_REPAIR', label: 'Under Repair', bg: 'bg-purple-50/20', border: 'border-purple-100', text: 'text-purple-600' },
    { id: 'READY_FOR_PICKUP', label: 'Ready for Pickup', bg: 'bg-green-50/20', border: 'border-green-100', text: 'text-green-600' },
    { id: 'CANCELLED', label: 'Cancelled', bg: 'bg-red-50/20', border: 'border-red-100', text: 'text-[#E62424]' },
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
      <div className="flex gap-6 overflow-x-auto pb-6 items-start min-w-full scrollbar-thin">
        {columns.map((col) => {
          const colBookings = globalBookings.filter((b) => getColumnForStatus(b.status) === col.id);

          return (
            <div
              key={col.id}
              className={`flex-1 min-w-[270px] shrink-0 p-5 rounded-[28px] border ${col.bg} ${col.border} min-h-[550px] flex flex-col space-y-4 transition-all duration-300 ${isDraggingOverCol[col.id]
                ? 'ring-2 ring-slate-900 border-transparent bg-slate-100/50 scale-[1.01]'
                : ''
                }`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragEnter={(e) => handleDragEnter(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
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
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, booking.id)}
                      onClick={() => openBookingModal(booking)}
                      className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-grab active:cursor-grabbing select-none animate-fade-in"
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

                        <h3 className="text-xs font-black text-slate-900 mt-3 uppercase tracking-tight font-sans">
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
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelBooking(booking);
                            }}
                            className="p-2 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-[#E62424] rounded-lg transition-colors cursor-pointer text-xs"
                            title="Cancel Booking"
                          >
                            🚫
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceStatus(booking);
                            }}
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

      {/* BOOKING DETAILS & BILLING MODAL */}
      {selectedBooking && editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

          {/* Modal Container */}
          <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-900 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                    Booking ID: {selectedBooking.id.toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${selectedBooking.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200/50' :
                    selectedBooking.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border border-blue-200/50' :
                      selectedBooking.status === 'In-Progress' || selectedBooking.status === 'Checked-In' ? 'bg-purple-50 text-purple-600 border border-purple-200/50' :
                        selectedBooking.status === 'Ready for Pickup' ? 'bg-green-50 text-green-600 border border-green-200/50' :
                          'bg-slate-100 text-slate-600 border border-slate-200/50'
                    }`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-1">
                  Appointment Details
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors font-black text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body - Split View */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left Column: Client & Vehicle Details */}
              <div className="space-y-6">

                {/* Client Profile */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Client Information
                  </h4>
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">Name</p>
                      <p className="text-sm font-black text-slate-900 uppercase">{selectedBooking.clientName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">Phone</p>
                      <p className="text-xs font-bold text-slate-700 font-mono">{getClientDetails(selectedBooking).phone}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">Email Address</p>
                      <p className="text-xs font-bold text-slate-700">{getClientDetails(selectedBooking).email}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Slot */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Vehicle & Appointment Schedule
                  </h4>
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">Vehicle Model</p>
                      <p className="text-xs font-black text-slate-900 uppercase">{selectedBooking.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">Scheduled Time</p>
                      <p className="text-xs font-bold text-slate-700 uppercase">{selectedBooking.scheduledAt}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Technician */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Assigned Technician
                  </h4>
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400">Technician</p>
                        <p className="text-xs font-black text-slate-900 uppercase">{selectedBooking.mechanicName}</p>
                      </div>
                      <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                        ⭐ {getMechanicDetails(selectedBooking).rating}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">Specialization</p>
                      <p className="text-xs font-semibold text-slate-700">{getMechanicDetails(selectedBooking).specialization}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400">Workshop Garage</p>
                      <p className="text-xs font-semibold text-slate-700 uppercase">{getMechanicDetails(selectedBooking).garage}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Invoicing & Invoice Ledger */}
              <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Invoicing & Financial Settlement
                  </h4>

                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-5">

                    {/* Core Rate */}
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">Service Base Rate</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{selectedBooking.serviceType}</p>
                      </div>
                      <span className="text-xs font-black text-slate-900">{getPrice(selectedBooking.serviceType)}</span>
                    </div>

                    {/* Parts Breakdown */}
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Parts & Materials</p>

                      {editingInvoice.parts.length > 0 ? (
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {editingInvoice.parts.map((p) => (
                            <div key={p.id} className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200/50 text-[11px]">
                              <span className="font-bold text-slate-800 uppercase">{p.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-950">EGP {p.price.toLocaleString()}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePart(p.id)}
                                  className="text-slate-400 hover:text-red-500 font-bold px-1 cursor-pointer transition-colors"
                                  title="Remove part"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic font-medium">No parts cataloged on this ticket.</p>
                      )}

                      {/* Add Part Form */}
                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          placeholder="PART NAME"
                          value={partName}
                          onChange={(e) => setPartName(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase placeholder-slate-400 focus:outline-none focus:border-slate-900"
                        />
                        <input
                          type="number"
                          placeholder="PRICE (EGP)"
                          value={partPrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPartPrice(val === '' ? '' : parseFloat(val) || 0);
                          }}
                          className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold placeholder-slate-400 focus:outline-none focus:border-slate-900"
                        />
                        <button
                          type="button"
                          onClick={handleAddPart}
                          className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Labor Total */}
                    <div className="pt-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                        Labor Surcharge (EGP)
                      </label>
                      <input
                        type="number"
                        value={editingInvoice.laborTotal}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setEditingInvoice({
                            ...editingInvoice,
                            laborTotal: val,
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    {/* Payment Status Checkbox */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400">Payment Status</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-0.5">Toggle customer invoice payment node</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingInvoice({
                            ...editingInvoice,
                            isPaid: !editingInvoice.isPaid,
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors cursor-pointer ${editingInvoice.isPaid
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : 'bg-red-50 border-red-200 text-[#E62424]'
                          }`}
                      >
                        {editingInvoice.isPaid ? '✓ Paid' : '✗ Unpaid'}
                      </button>
                    </div>

                    {/* Calculations Summary */}
                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">Calculated Total</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Includes parts + labor + base rate</p>
                      </div>
                      <span className="text-sm font-black text-[#E62424]">
                        EGP {getInvoiceTotal(selectedBooking, editingInvoice).toLocaleString()}
                      </span>
                    </div>

                    {/* Save Button */}
                    <button
                      type="button"
                      onClick={handleSaveInvoice}
                      className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer mt-2"
                    >
                      Save Financial Invoice Updates
                    </button>

                  </div>
                </div>
              </div>

            </div>

            {/* Footer Action Bar */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleModalCancel}
                className="px-4 py-3 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-[#E62424] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                🚫 Cancel Booking
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Close Panel
                </button>

                {selectedBooking.status !== 'Completed' && selectedBooking.status !== 'Cancelled' && (
                  <button
                    type="button"
                    onClick={handleModalAdvance}
                    className="px-4 py-3 bg-slate-950 hover:bg-[#E62424] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    {selectedBooking.status === 'Ready for Pickup' ? 'Release Vehicle' : 'Advance Workflow Status'}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

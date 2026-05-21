'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Wrench, Sparkles, Star, Heart, MapPin, Calendar, Clock, DollarSign, X } from 'lucide-react';
import { WorkspaceLayout } from '../../components/dashboard/WorkspaceLayout';
import { useAuthStore, Mechanic } from '../../store/authStore';
import { Button } from '../../components/ui/Button';

const SPECIALTIES = [
  'All',
  'Engine Diagnostics',
  'Brake Systems',
  'EV Tuning',
  'Battery Calibration',
  'Classic & Performance Care',
  'Suspension Alignment',
];

export default function MechanicsPage() {
  const { mechanics, toggleFavoriteMechanic, addTransaction, addNotification } = useAuthStore();

  const [search, setSearch] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState('All');
  const [bookingMech, setBookingMech] = useState<Mechanic | null>(null);

  // Booking details
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingService, setBookingService] = useState('Standard Diagnostics');

  // Filter mechanics
  const filteredMechanics = useMemo(() => {
    return mechanics.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.garageName.toLowerCase().includes(search.toLowerCase());
      
      const matchesSpecialty =
        activeSpecialty === 'All' ||
        m.specialties.includes(activeSpecialty);

      return matchesSearch && matchesSpecialty;
    });
  }, [mechanics, search, activeSpecialty]);

  const handleConfirmBooking = () => {
    if (!bookingMech || !bookingDate || !bookingTime) return;

    addTransaction('booking', `Booking Confirmed: ${bookingMech.name}`, -49.00);
    addNotification(
      'Service Appointment Confirmed 📅',
      `Registered standard ${bookingService} with ${bookingMech.name} for ${bookingDate} at ${bookingTime}.`,
      'booking'
    );

    setBookingMech(null);
    setBookingDate('');
    setBookingTime('');
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-8 select-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Apex Mechanics</h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">Book certified vetted diagnostics and repairs near you.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Vetted certified standard
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="relative">
          <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl px-5 h-14 shadow-sm">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search garage name, mechanics specialty or technician name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-sm font-semibold outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {SPECIALTIES.map((spec) => {
            const isActive = activeSpecialty === spec;
            return (
              <button
                key={spec}
                onClick={() => setActiveSpecialty(spec)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FF2D2D] text-white shadow-md shadow-[#FF2D2D]/35'
                    : 'bg-white border border-gray-250 text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>

        {/* Mechanics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMechanics.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
              >
                {/* Favorites button */}
                <button
                  onClick={() => toggleFavoriteMechanic(m.id)}
                  className="absolute right-4 top-4 w-9 h-9 rounded-xl bg-white/80 border border-gray-250 flex items-center justify-center text-[#FF2D2D] z-10 hover:scale-105 transition-transform"
                >
                  <Heart className={`w-4.5 h-4.5 ${m.isFavorite ? 'fill-current' : 'text-gray-400'}`} />
                </button>

                {/* Profile Header */}
                <div className="flex items-center gap-4.5 mb-5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative">
                    <img src={m.avatar} alt={m.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">{m.name}</h3>
                    <p className="text-xs text-gray-400 font-bold leading-none mt-1">{m.garageName}</p>
                  </div>
                </div>

                {/* Specialties tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {m.specialties.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-150 text-gray-500 text-[10px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-2 border-t border-gray-50 pt-4 mb-5 text-xs text-gray-500 font-semibold">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {m.rating} ({m.reviewsCount} reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4.5 h-4.5 text-[#FF2D2D]" />
                      {m.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {m.distance}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold ${
                      m.available ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {m.available ? 'Available' : 'Booked Out'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setBookingMech(m)}
                    className="flex-1 h-10 bg-[#FF2D2D] hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/20 border-none"
                  >
                    Instant Book
                  </Button>
                  <Link href={`/mechanics/${m.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full h-10 rounded-xl text-xs font-bold">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Booking Drawer dialog modal */}
      <AnimatePresence>
        {bookingMech && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingMech(null)}
              className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 top-1/4 sm:top-1/3 max-w-md mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-150 p-6 z-55"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">Instant Service Reservation</h3>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">Booking with {bookingMech.name}</p>
                </div>
                <button
                  onClick={() => setBookingMech(null)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Select Service Type</label>
                  <select
                    value={bookingService}
                    onChange={(e) => setBookingService(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors cursor-pointer"
                  >
                    <option value="Diagnostics Inspection">Diagnostics Session ($49.00)</option>
                    <option value="Complete Engine Cleanse">Complete Engine Cleanse ($99.00)</option>
                    <option value="Advanced Brake System Tune">Advanced Brakes System Tune ($149.00)</option>
                    <option value="Performance Tuning">Custom Performance Mapping ($299.00)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Choose Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Choose Time</label>
                    <input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={!bookingDate || !bookingTime}
                    fullWidth
                    className="h-12 bg-[#FF2D2D] text-white hover:bg-red-600 font-bold"
                  >
                    Confirm Appointment
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </WorkspaceLayout>
  );
}

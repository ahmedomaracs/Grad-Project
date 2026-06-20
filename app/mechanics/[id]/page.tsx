'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Award, 
  Check, 
  ThumbsUp, 
  DollarSign, 
  Heart,
  X
} from 'lucide-react';
import { WorkspaceLayout } from '../../../components/dashboard/WorkspaceLayout';
import { useAuthStore, Mechanic } from '../../../store/authStore';
import { Button } from '../../../components/ui/Button';

// Mock Certifications list
const CERTIFICATIONS = [
  'ASE Master Technician Certification',
  'Porsche Gold Certified Specialist',
  'Advanced Hybrid/EV Diagnostic Credentials',
  'TÜV SÜD High-Performance Systems License',
];

// Mock Review entries
const REVIEWS = [
  { name: 'Khaled Jamil', rating: 5, date: 'May 14, 2026', text: 'Marcus did a phenomenal diagnostic map on my Porsche 911. Extremely precise!' },
  { name: 'Nour El-Din', rating: 4.8, date: 'May 08, 2026', text: 'Apex Precision has outstanding high-end diagnostic gear. Recommended.' },
];

export default function MechanicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const mechanicId = resolvedParams.id;

  const { mechanics, toggleFavoriteMechanic, addTransaction, addNotification } = useAuthStore();

  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingService, setBookingService] = useState('Standard Diagnostics');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Locate technician in store
    const found = mechanics.find((m) => m.id === mechanicId);
    if (found) {
      setMechanic(found);
    }
  }, [mechanicId, mechanics]);

  if (!mechanic) {
    return (
      <WorkspaceLayout>
        <div className="py-24 text-center">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Technician Not Found</p>
          <Link href="/mechanics" className="mt-4 inline-block text-[#E12F2F] hover:underline font-bold">
            Back to Directory
          </Link>
        </div>
      </WorkspaceLayout>
    );
  }

  const handleBookSession = () => {
    if (!bookingDate || !bookingTime) return;

    addTransaction('booking', `Booking Prep: ${mechanic.name}`, -49.00);
    addNotification(
      'Service Booked 🚀',
      `Diagnostics session registered on ${bookingDate} at ${bookingTime} with ${mechanic.name}.`,
      'booking'
    );
    setBookingSuccess(true);
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-8 select-none max-w-5xl mx-auto">
        {/* Back navigation */}
        <Link href="/mechanics" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#E12F2F] transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Mechanics</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#E12F2F]/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between relative z-10">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden relative flex-shrink-0">
                <img src={mechanic.avatar} alt={mechanic.name} className="object-cover w-full h-full" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-none">{mechanic.name}</h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                    Active Vetted
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-400 mt-1">{mechanic.garageName}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-semibold flex-wrap">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {mechanic.rating} ({mechanic.reviewsCount} reviews)
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {mechanic.distance}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-gray-900 font-extrabold">
                    <DollarSign className="w-4 h-4 text-[#E12F2F]" />
                    {mechanic.price} Standard Rate
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleFavoriteMechanic(mechanic.id)}
              className="w-11 h-11 bg-gray-50 hover:bg-red-50 border border-gray-200 text-[#E12F2F] rounded-xl flex items-center justify-center hover:scale-105 transition-all self-start md:self-auto"
            >
              <Heart className={`w-5 h-5 ${mechanic.isFavorite ? 'fill-current' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Detail grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Details column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Certifications Card */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#E12F2F]" />
                Professional Certifications
              </h3>
              <ul className="space-y-3">
                {CERTIFICATIONS.map((cert) => (
                  <li key={cert} className="flex gap-2.5 items-start text-xs font-semibold text-gray-500">
                    <ShieldCheck className="w-4.5 h-4.5 text-green-500 flex-shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specialties Card */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Core Specialist Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {mechanic.specialties.map((spec) => (
                  <span key={spec} className="px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-250 text-gray-600 text-xs font-bold shadow-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews list */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-5">Customer Endorsements</h3>
              <div className="space-y-5 divide-y divide-gray-50">
                {REVIEWS.map((rev, idx) => (
                  <div key={idx} className="pt-5 first:pt-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-extrabold text-sm text-gray-900">{rev.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Calendar picker column */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm sticky top-24">
              <AnimatePresence mode="wait">
                {!bookingSuccess ? (
                  <motion.div
                    key="booking-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-lg leading-snug">Reserve Slot</h3>
                      <p className="text-xs text-gray-400 font-semibold mt-1">Book Apex-vetted workshop diagnostics.</p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Service Type</label>
                        <select
                          value={bookingService}
                          onChange={(e) => setBookingService(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#E12F2F]/40 cursor-pointer"
                        >
                          <option value="Diagnostics Inspection">Diagnostics Session ($49.00)</option>
                          <option value="Performance Tuning">Custom Calibration ($299.00)</option>
                          <option value="Brake Pad Bleeding">Brake Bleed Upgrade ($149.00)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Choose Date</label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#E12F2F]/40"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Choose Time</label>
                        <input
                          type="time"
                          required
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#E12F2F]/40"
                        />
                      </div>

                      <div className="pt-2">
                        <Button
                          onClick={handleBookSession}
                          disabled={!bookingDate || !bookingTime}
                          fullWidth
                          size="lg"
                          className="h-12 bg-[#E12F2F] text-white hover:bg-red-600 shadow-md shadow-red-500/25 border-none font-bold text-sm"
                        >
                          Book Appointment ($49)
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="booking-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-lg leading-snug">Booking Confirmed!</h3>
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed mt-2">
                        Your service appointment has been confirmed for {bookingDate} at {bookingTime} with {mechanic.name}.
                      </p>
                    </div>
                    <div className="pt-4 flex gap-2">
                      <Button
                        onClick={() => router.push('/dashboard')}
                        fullWidth
                        className="h-10 bg-gray-900 text-white rounded-xl text-xs font-bold border-none"
                      >
                        Go to Overview
                      </Button>
                      <Button
                        onClick={() => setBookingSuccess(false)}
                        variant="secondary"
                        className="h-10 rounded-xl text-xs font-bold flex-1"
                      >
                        Book Another
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

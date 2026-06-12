'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Wrench, 
  ShoppingBag, 
  Wallet, 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  CreditCard,
  CheckCircle,
  Clock,
  Truck,
  Heart,
  Calendar,
  X,
  Gauge
} from 'lucide-react';
import { WorkspaceLayout } from '../../components/dashboard/WorkspaceLayout';

import { useAuthStore, Vehicle, Mechanic, Order } from '../../store/authStore';
import { useLocalDB } from '../../store/localDB';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';

// Vehicle validation schema
const vehicleSchema = z.object({
  brand: z.string().min(2, 'Make / Brand is required (min 2 chars)'),
  model: z.string().min(1, 'Model name is required'),
  year: z.any(),
  mileage: z.any(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

// Booking validation schema
const bookingSchema = z.object({
  service: z.string().min(1, 'Service type is required'),
  date: z.any(),
  time: z.any(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function DashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab');
  const router = useRouter();

  // Store connection
  const { 
    user, 
    vehicles, 
    orders, 
    transactions, 
    walletBalance, 
    addVehicle, 
    removeVehicle,
    toggleFavoriteMechanic,
    addTransaction,
    addNotification,
    bookMechanic,
    mechanics,
  } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  // Add Vehicle Form modal state
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  
  // Add Vehicle Form hook
  const {
    register: registerVehicle,
    handleSubmit: handleSubmitVehicle,
    reset: resetVehicle,
    formState: { errors: vehicleErrors }
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: '',
      model: '',
      year: 2023,
      mileage: 12000,
    }
  });

  // Wallet deposit state
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  // Mechanic Booking state
  const [bookingMech, setBookingMech] = useState<Mechanic | null>(null);
  const [isBookingMech, setIsBookingMech] = useState(false);

  // Mechanic Booking hook
  const {
    register: registerBooking,
    handleSubmit: handleSubmitBooking,
    reset: resetBooking,
    formState: { errors: bookingErrors }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: 'Standard Diagnostics',
      date: '',
      time: '',
    }
  });

  // Add dynamic animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (idx: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
    })
  };

  const onAddVehicleSubmit = async (data: VehicleFormValues) => {
    setIsAddingVehicle(true);
    await new Promise(r => setTimeout(r, 800));
    setIsAddingVehicle(false);

    addVehicle({
      brand: data.brand,
      model: data.model,
      year: Number(data.year),
      mileage: Number(data.mileage),
      status: 'Perfect',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=80'
    });

    resetVehicle();
    setShowAddVehicleModal(false);

    // Alert
    addNotification('Vehicle Added 🏎️', `${data.brand} ${data.model} has been parked inside your garage workspace.`, 'system');
    addToast({ type: 'success', title: 'Vehicle Added', message: `${data.brand} ${data.model} is now in your garage.` });
  };

  const handleDeposit = async () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    setIsDepositing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsDepositing(false);

    addTransaction('deposit', 'Stripe Balance Add', amt);
    addNotification('Funds Received 💰', `$${amt.toFixed(2)} has been loaded into your Automate Wallet.`, 'system');
    setDepositAmount('');
  };

  const onBookingSubmit = async (data: BookingFormValues) => {
    if (!bookingMech) return;

    setIsBookingMech(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsBookingMech(false);

    const dateTime = `${data.date}, ${data.time}`;
    const vehicleLabel = vehicles[0]
      ? `${vehicles[0].brand} ${vehicles[0].model} (${vehicles[0].year})`
      : 'My Vehicle';

    // Task B: cross-role event — creates MechanicBooking + notifies Mechanic
    bookMechanic(
      bookingMech.id,
      bookingMech.id + '@automate.com', // mechanicUserId: stable key per mechanic
      user?.email ?? 'client@automate.com',
      user?.name ?? 'Client',
      vehicleLabel,
      data.service,
      dateTime
    );

    // Client-side feedback
    addTransaction('booking', `Booking Prep: ${bookingMech.name}`, -49.00);
    addNotification('Appointment Confirmed 🔧', `Diagnostic slot registered on ${data.date} at ${data.time} with ${bookingMech.name}.`, 'booking');
    addToast({ type: 'success', title: 'Booking Confirmed!', message: `Appointment scheduled with ${bookingMech.name}.` });

    setBookingMech(null);
    resetBooking();
  };

  // If tab=wallet is requested, render the full wallet dashboard widget, else overview
  return (
    <WorkspaceLayout>
      <AnimatePresence>
        {activeTab === 'wallet' ? (
          /* ── WALLET INTERFACE ── */
          <motion.div
            key="wallet-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Wallet</h1>
              <p className="text-sm text-gray-500 font-semibold mt-1">Manage deposits, automated billing and repairs payouts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Bal Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-[#111] to-[#222] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
                <div className="absolute top-[-50%] left-[-20%] w-[120%] h-[150%] bg-[radial-gradient(ellipse_at_center,_#FF2D2D_0%,_transparent_55%)] opacity-35 blur-[80px] pointer-events-none" />
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest">Available Balance</p>
                      <h2 className="text-4xl font-extrabold tracking-tight mt-2">${walletBalance.toFixed(2)}</h2>
                    </div>
                    <CreditCard className="w-8 h-8 text-[#FF2D2D]" />
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="100.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="flex-1 h-11 px-4 rounded-xl border border-white/10 bg-white/5 text-sm font-bold outline-none focus:border-[#FF2D2D]/60 transition-colors"
                      />
                      <Button
                        onClick={handleDeposit}
                        disabled={isDepositing}
                        className="h-11 bg-[#FF2D2D] hover:bg-red-600 shadow-md shadow-red-500/25 border-none"
                      >
                        {isDepositing ? 'Adding...' : 'Deposit'}
                      </Button>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold block">
                      Guaranteed secure 256-bit SSL checkout processing via Stripe.
                    </span>
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-150 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>
                <div className="space-y-4 divide-y divide-gray-50">
                  {transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between pt-4 first:pt-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          t.type === 'deposit' 
                            ? 'bg-green-500/10 text-green-500' 
                            : t.type === 'booking' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {t.type === 'deposit' ? '+$' : t.type === 'booking' ? 'W' : 'S'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{t.title}</p>
                          <span className="text-[10px] text-gray-400 font-bold">{t.date}</span>
                        </div>
                      </div>
                      <span className={`text-sm font-extrabold ${t.amount >= 0 ? 'text-green-500' : 'text-gray-900'}`}>
                        {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── OVERVIEW PANELS ── */
          <motion.div
            key="overview-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header banner */}
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Welcome back, {user?.name.split(' ')[0] || 'Ahmed'}!
              </h1>
              <p className="text-sm text-gray-500 font-semibold mt-1">
                Manage your garage, diagnostic bookings, and commerce orders all in one place.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'Book a Mechanic',
                  desc: 'Vetted performance diagnostics & maintenance specialists at your location.',
                  btnLabel: 'Browse Mechanics',
                  href: '/mechanics',
                  icon: Wrench,
                  accent: 'bg-[#FF2D2D]/10 border-[#FF2D2D]/20 text-[#FF2D2D] hover:bg-[#FF2D2D] hover:text-white',
                },
                {
                  title: 'Shop Spare Parts',
                  desc: 'Order genuine ceramic brakes, high-flow air filters, LED headlamps, and tires.',
                  btnLabel: 'Browse Shop',
                  href: '/shop',
                  icon: ShoppingBag,
                  accent: 'bg-[#FF2D2D]/10 border-[#FF2D2D]/20 text-[#FF2D2D] hover:bg-[#FF2D2D] hover:text-white',
                },
              ].map((act, i) => (
                <motion.div
                  key={act.title}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="bg-white border border-gray-150 rounded-3xl p-6 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF2D2D]/10 to-transparent border border-[#FF2D2D]/20 flex items-center justify-center text-[#FF2D2D] flex-shrink-0">
                      <act.icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-[#FF2D2D] transition-colors">
                        {act.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-semibold mt-1 leading-relaxed">
                        {act.desc}
                      </p>
                    </div>
                  </div>
                  <Link href={act.href} className="self-start">
                    <Button variant="secondary" className="px-6 h-10 font-bold text-xs">
                      {act.btnLabel}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Garage Widget */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#FF2D2D]" />
                    My Garage
                  </h3>
                  <span className="text-xs text-gray-400 font-bold block mt-1">
                    {vehicles.length} Active {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddVehicleModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 h-9 bg-gray-100 hover:bg-[#FF2D2D]/10 hover:text-[#FF2D2D] text-xs font-bold rounded-xl border border-gray-250 hover:border-[#FF2D2D]/40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Car
                </motion.button>
              </div>

              {vehicles.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <Car className="w-12 h-12 text-gray-300" />
                  <p className="font-bold text-gray-900">Your garage is empty</p>
                  <p className="text-xs text-gray-400 max-w-xs">Add your vehicle model, year, and mileage to unlock smart service scheduling.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vehicles.map((v) => (
                    <div key={v.id} className="flex gap-4 p-4 bg-gray-50 border border-gray-150 rounded-2xl relative overflow-hidden group">
                      {v.image && (
                        <div className="w-20 sm:w-28 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-100">
                          <img src={v.image} alt={v.model} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] font-bold text-[#FF2D2D] uppercase tracking-widest">{v.brand}</span>
                        <h4 className="font-bold text-gray-900 text-sm truncate mt-0.5">{v.model}</h4>
                        <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5 text-gray-400" />
                            {v.mileage.toLocaleString()} mi
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold self-start mt-1 ${
                            v.status === 'Perfect' 
                              ? 'bg-green-500/10 text-green-500' 
                              : v.status === 'Needs Attention' 
                              ? 'bg-amber-500/10 text-amber-500' 
                              : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {v.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          removeVehicle(v.id);
                          addNotification('Vehicle Removed ❌', `${v.brand} has been removed from your account.`, 'system');
                        }}
                        className="absolute right-3 top-3 w-7 h-7 bg-white/80 hover:bg-red-50 border border-gray-150 hover:border-red-200 text-gray-400 hover:text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mechanics & Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fav Mechanics */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Heart className="w-5 h-5 fill-[#FF2D2D] text-[#FF2D2D]" />
                    Favorite Mechanics
                  </h3>
                  <div className="space-y-4">
                    {mechanics.filter(m => m.isFavorite).map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{m.garageName}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBookingMech(m)}
                            className="h-8 px-3 rounded-lg bg-[#FF2D2D] hover:bg-red-600 text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Book Slot
                          </button>
                          <button
                            onClick={() => toggleFavoriteMechanic(m.id)}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-250 flex items-center justify-center text-[#FF2D2D]"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/mechanics" className="block mt-6">
                  <span className="text-xs font-bold text-[#FF2D2D] hover:underline flex items-center gap-1.5 cursor-pointer">
                    Browse All Certified Vetted Mechanics →
                  </span>
                </Link>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#FF2D2D]" />
                    Recent Orders
                  </h3>
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-5 h-5 text-gray-300" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight">{o.productName}</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">{o.brand} · ${o.price}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          o.status === 'Delivered' 
                            ? 'bg-green-500/10 text-green-500' 
                            : o.status === 'In Transit' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {o.status === 'Delivered' ? <CheckCircle className="w-3 h-3" /> : o.status === 'In Transit' ? <Truck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/shop" className="block mt-6">
                  <span className="text-xs font-bold text-[#FF2D2D] hover:underline flex items-center gap-1.5 cursor-pointer">
                    Browse OEM Genuine Parts Store →
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ADD VEHICLE MODAL ── */}
      <AnimatePresence>
        {showAddVehicleModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddVehicleModal(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 top-1/4 sm:top-1/3 max-w-md mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-150 p-6 z-55 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-gray-900 text-lg">Add New Vehicle</h3>
                <button
                  onClick={() => setShowAddVehicleModal(false)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleSubmitVehicle(onAddVehicleSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Make / Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Porsche"
                    disabled={isAddingVehicle}
                    {...registerVehicle('brand')}
                    className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                      vehicleErrors.brand ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                    }`}
                  />
                  {vehicleErrors.brand && <p className="text-[10px] font-bold text-red-500 mt-1">{vehicleErrors.brand.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Model Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Taycan Turbo S"
                    disabled={isAddingVehicle}
                    {...registerVehicle('model')}
                    className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                      vehicleErrors.model ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                    }`}
                  />
                  {vehicleErrors.model && <p className="text-[10px] font-bold text-red-500 mt-1">{vehicleErrors.model.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Year</label>
                    <input
                      type="number"
                      placeholder="e.g. 2023"
                      disabled={isAddingVehicle}
                      {...registerVehicle('year')}
                      className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                        vehicleErrors.year ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                      }`}
                    />
                    {vehicleErrors.year && <p className="text-[10px] font-bold text-red-500 mt-1">{String(vehicleErrors.year.message)}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Current Mileage</label>
                    <input
                      type="number"
                      placeholder="e.g. 12000"
                      disabled={isAddingVehicle}
                      {...registerVehicle('mileage')}
                      className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                        vehicleErrors.mileage ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                      }`}
                    />
                    {vehicleErrors.mileage && <p className="text-[10px] font-bold text-red-500 mt-1">{String(vehicleErrors.mileage.message)}</p>}
                  </div>
                </div>
                <div className="pt-4">
                  <Button type="submit" fullWidth disabled={isAddingVehicle} className="h-12 bg-[#FF2D2D] text-white hover:bg-red-600 font-bold">
                    {isAddingVehicle ? 'Adding Vehicle...' : 'Park Vehicle In Garage'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MECHANIC BOOKING DIALOG ── */}
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
                  <h3 className="font-extrabold text-gray-900 text-lg">Book Service Session</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">Booking with {bookingMech.name}</p>
                </div>
                <button
                  onClick={() => setBookingMech(null)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmitBooking(onBookingSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Service Type</label>
                  <select
                    {...registerBooking('service')}
                    disabled={isBookingMech}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <option value="Standard Diagnostics">Diagnostic Session ($49.00)</option>
                    <option value="Full Engine Oil Flush">Full Oil Flush ($99.00)</option>
                    <option value="Brake System Bleeding">Brakes Calibrations ($149.00)</option>
                    <option value="Custom Performance Remap">Performance Mapping ($299.00)</option>
                  </select>
                  {bookingErrors.service && <p className="text-[10px] font-bold text-red-500 mt-1">{bookingErrors.service.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Select Date</label>
                    <input
                      type="date"
                      {...registerBooking('date')}
                      disabled={isBookingMech}
                      className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                        bookingErrors.date ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                      }`}
                    />
                    {bookingErrors.date && <p className="text-[10px] font-bold text-red-500 mt-1">{String(bookingErrors.date.message)}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Select Time</label>
                    <input
                      type="time"
                      {...registerBooking('time')}
                      disabled={isBookingMech}
                      className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                        bookingErrors.time ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                      }`}
                    />
                    {bookingErrors.time && <p className="text-[10px] font-bold text-red-500 mt-1">{String(bookingErrors.time.message)}</p>}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    fullWidth
                    disabled={isBookingMech}
                    className="h-12 bg-[#FF2D2D] text-white hover:bg-red-600 font-bold"
                  >
                    {isBookingMech ? 'Processing Payment...' : 'Confirm & Authorize Payment'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </WorkspaceLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center font-sans text-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-[#FF2D2D] rounded-full animate-spin" />
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

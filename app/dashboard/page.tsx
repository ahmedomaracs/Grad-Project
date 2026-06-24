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
  year: z.coerce.number().int().min(1900, 'Year must be after 1900').max(new Date().getFullYear() + 2, 'Invalid year'),
  mileage: z.coerce.number().min(0, 'Mileage must be 0 or more'),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

// Booking validation schema
const bookingSchema = z.object({
  service: z.string().min(1, 'Service type is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
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
    appointments,
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
    resolver: zodResolver(vehicleSchema) as any,
    defaultValues: {
      brand: '',
      model: '',
      year: 2023,
      mileage: 12000,
    }
  });

  // Wallet deposit state
  const [depositAmount, setDepositAmount] = useState('100.00');
  const [isDepositing, setIsDepositing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  useEffect(() => {
    const updateBalance = () => {
      const current = localStorage.getItem('wallet_balance') || '0.00';
      setBalance(parseFloat(current));
    };
    updateBalance();
    window.addEventListener('wallet_update', updateBalance);
    return () => window.removeEventListener('wallet_update', updateBalance);
  }, []);

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

  const executeMockDeposit = async () => {
    setIsDepositing(true);
    await new Promise(resolve => setTimeout(resolve, 1800));

    const current = parseFloat(localStorage.getItem('wallet_balance') || '0.00');
    const added = parseFloat(depositAmount) || 0;
    const finalVal = (current + added).toFixed(2);

    localStorage.setItem('wallet_balance', finalVal);

    addTransaction('deposit', 'Deposit via Stripe Secure', added);
    
    window.dispatchEvent(new Event('wallet_update'));
    setIsGatewayOpen(false);
    setIsDepositing(false);
    setDepositAmount('100.00');
    addNotification('Funds Received 💰', `$${added.toFixed(2)} has been loaded into your Automate Wallet.`, 'system');
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
              <h1 className="text-3xl font-display text-slate-950">Financial Wallet</h1>
              <p className="text-sm text-slate-500 font-semibold mt-1">Manage deposits, automated billing and repairs payouts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Bal Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-[#E12F2F] to-red-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg border border-red-500/20">
                <div className="absolute top-[-50%] left-[-20%] w-[120%] h-[150%] bg-[radial-gradient(ellipse_at_center,_#FFFFFF_0%,_transparent_55%)] opacity-20 blur-[80px] pointer-events-none" />
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white/80 font-extrabold uppercase tracking-widest">Available Balance</p>
                      <h2 className="text-4xl font-extrabold tracking-tight mt-2">${balance.toFixed(2)}</h2>
                    </div>
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="100.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="flex-1 h-11 px-4 rounded-xl border border-white/20 bg-white/10 text-sm font-bold text-white placeholder-white/50 outline-none focus:border-white/40 focus:ring-1 focus:ring-white transition-all w-full"
                      />
                      <Button
                        onClick={() => setIsGatewayOpen(true)}
                        className="h-11 bg-white text-[#E12F2F] hover:bg-slate-50 shadow-md border-none px-6 font-bold cursor-pointer"
                      >
                        Deposit
                      </Button>
                    </div>
                    <span className="text-[10px] text-white/80 font-bold block">
                      Guaranteed secure 256-bit SSL checkout processing via Stripe.
                    </span>
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="lg:col-span-2 theme-glass-card rounded-3xl p-6 border-slate-200/60 bg-white/70">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Transactions</h3>
                <div className="space-y-4 divide-y divide-slate-100">
                  {transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between pt-4 first:pt-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          t.type === 'deposit'
                            ? 'bg-green-50 text-green-600 border border-green-200/50'
                            : t.type === 'booking'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200/50'
                            : 'bg-amber-50 text-amber-600 border border-amber-200/50'
                        }`}>
                          {t.type === 'deposit' ? '+$' : t.type === 'booking' ? 'W' : 'S'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{t.title}</p>
                          <span className="text-[10px] text-slate-400 font-bold">{t.date}</span>
                        </div>
                      </div>
                      <span className={`text-sm font-extrabold ${t.amount >= 0 ? 'text-green-600' : 'text-slate-900'}`}>
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
              <h1 className="text-3xl font-display text-slate-950">
                Welcome back, {user?.name.split(' ')[0] || 'Ahmed'}!
              </h1>
              <p className="text-sm text-slate-500 font-semibold mt-1">
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
                  accent: 'bg-[#E12F2F]/10 border-[#E12F2F]/20 text-[#E12F2F] hover:bg-[#E12F2F] hover:text-white',
                },
                {
                  title: 'Shop Spare Parts',
                  desc: 'Order genuine ceramic brakes, high-flow air filters, LED headlamps, and tires.',
                  btnLabel: 'Browse Shop',
                  href: '/shop',
                  icon: ShoppingBag,
                  accent: 'bg-[#E12F2F]/10 border-[#E12F2F]/20 text-[#E12F2F] hover:bg-[#E12F2F] hover:text-white',
                },
              ].map((act, i) => (
                <motion.div
                  key={act.title}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="theme-glass-card bg-white/80 border border-slate-200/70 rounded-3xl p-6 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E12F2F]/5 border border-[#E12F2F]/10 flex items-center justify-center text-[#E12F2F] flex-shrink-0">
                      <act.icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-[#E12F2F] transition-colors">
                        {act.title}
                      </h3>
                      <p className="text-sm text-slate-500 font-semibold mt-1 leading-relaxed">
                        {act.desc}
                      </p>
                    </div>
                  </div>
                  <Link href={act.href} className="self-start">
                    <Button variant="secondary" className="px-6 h-10 font-bold text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm">
                      {act.btnLabel}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Garage Widget */}
            <div
              onClick={() => router.push('/dashboard/my-garage')}
              className="theme-glass-card bg-white/80 border border-slate-200/70 rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#E12F2F]" />
                    My Garage
                  </h3>
                  <span className="text-xs text-slate-500 font-bold block mt-1">
                    {vehicles.length} Active {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddVehicleModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 h-9 bg-slate-50 hover:bg-[#E12F2F]/5 hover:text-[#E12F2F] text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-[#E12F2F]/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Car
                </motion.button>
              </div>

              {vehicles.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white/40">
                  <Car className="w-12 h-12 text-slate-300" />
                  <p className="font-bold text-slate-800">Your garage is empty</p>
                  <p className="text-xs text-slate-500 max-w-xs">Add your vehicle model, year, and mileage to unlock smart service scheduling.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vehicles.map((v) => (
                    <div
                      key={v.id}
                      onClick={(e) => e.stopPropagation()}
                      className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl relative overflow-hidden group cursor-default shadow-sm"
                    >
                      {v.image && (
                        <div className="w-20 sm:w-28 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-100">
                          <img src={v.image} alt={v.model} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] font-bold text-[#E12F2F] uppercase tracking-widest">{v.brand}</span>
                        <h4 className="font-bold text-slate-900 text-sm truncate mt-0.5">{v.model}</h4>
                        <div className="flex flex-col gap-1 mt-2 text-xs text-slate-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5 text-slate-400" />
                            {v.mileage.toLocaleString()} mi
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold self-start mt-1 ${
                            v.status === 'Perfect'
                              ? 'bg-green-50 text-green-600 border border-green-200/50'
                              : v.status === 'Needs Attention'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200/50'
                              : 'bg-blue-50 text-blue-600 border border-blue-200/50'
                          }`}>
                            {v.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVehicle(v.id);
                          addNotification('Vehicle Removed ❌', `${v.brand} has been removed from your account.`, 'system');
                        }}
                        className="absolute right-3 top-3 w-8 h-8 min-h-[32px] min-w-[32px] bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookings Widget */}
            <div
              onClick={() => router.push('/dashboard/bookings')}
              className="theme-glass-card bg-white/80 border border-slate-200/70 rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#E12F2F]" />
                    Service Bookings
                  </h3>
                  <span className="text-xs text-slate-500 font-bold block mt-1">
                    {appointments.length} Active {appointments.length === 1 ? 'Booking' : 'Bookings'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/dashboard/bookings');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 h-9 bg-slate-50 hover:bg-[#E12F2F]/5 hover:text-[#E12F2F] text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-[#E12F2F]/20 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  View All
                </motion.button>
              </div>

              {appointments.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white/40">
                  <Calendar className="w-12 h-12 text-slate-300" />
                  <p className="font-bold text-slate-800">No active bookings</p>
                  <p className="text-xs text-slate-500 max-w-xs">Schedule a diagnostic or repair session with a verified mechanic.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/dashboard/bookings');
                      }}
                      className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl relative overflow-hidden group cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                    >
                      {appt.mechanicAvatar && (
                        <div className="w-20 sm:w-28 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-100">
                          <img src={appt.mechanicAvatar} alt={appt.mechanicName} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] font-bold text-[#E12F2F] uppercase tracking-widest truncate block">{appt.service}</span>
                        <h4 className="font-bold text-slate-900 text-sm truncate mt-0.5">{appt.mechanicName}</h4>
                        <div className="flex flex-col gap-1 mt-2 text-xs text-slate-500 font-semibold">
                          <span className="flex items-center gap-1 truncate">
                            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            {appt.date} at {appt.time}
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold self-start mt-1 ${
                            appt.status === 'Upcoming'
                              ? 'bg-blue-50 text-blue-600 border border-blue-200/50'
                              : appt.status === 'Completed'
                              ? 'bg-green-50 text-green-600 border border-green-200/50'
                              : 'bg-amber-50 text-amber-600 border border-amber-200/50'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mechanics & Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fav Mechanics */}
              <div className="theme-glass-card bg-white/80 border border-slate-200/70 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Heart className="w-5 h-5 fill-[#E12F2F] text-[#E12F2F]" />
                    Favorite Mechanics
                  </h3>
                  <div className="space-y-4">
                    {mechanics.filter(m => m.isFavorite).map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{m.garageName}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBookingMech(m)}
                            className="h-8 px-3 rounded-lg bg-[#E12F2F] hover:bg-[#C41F1F] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            Book Slot
                          </button>
                          <button
                            onClick={() => toggleFavoriteMechanic(m.id)}
                            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#E12F2F] hover:bg-slate-100 cursor-pointer"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/mechanics" className="block mt-6">
                  <span className="text-xs font-bold text-[#E12F2F] hover:underline flex items-center gap-1.5 cursor-pointer">
                    Browse All Certified Vetted Mechanics →
                  </span>
                </Link>
              </div>

              {/* Recent Orders */}
              <div className="theme-glass-card bg-white/80 border border-slate-200/70 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#E12F2F]" />
                    Recent Orders
                  </h3>
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-tight">{o.productName}</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-0.5">{o.brand} · ${o.price}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          o.status === 'Delivered'
                            ? 'bg-green-50 text-green-600 border border-green-200/50'
                            : o.status === 'In Transit'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200/50'
                            : 'bg-amber-50 text-amber-600 border border-amber-200/50'
                        }`}>
                          {o.status === 'Delivered' ? <CheckCircle className="w-3 h-3" /> : o.status === 'In Transit' ? <Truck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/shop" className="block mt-6">
                  <span className="text-xs font-bold text-[#E12F2F] hover:underline flex items-center gap-1.5 cursor-pointer">
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
                      vehicleErrors.brand ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#E12F2F]/40'
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
                      vehicleErrors.model ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#E12F2F]/40'
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
                        vehicleErrors.year ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#E12F2F]/40'
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
                        vehicleErrors.mileage ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#E12F2F]/40'
                      }`}
                    />
                    {vehicleErrors.mileage && <p className="text-[10px] font-bold text-red-500 mt-1">{String(vehicleErrors.mileage.message)}</p>}
                  </div>
                </div>
                <div className="pt-4">
                  <Button type="submit" fullWidth disabled={isAddingVehicle} className="h-12 bg-[#E12F2F] text-white hover:bg-red-600 font-bold">
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
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#E12F2F]/40 transition-colors cursor-pointer disabled:opacity-60"
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
                        bookingErrors.date ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#E12F2F]/40'
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
                        bookingErrors.time ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#E12F2F]/40'
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
                    className="h-12 bg-[#E12F2F] text-white hover:bg-red-600 font-bold"
                  >
                    {isBookingMech ? 'Processing Payment...' : 'Confirm & Authorize Payment'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── STRIPE GATEWAY MODAL ── */}
      <AnimatePresence>
        {isGatewayOpen && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
          >
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 15 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 15 }}
               className="bg-white border border-slate-200/80 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 relative"
             >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Automate Payment Network</span>
                  <button onClick={() => setIsGatewayOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5"/></button>
                </div>
                <div className="text-4xl font-black text-slate-950 mt-2 mb-6 tracking-tight">
                  +${parseFloat(depositAmount || '0').toFixed(2)}
                </div>
                
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
                  <input type="text" placeholder="Card Number (4242 •••• •••• ••••)" className="w-full bg-transparent text-slate-900 text-sm border-b border-slate-200 p-3.5 focus:outline-none focus:bg-white transition-colors font-semibold" />
                  <div className="flex">
                    <input type="text" placeholder="MM/YY" className="w-1/2 bg-transparent text-slate-900 text-sm border-r border-slate-200 p-3.5 focus:outline-none focus:bg-white transition-colors font-semibold" />
                    <input type="text" placeholder="CVC" className="w-1/2 bg-transparent text-slate-900 text-sm p-3.5 focus:outline-none focus:bg-white transition-colors font-semibold" />
                  </div>
                </div>

                <button type="button" onClick={executeMockDeposit} disabled={isDepositing} className="w-full bg-[#E62424] hover:bg-[#d01f1f] text-white text-sm font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                  {isDepositing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {isDepositing ? 'Authorizing...' : 'Authorize Transaction & Deposit'}
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </WorkspaceLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center font-sans text-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" />
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

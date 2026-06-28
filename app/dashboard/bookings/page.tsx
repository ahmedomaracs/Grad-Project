'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Wrench,
  Car,
  ChevronRight,
  Home,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Ban,
  MapPin,
  Receipt,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useAuthStore, type AppointmentStatus, type Appointment } from '@/store/authStore';

/* ------------------------------------------------------------------ */
/*  Status config — badge colour, label, icon, pulse                   */
/* ------------------------------------------------------------------ */
const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bg: string; text: string; border: string; Icon: React.FC<{ className?: string }>; pulse?: boolean }
> = {
  Upcoming: {
    label: 'Upcoming',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    Icon: ({ className }) => <Clock className={className} />,
  },
  'In Progress': {
    label: 'In Progress',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    Icon: ({ className }) => <Loader2 className={`${className} animate-spin`} />,
    pulse: true,
  },
  Completed: {
    label: 'Completed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    Icon: ({ className }) => <CheckCircle2 className={className} />,
  },
  Cancelled: {
    label: 'Cancelled',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-200',
    Icon: ({ className }) => <Ban className={className} />,
  },
};

/* Also handle mechanic-side statuses the user might see */
const EXTENDED_STATUS_MAP: Record<string, keyof typeof STATUS_CONFIG> = {
  Pending: 'Upcoming',
  Confirmed: 'Upcoming',
  'Checked-In': 'In Progress',
  'In-Progress': 'In Progress',
  'Ready for Pickup': 'Completed',
  Upcoming: 'Upcoming',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  'In Progress': 'In Progress',
};

function resolveStatus(raw: string): AppointmentStatus {
  return (EXTENDED_STATUS_MAP[raw] as AppointmentStatus) ?? 'Upcoming';
}

/* ------------------------------------------------------------------ */
/*  Status Badge                                                        */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }: { status: string }) {
  const resolved = resolveStatus(status);
  const cfg = STATUS_CONFIG[resolved];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {cfg.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
        </span>
      )}
      {!cfg.pulse && <cfg.Icon className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                         */
/* ------------------------------------------------------------------ */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center py-28 border border-dashed border-slate-200 bg-white rounded-3xl shadow-sm"
    >
      <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-8 shadow-sm">
        <Wrench className="w-9 h-9 text-slate-300" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No Bookings Yet</h2>
      <p className="text-sm text-slate-500 font-medium max-w-sm leading-relaxed mb-8">
        You haven't scheduled any service appointments yet. Book a certified mechanic to get started.
      </p>
      <Link
        href="/booking"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E62424] hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
      >
        <Wrench className="w-4 h-4" />
        Schedule a Certified Mechanic
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Booking Card                                                        */
/* ------------------------------------------------------------------ */
function BookingCard({ appt, index }: { appt: Appointment; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { vehicles } = useAuthStore();

  // Try to match a vehicle from the store by id or name
  const vehicle = vehicles.find(
    (v) => v.id === appt.vehicleId || `${v.year} ${v.brand || v.make} ${v.model}` === appt.vehicleName
  );

  const vehicleLabel =
    vehicle
      ? `${vehicle.year} ${vehicle.brand || vehicle.make} ${vehicle.model}`
      : appt.vehicleName || 'Unknown Vehicle';

  const vehiclePlate = vehicle?.plate || vehicle?.plateNumber || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* ── Card Header ── */}
      <div
        className="flex items-start sm:items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer select-none"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Left — mechanic avatar + core info */}
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          {appt.mechanicAvatar ? (
            <img
              src={appt.mechanicAvatar}
              alt={appt.mechanicName}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5 text-slate-400" />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wider text-[#E62424] mb-0.5">
              {appt.service}
            </p>
            <h3 className="text-sm font-black text-slate-900 truncate">{appt.mechanicName}</h3>
            {appt.garageName && (
              <p className="text-xs text-slate-400 font-medium truncate">{appt.garageName}</p>
            )}
          </div>
        </div>

        {/* Right — status + expand toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <StatusBadge status={appt.status} />
          <div className="text-slate-400 hidden sm:block">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* ── Pill row — date / vehicle / price ── */}
      <div className="flex flex-wrap items-center gap-2 px-5 sm:px-6 pb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <Calendar className="w-3 h-3 text-slate-400" />
          {appt.date}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <Clock className="w-3 h-3 text-slate-400" />
          {appt.time}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <Car className="w-3 h-3 text-slate-400" />
          {vehicleLabel}
          {vehiclePlate && ` · ${vehiclePlate}`}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <Receipt className="w-3 h-3 text-[#E62424]" />
          EGP {(appt.price * 50).toLocaleString()}
        </span>
      </div>

      {/* ── Expanded Detail Panel ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-5 sm:mx-6 mb-5 p-5 rounded-2xl bg-slate-50/80 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-5 relative overflow-hidden">
              {/* Red accent line */}
              <div className="absolute top-0 left-0 w-1 h-full bg-[#E62424] rounded-r-full" />

              {/* Service info */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Service Details</p>
                <p className="text-sm font-bold text-slate-900">{appt.service}</p>
                {appt.notes && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">"{appt.notes}"</p>
                )}
              </div>

              {/* Vehicle info */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Vehicle</p>
                <p className="text-sm font-bold text-slate-900">{vehicleLabel}</p>
                {vehiclePlate && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg">
                    <MapPin className="w-2.5 h-2.5 text-[#E62424]" />
                    Plate: {vehiclePlate}
                  </span>
                )}
                {vehicle?.mileage && (
                  <p className="text-xs text-slate-500 mt-1">{Number(vehicle.mileage).toLocaleString()} km</p>
                )}
              </div>

              {/* Cost breakdown */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Transaction</p>
                <p className="text-2xl font-black text-slate-900 font-mono">
                  EGP {(appt.price * 50).toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Consultation base fee</p>
                <div className="mt-3">
                  <StatusBadge status={appt.status} />
                </div>
              </div>
            </div>

            {/* Action row */}
            {(appt.status === 'Upcoming') && (
              <div className="px-5 sm:px-6 pb-5 flex gap-2">
                <Link
                  href={`/booking?reschedule=true&bookingId=${appt.id}&mechanic=${encodeURIComponent(appt.mechanicName)}&service=${encodeURIComponent(appt.service)}&vehicleId=${appt.vehicleId || ''}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reschedule
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats Strip                                                         */
/* ------------------------------------------------------------------ */
function StatsStrip({ appointments }: { appointments: Appointment[] }) {
  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === 'Completed').length;
  const upcoming = appointments.filter(
    (a) => a.status === 'Upcoming' || a.status === 'In Progress'
  ).length;
  const totalSpend = appointments
    .filter((a) => a.status === 'Completed')
    .reduce((sum, a) => sum + a.price * 50, 0);

  const stats = [
    { label: 'Total Bookings', value: total, suffix: '' },
    { label: 'Completed', value: completed, suffix: '' },
    { label: 'Upcoming / Active', value: upcoming, suffix: '' },
    { label: 'Total Spent', value: `EGP ${totalSpend.toLocaleString()}`, suffix: '' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
          <p className="text-2xl font-black text-slate-900 font-mono">{s.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter Tabs                                                         */
/* ------------------------------------------------------------------ */
type FilterKey = 'All' | 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
const FILTERS: FilterKey[] = ['All', 'Upcoming', 'In Progress', 'Completed', 'Cancelled'];

function filterAppointments(appointments: Appointment[], filter: FilterKey): Appointment[] {
  if (filter === 'All') return appointments;
  return appointments.filter((a) => resolveStatus(a.status) === filter);
}

/* ------------------------------------------------------------------ */
/*  Main Page Content                                                   */
/* ------------------------------------------------------------------ */
function BookingsPageContent() {
  const router = useRouter();
  const { appointments } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');

  const filtered = filterAppointments(appointments, activeFilter);

  // Sort: upcoming first, then by date desc
  const sorted = [...filtered].sort((a, b) => {
    const order: Record<string, number> = { 'In Progress': 0, Upcoming: 1, Completed: 2, Cancelled: 3 };
    const aOrd = order[resolveStatus(a.status)] ?? 4;
    const bOrd = order[resolveStatus(b.status)] ?? 4;
    if (aOrd !== bOrd) return aOrd - bOrd;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-full bg-[#F8FAFC] text-slate-900">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <Home className="w-3 h-3" />
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Bookings</span>
          </nav>
          <h1 className="text-3xl font-display text-slate-950">Bookings &amp; Service History</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Track all your mechanic appointments, service records, and repair statuses.
          </p>
        </div>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E62424] hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-md shadow-red-500/15 transition-all active:scale-[0.98] flex-shrink-0"
        >
          <Wrench className="w-4 h-4" />
          Book a Mechanic
        </Link>
      </div>

      {/* ── Stats Strip ── */}
      {appointments.length > 0 && <StatsStrip appointments={appointments} />}

      {/* ── Filter Tabs ── */}
      {appointments.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {FILTERS.map((f) => {
            const count = filterAppointments(appointments, f).length;
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
                  }`}
              >
                {f}
                {f !== 'All' && count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Content ── */}
      {appointments.length === 0 ? (
        <EmptyState />
      ) : sorted.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl"
        >
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">No bookings match this filter.</p>
          <button
            onClick={() => setActiveFilter('All')}
            className="mt-4 text-xs font-black text-[#E62424] hover:underline uppercase tracking-wider"
          >
            Clear Filter
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {sorted.map((appt, i) => (
              <BookingCard key={appt.id} appt={appt} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Wrapped Export                                                      */
/* ------------------------------------------------------------------ */
export default function BookingsPage() {
  return (
    <WorkspaceLayout>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="w-10 h-10 border-[3px] border-slate-200 border-t-[#E62424] rounded-full animate-spin" />
          </div>
        }
      >
        <BookingsPageContent />
      </Suspense>
    </WorkspaceLayout>
  );
}

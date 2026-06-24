'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { appointmentsApi } from '../../lib/services/appointmentsApi';
import { Calendar as CalendarIcon, Car, Clock, Wrench, ChevronLeft, ChevronRight, Gauge, PlusCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isPastDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function getCalendarDays(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  return days;
}

function BookingFeatureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReschedule = searchParams.get('reschedule') === 'true';
  const bookingId = searchParams.get('bookingId');
  const queryMechanic = searchParams.get('mechanic');
  const queryService = searchParams.get('service');
  const queryVehicleId = searchParams.get('vehicleId');

  const { user, vehicles, mechanics: storeMechanics, bookMechanic, addAppointment, updateAppointment } = useAuthStore();
  const { addToast } = useToastStore();
  
  // Dynamically map mechanics and convert string pricing (e.g. '$$$') to EGP base fees
  const mechanics = storeMechanics.map(m => ({
    id: m.id,
    name: m.name,
    specialty: m.specialties[0] || "General Repair",
    rating: m.rating,
    estimatedTime: "45-60 mins",
    baseFee: m.price.length * 2500, // $$ = 5000 EGP
    avatar: m.avatar,
    garageName: m.garageName
  }));

  // --- STATE ---
  const [selectedMechanic, setSelectedMechanic] = useState<typeof mechanics[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState<string>('');
  
  // Custom Calendar State
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);

  const calendarDays = useMemo(() => getCalendarDays(viewDate), [viewDate]);
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return;
    setSelectedDateObj(date);
    setSelectedDate(date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }));
  };

  // Pipeline Flags
  const [loading, setLoading] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ success: boolean; message: string } | null>(null);

  const availableSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  // Prefill default vehicle if exists
  useEffect(() => {
    if (isReschedule && queryVehicleId) {
      setSelectedVehicle(queryVehicleId);
    } else if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0].id);
    }
  }, [vehicles, isReschedule, queryVehicleId]);

  // Hydrate rescheduling context
  useEffect(() => {
    if (isReschedule) {
      if (queryService) setIssueDescription(queryService);
      if (queryMechanic) {
        const mech = mechanics.find(m => m.name === queryMechanic);
        if (mech) setSelectedMechanic(mech);
      }
    }
  }, [isReschedule, queryService, queryMechanic, mechanics]);

  const handleFrictionlessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMechanic || !selectedDate || !selectedTime || !selectedVehicle) return;

    setLoading(true);
    setSubmissionStatus(null);

    try {
      const vehicleObj = vehicles.find(v => v.id === selectedVehicle);
      const brandName = vehicleObj ? (vehicleObj.brand || vehicleObj.make || 'Vehicle') : 'Vehicle';
      const mileageStr = vehicleObj?.mileage
        ? ` — ${Number(vehicleObj.mileage).toLocaleString()} km`
        : '';
      // Spec format: "BMW 320i (2022) — 42,000 km"
      const vehicleName = vehicleObj
        ? `${brandName} ${vehicleObj.model} (${vehicleObj.year})${mileageStr}`
        : selectedVehicle;

      // Build ISO datetime from selected date + time
      const dateObj = selectedDateObj || new Date();
      const [time, meridiem] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const hour24 =
        meridiem === 'PM' && hours !== 12
          ? hours + 12
          : meridiem === 'AM' && hours === 12
          ? 0
          : hours;
      dateObj.setHours(hour24, minutes, 0, 0);
      const scheduledAt = dateObj.toISOString();

      // --- Try real API first ---
      try {
        await appointmentsApi.create({
          mechanicId: Number(selectedMechanic.id) || 0,
          vehicleDescription: vehicleName,
          serviceType: issueDescription || 'Standard diagnostic check',
          scheduledAt,
          notes: issueDescription || undefined,
        });
      } catch (apiErr) {
        // Backend may 401 (not auth'd) or mechanic ID may not match — 
        // fall through to local store so the page never fully breaks.
        console.warn('[BookingPage] API create appointment failed, using local store only:', apiErr);
      }

      // Always mirror into local Zustand store for immediate UI feedback for Mechanics dashboard
      bookMechanic(
        selectedMechanic.id,
        selectedMechanic.name,
        user?.id || 'client_default',
        user?.name || 'Guest User',
        vehicleName,
        issueDescription || 'Standard diagnostic check',
        `${selectedDate} at ${selectedTime}`
      );

      // Map the data envelope structurally and append/update the Client dashboard history pipeline
      const payload = {
        mechanicId: selectedMechanic.id,
        mechanicName: selectedMechanic.name,
        mechanicAvatar: selectedMechanic.avatar,
        garageName: selectedMechanic.garageName,
        service: issueDescription || 'Standard diagnostic check',
        vehicleId: selectedVehicle,
        vehicleName: vehicleName,
        date: selectedDate,
        time: selectedTime,
        status: 'Upcoming' as const,
        price: selectedMechanic.baseFee / 50, // Convert back to USD internally if store expects base format, or keep EGP depending on store standard. Store uses USD (price * 50 = EGP in dashboard)
        notes: issueDescription,
      };

      if (isReschedule && bookingId) {
        updateAppointment(bookingId, payload);
      } else {
        addAppointment(payload);
      }

      setSubmissionStatus({
        success: true,
        message: isReschedule
          ? `Appointment rescheduled successfully with ${selectedMechanic.name}!`
          : `Appointment scheduled successfully with ${selectedMechanic.name}!`,
      });

      // Global toast fallback / notification
      if (isReschedule) {
        addToast({
          type: 'success',
          title: 'Rescheduled!',
          message: `Appointment rescheduled successfully to ${selectedDate}!`,
        });
      } else {
        addToast({
          type: 'success',
          title: 'Confirmed!',
          message: `Appointment scheduled for ${selectedDate}.`,
        });
      }

      // UX State reset & Route loop execution immediately:
      // Using router.replace ensures the ?reschedule URL params aren't left in history,
      // creating a clean slate if the user re-navigates to /booking.
      router.replace('/dashboard/bookings');
      
    } catch (error) {
      setSubmissionStatus({
        success: false,
        message: 'Unable to schedule your appointment right now.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans mt-16">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER BRAND BLOCK */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-xs font-black tracking-widest uppercase text-[#E62424] bg-red-50 px-3 py-1 rounded-full border border-red-100">
            {isReschedule ? 'Reschedule Your Appointment' : 'Automate Express Service'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mt-4">
            {isReschedule ? 'Reschedule Appointment' : 'Frictionless Dispatch'}
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl">
            {isReschedule 
              ? 'Select a new date and time with your specialist. Your vehicle data is securely pre-filled.' 
              : 'Select an expert, allocate a timeline, and initiate a diagnostic pipeline transaction instantly. Your vehicle data is securely pre-filled.'}
          </p>
        </div>

        {/* FEEDBACK INTEGRATION COMPONENT */}
        {submissionStatus && (
          <div className={`mb-6 p-4 rounded-2xl border text-sm font-bold shadow-sm animate-in fade-in duration-200 ${
            submissionStatus.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {submissionStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* SELECTION COLUMN */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* 1. VEHICLE SELECTION — Premium Card Picker */}
            <div className="bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-slate-400" />
                  <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">1. Select Vehicle from Garage</h2>
                </div>
                {vehicles.length > 0 && (
                  <Link
                    href="/dashboard/my-garage"
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#E62424] hover:underline"
                  >
                    <PlusCircle className="w-3 h-3" />
                    Add Vehicle
                  </Link>
                )}
              </div>

              {vehicles.length === 0 ? (
                /* ── Empty Garage State ── */
                <div className="flex flex-col items-center justify-center gap-3 py-8 bg-slate-50/80 border border-dashed border-slate-200 rounded-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Car className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-bold text-slate-500 text-center max-w-[200px] leading-relaxed">
                    No vehicles found in your garage.
                  </p>
                  <Link
                    href="/dashboard/my-garage"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-[#E62424] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add a Vehicle to Your Garage First
                  </Link>
                </div>
              ) : (
                /* ── Vehicle Card Grid ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicles.map((v) => {
                    const isSelected = selectedVehicle === v.id;
                    const brandName = v.brand || v.make || 'Unknown';
                    const mileageStr = v.mileage
                      ? `${Number(v.mileage).toLocaleString()} km`
                      : null;
                    const plateStr = v.plate || v.plateNumber || null;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => { setSelectedVehicle(v.id); setSubmissionStatus(null); }}
                        className={`relative w-full text-left p-4 rounded-2xl border transition-all duration-200 group ${
                          isSelected
                            ? 'border-[#E62424] bg-red-50/30 ring-1 ring-[#E62424] shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {/* Selected checkmark */}
                        {isSelected && (
                          <span className="absolute top-3 right-3">
                            <CheckCircle2 className="w-4 h-4 text-[#E62424]" />
                          </span>
                        )}

                        {/* Colour swatch + brand badge */}
                        <div className="flex items-center gap-2 mb-2.5">
                          {v.color && (
                            <span
                              className="w-3 h-3 rounded-full border border-slate-200 flex-shrink-0"
                              style={{ backgroundColor: v.color }}
                            />
                          )}
                          {v.image ? (
                            <img
                              src={v.image}
                              alt={`${brandName} ${v.model}`}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <Car className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-[#E62424]' : 'text-slate-300'}`} strokeWidth={1.5} />
                          )}
                        </div>

                        {/* Primary label */}
                        <p className={`text-sm font-black leading-tight mb-1 ${
                          isSelected ? 'text-[#E62424]' : 'text-slate-900'
                        }`}>
                          {brandName} {v.model}
                          <span className="text-slate-400 font-bold"> ({v.year})</span>
                        </p>

                        {/* Meta pills row */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {mileageStr && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              <Gauge className="w-2.5 h-2.5" />
                              {mileageStr}
                            </span>
                          )}
                          {plateStr && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                              {plateStr}
                            </span>
                          )}
                          {v.fuelType && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {v.fuelType}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. MECHANICS TRACK CONTAINER */}
            <div className="bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">2. Select Available Specialist</h2>
              </div>
              <div className="space-y-3">
                {mechanics.map((mech) => {
                  const isSelected = selectedMechanic?.id === mech.id;
                  return (
                    <div
                      key={mech.id}
                      onClick={() => { setSelectedMechanic(mech); setSubmissionStatus(null); }}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex justify-between items-center ${
                        isSelected 
                          ? 'border-[#E62424] bg-red-50/20 shadow-sm ring-1 ring-[#E62424]' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img src={mech.avatar} alt={mech.name} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-100" />
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{mech.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{mech.garageName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-black text-slate-900 font-mono">EGP {mech.baseFee.toLocaleString()}</span>
                        <span className="text-[10px] text-[#E62424] font-bold">★ {mech.rating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. DATE & TIME SELECTOR ROW */}
            <div className="bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">3. Pick a Dispatch Window</h2>
              </div>
              
              <div className="space-y-6">
                
                {/* Custom Interactive Calendar */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-slate-800">{monthLabel}</span>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS.map((d) => (
                      <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-wider py-2">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                      if (!day) {
                        return <div key={idx} className="h-10" />;
                      }
                      const past = isPastDate(day);
                      const selected = selectedDateObj && isSameDay(day, selectedDateObj);
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={past}
                          onClick={() => handleDateSelect(day)}
                          className={`
                            h-10 w-full rounded-xl text-xs font-bold transition-all outline-none flex items-center justify-center
                            ${past
                              ? 'text-slate-300 cursor-not-allowed bg-slate-100/50'
                              : selected
                                ? 'bg-[#E62424] text-white shadow-md shadow-red-500/30'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-[#E62424]/50 hover:bg-red-50 shadow-sm'
                            }
                          `}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">Available Slots</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {availableSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          type="button"
                          key={time}
                          disabled={!selectedDateObj}
                          onClick={() => { setSelectedTime(time); setSubmissionStatus(null); }}
                          className={`py-3 px-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-150 flex items-center justify-center gap-1.5 ${
                            !selectedDateObj
                              ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                              : isSelected 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                          }`}
                        >
                          <Clock className="w-3 h-3" /> {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* STEP 4: ORDER SUMMARY & DIRECT COMMIT PILL PANEL */}
          <div className="lg:col-span-2">
            <form onSubmit={handleFrictionlessSubmit} className="bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow lg:sticky lg:top-24 space-y-6">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">4. Review Ticket Checkout</h2>
              
              {/* TICKET DETAILS MATRIX */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Specialist:</span>
                  <span className="font-black text-slate-900">{selectedMechanic ? selectedMechanic.name : 'Pending'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Schedule:</span>
                  <div className="text-right">
                    <span className="font-black text-[#E62424] block">{selectedDate ? selectedDate : 'No Date'}</span>
                    <span className="font-bold text-slate-700 block text-[10px]">{selectedTime ? selectedTime : 'No Time'}</span>
                  </div>
                </div>
                <div className="flex justify-between items-start text-xs">
                  <span className="text-slate-500 font-bold flex-shrink-0">Vehicle:</span>
                  <div className="text-right max-w-[140px]">
                    {(() => {
                      const v = selectedVehicle ? vehicles.find(x => x.id === selectedVehicle) : null;
                      if (!v) return <span className="font-black text-slate-400">Not Selected</span>;
                      const brand = v.brand || v.make || '';
                      return (
                        <>
                          <span className="font-black text-slate-900 block leading-tight">
                            {brand} {v.model}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 block">
                            {v.year}{v.plate ? ` · ${v.plate}` : ''}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-900 uppercase">Consultation Base</span>
                  <span className="text-xl font-black text-slate-900 font-mono">EGP {selectedMechanic ? selectedMechanic.baseFee.toLocaleString() : '0'}</span>
                </div>
              </div>

              {/* CONTEXT DIAGNOSIS DESCRIPTIVE BLOCK */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Diagnostic Case Notes (Optional)
                </label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe engine abnormal noise, dashboard warnings..."
                  rows={3}
                  className="w-full bg-white border border-slate-200 text-sm font-medium rounded-xl p-3 focus:outline-none focus:border-[#E62424] focus:ring-1 focus:ring-[#E62424] transition-colors placeholder:text-slate-400 resize-none shadow-sm"
                />
              </div>

              {/* ACTION EXECUTE GATEWAY BUTTON */}
              <button
                type="submit"
                disabled={!selectedMechanic || !selectedDate || !selectedTime || !selectedVehicle || loading}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-150 ${
                  (!selectedMechanic || !selectedDate || !selectedTime || !selectedVehicle || loading)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#E62424] text-white hover:bg-red-700 shadow-[0_8px_16px_rgba(230,36,36,0.2)] active:scale-[0.98]'
                }`}
              >
                {loading ? 'Confirming Protocol...' : isReschedule ? 'Confirm New Date & Time' : 'Finalize Dispatch'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function BookingFeaturePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans mt-16">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#E62424] rounded-full animate-spin" />
        </div>
      }
    >
      <BookingFeatureContent />
    </Suspense>
  );
}

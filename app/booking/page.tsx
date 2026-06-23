'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { Calendar as CalendarIcon, Car, Clock, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function BookingFeaturePage() {
  const router = useRouter();
  const { user, vehicles, mechanics: storeMechanics, bookMechanic } = useAuthStore();
  
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
    if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0].id);
    }
  }, [vehicles]);

  const handleFrictionlessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMechanic || !selectedDate || !selectedTime || !selectedVehicle) return;

    setLoading(true);
    setSubmissionStatus(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const vehicleObj = vehicles.find(v => v.id === selectedVehicle);
      const vehicleName = vehicleObj ? `${vehicleObj.year} ${vehicleObj.brand} ${vehicleObj.model}` : selectedVehicle;
      
      // Use the global store action
      bookMechanic(
        selectedMechanic.id,
        selectedMechanic.name,
        user?.id || 'client_default',
        user?.name || 'Guest User',
        vehicleName,
        issueDescription || 'Standard diagnostic check',
        `${selectedDate} at ${selectedTime}`
      );

      setSubmissionStatus({
        success: true,
        message: `Appointment scheduled successfully with ${selectedMechanic.name}!`
      });
      
      setTimeout(() => {
        router.push('/dashboard/orders'); // routing to orders per specification
      }, 2000);
      
    } catch (error) {
      setSubmissionStatus({
        success: false,
        message: 'Unable to schedule your appointment right now.'
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
            Automate Express Service
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mt-4">
            Frictionless Dispatch
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl">
            Select an expert, allocate a timeline, and initiate a diagnostic pipeline transaction instantly. Your vehicle data is securely pre-filled.
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
            
            {/* 1. VEHICLE SELECTION */}
            <div className="bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <Car className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">1. Select Registered Vehicle</h2>
              </div>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#E62424] focus:ring-1 focus:ring-[#E62424] transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled>Choose your vehicle...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.year} {v.brand} {v.model} ({v.plate})
                  </option>
                ))}
              </select>
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
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Vehicle:</span>
                  <span className="font-black text-slate-900 truncate max-w-[120px]">
                    {selectedVehicle && vehicles.find(v => v.id === selectedVehicle) 
                      ? vehicles.find(v => v.id === selectedVehicle)?.model 
                      : 'Not Selected'}
                  </span>
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
                {loading ? 'Confirming Protocol...' : 'Finalize Dispatch'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

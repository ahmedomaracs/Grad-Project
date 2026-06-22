'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Check, Loader2, ArrowRight, ChevronLeft, ChevronRight, CalendarDays, Clock } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { servicesData } from '../../lib/servicesData';

interface Props {
  preselectedSlug?: string;
}

const vehicleModels: Record<string, string[]> = {
  Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'],
  BMW: ['M3', 'M5', 'X5', 'i8', 'i4', '3 Series', '7 Series'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'G-Class', 'AMG GT', 'EQS'],
  Audi: ['A4', 'A6', 'Q7', 'Q8', 'e-tron', 'R8'],
  Toyota: ['Camry', 'Supra', 'RAV4', 'Land Cruiser', 'Prius', 'Hilux'],
  Porsche: ['911 Carrera', 'Cayenne', 'Macan', 'Taycan', 'Panamera'],
  Ford: ['Mustang', 'F-150', 'Explorer', 'Mach-E', 'Bronco'],
  Chevrolet: ['Corvette', 'Camaro', 'Tahoe', 'Silverado', 'Bolt'],
};

const timeSlots = [
  '09:00 AM', '10:30 AM', '11:30 AM',
  '01:00 PM', '02:00 PM', '03:30 PM', '04:30 PM',
];

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

export function InlineEnquiryForm({ preselectedSlug }: Props) {
  const addToast = useToastStore((s) => s.addToast);

  const preselectedService = servicesData.find((s) => s.slug === preselectedSlug);

  const [service, setService] = useState<string>(preselectedSlug ?? '');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [plateCode, setPlateCode] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [description, setDescription] = useState(
    preselectedService
      ? `Booking appointment for ${preselectedService.name}.`
      : '',
  );
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* ── scheduler state ─────────────────────────────────────────────────── */
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const calendarDays = useMemo(() => getCalendarDays(viewDate), [viewDate]);
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // If the slug prop changes (edge case), keep form in sync
  useEffect(() => {
    if (preselectedSlug) {
      setService(preselectedSlug);
      const matched = servicesData.find((s) => s.slug === preselectedSlug);
      if (matched && !description) {
        setDescription(`Booking appointment for ${matched.name}.`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedSlug]);

  /* ── handlers ─────────────────────────────────────────────────────────── */

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    setService(slug);
    const matched = servicesData.find((s) => s.slug === slug);
    setDescription(matched ? `Booking appointment for ${matched.name}.` : '');
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMake(e.target.value);
    setModel('');
  };

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return;
    setSelectedDate(date);
  };

  const prevMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files.length) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service || !make || !model || !firstName || !lastName || !phone || !email) {
      addToast({ type: 'error', title: 'Missing Fields', message: 'Please fill in all required fields.' });
      return;
    }
    if (!selectedDate) {
      addToast({ type: 'error', title: 'Select Date', message: 'Please pick an appointment date from the calendar.' });
      return;
    }
    if (!selectedTime) {
      addToast({ type: 'error', title: 'Select Time', message: 'Please choose an available time slot.' });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      service,
      vehicle: { make, model, plateCode, plateNumber },
      client: { firstName, lastName, phone, email },
      appointment: { date: selectedDate.toISOString(), time: selectedTime },
      notes: description,
      files: files.map((f) => f.name),
    };

    await new Promise((r) => setTimeout(r, 2000));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    addToast({
      type: 'success',
      title: 'Appointment Confirmed',
      message: `Your mechanic appointment is booked for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
    });
  };

  const resetForm = () => {
    setService(preselectedSlug ?? '');
    setMake('');
    setModel('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setPlateCode('');
    setPlateNumber('');
    setDescription(
      preselectedService ? `Booking appointment for ${preselectedService.name}.` : '',
    );
    setFiles([]);
    setViewDate(new Date());
    setSelectedDate(null);
    setSelectedTime(null);
    setSubmitSuccess(false);
  };

  /* ── shared input class ──────────────────────────────────────────────── */
  const fieldCls =
    'w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/30 focus:ring-1 focus:ring-red-500/20 transition-all min-h-[44px]';
  const selectCls = `${fieldCls} appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`;
  const labelCls = 'text-[10px] font-bold text-gray-400 uppercase tracking-wider';

  /* ── step badge ──────────────────────────────────────────────────────── */
  const Step = ({ n }: { n: number }) => (
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600/10 text-red-400 text-xs font-black shrink-0 border border-red-500/20">
      {n}
    </span>
  );

  /* ── arrow SVG ───────────────────────────────────────────────────────── */
  const ChevronSvg = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <section className="py-24 relative overflow-hidden bg-[#070A12]">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-8%] w-[45vw] h-[45vw] rounded-full bg-[#E12F2F]/6 blur-[130px]" />
        <div className="absolute bottom-[10%] right-[-8%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[110px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-red-400 font-bold text-xs tracking-widest uppercase bg-red-600/10 border border-red-500/20 px-4 py-1.5 rounded-full inline-block mb-4">
              Zero-Friction Booking
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Book Your Mechanic Appointment
            </h2>
            <p className="text-base text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
              Select your service, enter your vehicle details, and pick a convenient time slot. Your certified mechanic will be ready.
            </p>
          </motion.div>
        </div>

        {/* Card surface */}
        <div className="relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 lg:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#E12F2F] to-rose-600" />

          <AnimatePresence mode="wait">
            {!submitSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-10"
              >
                {/* ── SEGMENT A : Vehicle Credentials & Service Target ── */}
                <div className="space-y-5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2.5">
                    <Step n={1} />
                    Vehicle Credentials &amp; Service Target
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Service */}
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="ief-service" className={labelCls}>
                        Targeted Service *
                      </label>
                      <div className="relative">
                        <select
                          id="ief-service"
                          value={service}
                          onChange={handleServiceChange}
                          className={selectCls}
                          required
                        >
                          <option value="">-- Choose a Service --</option>
                          {servicesData.map((s) => (
                            <option key={s.slug} value={s.slug}>
                              {s.name}
                            </option>
                          ))}
                          <option value="custom">Other / Custom Service</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronSvg />
                        </div>
                      </div>
                    </div>

                    {/* Make */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ief-make" className={labelCls}>
                        Make *
                      </label>
                      <div className="relative">
                        <select
                          id="ief-make"
                          value={make}
                          onChange={handleMakeChange}
                          className={selectCls}
                          required
                        >
                          <option value="">-- Choose Make --</option>
                          {Object.keys(vehicleModels).map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronSvg />
                        </div>
                      </div>
                    </div>

                    {/* Model */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ief-model" className={labelCls}>
                        Model *
                      </label>
                      <div className="relative">
                        <select
                          id="ief-model"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          disabled={!make}
                          className={selectCls}
                          required
                        >
                          <option value="">-- Choose Model --</option>
                          {make &&
                            vehicleModels[make]?.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronSvg />
                        </div>
                      </div>
                    </div>

                    {/* Plate Code */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ief-plate-code" className={labelCls}>
                        Plate Code
                      </label>
                      <input
                        id="ief-plate-code"
                        type="text"
                        value={plateCode}
                        onChange={(e) => setPlateCode(e.target.value)}
                        className={fieldCls}
                        placeholder="A"
                        maxLength={5}
                      />
                    </div>

                    {/* Plate Number */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ief-plate-num" className={labelCls}>
                        Plate Number
                      </label>
                      <input
                        id="ief-plate-num"
                        type="text"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value)}
                        className={fieldCls}
                        placeholder="12345"
                        maxLength={8}
                      />
                    </div>
                  </div>
                </div>

                {/* ── SEGMENT B : Interactive Time & Mechanic Scheduler ─ */}
                <div className="space-y-5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2.5">
                    <Step n={2} />
                    Schedule Your Appointment
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Date Picker */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 backdrop-blur-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarDays className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-bold text-white">Select Date</span>
                      </div>

                      {/* Month nav */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={prevMonth}
                          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center outline-none"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-semibold text-white">{monthLabel}</span>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center outline-none"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Day headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map((d) => (
                          <div key={d} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider py-2">
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, idx) => {
                          if (!day) {
                            return <div key={idx} className="h-11" />;
                          }
                          const past = isPastDate(day);
                          const selected = selectedDate && isSameDay(day, selectedDate);
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={past}
                              onClick={() => handleDateSelect(day)}
                              className={`
                                h-11 min-h-[44px] w-full rounded-xl text-sm font-semibold transition-all outline-none
                                ${past
                                  ? 'text-gray-600 cursor-not-allowed'
                                  : selected
                                    ? 'bg-[#E12F2F] text-white font-bold shadow-lg shadow-[#E12F2F]/25'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }
                              `}
                            >
                              {day.getDate()}
                            </button>
                          );
                        })}
                      </div>

                      {selectedDate && (
                        <p className="mt-3 text-xs text-red-400 font-medium">
                          Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>

                    {/* Time Slot Selector */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 backdrop-blur-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-bold text-white">Select Time Slot</span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {timeSlots.map((slot) => {
                          const active = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTime(slot)}
                              className={`
                                min-h-[44px] min-w-[88px] px-4 py-2 rounded-xl text-sm font-semibold transition-all outline-none
                                ${active
                                  ? 'bg-[#E12F2F] text-white font-bold shadow-lg shadow-[#E12F2F]/25'
                                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                                }
                              `}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>

                      {selectedTime && (
                        <p className="mt-4 text-xs text-red-400 font-medium">
                          Time locked: {selectedTime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Client Details ─────────────────────────────────── */}
                <div className="space-y-5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2.5">
                    <Step n={3} />
                    Client Contact Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ief-first" className={labelCls}>
                        First Name *
                      </label>
                      <input
                        id="ief-first"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={fieldCls}
                        placeholder="John"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ief-last" className={labelCls}>
                        Last Name *
                      </label>
                      <input
                        id="ief-last"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={fieldCls}
                        placeholder="Doe"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ief-phone" className={labelCls}>
                        Contact Number *
                      </label>
                      <input
                        id="ief-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={fieldCls}
                        placeholder="+971 50 123 4567"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ief-email" className={labelCls}>
                        Email Address *
                      </label>
                      <input
                        id="ief-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={fieldCls}
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ── Step 4 : Upload & Notes ──────────────────────────── */}
                <div className="space-y-5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2.5">
                    <Step n={4} />
                    Documents &amp; Description
                  </h3>

                  {/* Dropzone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[130px]
                      ${isDragActive
                        ? 'border-[#E12F2F] bg-[#E12F2F]/5'
                        : 'border-white/15 hover:border-white/30 bg-white/2 hover:bg-white/5'
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-3 text-gray-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-gray-300">
                      Drag &amp; Drop your files or{' '}
                      <span className="text-[#E12F2F]">Browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Logbook, registration, mechanic notes — PDF / JPG / PNG up to 10 MB
                    </p>
                  </div>

                  {/* File chips */}
                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-[#E12F2F]/10 border border-[#E12F2F]/25 text-[#E12F2F] px-3.5 py-1.5 rounded-full text-xs font-bold"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span className="max-w-[140px] truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="hover:text-red-300 outline-none cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Description textarea */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ief-desc" className={labelCls}>
                      Description / Notes
                    </label>
                    <textarea
                      id="ief-desc"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`${fieldCls} resize-none min-h-[100px]`}
                      placeholder="Describe your vehicle's symptoms, specific requirements, or any additional notes..."
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[52px] py-4 bg-gradient-to-r from-[#E12F2F] to-red-600 hover:from-[#E12F2F]/90 hover:to-red-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-[#E12F2F]/20 transition-all duration-300 outline-none flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] lg:hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Confirming Appointment…
                    </>
                  ) : (
                    <>
                      Confirm Mechanic Appointment
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-14 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
                  Appointment Confirmed!
                </h3>
                <p className="text-gray-400 font-light max-w-md leading-relaxed mb-8">
                  Your mechanic appointment has been booked successfully. A confirmation has been
                  sent to{' '}
                  <span className="font-bold text-white">{email}</span>. See you at the garage!
                </p>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-sm rounded-xl transition-colors min-h-[44px] cursor-pointer"
                >
                  Book Another Appointment
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

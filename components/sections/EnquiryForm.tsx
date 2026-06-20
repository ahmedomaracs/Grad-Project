'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Check, Loader2, ArrowRight } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { servicesData } from '../../lib/servicesData';
import { useAuthStore } from '../../store/authStore';

interface VehicleModelData {
  [key: string]: string[];
}

export function EnquiryForm() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#E12F2F] mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading booking form...</p>
      </div>
    }>
      <EnquiryFormContent />
    </Suspense>
  );
}

function EnquiryFormContent() {
  const addToast = useToastStore((state) => state.addToast);
  const searchParams = useSearchParams();
  const { mechanics } = useAuthStore();

  const [service, setService] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [selectedMechanic, setSelectedMechanic] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [plateCode, setPlateCode] = useState<string>('');
  const [plateNumber, setPlateNumber] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const vehicleModels: VehicleModelData = {
    'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'],
    'BMW': ['M3', 'M5', 'X5', 'i8', 'i4', '3 Series', '7 Series'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'G-Class', 'AMG GT', 'EQS'],
    'Audi': ['A4', 'A6', 'Q7', 'Q8', 'e-tron', 'R8'],
    'Toyota': ['Camry', 'Supra', 'RAV4', 'Land Cruiser', 'Prius', 'Hilux'],
    'Porsche': ['911 Carrera', 'Cayenne', 'Macan', 'Taycan', 'Panamera'],
    'Ford': ['Mustang', 'F-150', 'Explorer', 'Mach-E', 'Bronco'],
    'Chevrolet': ['Corvette', 'Camaro', 'Tahoe', 'Silverado', 'Bolt']
  };

  // Pre-populate service and description based on URL queries
  useEffect(() => {
    const serviceSlug = searchParams.get('service') || '';
    const tierName = searchParams.get('tier') || '';

    if (serviceSlug) {
      setService(serviceSlug);
      const matched = servicesData.find(s => s.slug === serviceSlug);
      if (matched) {
        let defaultDesc = `I would like to request a quote for the ${matched.name} package.`;
        if (tierName) {
          defaultDesc += ` Package tier selected: ${tierName}.`;
        }
        setDescription(defaultDesc);
      }
    }
  }, [searchParams]);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMake(e.target.value);
    setModel(''); // Reset model selection when make changes
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const onDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !make || !model || !selectedMechanic || !firstName || !lastName || !phone || !email) {
      addToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please fill out all required fields before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    addToast({
      type: 'success',
      title: 'Quote Requested',
      message: 'Your service request has been received. An advisor will contact you shortly.',
    });
  };

  const resetForm = () => {
    setService('');
    setMake('');
    setModel('');
    setSelectedMechanic('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setPlateCode('');
    setPlateNumber('');
    setDescription('');
    setFiles([]);
    setSubmitSuccess(false);
  };

  const inputClass = "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E62424] focus:ring-1 focus:ring-red-500/20 transition-all min-h-[44px]";
  const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-wider";

  return (
    <section id="quote-form" className="py-24 bg-[#F8FAFC] relative overflow-hidden text-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#E12F2F]/2 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/2 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#E62424] font-bold text-sm tracking-wider uppercase bg-[#E62424]/5 px-4 py-1.5 rounded-full inline-block mb-4 border border-[#E62424]/10">
              Get an Estimate
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-955 mb-4 tracking-tight">
              Request a Quote
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              Complete our ultra-clean, zero-friction booking form to receive a tailored estimate in minutes.
            </p>
          </motion.div>
        </div>

        {/* Form Surface */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl p-8 max-w-3xl mx-auto relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#E62424] to-red-600 opacity-90" />
          
          <AnimatePresence mode="wait">
            {!submitSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {/* 1. Service & Vehicle Selection Grid */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E62424]/10 text-[#E62424] text-xs font-black">1</span>
                    <span>Service & Vehicle Identification</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Service Selection */}
                    <div className="md:col-span-4 relative flex flex-col gap-1.5">
                      <label htmlFor="select-service" className={labelClass}>Select Service *</label>
                      <div className="relative">
                        <select
                          id="select-service"
                          value={service}
                          onChange={(e) => {
                            setService(e.target.value);
                            const matched = servicesData.find(s => s.slug === e.target.value);
                            if (matched) {
                              setDescription(`I would like to request a quote for the ${matched.name} package.`);
                            } else {
                              setDescription('');
                            }
                          }}
                          className={`${inputClass} appearance-none cursor-pointer`}
                          required
                        >
                          <option value="" className="bg-white">-- Choose a Service --</option>
                          {servicesData.map((s) => (
                            <option key={s.slug} value={s.slug} className="bg-white">{s.name}</option>
                          ))}
                          <option value="custom" className="bg-white">Other / Custom Service</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    {/* Mechanics Selection Dropdown */}
                    <div className="md:col-span-4 relative flex flex-col gap-1.5">
                      <label htmlFor="select-mechanic" className={labelClass}>Select Your Certified Mechanic *</label>
                      <div className="relative">
                        <select
                          id="select-mechanic"
                          value={selectedMechanic}
                          onChange={(e) => setSelectedMechanic(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-800 hover:border-[#E62424] focus:border-[#E62424] focus:ring-1 focus:ring-red-500/20 rounded-xl px-4 py-3 text-sm font-semibold appearance-none cursor-pointer transition-all min-h-[44px]"
                          required
                        >
                          <option value="" className="bg-white">-- Select Certified Mechanic --</option>
                          {mechanics.map((m) => (
                            <option key={m.id} value={m.id} className="bg-white">
                              {m.name} - {m.specialties?.join(', ') || 'Specialist'} ({m.rating}★) {m.available ? '● Active' : '○ Offline'}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    {/* Make Selection */}
                    <div className="md:col-span-2 relative flex flex-col gap-1.5">
                      <label htmlFor="select-make" className={labelClass}>Vehicle Make *</label>
                      <div className="relative">
                        <select
                          id="select-make"
                          value={make}
                          onChange={handleMakeChange}
                          className={`${inputClass} appearance-none cursor-pointer`}
                          required
                        >
                          <option value="" className="bg-white">-- Choose Make --</option>
                          {Object.keys(vehicleModels).map((m) => (
                            <option key={m} value={m} className="bg-white">{m}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    {/* Model Selection */}
                    <div className="md:col-span-2 relative flex flex-col gap-1.5">
                      <label htmlFor="select-model" className={labelClass}>Vehicle Model *</label>
                      <div className="relative">
                        <select
                          id="select-model"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          disabled={!make}
                          className={`${inputClass} appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
                          required
                        >
                          <option value="" className="bg-white">-- Choose Model --</option>
                          {make && vehicleModels[make]?.map((m) => (
                            <option key={m} value={m} className="bg-white">{m}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Client Details Grid */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E62424]/10 text-[#E62424] text-xs font-black">2</span>
                    <span>Client Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="first-name" className={labelClass}>First Name *</label>
                      <input
                        type="text"
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={inputClass}
                        placeholder="John"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="last-name" className={labelClass}>Last Name *</label>
                      <input
                        type="text"
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={inputClass}
                        placeholder="Doe"
                        required
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className={labelClass}>Contact Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                        placeholder="+971 50 123 4567"
                        required
                      />
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className={labelClass}>Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Vehicle Markers (Plate Details) */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E62424]/10 text-[#E62424] text-xs font-black">3</span>
                    <span>Plate & registration markers</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6 max-w-md">
                    {/* Plate Code */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="plate-code" className={labelClass}>Plate Code</label>
                      <input
                        type="text"
                        id="plate-code"
                        value={plateCode}
                        onChange={(e) => setPlateCode(e.target.value)}
                        className={inputClass}
                        placeholder="A"
                        maxLength={5}
                      />
                    </div>

                    {/* Plate Number */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="plate-number" className={labelClass}>Plate Number</label>
                      <input
                        type="text"
                        id="plate-number"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value)}
                        className={inputClass}
                        placeholder="12345"
                        maxLength={8}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Integrated Upload & Notes */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E62424]/10 text-[#E62424] text-xs font-black">4</span>
                    <span>Upload Documents & Description</span>
                  </h3>

                  <div className="space-y-6">
                    {/* File Dropzone */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logbook, Specs, or Mechanic Notes</span>
                      
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={onDropzoneClick}
                        className={`w-full border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all min-h-[140px]
                          ${isDragActive 
                            ? 'border-[#E62424] bg-[#E62424]/5' 
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                          }
                        `}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-md mb-3 text-slate-400">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">
                          Drag & Drop your files or <span className="text-[#E62424] hover:underline">Browse</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, DOC up to 10MB</p>
                      </div>

                      {/* File Chips */}
                      {files.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {files.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-[#E62424]/5 border border-[#E62424]/10 text-[#E62424] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="max-w-[150px] truncate">{file.name}</span>
                              <button 
                                type="button" 
                                onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                className="hover:text-red-700 outline-none cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes (Description) */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="description" className={labelClass}>Enter Description</label>
                      <textarea
                        id="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`${inputClass} resize-none min-h-[100px]`}
                        placeholder="Please detail your vehicle symptoms, requirements, or any specific concerns..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#E62424] text-white hover:bg-[#d01f1f] py-3 rounded-xl font-bold transition-all w-full min-h-[48px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Request...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Request Quote</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12 px-6 flex flex-col items-center animate-fade-in"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mb-6 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Request Received!</h3>
                <p className="text-slate-500 font-medium max-w-md leading-relaxed mb-8">
                  Thank you for requesting a quote. Your service details and documents have been securely processed by our experts. We will send an estimate to <span className="font-bold text-slate-800">{email}</span> within 15 minutes.
                </p>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 bg-[#E62424] hover:bg-[#d01f1f] text-white font-bold text-sm rounded-xl shadow-md transition-all min-h-[44px] cursor-pointer"
                >
                  Submit Another Request
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}

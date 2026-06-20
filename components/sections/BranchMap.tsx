'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation, ExternalLink, Calendar } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  hours: string;
  days: string;
  phone: string;
  coords: { x: number; y: number }; // Percentage coords on the grid map
  status: 'Open' | 'Busy' | 'Closed';
}

export function BranchMap() {
  const branches: Branch[] = [
    {
      id: 'al-quoz',
      name: 'Al Quoz Central Hub',
      address: 'Street 4B, Al Quoz Industrial Area 3, Dubai',
      hours: '8:00 AM - 9:00 PM',
      days: 'Monday - Saturday',
      phone: '+971 4 800 2886',
      coords: { x: 40, y: 55 },
      status: 'Open'
    },
    {
      id: 'marina',
      name: 'Dubai Marina Garage',
      address: 'Marina Wharf, Ground Floor, Dubai Marina',
      hours: '9:00 AM - 8:00 PM',
      days: 'Monday - Saturday',
      phone: '+971 4 800 2887',
      coords: { x: 25, y: 75 },
      status: 'Busy'
    },
    {
      id: 'downtown',
      name: 'Downtown Express Workshop',
      address: 'Sheikh Mohammed bin Rashid Blvd, Downtown Dubai',
      hours: '8:00 AM - 10:00 PM',
      days: 'Daily',
      phone: '+971 4 800 2888',
      coords: { x: 55, y: 35 },
      status: 'Open'
    },
    {
      id: 'silicon',
      name: 'Silicon Oasis Tech Center',
      address: 'Silicon Gates 2, Dubai Silicon Oasis',
      hours: '8:00 AM - 8:00 PM',
      days: 'Monday - Saturday',
      phone: '+971 4 800 2889',
      coords: { x: 80, y: 45 },
      status: 'Open'
    }
  ];

  const [selectedBranchId, setSelectedBranchId] = useState<string>('al-quoz');
  const activeBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  return (
    <section id="branch-map" className="py-24 bg-[#0A0A0A] text-white relative overflow-hidden border-t border-white/5">
      {/* Background ambient red glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[#E12F2F]/5 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#E12F2F] font-bold text-xs uppercase tracking-widest bg-[#E12F2F]/10 border border-[#E12F2F]/20 px-3 py-1 rounded-full inline-block mb-4">
              Regional Center Network
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Our Locations & Hours
            </h2>
            <p className="text-lg text-gray-400 max-w-xl font-light">
              Visit one of our state-of-the-art diagnostic and repair centers. Book an appointment online or contact our hotline.
            </p>
          </motion.div>
        </div>

        {/* Outer Flex Container for Split Panel */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left: Interactive List */}
          <div className="lg:col-span-5 flex flex-col gap-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {branches.map((branch) => {
              const isSelected = selectedBranchId === branch.id;
              return (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md cursor-pointer outline-none relative overflow-hidden flex flex-col gap-3 min-h-[48px]
                    ${isSelected 
                      ? 'bg-white/10 border-[#E12F2F]/50 shadow-[0_0_30px_rgba(255,45,45,0.1)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                    }
                    active:scale-[0.99]
                  `}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-white group-hover:text-[#E12F2F]">
                      {branch.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                      ${branch.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                      ${branch.status === 'Busy' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                      ${branch.status === 'Closed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                    `}>
                      {branch.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-sm text-gray-400">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>{branch.hours}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>{branch.phone}</span>
                    </div>
                  </div>

                  {/* Left-edge selection bar */}
                  {isSelected && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#E12F2F]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Premium Interactive Schematic Map Grid */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden min-h-[400px]">
            {/* Dots and Grid background */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/80 pointer-events-none" />

            {/* Simulated Road Map SVG Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-25 z-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50,150 Q100,80 300,120 T700,90" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
              <path d="M200,-50 C220,100 180,250 240,500" fill="none" stroke="white" strokeWidth="1.5" />
              <path d="M450,-50 C380,200 480,300 400,500" fill="none" stroke="white" strokeWidth="1" />
              <path d="M-50,300 C200,280 400,420 800,380" fill="none" stroke="white" strokeWidth="2" />
            </svg>

            {/* Glowing Map Nodes for Branches */}
            <div className="absolute inset-0 z-10">
              {branches.map((branch) => {
                const isSelected = selectedBranchId === branch.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                    className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-all duration-300 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                    style={{ left: `${branch.coords.x}%`, top: `${branch.coords.y}%` }}
                  >
                    {/* Ring glow */}
                    <div className={`absolute rounded-full transition-all duration-500
                      ${isSelected 
                        ? 'w-10 h-10 bg-[#E12F2F]/30 animate-ping' 
                        : 'w-6 h-6 bg-white/10 group-hover:bg-white/20'
                      }`} 
                    />
                    {/* Outer circle */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 shadow-md
                      ${isSelected 
                        ? 'bg-[#E12F2F] border-red-400 scale-125' 
                        : 'bg-zinc-800 border-white/30 hover:bg-zinc-700'
                      }`}
                    >
                      {/* Inner dot */}
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    {/* Popover label (hidden by default on mobile, styled nicely on hover/selection) */}
                    <span className={`absolute top-6 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-[10px] font-bold text-white px-2 py-1 rounded border border-white/10 whitespace-nowrap shadow-xl transition-all duration-300 pointer-events-none
                      ${isSelected ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-90'}
                    `}>
                      {branch.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Branch Map Drawer Banner Overlay */}
            <div className="relative z-20 bg-black/80 border border-white/10 p-6 rounded-2xl backdrop-blur-md mt-auto shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-[#E12F2F] text-[10px] font-bold uppercase tracking-widest block mb-1">Currently Viewing Branch</span>
                <h4 className="text-xl font-bold text-white mb-2">{activeBranch.name}</h4>
                <div className="flex flex-col gap-1.5 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#E12F2F] shrink-0" />
                    <span>{activeBranch.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#E12F2F] shrink-0" />
                    <span>{activeBranch.days} | {activeBranch.hours}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <a
                  href={`tel:${activeBranch.phone.replace(/\s+/g, '')}`}
                  className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.98] min-h-[44px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Hotline</span>
                </a>
                
                <button
                  onClick={() => {
                    // Works on both the service detail page (#service-enquiry-form)
                    // and the standalone /request-quote page (#quote-form)
                    const target =
                      document.getElementById('service-enquiry-form') ??
                      document.getElementById('quote-form');
                    if (target) {
                      const y = target.getBoundingClientRect().top + window.scrollY - 88;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#E12F2F] hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.98] min-h-[44px]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

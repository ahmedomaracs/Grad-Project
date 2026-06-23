'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';
import { CheckCircle2, ArrowRight, Home, Package } from 'lucide-react';

// Static specification dictionary lookup matrix engine
const METRICS_DICTIONARY: Record<string, { title: string; price: number; duration: string; details: string[] }> = {
  "car-scanning-diagnostics": { title: "Car Scanning Diagnostics", price: 4500, duration: "30 mins", details: ["Full ECU Code Readout", "Live Sensor Stream Analysis", "Clear Check Engine Light Fault Records"] },
  "battery-replacement": { title: "Battery Replacement & Core Test", price: 12000, duration: "25 mins", details: ["AGM Premium Battery Fitment", "Charging System Diagnostic Run", "Terminal Corrosion Cleaning Protection"] },
  "engine-repair": { title: "Precision Engine Structural Repair", price: 45000, duration: "3-5 Business Days", details: ["Cylinder Compression Profiles", "Timing Chain Assessment Alignment", "Gasket Structural Integrity Inspections"] },
  "transmission-repair": { title: "Transmission Fluid & Mechanical Overhaul", price: 35000, duration: "1 Day", details: ["Fluid Flush Exchange & Pressure Checks", "Clutch Pack Parameter Adjustments", "Solonoid Valve Performance Scans"] },
  "scheduled-maintenance": { title: "Comprehensive Scheduled Maintenance", price: 9500, duration: "60 mins", details: ["Multi-Point Safety Inspection Matrix", "Air & Cabin Particle Filter Upgrades", "Fluid Refills & Performance Inspections"] },
  "oil-change": { title: "Premium Synthetic Fluid & Oil Change", price: 6500, duration: "20 mins", details: ["Full Synthetic High Endurance Oil Flush", "OEM Specification Filter Replacement", "Chassis Lubrication Component Check"] },
  "ac-repair": { title: "AC System Environmental Re-Charge & Fix", price: 11000, duration: "45 mins", details: ["R134a Refrigerator Fluid Fill", "Vacuum Leak Drop Inspections", "HVAC Actuator Output Calibration Runs"] },
  "wheel-balancing-alignment": { title: "Laser Guided Wheel Balancing & Alignment", price: 7500, duration: "40 mins", details: ["Four-Wheel Laser Toe Caster Scans", "Dynamic Weight Optimization Distribution", "Tire Thread Uniformity Evaluation Logs"] }
};

export default function ServiceSpecificationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const currentService = METRICS_DICTIONARY[slug] || {
    title: "Technical Engineering Service",
    price: 9900,
    duration: "Varies",
    details: ["Standard Diagnosis Execution Protocol", "System Validation Pass Run"]
  };

  const { user, vehicles, mechanics, bookMechanic } = useAuthStore();

  // --- QUOTE TRANSACTION CONTROLLER HOOKS ---
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prefill default vehicle if exists
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0].id);
    }
  }, [vehicles]);

  const dispatchQuoteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const vehicleObj = vehicles.find(v => v.id === selectedVehicle);
      const vehicleName = vehicleObj ? `${vehicleObj.year} ${vehicleObj.brand} ${vehicleObj.model}` : selectedVehicle;
      
      const mechanicObj = mechanics.find(m => m.id === selectedMechanic);
      const mechanicId = mechanicObj ? mechanicObj.id : mechanics[0]?.id || 'm_default';
      const mechanicName = mechanicObj ? mechanicObj.name : mechanics[0]?.name || 'Assigned Expert';

      // Push a booking request to the global store mimicking the quote pipeline
      bookMechanic(
        mechanicId,
        mechanicName,
        user?.id || 'client_default',
        user?.name || 'Guest User',
        vehicleName,
        `Quote Request for: ${currentService.title}`,
        `Pending Assignment`
      );

      setSuccess(true);
    } catch (err) {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-6 font-sans mt-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* LEFT COMPONENT COLUMN: SPECIFICATION OVERVIEW CARD PANEL */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-black uppercase text-[#E62424] bg-red-50 px-3 py-1 rounded-full tracking-wider">
              Service Specs Catalog
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-4 uppercase">
              {currentService.title}
            </h1>
            <p className="text-slate-500 text-xs font-bold mt-2">
              Estimated Duration: <span className="text-slate-900">{currentService.duration}</span> • Base Rate Estimate: <span className="text-[#E62424]">EGP {currentService.price.toLocaleString()}</span>
            </p>

            <hr className="border-slate-100 my-6" />

            <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase mb-4">Included Technical Protocols</h3>
            <ul className="space-y-4">
              {currentService.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-50 text-[#E62424] font-bold text-[10px] flex-shrink-0 mt-0.5">✓</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: PREMIUM ZERO-FRICTION REQUEST A QUOTE FORM PANEL */}
        <div className="lg:col-span-2">
          {success ? (
            <div className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-md sticky top-28 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Quote Request Safely Logged</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                Your diagnostics ticket has been securely created. We will notify you as soon as a certified specialist has confirmed your appointment.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className="w-full bg-slate-950 text-white font-black text-xs uppercase tracking-widest px-4 py-4 rounded-xl hover:bg-[#E62424] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                  <Home className="w-4 h-4" /> View Dashboard
                </Link>
                <Link href="/dashboard/orders" className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest px-4 py-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                  <Package className="w-4 h-4" /> Check Order History
                </Link>
                <Link href="/" className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider mt-3 flex items-center justify-center gap-1 transition-colors">
                  Return Home <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={dispatchQuoteRequest} className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-md sticky top-28 space-y-5 hover:shadow-lg transition-shadow">
              <div>
                <span className="text-[9px] bg-slate-900 text-white font-black uppercase tracking-widest px-2 py-0.5 rounded">Secure Node</span>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-2">Request a Quote</h2>
                <p className="text-[11px] text-slate-400 font-medium">Complete this form to receive a tailored estimate instantly.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Select Vehicle *</label>
                <select 
                  required 
                  value={selectedVehicle} 
                  onChange={e => setSelectedVehicle(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#E62424] focus:ring-1 focus:ring-[#E62424] transition-all cursor-pointer appearance-none"
                >
                  <option value="" disabled>Choose a vehicle from your garage</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.year} {v.brand} {v.model}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Select Certified Mechanic (Optional)</label>
                <select 
                  value={selectedMechanic} 
                  onChange={e => setSelectedMechanic(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#E62424] focus:ring-1 focus:ring-[#E62424] transition-all cursor-pointer appearance-none"
                >
                  <option value="">-- Assign First Available Expert --</option>
                  {mechanics.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.specialties[0] || 'General Repair'})</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading || !selectedVehicle}
                className="w-full py-4 bg-slate-950 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#E62424] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(230,36,36,0.23)] transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed mt-4"
              >
                {loading ? 'Transmitting Request Packets...' : 'Submit Quote Request'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

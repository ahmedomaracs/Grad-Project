'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { usePartnershipStore } from '../../store/partnershipStore';

export default function BecomeMerchant() {
  const addApplication = usePartnershipStore((state) => state.addApplication);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    vatNumber: '',
    storeCategory: 'Spare Parts'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addApplication({
      applicantName: formData.fullName,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      roleApplied: 'Merchant',
      roleData: {
        vatNumber: formData.vatNumber,
        inventoryCategory: formData.storeCategory,
      }
    });
    setSubmitted(true);
  };

  const labelClass = "text-slate-500 text-[10px] font-bold tracking-widest block mb-2 uppercase";
  const inputClass = "w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#E62424] focus:ring-4 focus:ring-red-500/10 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center text-slate-900">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-lg border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-3xl p-8 sm:p-10 relative">
        
        {/* Close button */}
        <Link 
          href="/" 
          className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors absolute top-4 right-4"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </Link>

        {!submitted ? (
          <>
            <div className="text-center mb-8 border-b border-slate-100 pb-6">
              <h1 className="text-3xl font-extrabold text-slate-955 tracking-tight">Register as a Certified Merchant</h1>
              <p className="text-slate-500 mt-2 text-sm">Join our luxury commerce platform and sell genuine parts to verified owners.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.fullName} 
                    onChange={e => setFormData({...formData, fullName: e.target.value})} 
                    className={inputClass} 
                    placeholder="e.g. John Doe" 
                  />
                </div>
                <div>
                  <label className={labelClass}>Store / Business Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.businessName} 
                    onChange={e => setFormData({...formData, businessName: e.target.value})} 
                    className={inputClass} 
                    placeholder="e.g. EuroSpec Parts Ltd." 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Professional Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className={inputClass} 
                    placeholder="merchant@business.com" 
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className={inputClass} 
                    placeholder="+1 (555) 019-2834" 
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Commercial Registry / VAT Number</label>
                <input 
                  type="text" 
                  required 
                  value={formData.vatNumber} 
                  onChange={e => setFormData({...formData, vatNumber: e.target.value})} 
                  className={inputClass} 
                  placeholder="e.g. VAT-US-881273615" 
                />
              </div>

              <div>
                <label className={labelClass}>Store Category</label>
                <select
                  value={formData.storeCategory}
                  onChange={e => setFormData({...formData, storeCategory: e.target.value})}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="Spare Parts & Rotors">Spare Parts &amp; Rotors</option>
                  <option value="Performance Modifications">Performance Modifications</option>
                  <option value="EV Systems & Batteries">EV Systems &amp; Batteries</option>
                  <option value="Engine Fluids & Oils">Engine Fluids &amp; Oils</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full h-12 bg-[#E62424] hover:bg-[#d01f1f] text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-500/10 active:scale-[0.99] transition-all cursor-pointer mt-6"
              >
                Submit Merchant Application
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Application Received</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
              Thank you for applying. Your merchant profile, inventory details, and VAT registry records have been securely queued for verification.
            </p>
            <Link 
              href="/" 
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors inline-block"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

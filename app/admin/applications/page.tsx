'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Wrench, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  XOctagon, 
  UserCheck, 
  Building2, 
  ArrowLeft,
  Mail,
  Phone,
  Layers,
  FileText
} from 'lucide-react';
import { usePartnershipStore, PartnershipApplication } from '../../../store/partnershipStore';
import { useToastStore } from '../../../store/toastStore';

export default function AdminApplicationsPage() {
  const { applications, approveApplication, denyApplication } = usePartnershipStore();
  const addToast = useToastStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [denyingId, setDenyingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Avoid NextJS SSR hydration mismatches
  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleApprove = (id: string, name: string) => {
    approveApplication(id);
    addToast({
      type: 'success',
      title: 'Partner Approved',
      message: `Access credentials and roles have been dispatched to ${name}.`,
    });
  };

  const handleDenySubmit = (e: React.FormEvent, id: string, name: string) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'A professional rejection reason is mandatory.',
      });
      return;
    }

    denyApplication(id, rejectionReason);
    addToast({
      type: 'info',
      title: 'Application Denied',
      message: `Rejection letter dispatched to ${name}.`,
    });

    setDenyingId(null);
    setRejectionReason('');
  };

  // Filter application segments
  const filteredApps = applications.filter((app) => app.status === activeTab);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center font-sans text-white">
        <div className="w-10 h-10 border-3 border-white/10 border-t-[#E12F2F] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] font-sans text-white selection:bg-[#E12F2F]/20 selection:text-[#E12F2F] pb-16">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_#E12F2F_0%,_transparent_65%)] opacity-10 blur-[100px] pointer-events-none" />

      {/* Admin Header Grid */}
      <header className="border-b border-white/[0.05] bg-[#0F0F0F]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="w-11 h-11 border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.06] rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors min-w-[44px] min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#E12F2F]" />
                B2B Partner Pipeline
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Automate Security Node & KYC Dispatcher
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E12F2F]/10 border border-[#E12F2F]/20 text-[#E12F2F] text-[10px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#E12F2F] rounded-full animate-ping" />
              Verification Queue
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* KPI Scorecard Grid (Folds to Single Column below MD) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: 'Pending Onboarding',
              count: applications.filter(a => a.status === 'pending').length,
              icon: Clock,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20'
            },
            {
              title: 'Approved Partners',
              count: applications.filter(a => a.status === 'approved').length,
              icon: FileCheck,
              color: 'text-green-400',
              bg: 'bg-green-500/10 border-green-500/20'
            },
            {
              title: 'Rejected Filings',
              count: applications.filter(a => a.status === 'rejected').length,
              icon: XOctagon,
              color: 'text-red-400',
              bg: 'bg-red-500/10 border-red-500/20'
            }
          ].map((stat, i) => (
            <div 
              key={stat.title}
              className={`p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between transition-all hover:border-white/[0.1]`}
            >
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-3xl font-black text-white mt-1.5">{stat.count}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5.5 h-5.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Tab Selection Guardrails (Touch target 44px) */}
        <div className="flex border-b border-white/[0.05] mb-8 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'pending' as const, label: 'Pending Queue', icon: Clock },
            { id: 'approved' as const, label: 'Active/Approved', icon: UserCheck },
            { id: 'rejected' as const, label: 'Rejected Filings', icon: XOctagon },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setDenyingId(null);
                  setRejectionReason('');
                }}
                className={`flex items-center gap-2 px-6 h-11 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 min-h-[44px] min-w-[120px] whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#E12F2F] text-white bg-white/[0.03]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-[#E12F2F]' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Queue Feed */}
        <AnimatePresence mode="popLayout">
          {filteredApps.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-20 border border-dashed border-white/[0.06] rounded-[2rem] bg-white/[0.01] flex flex-col items-center justify-center gap-4"
            >
              <Layers className="w-12 h-12 text-white/10" />
              <div>
                <p className="font-bold text-white text-lg">Verification pipeline is empty</p>
                <p className="text-slate-400 text-xs mt-1 font-medium max-w-sm">
                  There are no current applications cataloged in the {activeTab} stage.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredApps.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-6 flex flex-col justify-between hover:border-white/[0.1] transition-all relative overflow-hidden group"
                >
                  {/* Category Glow Tag */}
                  <div className={`absolute top-0 right-6 px-3 py-1 rounded-b-xl text-[10px] font-black uppercase tracking-wider ${
                    app.roleApplied === 'Mechanic' 
                      ? 'bg-blue-500/10 text-blue-400 border-x border-b border-blue-500/20' 
                      : app.roleApplied === 'Merchant' 
                      ? 'bg-purple-500/10 text-purple-400 border-x border-b border-purple-500/20' 
                      : 'bg-teal-500/10 text-teal-400 border-x border-b border-teal-500/20'
                  }`}>
                    {app.roleApplied}
                  </div>

                  <div>
                    {/* Header */}
                    <div className="flex gap-4 items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-300 flex-shrink-0">
                        {app.roleApplied === 'Mechanic' ? <Wrench className="w-5.5 h-5.5 text-blue-400" /> : <Building2 className="w-5.5 h-5.5 text-purple-400" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-white text-base truncate">{app.applicantName}</h3>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {app.businessName}
                        </p>
                      </div>
                    </div>

                    {/* Shared Credentials List */}
                    <div className="space-y-2.5 bg-white/[0.01] border border-white/[0.03] p-4 rounded-2xl mb-6">
                      <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span className="truncate">{app.email}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span>{app.phone}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          Filed {new Date(app.timestamp).toLocaleDateString()} at {new Date(app.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Conditional Role Metadata */}
                    <div className="border-t border-white/[0.04] pt-4 mb-6">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">KYC Verification Data</p>
                      
                      {app.roleApplied === 'Mechanic' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-semibold text-slate-500 block">License Code</span>
                            <span className="text-xs font-bold text-white mt-0.5 block">{app.roleData.licenseNumber}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-slate-500 block">Tuning specialty</span>
                            <span className="text-xs font-bold text-blue-400 mt-0.5 block">{app.roleData.specialization}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-semibold text-slate-500 block">Commercial ID / VAT</span>
                            <span className="text-xs font-bold text-white mt-0.5 block">{app.roleData.vatNumber}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-slate-500 block">Distribution Class</span>
                            <span className="text-xs font-bold text-purple-400 mt-0.5 block">{app.roleData.inventoryCategory}</span>
                          </div>
                        </div>
                      )}

                      {/* Display rejection rationale if looking at rejected tab */}
                      {app.status === 'rejected' && app.roleData.rejectionReason && (
                        <div className="mt-4 p-3.5 rounded-xl bg-red-500/5 border border-red-500/10">
                          <span className="text-[10px] font-black text-red-400 uppercase tracking-wider block">Rejection Audit Log</span>
                          <span className="text-xs text-slate-400 font-medium mt-1 block italic">"{app.roleData.rejectionReason}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Guardrails (Strict B2B choices, min 44px target) */}
                  {app.status === 'pending' && (
                    <div className="border-t border-white/[0.04] pt-5 flex flex-col gap-4">
                      {denyingId !== app.id ? (
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => handleApprove(app.id, app.applicantName)}
                            className="h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 border border-emerald-500/40 min-h-[44px] cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => setDenyingId(app.id)}
                            className="h-11 bg-[#E12F2F] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/10 border border-red-500/40 min-h-[44px] cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            Deny Application
                          </button>
                        </div>
                      ) : (
                        <motion.form 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          onSubmit={(e) => handleDenySubmit(e, app.id, app.applicantName)}
                          className="space-y-4"
                        >
                          <div>
                            <label className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Specify Rejection Reason</label>
                            <textarea
                              required
                              rows={2}
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="e.g. Workshop license number could not be validated via state DMV database."
                              className="w-full p-3 rounded-xl border border-red-500/20 bg-slate-950 text-xs font-semibold text-white placeholder-slate-600 outline-none focus:border-red-500 transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                setDenyingId(null);
                                setRejectionReason('');
                              }}
                              className="h-11 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 border border-white/[0.06] min-h-[44px] cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="h-11 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 border border-red-500 min-h-[44px] cursor-pointer"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

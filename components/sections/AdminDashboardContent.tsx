'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  ShieldAlert, 
  PackageSearch, 
  Briefcase, 
  ArrowRight,
  Database,
  Cpu,
  Server
} from 'lucide-react';

export function AdminDashboardContent() {
  const stats = [
    { title: 'Core Server Load', value: '14.2%', color: 'text-emerald-400', desc: 'Running optimally' },
    { title: 'Connected Nodes', value: '4 nodes', color: 'text-blue-400', desc: 'Sync Active' },
    { title: 'Auth Hydration', value: '99.98%', color: 'text-purple-400', desc: 'SSL 256-bit safe' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] text-slate-900 min-h-screen">
      {/* Welcome & System Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-slate-950">System Controller</h2>
          <p className="text-slate-500 text-xs font-semibold mt-1">Platform-wide microservices metrics & catalog registries.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          Gateway Connected
        </div>
      </div>

      {/* Grid of Microservice KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.title} className="p-6 rounded-3xl bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all duration-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.title}</p>
            <p className={`text-3xl font-black mt-2 ${s.color === 'text-emerald-400' ? 'text-emerald-600' : s.color === 'text-blue-400' ? 'text-blue-600' : 'text-purple-600'}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* Module Card: B2B Onboarding pipeline */}
        <div className="theme-glass-card bg-white/80 border border-slate-200/70 p-6 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#E12F2F]/5 border border-[#E12F2F]/10 flex items-center justify-center text-[#E12F2F] mb-6">
              <Briefcase className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">B2B Partner Pipeline</h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mt-2">
              Review, approve, or deny registration filings from external workshop mechanics, spare parts merchants, and bulk suppliers.
            </p>
          </div>
          <Link href="/admin/applications" className="block mt-6">
            <motion.div 
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-1.5 text-[#E12F2F] text-xs font-bold uppercase tracking-widest cursor-pointer hover:underline"
            >
              <span>Manage Application Queue</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>

        {/* Module Card: Active Databases */}
        <div className="theme-glass-card bg-white/80 border border-slate-200/70 p-6 rounded-3xl flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
              <Database className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">System Logs & DB Sync</h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mt-2">
              Inspect decentralized telemetry nodes, rehydrate auth persistent layers, and trace cross-role client events in real-time.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mt-6 cursor-not-allowed">
            <span>Developer Mode Restricted</span>
          </div>
        </div>

      </div>
    </div>
  );
}

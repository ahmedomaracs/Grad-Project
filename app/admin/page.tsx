'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useToastStore } from '../../store/toastStore';

export default function AdminCommandCenter() {
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);
  
  // Platform system alerts metrics dataset mock tracking
  const metricsKpi = [
    { title: 'Total Revenue Month', value: 'EGP 482,900', icon: '💰', trend: '+14.2% vs May' },
    { title: 'Active Providers', value: '142 Mechanics', icon: '🔧', trend: '12 Pending vetting' },
    { title: 'Open Store Orders', value: '89 Requests', icon: '🛒', trend: '9 Low-stock flags' },
    { title: 'Wallet Ledger Pool', value: 'EGP 1.2M', icon: '💳', trend: 'Stripe Pipeline Online' },
  ];

  const handleRapidOverride = (action: string) => {
    addToast({
      type: 'info',
      title: 'Override Initiated',
      message: `Action [${action}] executed successfully by system administrator.`,
    });
  };

  return (
    <div className="space-y-10">
      
      {/* VIEWPORT ROW HEADER BLOCK */}
      <div>
        <span className="text-[10px] font-black uppercase text-[#E62424] bg-red-50 px-3 py-1 rounded-full tracking-wider">
          Central Node Infrastructure
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 uppercase">Command Center</h1>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Real-time performance metrics log summary data tracking fields.
        </p>
      </div>

      {/* 4-COLUMN KPI DATA MATRICES DECK GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsKpi.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">{kpi.title}</span>
              <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">{kpi.icon}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{kpi.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* EMERGENCY SYSTEM ALERTS PANEL BLOCK CONTAINER */}
      <div className="bg-white border border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold shrink-0">⚠️</div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">Vetting Backlog / Inventory Alerts Action Item</h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">There are 12 mechanic candidate registration packets awaiting review, and 2 OEM part lines hitting critical replenishment threshold values.</p>
          </div>
        </div>
        <button 
          onClick={() => router.push('/admin/users')}
          className="px-4 py-2.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-[#E62424] transition-colors shrink-0 self-start md:self-auto cursor-pointer"
        >
          Review Alerts Node
        </button>
      </div>

      {/* TWO COLUMN LOWER PANEL WORKSPACE DATA LOG ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic Recent Events Flow Timeline List Container (Left Column) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Recent Activity Ingestion Ledger</h3>
          <div className="space-y-4">
            {[
              { text: 'New Merchant registration packet submitted by Brembo Official Cairo Hub.', time: '4 mins ago', type: 'Merchant' },
              { text: 'Wallet balance deposit of EGP 24,000 processed successfully via Stripe.', time: '22 mins ago', type: 'Ledger' },
              { text: 'Appointment slot confirmed: Client ID #42022132 mapped to Marcus Chen.', time: '1 hr ago', type: 'Booking' }
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-medium">
                <p className="text-slate-700 leading-normal"><span className="font-black text-slate-900 uppercase tracking-tight mr-2">[{activity.type}]</span> {activity.text}</p>
                <span className="text-[10px] text-slate-400 font-bold shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Commands Platform Action Utility Deck Panel Box (Right Column) */}
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-2">Rapid System Direct Overrides</h3>
          
          <button 
            onClick={() => handleRapidOverride('Freeze Active User Token Link')}
            className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider rounded-xl text-left px-4 hover:border-slate-900 hover:bg-white transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>Freeze Active User Token Link</span>
            <span>🔒</span>
          </button>
          
          <button 
            onClick={() => handleRapidOverride('Trigger Bulk Merchant Settlement Payout')}
            className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider rounded-xl text-left px-4 hover:border-slate-900 hover:bg-white transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>Trigger Bulk Merchant Settlement Payout</span>
            <span>💸</span>
          </button>

          <button 
            onClick={() => handleRapidOverride('Edit Base Commission Rules')}
            className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider rounded-xl text-left px-4 hover:border-slate-900 hover:bg-white transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>Edit Base Commission Rules</span>
            <span>⚙️</span>
          </button>
        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useToastStore } from '../../../store/toastStore';

interface LedgerTransaction {
  id: string; // ORD-XXXXX or TXN-XXXXX
  date: string;
  type: 'Platform Split' | 'Merchant Payout' | 'Deposit' | 'Payout' | 'Refund';
  details: string;
  gross: number; // in EGP
  fee: number; // in EGP
  net: number; // in EGP
  status: 'Success' | 'Pending' | 'Refunded';
}

const LOCAL_LEDGER_KEY = 'automate-admin-ledger-transactions';

export default function AdminLedgerPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load and seed ledger transactions from localStorage
  useEffect(() => {
    setHydrated(true);
    const stored = localStorage.getItem(LOCAL_LEDGER_KEY);
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      const initialTransactions: LedgerTransaction[] = [
        { id: 'ORD-88421', date: 'June 22, 2026', type: 'Platform Split', details: 'Brembo Brake Pads Purchase Split', gross: 2700, fee: 270, net: 2430, status: 'Success' },
        { id: 'ORD-77312', date: 'June 21, 2026', type: 'Merchant Payout', details: 'EuroSpec Parts Settlement Payout', gross: 4500, fee: 0, net: 4500, status: 'Success' },
        { id: 'ORD-20261', date: 'June 20, 2026', type: 'Deposit', details: 'Client Stripe Balance Top-Up', gross: 12000, fee: 0, net: 12000, status: 'Success' },
        { id: 'ORD-42022', date: 'June 18, 2026', type: 'Platform Split', details: 'Porsche Diagnostics Fee Split', gross: 1450, fee: 145, net: 1305, status: 'Success' },
        { id: 'ORD-10928', date: 'June 17, 2026', type: 'Platform Split', details: 'Workshop Battery Tuning Split', gross: 3800, fee: 380, net: 3420, status: 'Pending' },
        { id: 'ORD-55421', date: 'June 15, 2026', type: 'Payout', details: 'Automated Partner Weekly Payout', gross: 75000, fee: 0, net: 75000, status: 'Success' },
      ];
      localStorage.setItem(LOCAL_LEDGER_KEY, JSON.stringify(initialTransactions));
      setTransactions(initialTransactions);
    }
  }, []);

  const saveTransactions = (updated: LedgerTransaction[]) => {
    setTransactions(updated);
    localStorage.setItem(LOCAL_LEDGER_KEY, JSON.stringify(updated));
  };

  const handleRefundOverride = (txId: string) => {
    const updated = transactions.map((tx) => {
      if (tx.id === txId) {
        if (tx.status === 'Refunded') {
          addToast({
            type: 'error',
            title: 'Refund Action Invalid',
            message: `Transaction ${txId} has already been refunded.`,
          });
          return tx;
        }

        // Add a refund transaction record and update this one
        addToast({
          type: 'success',
          title: 'Manual Override Refund Processed',
          message: `Stripe payout reverse dispatched for ID ${txId}.`,
        });
        return { ...tx, status: 'Refunded' as const };
      }
      return tx;
    });

    // Append the refund tracking log row
    const targetTx = transactions.find((t) => t.id === txId);
    if (targetTx && targetTx.status !== 'Refunded') {
      const refundEntry: LedgerTransaction = {
        id: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        type: 'Refund',
        details: `Reversal of ${targetTx.details}`,
        gross: -targetTx.gross,
        fee: -targetTx.fee,
        net: -targetTx.net,
        status: 'Success',
      };
      saveTransactions([refundEntry, ...updated]);
    } else {
      saveTransactions(updated);
    }
  };

  // Compute stats dynamically
  const platformRevenue = transactions
    .filter((tx) => tx.type === 'Platform Split' && tx.status !== 'Refunded')
    .reduce((sum, tx) => sum + tx.fee, 0);

  const totalPool = transactions
    .filter((tx) => tx.status === 'Success')
    .reduce((sum, tx) => sum + (tx.type === 'Refund' ? tx.net : tx.net), 0);

  if (!hydrated) {
    return (
      <div className="flex flex-col h-96 bg-[#F8FAFC] items-center justify-center font-sans">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* HEADER SECTION */}
      <div>
        <span className="text-[10px] font-black uppercase text-[#E62424] bg-red-50 px-3 py-1 rounded-full tracking-wider">
          Financial Custody System
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 uppercase">Financial Ledger</h1>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          System-wide accounting ledger log tracking transaction history, platform fee splits, and B2B payout pipelines.
        </p>
      </div>

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Ledger Pool Card */}
        <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Wallet Ledger Pool</span>
            <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">💳</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">EGP {(1200000 + totalPool).toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Live Custody Balance</p>
          </div>
        </div>

        {/* Platform Revenue Card */}
        <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Month Fee Splits</span>
            <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">💰</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">EGP {(48290 + platformRevenue).toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-green-600 mt-0.5 uppercase tracking-wide">+10.2% fee margins</p>
          </div>
        </div>

        {/* Deposit Channels Card */}
        <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Deposit Pipeline</span>
            <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">📥</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">EGP 242,900</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Stripe Ingestion Online</p>
          </div>
        </div>

        {/* Payout Pipeline Card */}
        <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Payout Pipeline</span>
            <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm">💸</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">EGP 112,400</h3>
            <p className="text-[10px] font-bold text-amber-600 mt-0.5 uppercase tracking-wide">Weekly Settlements Run</p>
          </div>
        </div>

      </div>

      {/* FINANCIAL LEDGER MASTER DATA TABLE */}
      <div className="bg-white border border-slate-200/60 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
            System Accounting Ingestion Log
          </h3>
          <span className="text-[10px] font-black bg-slate-900 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
            Stripe & Wallet Pipelines Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-8 py-4">Transaction ID & Date</th>
                <th className="px-8 py-4">Accounting Type</th>
                <th className="px-8 py-4">Ingestion Details</th>
                <th className="px-8 py-4">Gross Sum</th>
                <th className="px-8 py-4">Platform Fee Split</th>
                <th className="px-8 py-4">Net Pool Sum</th>
                <th className="px-8 py-4">Status Node</th>
                <th className="px-8 py-4 text-right">Actions Override</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* ID & Date */}
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-slate-950 font-mono font-bold tracking-tight">
                          {tx.id}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">
                          {tx.date}
                        </p>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-8 py-5">
                      <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                        tx.type === 'Platform Split'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : tx.type === 'Deposit'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : tx.type === 'Payout' || tx.type === 'Merchant Payout'
                          ? 'bg-purple-50 text-purple-600 border border-purple-100'
                          : 'bg-red-50 text-[#E62424] border border-red-100'
                      }`}>
                        {tx.type}
                      </span>
                    </td>

                    {/* Details */}
                    <td className="px-8 py-5 uppercase text-slate-500 font-medium">
                      {tx.details}
                    </td>

                    {/* Gross */}
                    <td className="px-8 py-5 font-bold text-slate-900">
                      {tx.gross < 0 ? '-' : ''}EGP {Math.abs(tx.gross).toLocaleString()}
                    </td>

                    {/* Fee */}
                    <td className="px-8 py-5 font-mono text-[10px] text-slate-500">
                      {tx.fee > 0 ? `EGP ${tx.fee.toLocaleString()}` : '—'}
                    </td>

                    {/* Net */}
                    <td className={`px-8 py-5 font-bold ${
                      tx.net < 0 ? 'text-[#E62424]' : 'text-slate-950'
                    }`}>
                      {tx.net < 0 ? '-' : ''}EGP {Math.abs(tx.net).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        tx.status === 'Success'
                          ? 'bg-green-50 text-green-600'
                          : tx.status === 'Pending'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-red-50 text-[#E62424] border border-red-200/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === 'Success'
                            ? 'bg-green-500'
                            : tx.status === 'Pending'
                            ? 'bg-amber-500 animate-pulse'
                            : 'bg-[#E62424]'
                        }`} />
                        {tx.status}
                      </span>
                    </td>

                    {/* Overrides */}
                    <td className="px-8 py-5 text-right">
                      {tx.status !== 'Refunded' && tx.type === 'Platform Split' ? (
                        <button
                          onClick={() => handleRefundOverride(tx.id)}
                          className="px-3 py-2 bg-slate-950 hover:bg-[#E62424] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Process Manual Override Refund
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Locked</span>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-8 py-10 text-center text-slate-400 font-semibold uppercase tracking-wider">
                    No transactions registered in the accounting database.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}

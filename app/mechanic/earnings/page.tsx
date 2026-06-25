'use client';

import React from 'react';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useRequireRole } from '@/hooks/useRequireRole';
import { useLocalDB, GlobalBooking } from '@/store/localDB';
import { MOCK_COMPLETED_BOOKINGS } from '@/store/mockData';
import { Button } from '@/components/ui/Button';
import { TrendingUp, FileText, Download, DollarSign, Activity } from 'lucide-react';

export default function MechanicEarningsPage() {
  const { isLoading, user } = useRequireRole('Mechanic');
  const allBookings = useLocalDB((s) => s.globalBookings);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" />
      </div>
    );
  }

  const PLATFORM_FEE_PERCENTAGE = 0.15; // 15% platform split

  const completedJobs = allBookings.filter(
    (b) => (b.mechanicId === user.email || b.mechanicName === user.email) && b.status === 'Completed'
  );

  const displayCompletedJobs = completedJobs.length > 0 ? completedJobs : MOCK_COMPLETED_BOOKINGS;

  const calculateGross = (invoice?: GlobalBooking['invoice']) => {
    if (!invoice) return 0;
    const partsTotal = invoice.parts?.reduce((sum, p) => sum + p.price, 0) || 0;
    return partsTotal + (invoice.laborTotal || 0);
  };

  const ledgerData = displayCompletedJobs.map((job) => {
    const gross = calculateGross(job.invoice);
    const fee = gross * PLATFORM_FEE_PERCENTAGE;
    const net = gross - fee;

    return {
      id: job.id,
      timestamp: new Date(job.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      gross,
      fee,
      net,
      clientName: job.clientName,
      service: job.serviceType,
    };
  });

  const totalGross = ledgerData.reduce((sum, row) => sum + row.gross, 0);
  const totalNet = ledgerData.reduce((sum, row) => sum + row.net, 0);

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display text-gray-900">Earnings Transparency Ledger</h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">Track completed job payouts and platform split deductions securely.</p>
          </div>
          <Button variant="outline" className="h-10 text-sm font-bold bg-white hidden sm:flex">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        {/* High-Level Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Gross Revenue</p>
              <h3 className="text-2xl font-extrabold text-gray-900">EGP {totalGross.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-[#E12F2F]/20 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E12F2F]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total Net Payout</p>
              <h3 className="text-2xl font-extrabold text-[#E12F2F]">EGP {totalNet.toFixed(2)}</h3>
            </div>
            <div className="relative z-10 w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
              <TrendingUp className="w-6 h-6 text-[#E12F2F]" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Completed Tickets</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{ledgerData.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-extrabold text-gray-900">Financial Ledger (Completed Jobs)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-extrabold">
                  <th className="px-6 py-4">Invoice ID / Job Details</th>
                  <th className="px-6 py-4">Completion Date</th>
                  <th className="px-6 py-4 text-right">Gross Amount</th>
                  <th className="px-6 py-4 text-right">Marketplace Fee (15%)</th>
                  <th className="px-6 py-4 text-right text-gray-900">Net Cash Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ledgerData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-semibold bg-white">
                      No completed invoices found for your account yet.
                    </td>
                  </tr>
                )}
                {ledgerData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 font-mono text-xs">{row.id.substring(0, 12).toUpperCase()}</div>
                      <div className="text-[10px] text-gray-500 font-semibold mt-1 truncate max-w-[200px]">
                        {row.clientName} • {row.service}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 font-semibold">{row.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-extrabold text-gray-700">EGP {row.gross.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded-lg">
                        - EGP {row.fee.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-extrabold text-[#E12F2F]">
                        EGP {row.net.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

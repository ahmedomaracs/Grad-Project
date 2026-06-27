'use client';

import React, { Suspense } from 'react';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useAuthStore } from '@/store/authStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useLocalDB } from '@/store/localDB';
import { AlertTriangle, Users } from 'lucide-react';

function CustomersPageContent() {
  const { user } = useRequireAuth();
  const { user: storeUser } = useAuthStore();
  const merchantId = storeUser?.email ?? 'merchant_demo';
  const allOrders = useLocalDB(s => s.globalOrders);
  
  const merchantOrders = (allOrders || []).filter(o => o.merchantId === merchantId);

  if (!user || user.role !== 'Merchant') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">You do not have permission to view the merchant dashboard.</p>
      </div>
    );
  }

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display text-gray-900">Customer Management</h1>
            <p className="text-gray-500 font-medium mt-1">View and manage your customer relationships</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4 mb-6">
            <Users className="w-8 h-8 text-[#E12F2F]" />
            <h2 className="text-xl font-bold text-gray-900">Customers List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold rounded-tl-xl">Client Name</th>
                  <th className="p-4 font-bold">Client ID</th>
                  <th className="p-4 font-bold">Orders Count</th>
                  <th className="p-4 font-bold rounded-tr-xl">Total Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from(new Set(merchantOrders.map(o => o.clientUserId))).map(clientId => {
                  const clientOrders = merchantOrders.filter(o => o.clientUserId === clientId);
                  const clientName = clientOrders[0]?.clientName || 'Unknown';
                  const totalSpend = clientOrders.reduce((sum, o) => sum + o.totalPrice, 0);
                  return (
                    <tr key={clientId} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-bold text-gray-900">{clientName}</td>
                      <td className="p-4 text-sm font-medium text-gray-500">{clientId}</td>
                      <td className="p-4 text-sm font-bold text-[#E12F2F]">{clientOrders.length}</td>
                      <td className="p-4 text-sm font-bold text-green-600">EGP {totalSpend.toLocaleString()}</td>
                    </tr>
                  );
                })}
                {merchantOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">No customers yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

export default function MerchantCustomersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" />
      </div>
    }>
      <CustomersPageContent />
    </Suspense>
  );
}

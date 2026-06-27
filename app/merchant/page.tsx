'use client';

import React, { Suspense } from 'react';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { AnalyticsTab } from '@/components/dashboard/merchant/AnalyticsTab';
import { useAuthStore } from '@/store/authStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AlertTriangle } from 'lucide-react';

export default function MerchantOverviewPage() {
  const { user } = useRequireAuth();
  const { user: storeUser } = useAuthStore();
  const merchantId = storeUser?.email ?? 'merchant_demo';

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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" />
      </div>
    }>
      <WorkspaceLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display text-gray-900">Business Analytics</h1>
              <p className="text-gray-500 font-medium mt-1">Track your performance and revenue</p>
            </div>
          </div>
          <AnalyticsTab merchantId={merchantId} />
        </div>
      </WorkspaceLayout>
    </Suspense>
  );
}

'use client';

import React from 'react';
import { useLocalDB } from '../../../store/localDB';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export function AnalyticsTab({ merchantId }: { merchantId: string }) {
  const { globalOrders, globalProducts } = useLocalDB();
  const orders = globalOrders.filter(o => o.merchantId === merchantId && o.status !== 'Cancelled');
  const products = globalProducts.filter(p => p.merchantId === merchantId);

  // Compute dummy metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalCost = products.reduce((sum, p) => sum + p.itemCost, 0); // Simplified cost calculation
  const netProfit = totalRevenue - totalCost;

  // Mock Sales Velocity Data for a simple bar chart visualization
  const salesData = [
    { day: 'Mon', val: 40 },
    { day: 'Tue', val: 70 },
    { day: 'Wed', val: 45 },
    { day: 'Thu', val: 90 },
    { day: 'Fri', val: 65 },
    { day: 'Sat', val: 120 },
    { day: 'Sun', val: 85 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-green-600 mb-4">
            <div className="p-2 bg-green-50 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm uppercase tracking-wide">Net Profit</span>
          </div>
          <p className="text-3xl font-black text-gray-900">${netProfit.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-blue-600 mb-4">
            <div className="p-2 bg-blue-50 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm uppercase tracking-wide">Total Revenue</span>
          </div>
          <p className="text-3xl font-black text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-purple-600 mb-4">
            <div className="p-2 bg-purple-50 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm uppercase tracking-wide">Avg Order Value</span>
          </div>
          <p className="text-3xl font-black text-gray-900">
            ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Velocity (7 Days)</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {salesData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                <div 
                  className="w-full bg-orange-100 rounded-t-xl group-hover:bg-[#FF2D2D] transition-colors relative"
                  style={{ height: `${(d.val / 120) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${d.val}
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top-Selling Products</h3>
          <div className="space-y-4">
            {products.slice(0, 4).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-400 text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-[#FF2D2D]">${p.basePrice.toFixed(2)}</p>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">Add products to track their performance.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

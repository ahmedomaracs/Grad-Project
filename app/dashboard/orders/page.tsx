'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Package, MapPin, Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export default function OrderHistoryPage() {
  const { orders, user } = useAuthStore();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-[80vh]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
        <Link href="/dashboard" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
          <Home className="w-3 h-3" /> Dashboard
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">Orders</span>
      </nav>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
        <p className="text-sm text-slate-500 font-medium mt-1 max-w-2xl">
          Manage your parts purchases, invoices, and active tracking deliveries. Click on any order row to view detailed shipping and breakdown information.
        </p>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div className="border border-dashed border-slate-200 bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-2xl mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your order history is empty</h3>
          <p className="text-sm text-slate-400 font-medium max-w-sm mt-2 mb-6">
            You haven't purchased any parts or scheduled package items yet.
          </p>
          <Link href="/shop" className="bg-slate-950 text-white hover:bg-[#E62424] active:scale-[0.98] transition-all px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(230,36,36,0.23)]">
            Browse Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Populated Orders State Table/List */
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Date Purchased</th>
                  <th className="py-4 px-6">Items Description</th>
                  <th className="py-4 px-6">Total Paid</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
                {orders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  
                  return (
                    <React.Fragment key={order.id}>
                      <tr 
                        onClick={() => toggleRow(order.id)}
                        className={`transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}
                      >
                        <td className="py-4 px-6 font-mono font-bold text-slate-900">{order.id}</td>
                        <td className="py-4 px-6 text-slate-500">{order.date}</td>
                        <td className="py-4 px-6 text-slate-900 font-semibold flex items-center gap-3">
                          <img src={order.image} alt={order.productName} className="w-8 h-8 rounded object-cover border border-slate-100 shadow-sm" />
                          <span className="line-clamp-1 max-w-[200px]">{order.quantity}x {order.productName}</span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">EGP {(order.price * order.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : order.status === 'Processing'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-slate-400">
                          <button className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                      {/* Expandable Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 border-t border-slate-100">
                          <td colSpan={6} className="p-0">
                            <div className="p-6 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm relative overflow-hidden">
                                {/* Decorative line */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#E62424]" />
                                
                                {/* Product Summary */}
                                <div className="col-span-1 md:col-span-2 flex gap-5">
                                  <div className="w-24 h-24 rounded-xl border border-slate-100 shadow-sm bg-white p-2 flex-shrink-0 flex items-center justify-center">
                                    <img src={order.image} alt={order.productName} className="max-w-full max-h-full object-contain" />
                                  </div>
                                  <div className="flex flex-col justify-center">
                                    <h4 className="text-sm font-black text-slate-900">{order.productName}</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Brand: <span className="text-slate-900 font-bold">{order.brand}</span></p>
                                    <div className="mt-3 inline-flex flex-wrap items-center gap-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-xs">
                                      <span className="text-slate-500">Qty: <strong className="text-slate-900">{order.quantity}</strong></span>
                                      <span className="text-slate-300">|</span>
                                      <span className="text-slate-500">Unit Price: <strong className="text-slate-900 font-mono">EGP {order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                                    </div>
                                  </div>
                                </div>
                                {/* Meta Data */}
                                <div className="col-span-1 flex flex-col justify-center space-y-4 border-l border-slate-100 pl-6">
                                  <div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                                      <MapPin className="w-3 h-3 text-[#E62424]" /> Shipping Address
                                    </div>
                                    <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                                      {user?.address || "10th of Ramadan City, Al-Sharqia Governorate, Egypt"}
                                    </p>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                                      <Clock className="w-3 h-3 text-[#E62424]" /> Order Timestamp
                                    </div>
                                    <p className="text-xs font-semibold text-slate-800">
                                      {order.date} at 14:32 PM (GST)
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

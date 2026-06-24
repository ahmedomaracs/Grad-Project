'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Home, Package, MapPin, Clock, ArrowRight,
  ChevronDown, ChevronUp, Wrench, ShoppingBag, CheckCircle2,
  Truck, AlertCircle, RefreshCw, Link2
} from 'lucide-react';
import { useAuthStore, OrderManifestRecord } from '../../../store/authStore';
import { ShopNavbar } from '../../../components/shop/ShopNavbar';
import { CartDrawer } from '../../../components/shop/CartDrawer';

/* ── Status Badge ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: OrderManifestRecord['deliveryStatus'] }) {
  const map: Record<OrderManifestRecord['deliveryStatus'], { cls: string; icon: React.ReactNode }> = {
    Processing: { cls: 'bg-amber-50 text-amber-600 border-amber-200', icon: <RefreshCw className="w-2.5 h-2.5" /> },
    Shipped:    { cls: 'bg-blue-50 text-blue-600 border-blue-200',     icon: <Truck className="w-2.5 h-2.5" /> },
    Delivered:  { cls: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: <CheckCircle2 className="w-2.5 h-2.5" /> },
    Cancelled:  { cls: 'bg-red-50 text-red-500 border-red-200',        icon: <AlertCircle className="w-2.5 h-2.5" /> },
  };
  const { cls, icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cls}`}>
      {icon}{status}
    </span>
  );
}

/* ── Delivery Type Badge ───────────────────────────────────────── */
function DeliveryBadge({ type }: { type: OrderManifestRecord['deliveryType'] }) {
  return type === 'SHIP_TO_WORKSHOP' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E62424]/10 text-[#E62424] text-[9px] font-black uppercase border border-[#E62424]/20">
      <Wrench className="w-2.5 h-2.5" /> Workshop
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase border border-slate-200">
      <Home className="w-2.5 h-2.5" /> Direct Home
    </span>
  );
}

/* ── Expandable Detail Panel ──────────────────────────────────── */
function OrderDetailPanel({ order }: { order: OrderManifestRecord }) {
  const ts = new Date(order.timestamp);
  const dateStr = ts.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div className="p-6 bg-slate-50/60 border-t border-slate-100">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          {/* Left accent bar */}
          <div className="absolute top-0 left-0 w-1 h-full bg-[#E62424] rounded-l-2xl" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="md:col-span-2 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3" /> Purchased Items
              </p>
              <div className="divide-y divide-slate-100">
                {order.purchasedItems.map((item, i) => (
                  <div key={`${item.productId}-${i}`} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Qty: {item.quantity} · EGP {item.unitPriceEGP.toFixed(2)} each
                      </p>
                    </div>
                    <span className="text-sm font-black text-slate-900 font-mono flex-shrink-0">
                      EGP {(item.unitPriceEGP * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial summary row */}
              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-100 mt-2">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>Subtotal</span><span className="font-mono">EGP {order.financialSummary.subtotalEGP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>Shipping</span><span className="text-emerald-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>Tax</span><span className="font-mono">EGP {order.financialSummary.taxEGP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Paid</span>
                  <span className="font-mono text-[#E62424]">EGP {order.financialSummary.totalPaidEGP.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Meta data */}
            <div className="space-y-4 border-l border-slate-100 pl-5">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                  <MapPin className="w-3 h-3 text-[#E62424]" /> Delivery Address
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">{order.shippingAddress}</p>
                <div className="mt-2">
                  <DeliveryBadge type={order.deliveryType} />
                </div>
              </div>

              {order.linkedAppointmentId && (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                    <Link2 className="w-3 h-3 text-[#E62424]" /> Linked Appointment
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#E62424]/5 border border-[#E62424]/20 text-[10px] font-black font-mono text-[#E62424]">
                    {order.linkedAppointmentId}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                  <Clock className="w-3 h-3 text-[#E62424]" /> Order Timestamp
                </div>
                <p className="text-xs font-semibold text-slate-800">{dateStr}</p>
                <p className="text-[10px] text-slate-400 font-mono">{timeStr} (Local)</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
                  <Package className="w-3 h-3 text-[#E62424]" /> Customer
                </div>
                <p className="text-xs font-semibold text-slate-800">{order.customerDetails.fullName}</p>
                <p className="text-[10px] text-slate-400 font-mono">{order.customerDetails.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function OrderHistoryPage() {
  const { orderManifests } = useAuthStore();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ShopNavbar />
      <CartDrawer />
      
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
            <Home className="w-3 h-3" /> Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">Orders</span>
        </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
          <p className="text-sm text-slate-500 font-medium mt-1 max-w-2xl">
            Manage your parts purchases, invoices, and active delivery tracking. Click any row to expand the full breakdown.
          </p>
        </div>
        {orderManifests.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
              {orderManifests.length} {orderManifests.length === 1 ? 'order' : 'orders'}
            </span>
            <span className="bg-[#E62424]/10 text-[#E62424] border border-[#E62424]/20 px-3 py-1.5 rounded-xl font-black">
              EGP {orderManifests.reduce((s, o) => s + o.financialSummary.totalPaidEGP, 0).toFixed(2)} total
            </span>
          </div>
        )}
      </div>

      {orderManifests.length === 0 ? (
        /* Empty State */
        <div className="border border-dashed border-slate-200 bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-2xl mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your order history is empty</h3>
          <p className="text-sm text-slate-400 font-medium max-w-sm mt-2 mb-6">
            You haven&apos;t purchased any parts or scheduled package items yet.
          </p>
          <Link
            href="/shop"
            className="bg-slate-950 text-white hover:bg-[#E62424] active:scale-[0.98] transition-all px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(230,36,36,0.23)]"
          >
            Browse Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Orders Table */
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Items</th>
                  <th className="py-4 px-6">Delivery</th>
                  <th className="py-4 px-6 text-right">Total Paid</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-3 text-center w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
                {orderManifests.map((order) => {
                  const isExpanded = expandedOrderId === order.orderId;
                  const ts = new Date(order.timestamp);
                  const dateLabel = ts.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const itemSummary = order.purchasedItems.length === 1
                    ? order.purchasedItems[0].name
                    : `${order.purchasedItems[0].name} +${order.purchasedItems.length - 1} more`;

                  return (
                    <React.Fragment key={order.orderId}>
                      <tr
                        onClick={() => toggleRow(order.orderId)}
                        className={`cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}
                      >
                        <td className="py-4 px-6 font-mono font-bold text-slate-900 text-xs">{order.orderId}</td>
                        <td className="py-4 px-6 text-slate-500 text-xs whitespace-nowrap">{dateLabel}</td>
                        <td className="py-4 px-6">
                          <p className="text-xs font-semibold text-slate-900 line-clamp-1 max-w-[180px]">{itemSummary}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{order.purchasedItems.length} item(s)</p>
                        </td>
                        <td className="py-4 px-6">
                          <DeliveryBadge type={order.deliveryType} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-black text-slate-900 font-mono text-sm">
                            EGP {order.financialSummary.totalPaidEGP.toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <StatusBadge status={order.deliveryStatus} />
                        </td>
                        <td className="py-4 px-3 text-center text-slate-400">
                          <button className="p-1 hover:bg-slate-200 rounded-lg transition-colors" aria-label="Toggle details">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                      {/* Expandable Detail Row */}
                      <tr className="bg-slate-50/30">
                        <td colSpan={7} className="p-0">
                          <AnimatePresence initial={false}>
                            {isExpanded && <OrderDetailPanel key={order.orderId} order={order} />}
                          </AnimatePresence>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

'use client';

import React, { Suspense } from 'react';
import { useMerchantOrderStore } from '../../../store/merchantOrderStore';
import { ShoppingCart, Navigation2, Wrench, AlertTriangle } from 'lucide-react';
import { MerchantOrderEntity, OrderItemEntity } from '../../../types/order';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useAuthStore } from '@/store/authStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export function OrdersTab({ merchantId }: { merchantId: string }) {
  const { orders, updateOrderStatus } = useMerchantOrderStore();
  // Optional: If you eventually want to filter by merchantId
  // const merchantOrders = orders.filter(o => o.merchantId === merchantId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order & Fulfillment Engine</h2>
            <p className="text-sm text-gray-500 font-medium">Manage pipeline states and delivery routing.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {orders.map((order: MerchantOrderEntity) => (
            <div key={order.id} className="border border-gray-150 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-gray-900">{order.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="text-xs font-bold uppercase tracking-wider bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#E12F2F] cursor-pointer"
                      value={order.fulfillmentStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as MerchantOrderEntity['fulfillmentStatus'])}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="DISPATCHED">DISPATCHED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="AT_WORKSHOP">AT WORKSHOP</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-sm font-medium text-gray-600">
                    Buyer: <span className="font-bold text-gray-900">{order.customerInfo.name}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    Phone: <span className="font-bold text-gray-900">{order.customerInfo.phone}</span>
                  </p>
                </div>

                <div className="mb-4">
                  {order.items.map((item: OrderItemEntity, idx: number) => (
                    <p key={`${item.productId}-${idx}`} className="text-sm font-medium text-gray-600 truncate">
                      {item.quantity}x <span className="font-bold text-gray-900">{item.name}</span>
                    </p>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl mb-4 h-full">
                  {order.deliveryType === 'HOME_DELIVERY' && order.shippingAddress ? (
                    <div className="flex items-start gap-2">
                      <Navigation2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-blue-700 mb-0.5">HOME DELIVERY</p>
                        <p className="text-sm font-medium text-gray-700">
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.governorate}
                        </p>
                      </div>
                    </div>
                  ) : order.deliveryType === 'WORKSHOP_ROUTING' && order.partnerWorkshopInfo ? (
                    <div className="flex items-start gap-2">
                      <Wrench className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-700 mb-0.5">
                          ROUTE TO WORKSHOP: {order.partnerWorkshopInfo.name}
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {order.partnerWorkshopInfo.bayLocation}
                        </p>
                        <p className="text-xs font-bold text-gray-500 mt-1">
                          Install: {order.partnerWorkshopInfo.scheduledInstallationTime}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-gray-150 pt-4 mt-auto">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">EGP {order.subtotalEGP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Delivery</span>
                  <span className="font-bold text-gray-900">EGP {order.deliveryFeeEGP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base mt-1">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-[#E12F2F]">EGP {order.totalAmountEGP.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-12 col-span-full">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-900 font-bold">No orders yet</p>
              <p className="text-gray-500 text-sm mt-1">Orders will appear here once customers purchase your products.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function MerchantOrdersPage() {
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" /></div>}>
      <WorkspaceLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display text-gray-900">Order Management</h1>
              <p className="text-gray-500 font-medium mt-1">Track and manage your incoming orders</p>
            </div>
          </div>
          <OrdersTab merchantId={merchantId} />
        </div>
      </WorkspaceLayout>
    </Suspense>
  );
}

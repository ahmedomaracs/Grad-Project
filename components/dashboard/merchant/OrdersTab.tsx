'use client';

import React from 'react';
import { useLocalDB } from '../../../store/localDB';
import { ShoppingCart, MapPin, CheckCircle } from 'lucide-react';

export function OrdersTab({ merchantId }: { merchantId: string }) {
  const { globalOrders, advanceOrderStatus } = useLocalDB();
  const orders = globalOrders.filter(o => o.merchantId === merchantId);

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

        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-150 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-black text-gray-900">#{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                  {order.deliveryType === 'workshop' && (
                    <span className="flex items-center gap-1 text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3" /> Workshop Delivery
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Product: <span className="font-bold text-gray-900">{order.productLabel}</span>
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Buyer: <span className="font-bold text-gray-900">{order.clientName}</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                <p className="text-xl font-black text-[#E12F2F]">${order.totalPrice.toFixed(2)}</p>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <select
                    className="w-full md:w-auto text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold focus:ring-2 focus:ring-[#E12F2F] outline-none"
                    value={order.status}
                    onChange={(e) => advanceOrderStatus(order.id, e.target.value as any, order.clientUserId, order.productLabel)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-12">
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

'use client';

import React, { useState } from 'react';
import { useMerchantOrderStore } from '../../../store/merchantOrderStore';
import { ShoppingCart, Navigation2, Wrench, X } from 'lucide-react';
import { MerchantOrderEntity, OrderItemEntity } from '../../../types/order';

export function OrdersTab({ merchantId }: { merchantId: string }) {
  const { orders, updateOrderStatus } = useMerchantOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<MerchantOrderEntity | null>(null);

  const handleStatusChange = (orderId: string, status: MerchantOrderEntity['fulfillmentStatus']) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, fulfillmentStatus: status });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order & Fulfillment Engine</h2>
            <p className="text-sm text-gray-500 font-medium">Manage pipeline states and delivery routing.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Buyer</th>
                <th className="p-4 font-bold">Items</th>
                <th className="p-4 font-bold">Delivery</th>
                <th className="p-4 font-bold text-right">Total</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order: MerchantOrderEntity) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-4 font-black text-gray-900 group-hover:text-[#E12F2F] transition-colors">{order.id}</td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-gray-900">{order.customerInfo.name}</p>
                    <p className="text-xs text-gray-500">{order.customerInfo.phone}</p>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-600">
                    {order.items.length} item(s)
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-600">
                    {order.deliveryType === 'HOME_DELIVERY' ? (
                      <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                        <Navigation2 className="w-3 h-3" /> Home
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                        <Wrench className="w-3 h-3" /> Workshop
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-black text-[#E12F2F] text-right">
                    EGP {order.totalAmountEGP.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.fulfillmentStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.fulfillmentStatus === 'DISPATCHED' ? 'bg-blue-100 text-blue-700' :
                      order.fulfillmentStatus === 'AT_WORKSHOP' ? 'bg-amber-100 text-amber-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.fulfillmentStatus.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-900 font-bold">No orders yet</p>
                    <p className="text-gray-500 text-sm mt-1">Orders will appear here once customers purchase your products.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-150 p-0 shadow-2xl flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden">
            
            <div className="flex justify-between items-center border-b border-gray-100 p-6 bg-gray-50">
              <div>
                <h2 className="text-xl font-black text-gray-900">Order {selectedOrder.id}</h2>
                <p className="text-sm text-gray-500 font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <span className="font-bold text-gray-700">Fulfillment Status</span>
                <select
                  className="text-sm font-bold uppercase tracking-wider bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#E12F2F] cursor-pointer"
                  value={selectedOrder.fulfillmentStatus}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as MerchantOrderEntity['fulfillmentStatus'])}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="AT_WORKSHOP">AT WORKSHOP</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Info</h3>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{selectedOrder.customerInfo.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customerInfo.phone}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customerInfo.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Delivery Details</h3>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 h-full">
                    {selectedOrder.deliveryType === 'HOME_DELIVERY' && selectedOrder.shippingAddress ? (
                      <div className="flex items-start gap-3">
                        <Navigation2 className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-blue-700 mb-1">HOME DELIVERY</p>
                          <p className="text-sm font-medium text-gray-700">
                            {selectedOrder.shippingAddress.street}<br/>
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.governorate}
                          </p>
                        </div>
                      </div>
                    ) : selectedOrder.deliveryType === 'WORKSHOP_ROUTING' && selectedOrder.partnerWorkshopInfo ? (
                      <div className="flex items-start gap-3">
                        <Wrench className="w-5 h-5 text-amber-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-amber-700 mb-1">
                            ROUTE TO WORKSHOP
                          </p>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.partnerWorkshopInfo.name}</p>
                          <p className="text-sm font-medium text-gray-600">
                            {selectedOrder.partnerWorkshopInfo.bayLocation}
                          </p>
                          <p className="text-xs font-bold text-gray-500 mt-2">
                            Install: {selectedOrder.partnerWorkshopInfo.scheduledInstallationTime}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: OrderItemEntity, idx: number) => (
                    <div key={`${item.productId}-${idx}`} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs font-medium text-gray-500">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">x{item.quantity}</p>
                        <p className="text-sm font-black text-[#E12F2F]">EGP {item.priceEGP.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-2 border-t border-gray-150 bg-gray-50 p-6">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-900">EGP {selectedOrder.subtotalEGP.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-500">Delivery Fee</span>
                <span className="font-bold text-gray-900">EGP {selectedOrder.deliveryFeeEGP.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg mt-2 pt-2 border-t border-gray-200">
                <span className="font-black text-gray-900">Total</span>
                <span className="font-black text-[#E12F2F]">EGP {selectedOrder.totalAmountEGP.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

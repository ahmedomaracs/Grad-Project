'use client';

import React, { Suspense } from 'react';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useAuthStore } from '../../store/authStore';
import { useLocalDB } from '../../store/localDB';
import { useSearchParams } from 'next/navigation';
import { Package, TrendingUp, Users, ShoppingCart, AlertTriangle, ArrowUpRight, DollarSign, BarChart3 } from 'lucide-react';
import { WorkspaceLayout } from '../../components/dashboard/WorkspaceLayout';
import { InventoryTab } from '../../components/dashboard/merchant/InventoryTab';
import { OrdersTab } from '../../components/dashboard/merchant/OrdersTab';
import { AnalyticsTab } from '../../components/dashboard/merchant/AnalyticsTab';

const SELLER_METRICS = [
  { id: 'rev', label: 'Total Revenue', value: '$24,580', trend: '↑ +12.5%', icon: DollarSign, color: 'green' },
  { id: 'ord', label: 'Orders', value: '342', trend: '↑ +8.2%', icon: ShoppingCart, color: 'blue' },
  { id: 'prd', label: 'Products', value: '48', trend: '↑ +3', icon: Package, color: 'purple' },
  { id: 'cus', label: 'Customers', value: '1,248', trend: '↑ +15.3%', icon: Users, color: 'orange' }
];

const ALERT_ITEMS = [
  { id: 'bpad', title: 'Brake Pads Set', remaining: 5, alert: '[Low Stock]', status: 'low' },
  { id: 'wipr', title: 'Wiper Blades', remaining: 2, alert: '[Critical]', status: 'critical' },
  { id: 'oil', title: 'Oil Filter', remaining: 12, alert: '[Low Stock]', status: 'low' }
];

function MerchantDashboardContent() {
  const { user } = useRequireAuth();
  const { user: storeUser, inventoryAlerts, updateOrderStatus, markNotificationsAsRead } = useAuthStore();
  const allOrders = useLocalDB(s => s.globalOrders);
  // merchantId = the Merchant's email, used as the targetUserId for cross-role notification routing
  const merchantId = storeUser?.email ?? 'merchant_demo';
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  // Account-isolated dynamic data retrieval
  const merchantOrders = allOrders.filter(o => o.merchantId === merchantId);

  if (!user || user.role !== 'Merchant') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">You do not have permission to view the merchant dashboard.</p>
      </div>
    );
  }

  const handleStatusChange = (id: string, newStatus: any) => {
    updateOrderStatus(id, newStatus);
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your inventory, orders, and business performance</p>
          </div>
        </div>

        {currentTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SELLER_METRICS.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.id} className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-${metric.color}-50 text-${metric.color}-500 flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {metric.trend}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-500 mb-1">{metric.label}</p>
                    <p className="text-3xl font-black text-gray-900">{metric.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-150 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                  <a href="#" className="text-sm font-bold text-[#E12F2F] hover:underline">View All</a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Order ID</th>
                        <th className="p-4 font-bold">Product</th>
                        <th className="p-4 font-bold">Buyer</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold">Total</th>
                        <th className="p-4 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {merchantOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-sm font-bold text-gray-900">#{order.id}</td>
                          <td className="p-4 text-sm font-medium text-gray-700">{order.productLabel}</td>
                          <td className="p-4 text-sm font-medium text-gray-700">{order.clientName}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                              }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-bold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                          <td className="p-4">
                            <select
                              className="text-sm bg-gray-100 border-none rounded-xl font-medium focus:ring-2 focus:ring-[#E12F2F]"
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {merchantOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">No recent orders found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inventory Alerts */}
              <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-150 bg-orange-50/30 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    </div>
                    Inventory Alerts
                  </h3>
                  <button className="px-4 py-2 bg-[#E12F2F] hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-red-500/25">
                    Restock
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="divide-y divide-gray-100 p-2">
                    {ALERT_ITEMS.map((item) => (
                      <div key={item.id} className="p-4 mx-2 my-2 bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.title}</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">{item.remaining} units remaining</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${item.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-amber-600'
                          }`}>
                          {item.alert}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'inventory' && (
          <InventoryTab merchantId={merchantId} />
        )}

        {currentTab === 'orders' && (
          <OrdersTab merchantId={merchantId} />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsTab merchantId={merchantId} />
        )}

        {currentTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-gray-150 p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Customer Management</h2>
            <p className="text-gray-500 mt-2">View customer details, order history, and support tickets.</p>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}

export default function MerchantDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" />
      </div>
    }>
      <MerchantDashboardContent />
    </Suspense>
  );
}

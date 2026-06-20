import React from 'react';

// Mock data reflecting premium automotive parts matching your shop theme
const mockOrders = [
  {
    id: "ORD-9941A",
    date: "June 18, 2026",
    status: "Delivered",
    total: 249.99,
    items: "Premium AGM Battery Replacement",
  },
  {
    id: "ORD-8712B",
    date: "May 14, 2026",
    status: "Processing",
    total: 85.00,
    items: "Advanced Ceramic Brake Pads (Front Set)",
  },
];

export default function OrderHistoryPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Manage your parts purchases, invoices, and active tracking deliveries.
        </p>
      </div>

      {mockOrders.length === 0 ? (
        /* Empty State (Matches your Empty Garage design styling) */
        <div className="border border-dashed border-slate-200 bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-2xl mb-4">
            📦
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your order history is empty</h3>
          <p className="text-sm text-slate-400 font-medium max-w-sm mt-2">
            You haven't purchased any parts or scheduled package items yet.
          </p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="py-4 px-6 text-slate-500">{order.date}</td>
                    <td className="py-4 px-6 text-slate-900 font-semibold">{order.items}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Delivered' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useLocalDB, GlobalOrder } from '../../../store/localDB';
import { useToastStore } from '../../../store/toastStore';

interface InventoryItem {
  sku: string;
  name: string;
  brand: string;
  stock: number;
  threshold: number;
  price: number;
  category: string;
}

const LOCAL_PRODUCTS_KEY = 'automate-admin-inventory-products';

export default function AdminInventoryPage() {
  const { globalOrders, advanceOrderStatus, appendOrder } = useLocalDB();
  const addToast = useToastStore((s) => s.addToast);
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Seed sample products and orders if empty on mount
  useEffect(() => {
    setHydrated(true);

    // 1. Seed Products
    const storedProducts = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      const initialProducts: InventoryItem[] = [
        { sku: 'OEM-BRK-102', name: 'Ceramic Brake Pads Pro', brand: 'Brembo', stock: 3, threshold: 5, price: 2700, category: 'Brakes' },
        { sku: 'OEM-FLT-209', name: 'High-Flow Engine Oil Filter', brand: 'Bosch', stock: 1, threshold: 5, price: 750, category: 'Filters' },
        { sku: 'OEM-PLG-004', name: 'Premium Spark Plugs Set', brand: 'NGK', stock: 12, threshold: 15, price: 1850, category: 'Ignition' },
        { sku: 'OEM-SUS-901', name: 'Performance Shock Absorbers', brand: 'Bilstein', stock: 8, threshold: 4, price: 12400, category: 'Suspension' },
        { sku: 'OEM-OIL-505', name: 'Fully Synthetic Engine Oil 5W-40', brand: 'Mobil 1', stock: 24, threshold: 10, price: 1950, category: 'Fluids' },
      ];
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(initialProducts));
      setProducts(initialProducts);
    }

    // 2. Seed Orders
    if (globalOrders.length === 0) {
      appendOrder({
        clientUserId: 'client_demo',
        clientName: 'Ahmed Al-Masri',
        merchantId: 'merch_1',
        merchantName: 'Turbo Parts Inc.',
        productLabel: 'Ceramic Brake Pads Pro',
        totalPrice: 2700,
        deliveryType: 'standard',
        status: 'Processing',
      });

      appendOrder({
        clientUserId: 'client_tariq',
        clientName: 'Tariq Al-Fayed',
        merchantId: 'merch_1',
        merchantName: 'Turbo Parts Inc.',
        productLabel: 'LED Headlight Kit Pro',
        totalPrice: 4500,
        deliveryType: 'workshop',
        status: 'Shipped',
      });
    }
  }, [globalOrders.length, appendOrder]);

  const saveProducts = (updated: InventoryItem[]) => {
    setProducts(updated);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  };

  const handleRestock = (sku: string) => {
    const updated = products.map((p) => {
      if (p.sku === sku) {
        const added = 10;
        addToast({
          type: 'success',
          title: 'SKU Inventory Replenished',
          message: `Successfully added ${added} units to SKU [${sku}].`,
        });
        return { ...p, stock: p.stock + added };
      }
      return p;
    });
    saveProducts(updated);
  };

  const handleAdvanceOrderStatus = (order: GlobalOrder) => {
    let nextStatus: GlobalOrder['status'] | null = null;
    let label = '';

    if (order.status === 'Processing') {
      nextStatus = 'Shipped';
      label = 'marked as Shipped';
    } else if (order.status === 'Shipped') {
      nextStatus = 'Delivered';
      label = 'marked as Delivered';
    }

    if (nextStatus) {
      advanceOrderStatus(order.id, nextStatus, order.clientUserId, order.productLabel);
      addToast({
        type: 'success',
        title: 'Order Status Updated',
        message: `Order #${order.id.toUpperCase()} has been ${label}.`,
      });
    }
  };

  const lowStockAlerts = products.filter((p) => p.stock <= p.threshold);

  if (!hydrated) {
    return (
      <div className="flex flex-col h-96 bg-[#F8FAFC] items-center justify-center font-sans">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* HEADER SECTION */}
      <div>
        <span className="text-[10px] font-black uppercase text-[#E62424] bg-red-50 px-3 py-1 rounded-full tracking-wider">
          Logistics Supply Chain Node
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 uppercase">E-Commerce Hub</h1>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">
          Global order ingestion log pipelines and warehouse inventory threshold alarms.
        </p>
      </div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE ORDERS MONITORING LOG (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                Global Order Ingestion Pipeline
              </h3>
              <span className="text-[10px] font-black bg-slate-900 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                {globalOrders.length} Orders Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                
                <thead className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Order ID & Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Overrides</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {globalOrders.length > 0 ? (
                    globalOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                        
                        {/* ID */}
                        <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-900">
                          #{order.id.toUpperCase()}
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4 font-black uppercase tracking-tight text-slate-900">
                          {order.clientName}
                        </td>

                        {/* Item */}
                        <td className="px-6 py-4 uppercase text-slate-500 font-medium">
                          {order.productLabel}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 font-bold text-slate-900">
                          EGP {order.totalPrice.toLocaleString()}
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4">
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                            order.deliveryType === 'workshop'
                              ? 'bg-purple-50 text-purple-600 border border-purple-100'
                              : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {order.deliveryType}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            order.status === 'Processing'
                              ? 'bg-amber-50 text-amber-600'
                              : order.status === 'Shipped'
                              ? 'bg-blue-50 text-blue-600'
                              : order.status === 'Delivered'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-red-50 text-[#E62424]'
                          }`}>
                            {order.status}
                          </span>
                        </td>

                        {/* Override */}
                        <td className="px-6 py-4 text-right">
                          {order.status !== 'Delivered' && order.status !== 'Cancelled' ? (
                            <button
                              onClick={() => handleAdvanceOrderStatus(order)}
                              className="px-2.5 py-1.5 bg-slate-950 hover:bg-[#E62424] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                              {order.status === 'Processing' ? 'Ship' : 'Deliver'}
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Closed</span>
                          )}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-semibold uppercase tracking-wider">
                        No orders currently registered in platform queue.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUPPLY ALERTS & STOCK THRESHOLDS (1/3 width) */}
        <div className="space-y-6">
          
          {/* Supply Alerts Summary Widget */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                Supply Alert Deck
              </h3>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                lowStockAlerts.length > 0 ? 'bg-red-50 text-[#E62424] animate-pulse' : 'bg-green-50 text-green-600'
              }`}>
                {lowStockAlerts.length} Warnings Active
              </span>
            </div>

            <div className="space-y-4">
              {lowStockAlerts.length > 0 ? (
                lowStockAlerts.map((item) => {
                  const isCritical = item.stock <= 1;
                  return (
                    <div 
                      key={item.sku} 
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                        isCritical 
                          ? 'bg-red-50/30 border-red-200/60' 
                          : 'bg-amber-50/30 border-amber-200/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-black uppercase text-slate-900 tracking-tight">
                            {item.name}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                            SKU: {item.sku}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          isCritical ? 'bg-red-100 text-[#E62424]' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {isCritical ? 'CRITICAL' : 'LOW STOCK'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Units Left</p>
                          <p className={`text-sm font-black mt-0.5 ${
                            isCritical ? 'text-[#E62424]' : 'text-slate-900'
                          }`}>
                            {item.stock} / {item.threshold}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRestock(item.sku)}
                          className="px-3 py-2 bg-slate-950 hover:bg-[#E62424] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Restock SKU
                        </button>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  All catalog SKU volumes operating within safe margins.
                </div>
              )}
            </div>

          </div>

          {/* Catalog Snapshot overview */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 pb-2 border-b border-slate-100">
              Warehouse Catalog Snap
            </h3>
            
            <div className="divide-y divide-slate-100">
              {products.map((item) => (
                <div key={item.sku} className="py-3 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <p className="text-slate-950 uppercase tracking-tight font-black">{item.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">{item.brand} | {item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-900 font-bold">EGP {item.price.toLocaleString()}</p>
                    <p className={`text-[10px] font-black mt-0.5 ${
                      item.stock <= item.threshold ? 'text-[#E62424]' : 'text-slate-400'
                    }`}>
                      {item.stock} Units
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

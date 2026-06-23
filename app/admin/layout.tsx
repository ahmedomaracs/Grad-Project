'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Command Center', icon: '📊' },
    { href: '/admin/users', label: 'User Directory', icon: '👥' },
    { href: '/admin/bookings', label: 'Bookings Board', icon: '🔧' },
    { href: '/admin/inventory', label: 'E-Commerce Hub', icon: '🛒' },
    { href: '/admin/ledger', label: 'Financial Ledger', icon: '💳' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* FIXED ADMINISTRATIVE SIDEBAR SIDE-DECK */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 p-6">
        <div className="space-y-8">
          
          {/* Logo Brand Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter text-slate-950 uppercase">Automate</span>
              <span className="text-[9px] bg-slate-950 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">Admin</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">SaaS Control Panel v1.0.4</p>
          </div>

          {/* Navigation Links Loop Map */}
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-md shadow-slate-950/10'
                      : 'text-slate-500 hover:text-[#E62424] hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Exit anchor block back to primary dashboard ecosystem views */}
        <div className="pt-4 border-t border-slate-100">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-[#E62424] transition-colors"
          >
            ← Exit To Workspace
          </Link>
        </div>
      </aside>

      {/* VIEWPORT CONTROLLER CONTENT REGION CONTAINER */}
      <main className="flex-1 overflow-y-auto max-h-screen p-8 lg:p-12">
        {children}
      </main>

    </div>
  );
}

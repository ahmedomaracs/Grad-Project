'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShieldAlert, Users, FolderTree, Activity, Settings, PackageSearch, Briefcase } from 'lucide-react';
import { Logo } from '../ui/Logo';

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const menuItems = [
    { name: 'System Overview', tab: 'overview', icon: Activity },
    { name: 'B2B Partner Pipeline', tab: 'b2b', icon: Briefcase, href: '/admin/applications' },
    { name: 'User Directory', tab: 'users', icon: Users },
    { name: 'Verification Queue', tab: 'verification', icon: ShieldAlert, badge: 3 },
    { name: 'Master Catalog', tab: 'catalog', icon: PackageSearch },
  ];

  return (
    <aside className="hidden md:flex h-full flex-shrink-0 w-[260px] bg-slate-50 border-r border-slate-200/80 flex-col justify-between select-none transition-colors duration-300">
      <div className="h-20 flex items-center px-8 border-b border-slate-200/80">
        <Logo showText={true} />
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Admin Controls
        </div>

        {menuItems.map((item) => {
          const href = 'href' in item ? item.href! : `/dashboard/admin?tab=${item.tab}`;
          const isActive = 'href' in item 
            ? pathname === item.href 
            : pathname === '/dashboard/admin' && currentTab === item.tab;

          return (
            <Link key={item.name} href={href}>
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                  isActive
                    ? 'bg-[#E62424]/10 text-[#E62424] shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? 'text-[#E62424] scale-110' : 'text-slate-400 group-hover:scale-110 group-hover:text-slate-700'
                    }`}
                  />
                  <span className={`text-sm font-bold ${isActive ? 'text-slate-900' : ''}`}>
                    {item.name}
                  </span>
                </div>
                {item.badge && (
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${isActive ? 'bg-[#E62424] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {item.badge}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/80">
        <div className="bg-white p-4 rounded-2xl flex flex-col items-center text-center border border-slate-200 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E62424] to-orange-400 opacity-80" />
          <div className="w-10 h-10 rounded-full bg-[#E62424]/10 flex items-center justify-center mb-3">
            <Settings className="w-5 h-5 text-[#E62424]" />
          </div>
          <p className="text-slate-900 text-xs font-bold">Platform Active</p>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">All services running optimally.</p>
        </div>
      </div>
    </aside>
  );
}

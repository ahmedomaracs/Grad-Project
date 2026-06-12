'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShieldAlert, Users, FolderTree, Activity, Settings, PackageSearch } from 'lucide-react';
import { Logo } from '../ui/Logo';

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const menuItems = [
    { name: 'System Overview', tab: 'overview', icon: Activity },
    { name: 'User Directory', tab: 'users', icon: Users },
    { name: 'Verification Queue', tab: 'verification', icon: ShieldAlert, badge: 3 },
    { name: 'Master Catalog', tab: 'catalog', icon: PackageSearch },
  ];

  return (
    <aside className="hidden md:flex h-full flex-shrink-0 w-[260px] bg-[#0f0f13] border-r border-[#2d2d35] flex-col justify-between select-none transition-colors duration-300">
      <div className="h-20 flex items-center px-8 border-b border-[#2d2d35]">
        <Logo showText={true} />
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <div className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
          Admin Controls
        </div>

        {menuItems.map((item) => {
          const isActive = pathname === '/dashboard/admin' && currentTab === item.tab;

          return (
            <Link key={item.name} href={`/dashboard/admin?tab=${item.tab}`}>
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                  isActive
                    ? 'bg-[#FF2D2D]/10 text-[#FF2D2D] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? 'text-[#FF2D2D] scale-110' : 'text-gray-500 group-hover:scale-110 group-hover:text-gray-300'
                    }`}
                  />
                  <span className={`text-sm font-bold ${isActive ? 'text-white' : ''}`}>
                    {item.name}
                  </span>
                </div>
                {item.badge && (
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${isActive ? 'bg-[#FF2D2D] text-white' : 'bg-white/10 text-gray-400'}`}>
                    {item.badge}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2d2d35]">
        <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center text-center border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF2D2D] to-orange-500 opacity-50" />
          <div className="w-10 h-10 rounded-full bg-[#FF2D2D]/20 flex items-center justify-center mb-3">
            <Settings className="w-5 h-5 text-[#FF2D2D]" />
          </div>
          <p className="text-white text-xs font-bold">Platform Active</p>
          <p className="text-[10px] text-gray-500 font-semibold mt-1">All services running optimally.</p>
        </div>
      </div>
    </aside>
  );
}

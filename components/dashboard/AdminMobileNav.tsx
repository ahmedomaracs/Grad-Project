'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShieldAlert, Users, FolderTree, Activity, PackageSearch } from 'lucide-react';

export function AdminMobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const menuItems = [
    { name: 'Overview', tab: 'overview', icon: Activity },
    { name: 'Users', tab: 'users', icon: Users },
    { name: 'Verifications', tab: 'verification', icon: ShieldAlert },
    { name: 'Catalog', tab: 'catalog', icon: PackageSearch },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full h-16 bg-[#0f0f13]/90 backdrop-blur-xl border-t border-[#2d2d35] z-40 flex items-center justify-around px-2 pb-safe">
      {menuItems.map((item) => {
        const isActive = pathname === '/dashboard/admin' && currentTab === item.tab;

        return (
          <Link key={item.name} href={`/dashboard/admin?tab=${item.tab}`} className="flex-1">
            <div className="flex flex-col items-center justify-center h-full gap-1 cursor-pointer">
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-[#FF2D2D]/20 text-[#FF2D2D] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' : 'text-gray-500'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span
                className={`text-[9px] font-bold transition-colors ${
                  isActive ? 'text-[#FF2D2D]' : 'text-gray-500'
                }`}
              >
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

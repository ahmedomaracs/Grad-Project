'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Wrench, DollarSign, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';

const MECHANIC_NAV_LINKS = [
  { href: '/dashboard/mechanic?tab=overview', icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
  { href: '/dashboard/mechanic?tab=bookings', icon: CalendarDays, label: 'Bookings', tab: 'bookings' },
  { href: '/dashboard/mechanic?tab=services', icon: Wrench, label: 'Services', tab: 'services' },
  { href: '/dashboard/mechanic?tab=earnings', icon: DollarSign, label: 'Earnings', tab: 'earnings' },
];

export function MechanicSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const { logout } = useAuthStore();

  return (
    <div className="hidden md:flex h-full w-64 flex-shrink-0 border-r border-slate-200/80 bg-slate-50 flex-col justify-between">
      <div className="p-6">
        <Logo showText={true} />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {MECHANIC_NAV_LINKS.map((link) => {
          const isActive = currentTab === link.tab;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-[#E62424] text-white shadow-md shadow-[#E62424]/25'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {link.label}
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-slate-200/80">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            Profile Settings
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200/80">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm font-bold text-slate-500 hover:text-[#E62424] hover:bg-red-50 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

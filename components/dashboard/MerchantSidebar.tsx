'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Users, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';

const MERCHANT_NAV_LINKS = [
  { href: '/dashboard/merchant?tab=overview', icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
  { href: '/dashboard/merchant?tab=inventory', icon: Package, label: 'Inventory', tab: 'inventory' },
  { href: '/dashboard/merchant?tab=orders', icon: ShoppingCart, label: 'Orders', tab: 'orders' },
  { href: '/dashboard/merchant?tab=analytics', icon: BarChart3, label: 'Analytics', tab: 'analytics' },
  { href: '/dashboard/merchant?tab=customers', icon: Users, label: 'Customers', tab: 'customers' },
];

export function MerchantSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const { logout } = useAuthStore();

  return (
    <div className="hidden md:flex h-full w-64 flex-shrink-0 border-r border-gray-200 bg-white flex-col justify-between">
      <div className="p-6">
        <Logo showText={true} />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {MERCHANT_NAV_LINKS.map((link) => {
          const isActive = currentTab === link.tab;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-200 relative ${
                isActive
                  ? 'bg-red-50 text-[#FF2D2D]'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-2xl'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#FF2D2D] rounded-r-full" />
              )}
              <link.icon className={`w-5 h-5 ${isActive ? 'text-[#FF2D2D]' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {link.label}
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-gray-100">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            Profile Settings
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-150">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
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

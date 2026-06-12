'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Users } from 'lucide-react';

const MERCHANT_MOBILE_LINKS = [
  { href: '/dashboard/merchant?tab=overview', icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
  { href: '/dashboard/merchant?tab=inventory', icon: Package, label: 'Inventory', tab: 'inventory' },
  { href: '/dashboard/merchant?tab=orders', icon: ShoppingCart, label: 'Orders', tab: 'orders' },
  { href: '/dashboard/merchant?tab=analytics', icon: BarChart3, label: 'Analytics', tab: 'analytics' },
  { href: '/dashboard/merchant?tab=customers', icon: Users, label: 'Customers', tab: 'customers' },
];

export function MerchantMobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40">
      <div className="flex items-center justify-around h-16">
        {MERCHANT_MOBILE_LINKS.map((link) => {
          const isActive = currentTab === link.tab;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center w-full h-full space-y-1"
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-[#FF2D2D]' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-[#FF2D2D]' : 'text-gray-400'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

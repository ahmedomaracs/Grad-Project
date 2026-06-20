'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Wrench, DollarSign } from 'lucide-react';

const MECHANIC_MOBILE_LINKS = [
  { href: '/dashboard/mechanic?tab=overview', icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
  { href: '/dashboard/mechanic?tab=bookings', icon: CalendarDays, label: 'Bookings', tab: 'bookings' },
  { href: '/dashboard/mechanic?tab=services', icon: Wrench, label: 'Services', tab: 'services' },
  { href: '/dashboard/mechanic?tab=earnings', icon: DollarSign, label: 'Earnings', tab: 'earnings' },
];

export function MechanicMobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40">
      <div className="flex items-center justify-around h-16">
        {MECHANIC_MOBILE_LINKS.map((link) => {
          const isActive = currentTab === link.tab;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center w-full h-full space-y-1"
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-[#E12F2F]' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-[#E12F2F]' : 'text-gray-400'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

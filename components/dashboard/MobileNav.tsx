'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Car, Wrench, ShoppingBag, Wallet, User } from 'lucide-react';

export function MobileNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNavigation = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const navs = [
    { label: 'Overview', icon: Home, href: '/dashboard' },
    { label: 'Garage', icon: Car, href: '/dashboard/my-garage' },
    { label: 'Mechanics', icon: Wrench, href: '/mechanics' },
    { label: 'Shop', icon: ShoppingBag, href: '/shop' },
    { label: 'Wallet', icon: Wallet, href: '/dashboard?tab=wallet' },
    { label: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-150 flex items-center justify-around z-45 px-2 select-none shadow-[0_-8px_30px_rgba(0,0,0,0.03)]">
      {navs.map((nav) => {
        const isActive = pathname === nav.href || (nav.href.includes('tab=wallet') && pathname.includes('tab=wallet'));
        return (
          <Link key={nav.label} href={nav.href} onClick={handleNavigation} className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              whileTap={{ scale: 0.90 }}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                isActive ? 'text-[#E12F2F]' : 'text-gray-400'
              }`}
            >
              <nav.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-bold tracking-tight">{nav.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeMobileDot"
                  className="w-1 h-1 rounded-full bg-[#E12F2F]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}

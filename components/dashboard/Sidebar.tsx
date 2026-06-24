'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Car, 
  Wrench, 
  ShoppingBag, 
  Wallet, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logoutUser = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'Overview', icon: Home, href: '/dashboard' },
    { label: 'My Garage', icon: Car, href: '/dashboard/my-garage' },
    { label: 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
    { label: 'Find Mechanics', icon: Wrench, href: '/mechanics' },
    { label: 'Spare Parts Shop', icon: ShoppingBag, href: '/shop' },
    { label: 'Wallet', icon: Wallet, href: '/dashboard?tab=wallet' },
    { label: 'Profile Settings', icon: User, href: '/profile' },
  ];

  const handleLogout = () => {
    logoutUser();
    router.push('/signin');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col h-full flex-shrink-0 border-r border-slate-200/80 bg-white/90 backdrop-blur-md justify-between select-none z-30"
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/60">
        <Logo showText={!collapsed} />

        {/* Collapse button */}
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-slate-500" />
          </button>
        )}
        {collapsed && (
          <button 
            onClick={() => setCollapsed(false)}
            className="absolute right-[-14px] top-6 w-7 h-7 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors z-40 cursor-pointer"
          >
            <ChevronRight className="w-4.5 h-4.5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Menu links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href.includes('tab=wallet') && pathname.includes('tab=wallet')) || (item.href === '/dashboard' && pathname === '/dashboard');
          return (
            <Link key={item.label} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-3.5 px-4 h-12 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-[#E62424] bg-red-50 font-semibold border-l-4 border-[#E62424] rounded-r-xl rounded-l-none shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#E62424]' : 'text-slate-400'}`} />
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {item.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarGlow"
                    className="absolute -left-1 w-1 h-6 bg-[#E62424] rounded-r-full"
                    style={{ zIndex: 10 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="p-4 border-t border-slate-200/60 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 h-12 rounded-xl text-sm font-bold text-slate-500 hover:text-[#E62424] hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-[#E62424]" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

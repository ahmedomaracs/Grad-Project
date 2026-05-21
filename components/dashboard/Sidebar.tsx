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
  ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logoutUser = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'Overview', icon: Home, href: '/dashboard' },
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
      className="hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-gray-150 select-none flex-shrink-0 z-30"
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-150">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D2D] to-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,45,45,0.4)] transform transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-extrabold text-xl tracking-tight text-gray-900"
            >
              Automate
            </motion.span>
          )}
        </Link>

        {/* Collapse button */}
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-gray-500" />
          </button>
        )}
        {collapsed && (
          <button 
            onClick={() => setCollapsed(false)}
            className="absolute right-[-14px] top-6 w-7 h-7 rounded-lg border border-gray-250 bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors z-40"
          >
            <ChevronRight className="w-4.5 h-4.5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Menu links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href.includes('tab=wallet') && pathname.includes('tab=wallet'));
          return (
            <Link key={item.label} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-3.5 px-4 h-12 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-white bg-[#FF2D2D] shadow-lg shadow-[#FF2D2D]/25 border border-[#FF2D2D]/40'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {item.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarGlow"
                    className="absolute -left-1 w-1 h-6 bg-white rounded-r-full"
                    style={{ zIndex: 10 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="p-4 border-t border-gray-150 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 h-12 rounded-xl text-sm font-bold text-gray-500 hover:text-[#FF2D2D] hover:bg-red-50/50 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-[#FF2D2D]" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

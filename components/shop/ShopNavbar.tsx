'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, User } from 'lucide-react';
import { CartButton } from '../shop/CartButton';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo } from '../layout/layout';

export function ShopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isRouting, setIsRouting] = useState(false);

  const handleDashboardNavigation = () => {
    if (isRouting) return;
    setIsRouting(true);

    if (!user) {
      router.push('/signin');
      setIsRouting(false);
      return;
    }

    const role = user.role?.toLowerCase();
    switch (role) {
      case 'mechanic':
        router.push('/mechanic');
        break;
      case 'merchant':
        router.push('/merchant');
        break;
      case 'admin':
        router.push('/admin');
        break;
      default:
        router.push('/dashboard');
        break;
    }

    setTimeout(() => setIsRouting(false), 1000);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [balance, setBalance] = useState('1000.00');

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHydrated(true);

    if (!localStorage.getItem('wallet_balance')) {
      // Seed an initial virtual balance of $1,000.00 for the video demo setup
      localStorage.setItem('wallet_balance', '1000.00');
    }

    const checkBalance = () => {
      const currentFunds = localStorage.getItem('wallet_balance') || '1000.00';
      setBalance(parseFloat(currentFunds).toFixed(2));
    };

    checkBalance();
    window.addEventListener('storage', checkBalance);
    window.addEventListener('wallet_update', checkBalance);
    return () => {
      window.removeEventListener('storage', checkBalance);
      window.removeEventListener('wallet_update', checkBalance);
    };
  }, []);

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Shop', href: '/shop' },
  ];

  return (
    <header className="w-full h-16 bg-white/75 backdrop-blur-md border-b border-slate-200/40 sticky top-0 z-50 px-6 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group focus:outline-none py-1 select-none">

        {/* DETAILED CAR SVG BRANDMARK (PROPORTIONALLY SCALED DOWN) */}
        <div className="h-5 sm:h-6 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-[1.02]">
          <BrandLogo className="h-full w-auto object-contain text-[#E62424]" />
        </div>

        {/* UI-FRIENDLY TYPOGRAPHY BRAND TEXT MATCHING LANDING PAGE DNA */}
        <div className="flex items-center text-sm sm:text-base font-black uppercase tracking-tight font-sans">

          {/* "AUTO" - Flat Black with a clean, hardware-accelerated text stroke border for crisp visibility */}
          <span className="text-black antialiased">
            AUTO
          </span>

          {/* "MATE" - Vibrant Brand Red Matching the Project Theme DNA */}
          <span className="text-[#E62424] ml-[1px]">
            MATE
          </span>

        </div>

      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 transition-colors">
        {/* 1. Browse Parts Tab */}
        <Link
          href="/shop"
          className={`text-sm font-bold pb-1 border-b-2 transition-all ${pathname === '/shop'
              ? 'text-slate-900 border-[#E62424]'
              : 'text-slate-500 border-transparent hover:text-[#E62424]'
            }`}
        >
          Browse Parts
        </Link>

        {/* 2. Order History Link */}
        <Link
          href="/dashboard/orders"
          className={`text-sm font-bold pb-1 border-b-2 transition-all ${pathname === '/dashboard/orders'
              ? 'text-slate-900 border-[#E62424]'
              : 'text-slate-500 border-transparent hover:text-[#E62424]'
            }`}
        >
          Order History
        </Link>

        {/* 3. My Garage Link */}
        <Link
          href="/dashboard/my-garage"
          className={`text-sm font-bold pb-1 border-b-2 transition-all ${pathname === '/dashboard/my-garage'
              ? 'text-slate-900 border-[#E62424]'
              : 'text-slate-500 border-transparent hover:text-[#E62424]'
            }`}
        >
          My Garage
        </Link>
      </div>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center gap-3">
        {/* Wallet Balance Pill */}
        <div className="h-9 px-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-1.5 text-xs font-bold text-slate-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Wallet:</span>
          <span className="text-slate-950">EGP {(parseFloat(balance) * 50).toFixed(2)}</span>
        </div>

        {hydrated && isAuthenticated ? (
          <>
            {/* Notification bell */}
            <div onClick={handleDashboardNavigation} className="w-9 h-9 flex items-center justify-center bg-slate-50/80 border border-slate-200/60 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-[#E62424] text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1 border-2 border-white">
                3
              </span>
            </div>

            {/* Cart */}
            <CartButton variant="navbar" />

            {/* Avatar — link to dashboard */}
            <div onClick={handleDashboardNavigation} className="w-9 h-9 rounded-xl border border-slate-200/60 overflow-hidden shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-700">
                  <User className="w-4.5 h-4.5" />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Cart */}
            <CartButton variant="navbar" />

            {/* Sign In */}
            <Link href="/signin">
              <div className="w-9 h-9 flex items-center justify-center bg-slate-50/80 border border-slate-200/60 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer relative">
                <User className="w-4.5 h-4.5" />
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Mobile: cart + hamburger */}
      <div className="md:hidden flex items-center gap-3">
        <CartButton variant="navbar" />
        <button
          className="p-2 text-slate-600 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 bg-white/95 backdrop-blur-xl md:hidden z-40 border-t border-slate-100"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-4 pb-20">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-bold text-slate-900 hover:text-[#E62424] transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4 w-full max-w-sm mt-8"
              >
                {hydrated && isAuthenticated ? (
                  <button onClick={handleDashboardNavigation} className="w-full h-12 rounded-2xl bg-[#E62424] text-white font-semibold text-base shadow-sm hover:shadow-md transition-all">
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full h-12 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-base hover:bg-slate-50 transition-colors">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full h-12 rounded-2xl bg-[#E62424] text-white font-semibold text-base shadow-sm hover:shadow-md transition-all">
                        Get Started Free
                      </button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Bell, User } from 'lucide-react';
import { CartButton } from '../shop/CartButton';
import { useAuthStore } from '../../store/authStore';

export function ShopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const backgroundColor = useTransform(scrollY, [0, 50], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.85)']);
  const borderColor = useTransform(scrollY, [0, 50], ['rgba(229,231,235,0)', 'rgba(229,231,235,0.5)']);
  const blur = useTransform(scrollY, [0, 50], ['blur(0px)', 'blur(14px)']);

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Shop', href: '/shop' },
  ];

  return (
    <motion.header
      style={{ backgroundColor, borderColor, backdropFilter: blur, WebkitBackdropFilter: blur }}
      className="fixed top-0 left-0 right-0 z-40 border-b transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D2D] to-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,45,45,0.4)] transform transition-transform group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,45,45,0.6)]">
              <span className="text-white font-bold text-xl leading-none">A</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">Automate</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF2D2D] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {hydrated && isAuthenticated ? (
              <>
                {/* Notification bell */}
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Bell className="w-4.5 h-4.5 text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF2D2D] shadow-[0_0_6px_rgba(255,45,45,0.7)]" />
                  </motion.div>
                </Link>

                {/* Cart */}
                <CartButton variant="navbar" />

                {/* Avatar — link to dashboard */}
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="object-cover w-full h-full" />
                    ) : (
                      <User className="w-4.5 h-4.5 text-white" />
                    )}
                  </motion.div>
                </Link>
              </>
            ) : (
              <>
                {/* Cart */}
                <CartButton variant="navbar" />

                {/* Sign In */}
                <Link href="/signin">
                  <motion.div
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  >
                    <User className="w-4.5 h-4.5 text-white" />
                  </motion.div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <CartButton variant="navbar" />
            <button
              className="p-2 text-gray-600 z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 bg-white/95 backdrop-blur-xl md:hidden z-40 border-t border-gray-100"
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
                    className="text-3xl font-bold text-gray-900 hover:text-[#FF2D2D] transition-colors"
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
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full h-12 rounded-2xl bg-[#FF2D2D] text-white font-semibold text-base shadow-[0_0_20px_rgba(255,45,45,0.3)] hover:shadow-[0_0_30px_rgba(255,45,45,0.5)] transition-all">
                      Go to Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full h-12 rounded-2xl border border-gray-200 text-gray-900 font-semibold text-base hover:bg-gray-50 transition-colors">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full h-12 rounded-2xl bg-[#FF2D2D] text-white font-semibold text-base shadow-[0_0_20px_rgba(255,45,45,0.3)] hover:shadow-[0_0_30px_rgba(255,45,45,0.5)] transition-all">
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
    </motion.header>
  );
}

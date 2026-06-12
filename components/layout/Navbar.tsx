'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHydrated(true);
  }, []);
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)']
  );
  
  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(229, 231, 235, 0)', 'rgba(229, 231, 235, 0.5)']
  );

  const blur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(12px)']
  );

  return (
    <motion.header
      style={{ backgroundColor, borderColor, backdropFilter: blur, WebkitBackdropFilter: blur }}
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo showText={true} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', href: '/#features' },
              { label: 'How It Works', href: '/#how-it-works' },
              { label: 'Testimonials', href: '/#testimonials' },
              { label: 'Shop', href: '/shop' },
            ].map((item) => (
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {hydrated && isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 bg-white/95 backdrop-blur-xl md:hidden z-40 border-t border-gray-100"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-4 pb-20">
              {[
                { label: 'Features', href: '/#features' },
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Testimonials', href: '/#testimonials' },
                { label: 'Shop', href: '/shop' },
              ].map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.label}
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
                    <Button fullWidth size="lg">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" fullWidth size="lg">Sign In</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button fullWidth size="lg">Get Started Free</Button>
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

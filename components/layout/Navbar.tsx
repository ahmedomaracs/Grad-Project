'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';
import { BrandLogo } from './layout';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Services', href: '/#services', isServices: true },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Contact', href: '/#contact' },
  { label: 'About', href: '/about' }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // --- DROPDOWN CONTROL STATE ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth hover entry: Clear any pending close timers immediately
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  // Smooth hover exit: Add a 150ms buffer gap so users can move their mouse into the menu safely
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150); 
  };

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const observerOptions = { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Target sections by their IDs matching your nav menu
    const targets = ['hero', 'services', 'how-it-works', 'contact'].map(id => document.getElementById(id));
    targets.forEach(target => target && observer.observe(target));

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const handleServicesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById('services');
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setMobileMenuOpen(false);
      }
    } else {
      setMobileMenuOpen(false);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('');
      setMobileMenuOpen(false);
    } else {
      router.push('/');
      setTimeout(() => window.scrollTo(0, 0), 50);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main navigation bar */}
      <div
        className={`transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-ink/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]'
            : 'bg-white border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
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

            {/* Desktop Navigation */}
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 transition-colors font-sans select-none">
              
              {/* 1. HOME LINK (ACTIVE DESIGN MATCHING SPEC) */}
              <div className="relative flex flex-col items-center">
                <Link href="/" className="text-[#E62424] font-bold pb-1">
                  Home
                </Link>
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E62424] rounded-full" />
              </div>

              {/* 2. MARKETPLACE GATEWAY LINK */}
              <Link href="/shop" className="hover:text-slate-900 transition-all duration-150 py-1">
                Shop
              </Link>

              {/* DYNAMIC INTERACTIVE DROPDOWN CONTAINER */}
              <div 
                className="relative py-1"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className={`flex items-center gap-1 font-semibold transition-colors focus:outline-none ${
                    isDropdownOpen ? 'text-slate-900' : 'hover:text-slate-900'
                  }`}
                >
                  <span>Services</span>
                  <svg 
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-slate-900' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* FLOATING ACTION MENU PANEL */}
                {isDropdownOpen && (
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* ADVANCED FLAGSHIP FEATURE: BOOK A MECHANIC */}
                    <Link 
                      href="/booking" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 group/item transition-colors"
                    >
                      <div className="text-base p-2 bg-red-50 text-[#E62424] rounded-lg group-hover/item:bg-[#E62424] group-hover/item:text-white transition-colors flex-shrink-0">
                        🔧
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Book a Mechanic</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-normal">Schedule on-site diagnostics & certified repairs.</p>
                      </div>
                    </Link>

                    {/* TRACK REPAIR SUB-FEATURE */}
                    <Link 
                      href="/booking/status" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 group/item transition-colors mt-0.5"
                    >
                      <div className="text-base p-2 bg-slate-50 text-slate-600 rounded-lg group-hover/item:bg-slate-950 group-hover/item:text-white transition-colors flex-shrink-0">
                        📋
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Live Track Repair</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-normal">Real-time status updates from your assigned technician.</p>
                      </div>
                    </Link>

                  </div>
                )}
              </div>

              {/* 4. PLATFORM FOOTPRINT LINKS */}
              <Link href="/#how-it-works" className="hover:text-slate-900 transition-all duration-150 py-1">
                How It Works
              </Link>

              <Link href="/#contact" className="hover:text-slate-900 transition-all duration-150 py-1">
                Contact
              </Link>

              <Link href="/about" className="hover:text-slate-900 transition-all duration-150 py-1">
                About
              </Link>

            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {hydrated && isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="sm" className="gap-2">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signin" className="text-sm font-semibold text-ink/80 hover:text-brand transition-colors">
                    Sign In
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="gap-2">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-ink z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 bg-white md:hidden z-40 border-t border-ink/10"
          >
            <div className="flex flex-col items-center justify-center h-full gap-7 px-4 pb-20">
              {NAV_LINKS.map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  key={item.label}
                >
                  <Link
                    href={item.href}
                    onClick={item.isServices ? handleServicesClick : () => setMobileMenuOpen(false)}
                    className="font-display text-3xl text-ink hover:text-brand transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 w-full max-w-sm mt-6"
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
    </header>
  );
}

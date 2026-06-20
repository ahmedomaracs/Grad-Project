'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { Wrench, Settings, AlertTriangle } from 'lucide-react';

export function Hero() {
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Captures the precise scroll position to fuel the orbital calculation matrix
      setScrollOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden bg-ink text-white pt-36 pb-20 lg:pt-44 lg:pb-28">
      {/* Background mechanic image + ambient red glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/carhive/mechanic-1.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-ink-soft" />
        <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand/15 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-brand/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/15 text-brand text-xs font-semibold uppercase tracking-widest mb-6">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                Trusted Auto Repair Experts
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-6">
                All Your Car Services in{' '}
                <span className="text-brand">One Platform</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg lg:text-xl text-muted-light mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Manage your vehicles, book certified mechanics, and shop for authentic spare parts. Experience automotive care re-engineered for the modern era.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto text-base px-9 h-14">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-9 h-14 border-white/25 text-white hover:bg-white hover:text-ink">
                  Browse Shop
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Car image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand/20 blur-[100px] rounded-full pointer-events-none" />
            <img
              src="/assets/carhive/car.png"
              alt="Premium car ready for service"
              className="relative w-full h-auto drop-shadow-2xl"
            />
            
            {/* Decorative Floating Vectors */}
            
            {/* The White Wrench */}
            <div 
              className="absolute top-[8%] left-[-8%] lg:left-[-15%] z-20 will-change-transform filter drop-shadow-[0_0_12px_rgba(255,255,255,0.85)] pointer-events-none"
              style={{ transform: `translateX(${scrollOffset * 0.35}px) translateY(${scrollOffset * 0.2}px) rotate(${scrollOffset * 0.12}deg)` }}
            >
              {/* Native infinite hover animation remains separated safely on the vector child */}
              <Wrench className="w-10 h-10 text-white opacity-100 animate-[bounce_4s_infinite_ease-in-out]" />
            </div>

            {/* The Yellow Check Engine Sign */}
            <div 
              className="absolute -top-[12%] right-[10%] lg:right-[15%] z-20 will-change-transform filter drop-shadow-[0_0_16px_rgba(251,191,36,0.9)] pointer-events-none"
              style={{ transform: `translateX(-${scrollOffset * 0.4}px) translateY(${scrollOffset * 0.15}px) rotate(-${scrollOffset * 0.1}deg)` }}
            >
              <AlertTriangle className="w-11 h-11 text-amber-400 opacity-100 animate-[pulse_2.5s_infinite_ease-in-out]" />
            </div>

            {/* The Red Gear */}
            <div 
              className="absolute bottom-[-5%] right-[-6%] lg:right-[-12%] z-20 will-change-transform filter drop-shadow-[0_0_14px_rgba(230,36,36,0.85)] pointer-events-none"
              style={{ transform: `translateX(${scrollOffset * 0.3}px) translateY(-${scrollOffset * 0.1}px)` }}
            >
              {/* Native constant spin style tracking loop */}
              <Settings className="w-11 h-11 text-[#E62424] opacity-100 animate-[spin_7s_linear_infinite]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


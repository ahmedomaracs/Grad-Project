'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { Car, Wrench, Bell, ShoppingCart, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen flex items-center bg-[#FAFAFA]">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#FF2D2D]/10 to-transparent blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tl from-[#FF2D2D]/5 to-transparent blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-bl from-blue-500/5 to-transparent blur-[100px] mix-blend-multiply" />
        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Left Content */}
          <div className="max-w-2xl relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold tracking-[-0.02em] text-[#111111] leading-[1.05] mb-8">
                All Your Car Services in{' '}
                <span className="relative whitespace-nowrap">
                  <span className="absolute -inset-1 bg-gradient-to-r from-[#FF2D2D]/20 to-[#FF2D2D]/0 blur-lg rounded-xl opacity-50" />
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-[#FF2D2D] to-red-600">
                    One Place
                  </span>
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg lg:text-xl text-gray-500 mb-10 leading-relaxed max-w-xl font-medium"
            >
              Manage your vehicles, book certified mechanics, and shop for authentic spare parts. Experience automotive care re-engineered for the modern era.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-14">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-10 h-14">
                  Browse Shop
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Product Showcase Panel */}
          <div className="relative flex flex-col gap-4 lg:block h-auto lg:h-[650px] w-full perspective-1000 group mt-12 lg:mt-0">

            {/* Centerpiece Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateX: 5, rotateY: -5 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, type: 'spring', damping: 20 }}
              className="relative lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full lg:w-[380px] bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)] border border-white/80 p-6 lg:p-8 z-30 transition-all duration-500 ease-out lg:group-hover:opacity-40 lg:hover:!opacity-100 active:opacity-100 active:scale-[0.98] lg:hover:scale-105 lg:hover:z-50 lg:hover:shadow-2xl will-change-transform order-first lg:order-none min-h-[44px]"
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#FF2D2D]/10 text-[#FF2D2D] text-xs font-bold tracking-wide uppercase mb-3">
                  Platform Overview
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">Automate Platform</h3>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">Enterprise-grade automotive management.</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  'Vehicle Management',
                  'Mechanic Booking',
                  'Service Tracking',
                  'Maintenance Alerts',
                  'Spare Parts Marketplace',
                  'Wallet & Payments'
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Link href="/features">
                <Button className="w-full group shadow-lg shadow-[#FF2D2D]/20">
                  Explore Features
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Floating Card 1: Vehicle Management */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: -40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.4, type: 'spring', damping: 20 }}
              className="relative lg:absolute lg:top-[2%] lg:left-[2%] w-full lg:w-[260px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-4 lg:p-5 z-20 transition-all duration-500 ease-out lg:group-hover:opacity-40 lg:hover:!opacity-100 active:opacity-100 active:scale-[0.98] lg:hover:scale-105 lg:hover:z-50 lg:hover:shadow-2xl will-change-transform min-h-[44px]"
            >
              <div className="flex items-center gap-4 mb-2 lg:mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Vehicle Management</h4>
                  <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Active Feature</span>
                </div>
              </div>
              <p className="text-xs lg:text-sm text-gray-500 leading-relaxed">Track maintenance, service history, mileage, and vehicle records in one place.</p>
            </motion.div>

            {/* Floating Card 2: Certified Mechanics */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.5, type: 'spring', damping: 20 }}
              className="relative lg:absolute lg:top-[12%] lg:right-[-5%] w-full lg:w-[250px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-4 lg:p-5 z-40 transition-all duration-500 ease-out lg:group-hover:opacity-40 lg:hover:!opacity-100 active:opacity-100 active:scale-[0.98] lg:hover:scale-105 lg:hover:z-50 lg:hover:shadow-2xl will-change-transform min-h-[44px]"
            >
              <div className="flex items-center gap-4 mb-2 lg:mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Certified Mechanics</h4>
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Verified</span>
                </div>
              </div>
              <p className="text-xs lg:text-sm text-gray-500 leading-relaxed">500+ verified mechanics available for instant booking.</p>
            </motion.div>

            {/* Floating Card 3: Instant Booking */}
            <motion.div
              initial={{ opacity: 0, x: -50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.6, type: 'spring', damping: 20 }}
              className="relative lg:absolute lg:top-[42%] lg:left-[-12%] w-full lg:w-[240px] bg-[#111111]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 lg:p-5 z-40 transition-all duration-500 ease-out lg:group-hover:opacity-40 lg:hover:!opacity-100 active:opacity-100 active:scale-[0.98] lg:hover:scale-105 lg:hover:z-50 lg:hover:shadow-2xl will-change-transform min-h-[44px]"
            >
              <div className="flex items-center gap-4 mb-2 lg:mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shadow-inner">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Instant Booking</h4>
                  <span className="text-[10px] font-semibold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Fast & Easy</span>
                </div>
              </div>
              <p className="text-xs lg:text-sm text-gray-400 leading-relaxed">Book trusted mechanics in less than 60 seconds.</p>
            </motion.div>

            {/* Floating Card 4: Smart Maintenance Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.7, type: 'spring', damping: 20 }}
              className="relative lg:absolute lg:bottom-[10%] lg:right-[-8%] w-full lg:w-[260px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-4 lg:p-5 z-20 transition-all duration-500 ease-out lg:group-hover:opacity-40 lg:hover:!opacity-100 active:opacity-100 active:scale-[0.98] lg:hover:scale-105 lg:hover:z-50 lg:hover:shadow-2xl will-change-transform min-h-[44px]"
            >
              <div className="flex items-center gap-4 mb-2 lg:mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF2D2D]/10 text-[#FF2D2D] flex items-center justify-center shadow-inner">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Smart Alerts</h4>
                  <span className="text-[10px] font-semibold text-[#FF2D2D] bg-[#FF2D2D]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">AI Powered</span>
                </div>
              </div>
              <p className="text-xs lg:text-sm text-gray-500 leading-relaxed">Get automated reminders for oil changes, inspections, and upcoming services.</p>
            </motion.div>

            {/* Floating Card 5: Spare Parts Marketplace */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.8, type: 'spring', damping: 20 }}
              className="relative lg:absolute lg:bottom-[5%] lg:left-[5%] w-full lg:w-[270px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-4 lg:p-5 z-40 transition-all duration-500 ease-out lg:group-hover:opacity-40 lg:hover:!opacity-100 active:opacity-100 active:scale-[0.98] lg:hover:scale-105 lg:hover:z-50 lg:hover:shadow-2xl will-change-transform min-h-[44px]"
            >
              <div className="flex items-center gap-4 mb-2 lg:mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Spare Parts Shop</h4>
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">10,000+ Parts</span>
                </div>
              </div>
              <p className="text-xs lg:text-sm text-gray-500 leading-relaxed">Shop authentic automotive parts with comprehensive warranty protection.</p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}


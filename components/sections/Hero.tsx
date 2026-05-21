'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import Link from 'next/link';

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
                    One Platform
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

          {/* Right Content - Premium Dashboard Cards */}
          <div className="relative h-[500px] lg:h-[600px] w-full hidden sm:block perspective-1000">
            {/* Main Center Card (My Garage) */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotateX: 10, rotateY: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, type: 'spring', damping: 20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white p-6 z-20 hover:scale-105 transition-transform duration-500"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">My Garage</h3>
                    <p className="text-xs text-gray-500 font-medium">2 Active Vehicles</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
              </div>
              {/* Mini chart placeholder */}
              <div className="h-24 w-full bg-gray-50 rounded-xl border border-gray-100 flex items-end p-2 gap-2 overflow-hidden">
                {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-[#FF2D2D]/20 to-[#FF2D2D] rounded-t-sm"
                  />
                ))}
              </div>
            </motion.div>

            {/* Top Right Card (Bookings) */}
            <motion.div
              initial={{ opacity: 0, x: 60, y: -40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.4, type: 'spring', damping: 20 }}
              className="absolute top-[10%] right-[5%] w-[260px] bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] border border-white/50 p-5 z-10 hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Next Service</h3>
                  <p className="text-xs text-gray-500">Tomorrow, 10 AM</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-blue-500"
                />
              </div>
            </motion.div>

            {/* Bottom Left Card (Quality) */}
            <motion.div
              initial={{ opacity: 0, x: -60, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.6, type: 'spring', damping: 20 }}
              className="absolute bottom-[15%] left-[5%] w-[240px] bg-[#111111]/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] border border-white/10 p-5 z-30 hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-yellow-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Top Rated</h3>
                  <p className="text-xs text-gray-400">Premium mechanics</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

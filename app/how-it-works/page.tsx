'use client';

import React, { useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { motion } from 'framer-motion';
import { HelpCircle, Layers, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  // Scroll to top on page route mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#070A12] font-sans text-white selection:bg-[#E12F2F]/20 selection:text-[#E12F2F] flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 lg:px-16 max-w-7xl mx-auto w-full relative z-10">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_#E12F2F_0%,_transparent_65%)] opacity-5 blur-[120px] pointer-events-none" />

        <div className="space-y-16">
          {/* Header Block */}
          <div className="border-b border-white/[0.05] pb-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 text-[#E12F2F] text-xs font-black uppercase tracking-widest mb-4"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Platform Protocol</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl"
            >
              How It Works
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 text-sm sm:text-base font-semibold mt-4 max-w-2xl leading-relaxed"
            >
              Experience the luxury of predictive, on-demand garage workspace administration. We've simplified premium vehicle stewardship into three precise cycles.
            </motion.p>
          </div>

          {/* Three Steps Grid (Folds down to a single column on mobile < 768px via grid-cols-1 md:grid-cols-3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Park & Track',
                desc: 'Register your vehicle brand, model, and mileage credentials inside your private cloud garage workspace. Our smart engine maps your factory scheduled intervals instantly.',
                icon: Layers,
                accent: 'from-[#E12F2F]/20 to-transparent border-[#E12F2F]/30',
                color: 'text-[#E12F2F]',
              },
              {
                step: '02',
                title: 'Vetted Dispatch',
                desc: 'Select a custom service tier. Our algorithmic broker dispatches the nearest certified master technician directly to your physical coordinates, fully prepared.',
                icon: ShieldCheck,
                accent: 'from-blue-500/10 to-transparent border-blue-500/20',
                color: 'text-blue-400',
              },
              {
                step: '03',
                title: 'Instant Execution',
                desc: 'Track diagnostic progress, review genuine parts lists, and execute automated secure Stripe checkout approvals with total cryptographic transparency.',
                icon: Zap,
                accent: 'from-emerald-500/10 to-transparent border-emerald-500/20',
                color: 'text-emerald-400',
              },
            ].map((s, idx) => (
              <div
                key={s.step}
                className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group hover:border-[#E12F2F]/30 transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${s.accent}`} />
                <span className="text-4xl font-black text-slate-800 tracking-wider absolute top-4 right-6 group-hover:text-[#E12F2F]/10 transition-colors duration-300">
                  {s.step}
                </span>
                <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center ${s.color} mb-6`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-white mb-4">{s.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Context Copy Area */}
          <div className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-extrabold text-white">total command. premium peace of mind.</h2>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Every appointment is logged on our platform ledger to maintain your vehicle's resale value and structural validation records. Whether you need carbon-ceramic brake replacement or fine ECU recalibration, Automate synchronizes the entire diagnostic chain under your command.
            </p>
            <div className="pt-6">
              <Link href="/mechanics">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 text-[#E12F2F] text-sm font-bold uppercase tracking-widest cursor-pointer hover:underline"
                >
                  <span>Browse Certified Mechanics</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { motion } from 'framer-motion';
import { Scale, FileText, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  // Scroll to top on page route mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F] font-sans text-white selection:bg-[#E12F2F]/20 selection:text-[#E12F2F] flex flex-col justify-between overflow-x-hidden">
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
              <Scale className="w-4 h-4" />
              <span>Legal Charter Node</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-display"
            >
              Terms of Service
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 text-sm sm:text-base font-semibold mt-4 max-w-2xl leading-relaxed"
            >
              By accessing our automated command center, booking services, or dispatching certified technicians, you consent to these global charter rules.
            </motion.p>
          </div>

          {/* Core Content Grid (Single column on mobile, dual column on MD) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group hover:border-[#E12F2F]/30 transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#E12F2F] opacity-40" />
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#E12F2F] mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white mb-4">1. Permitted Workspace Use</h2>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Users are solely responsible for ensuring the accuracy of vehicle details (VIN logs, mileage inputs, and service histories) supplied inside the Garage panel. Submitting falsified registration credentials or misrepresenting brand ownership is grounds for immediate account suspension.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group hover:border-[#E12F2F]/30 transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-40" />
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-blue-400 mb-6">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white mb-4">2. Mechanic Service Bonds</h2>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Service contracts generated via the Booking scheduler represent a direct binding covenant between the client and the dispatched workshop partner. Automate holds no liability for roadside accidents or workshop mechanical failure, though we audit all partners to enforce high-performance compliance.
              </p>
            </div>
          </div>

          {/* Prose semantic blocks */}
          <div className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-extrabold text-white">3. Secure stripe payouts & refunds</h2>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Deposit transactions loaded into your financial wallet are held securely in a Stripe escrow ledger. Payouts are dispatched to technicians immediately upon your digital signature confirming check-out service completion. Dispute logs can be generated inside your profile settings panel.
            </p>
            <div className="pt-6">
              <Link href="/privacy">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 text-[#E12F2F] text-sm font-bold uppercase tracking-widest cursor-pointer hover:underline"
                >
                  <span>Read Platform Privacy Policy</span>
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

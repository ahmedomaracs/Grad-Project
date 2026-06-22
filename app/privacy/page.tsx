import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Shield, Eye, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Automate',
  description: 'Automate Privacy Policy. Read about how we manage and secure your personal and vehicle data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] font-sans text-white selection:bg-[#E12F2F]/20 selection:text-[#E12F2F] flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 lg:px-16 max-w-7xl mx-auto w-full relative z-10">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_#E12F2F_0%,_transparent_65%)] opacity-5 blur-[120px] pointer-events-none" />

        <div className="space-y-16">
          {/* Header Block */}
          <div className="border-b border-white/[0.05] pb-10">
            <div className="flex items-center gap-3 text-[#E12F2F] text-xs font-black uppercase tracking-widest mb-4">
              <Shield className="w-4 h-4" />
              <span>Data Protection Node</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wide">
              Privacy Policy
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-semibold mt-4 max-w-2xl leading-relaxed">
              Your telemetry and personal credentials are protected under our multi-layer security protocols. Read how Automate manages your privacy footprint.
            </p>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group hover:border-[#E12F2F]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#E12F2F] opacity-40" />
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#E12F2F] mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white mb-4">1. Telemetry Isolation</h2>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Every vehicle log, diagnostic parameter, and mileage record is sandboxed on our decentralized databases. We strictly enforce strict isolation, meaning your diagnostic telemetry is never shared with third-party advertising brokers or vehicle insurance aggregators.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group hover:border-[#E12F2F]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-40" />
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-blue-400 mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white mb-4">2. Cryptographic Purchases</h2>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                All commerce orders, shipping addresses, and wallet balance transactions are encrypted end-to-end via Stripe's 256-bit SSL pipeline. We do not store raw credit card numbers or digital pin codes on our database.
              </p>
            </div>
          </div>

          {/* Prose semantic blocks */}
          <div className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-extrabold text-white">3. Cookies & Platform Sessions</h2>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              We leverage browser session tokens to maintain your login credentials and save active shopping cart components. These secure tokens prevent session hijacking and guarantee instant page hydration upon reload. You can flush these parameters anytime via your user settings panel.
            </p>
            <div className="pt-6">
              <Link href="/terms" className="inline-flex items-center gap-2 text-[#E12F2F] text-sm font-bold uppercase tracking-widest cursor-pointer hover:underline">
                <span>Read Platform Terms of Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

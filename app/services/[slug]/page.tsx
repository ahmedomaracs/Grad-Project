'use client';

import React, { useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { servicesData } from '../../../lib/servicesData';
import { InlineEnquiryForm } from '../../../components/sections/InlineEnquiryForm';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const service = servicesData.find((s) => s.slug === slug);

  /** Smooth-scroll to an element by id with fixed navbar offset */
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  // 404 guard
  if (!service) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-6">
        <h1 className="font-display text-4xl mb-4">Service Not Found</h1>
        <p className="text-gray-400 mb-8">The requested car service could not be found.</p>
        <Link
          href="/#services"
          className="px-6 py-3 bg-gradient-to-r from-[#E12F2F] to-red-600 rounded-xl font-bold text-sm min-h-[44px] flex items-center justify-center"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white font-sans selection:bg-[#E12F2F]/20 selection:text-[#E12F2F] overflow-x-hidden">
      <Navbar />

      <main className="pt-24 pb-0">
        {/* ── Back link ───────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-30">
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-all bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md hover:bg-white/10 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-[#E12F2F]" />
            <span>Back to Services</span>
          </Link>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-[#E12F2F]/10 to-transparent blur-[120px] pointer-events-none" />

        {/* ── Animated page wrapper ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {/* ── HERO SPLIT ───────────────────────────────────────────────── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-8 lg:py-12">
              {/* Illustration */}
              <div className="w-full relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#E12F2F] to-rose-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-45 transition duration-700" />
                <div className="relative bg-zinc-950/80 border border-white/10 rounded-3xl p-6 lg:p-12 backdrop-blur-2xl">
                  {service.illustration}
                </div>
              </div>

              {/* Copy */}
              <div className="flex flex-col">
                <div className="w-16 h-1.5 bg-[#E12F2F] rounded-full mb-6" />

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E12F2F]">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#E12F2F]">
                    Service Details
                  </span>
                </div>

                <h1 className="font-display text-4xl lg:text-5xl text-white mb-6 leading-tight">
                  {service.name}
                </h1>

                <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light">
                  {service.summary}
                </p>

                {/* Value propositions */}
                <div className="space-y-4 mb-10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    What&apos;s Included
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#E12F2F] shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-gray-200 leading-snug">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── TWIN CTAs ──────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  {/* Secondary — scrolls to branch map */}
                  <button
                    onClick={() => scrollTo('service-enquiry-form')}
                    className="w-full sm:w-1/2 min-h-[44px] px-6 py-3 border border-[#E12F2F] hover:bg-[#E12F2F]/8 rounded-xl font-bold text-[#E12F2F] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Talk To Our Expert</span>
                  </button>

                  {/* Primary — scrolls to inline enquiry form */}
                  <button
                    onClick={() => scrollTo('service-enquiry-form')}
                    className="w-full sm:w-1/2 min-h-[44px] px-6 py-3 bg-gradient-to-r from-[#E12F2F] to-red-600 hover:from-[#E12F2F]/90 hover:to-red-700 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E12F2F]/15 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Request for a Quote</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>

                {/* Scroll hint */}
                <p className="mt-5 text-[11px] text-gray-500 flex items-center gap-1">
                  <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                  Scroll down to submit your request
                </p>
              </div>
            </div>
          </section>

          {/* ── INLINE ENQUIRY FORM (Request a Quote target) ──────────────── */}
          <div id="service-enquiry-form" className="bg-[#0B0B0F]">
            <InlineEnquiryForm preselectedSlug={slug} />
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

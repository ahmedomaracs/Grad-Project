'use client';

import React, { useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { motion } from 'framer-motion';
import { MessageSquare, Star, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

export default function TestimonialsPage() {
  // Scroll to top on page route mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const reviews = [
    {
      name: 'Julian Sterling',
      role: 'Porsche 911 GT3 RS Owner',
      quote: 'Automate has completely transformed how I manage my track vehicle. Booking a certified gearbox specialist took seconds, and the technician arrived at my garage with the exact factory OEM gasket kits required.',
      rating: 5,
    },
    {
      name: 'Sarah Jenkins',
      role: 'Aston Martin DB11 Owner',
      quote: 'Decidedly premium. The interface feels like a luxury car cockpit itself. Cryptographic invoice tracking and automated alerts make servicing an absolute joy. Highly recommended for premium vehicle owners.',
      rating: 5,
    },
    {
      name: 'Robert Vance',
      role: 'Classic Ferrari 328 GTS Owner',
      quote: 'The level of craftsmanship is unparalleled. I was paired with an authorized classic powertrain mechanic who treated my vintage engine with the respect it deserves. Absolute peace of mind.',
      rating: 5,
    },
  ];

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
              <MessageSquare className="w-4 h-4" />
              <span>Verifiable Feedback</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl"
            >
              Testimonials
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 text-sm sm:text-base font-semibold mt-4 max-w-2xl leading-relaxed"
            >
              Read the unfiltered experiences of our discerning platform drivers, collector car guardians, and authorized service workshops.
            </motion.p>
          </div>

          {/* Grid Layout (Folds down to single column on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r, idx) => (
              <div
                key={r.name}
                className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group hover:border-[#E12F2F]/30 transition-all duration-300"
              >
                <div className="flex gap-1 mb-6 text-[#E12F2F]">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed font-light mb-8 italic">
                  "{r.quote}"
                </p>
                <div className="flex items-center gap-3 border-t border-white/[0.04] pt-6">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{r.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Context Area */}
          <div className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-extrabold text-white">trusted by discerning collector clubs.</h2>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              We value transparent engineering. That is why we maintain immutable logs of every diagnostic check and repairs payout. This guarantees platform authenticity and safeguards the high-end pedigree of your assets.
            </p>
            <div className="pt-6">
              <Link href="/signin">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 text-[#E12F2F] text-sm font-bold uppercase tracking-widest cursor-pointer hover:underline"
                >
                  <span>Register My Personal Account</span>
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

'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Testimonials } from '../../components/sections/Testimonials';
import { motion } from 'framer-motion';
import { CheckCircle2, Phone, Award, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const TEAM = [
  { name: 'Ahmed Khalid', role: 'CEO & Founder',     img: '/assets/automate/team-1.jpg' },
  { name: 'Yusuf Hassan', role: 'Lead Mechanic',      img: '/assets/automate/team-2.jpg' },
  { name: 'Omar Faruk',   role: 'Auto Technician',    img: '/assets/automate/team-3.jpg' },
  { name: 'Ali Mansour',  role: 'Diagnostics Expert', img: '/assets/automate/team-4.jpg' },
];
const STEPS = [
  { n: '01', t: 'Book Your Service',          d: 'Select your service, date, and a certified technician from our verified network.' },
  { n: '02', t: 'Expert Inspection & Repair', d: 'Our certified mechanic performs a full diagnostic and precision repair at your location.' },
  { n: '03', t: 'Drive Away Safely',          d: 'Get your vehicle back in peak condition with a full service report and warranty.' },
];
const PARTNERS = [1,2,3,4,5,6].map(i => `/assets/automate/client-${i}.png`);
const STATS = [
  { v: '250+',   l: 'Our Testimonials' },
  { v: '1,250+', l: 'Satisfied Clients'  },
  { v: '900+',   l: 'Happy Customers'    },
  { v: '200+',   l: 'Total Awards'       },
];
const iCls = 'w-full h-12 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder-slate-500 outline-none focus:border-[#E12F2F]/50 transition-colors';

export default function AboutPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-[#0F0F0F] flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#0F0F0F] text-white pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src="/assets/automate/mechanic-2.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/90 to-[#0F0F0F]/50" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_left,#E12F2F,transparent_60%)] opacity-[0.12] blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-[#E12F2F] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" /><span className="text-white">About Us</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-2 text-[#E12F2F] text-[11px] font-black uppercase tracking-widest mb-5">
                <span className="w-5 h-px bg-[#E12F2F]" /><span>About Us</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-none mb-6 uppercase">
                Driven By Passion<br /><span className="text-[#E12F2F]">Powered By</span> Precision
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-lg">
                Automate connects you with elite certified mechanics for diagnostics, repairs, and OEM parts — engineered for performance-driven ownership.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {['Fuel System Repair','Air Conditioning','Wheel Alignment','Engine Diagnostics','Brake Calibration','Performance Remap'].map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E12F2F] flex-shrink-0" />{s}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
                  <img src="/assets/automate/team-1.jpg" alt="CEO" className="w-10 h-10 rounded-xl object-cover" />
                  <div><p className="text-sm font-bold text-white">Ahmed Khalid</p><p className="text-[10px] text-slate-400">Co-Founder</p></div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#E12F2F]/10 border border-[#E12F2F]/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#E12F2F]" />
                  </div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ISO Certificate</p><p className="text-sm font-bold text-white">Manufacturer</p></div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <Link href="/request-quote">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 px-6 h-12 bg-[#E12F2F] hover:bg-[#C41F1F] text-white text-sm font-bold rounded-xl transition-colors">
                    More About Us <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <a href="tel:+12345678900" className="flex items-center gap-3 group">
                  <div className="w-11 h-11 rounded-xl bg-[#E12F2F] flex items-center justify-center shadow-lg shadow-red-500/20">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Need Help</p>
                    <p className="text-sm font-bold text-white group-hover:text-[#E12F2F] transition-colors">+1 234 567 8900</p>
                  </div>
                </a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden lg:block">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img src="/assets/automate/mechanic-1.jpg" alt="Mechanic at work" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/70 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#E12F2F] text-white rounded-2xl px-6 py-4 shadow-2xl shadow-red-500/30">
                <p className="text-5xl font-display leading-none">20+</p>
                <p className="text-xs font-bold uppercase tracking-wider mt-1 opacity-90">Years of Experience</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED PARTNERS ── */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col sm:flex-row items-center gap-8">
          <p className="text-sm font-black text-[#0F0F0F] uppercase tracking-wider whitespace-nowrap flex-shrink-0">Your Trusted Partner:</p>
          <div className="flex flex-wrap items-center justify-center gap-8 flex-1 opacity-60">
            {PARTNERS.map((src, i) => (
              <img key={i} src={src} alt={`Partner ${i + 1}`} className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET OUR TEAM ── */}
      <section className="bg-[#F5F5F5] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-[#E12F2F] text-[11px] font-black uppercase tracking-widest mb-4">
              <span className="w-5 h-px bg-[#E12F2F]" /><span>Our Technicians</span><span className="w-5 h-px bg-[#E12F2F]" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-[#0F0F0F] uppercase">Meet Our Expert Technicians</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Certified specialists with decades of experience in high-performance automotive diagnostics and precision repair.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-[#E12F2F]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    {['Fb','Tw','In'].map(s => (
                      <div key={s} className="w-9 h-9 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-bold">{s}</div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100">
                  <p className="font-bold text-[#0F0F0F] text-sm">{m.name}</p>
                  <p className="text-[#E12F2F] text-[11px] font-bold uppercase tracking-wider mt-0.5">{m.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA + APPOINTMENT ── */}
      <section className="relative bg-[#0F0F0F] py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src="/assets/automate/mechanic-3.jpg" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-[#0F0F0F]/80" />
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,#E12F2F,transparent_65%)] opacity-10 blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2 text-[#E12F2F] text-[11px] font-black uppercase tracking-widest mb-5">
              <span className="w-5 h-px bg-[#E12F2F]" /><span>Let's Connect</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase leading-tight mb-6">
              Don't Wait, Get Your Car<br />Back in <span className="text-[#E12F2F]">Top Shape</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
              Book a certified mechanic today and get your vehicle back to factory-grade precision — fast, verified, and hassle-free.
            </p>
            <Link href="/request-quote">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 px-6 h-12 bg-[#E12F2F] hover:bg-[#C41F1F] text-white text-sm font-bold rounded-xl transition-colors">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur-md">
            {submitted ? (
              <div className="bg-brand/10 border border-brand/20 rounded-3xl p-8 text-center text-white">
                <CheckCircle2 className="w-12 h-12 text-[#E12F2F] mx-auto mb-4 animate-bounce" />
                <h3 className="font-display text-2xl uppercase mb-2">Booking Requested!</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Thank you, {formData.name}. Our team will contact you shortly at {formData.phone} to confirm your appointment.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', date: '', service: '' });
                  }}
                  className="px-6 py-2 border border-white/20 hover:bg-white/5 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl text-white uppercase mb-6">Book Your Appointment</h3>
                <form className="space-y-4" onSubmit={handleBookingSubmit}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={iCls}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={iCls}
                  />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className={iCls}
                  />
                  <select
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-[#1a1a1a] border border-white/[0.08] text-slate-400 text-sm outline-none focus:border-[#E12F2F]/50 transition-colors cursor-pointer"
                  >
                    <option value="">Select a Service</option>
                    {['Fuel System Repair','Engine Diagnostics','Brake Calibration','Performance Remap','Air Conditioning','Wheel Alignment'].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full h-12 bg-[#E12F2F] hover:bg-[#C41F1F] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                    Book Appointment <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-[#E12F2F] text-[11px] font-black uppercase tracking-widest mb-4">
              <span className="w-5 h-px bg-[#E12F2F]" /><span>Our Working Process</span><span className="w-5 h-px bg-[#E12F2F]" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-[#0F0F0F] uppercase">How Do We Work</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              A streamlined three-step process engineered for zero friction and maximum vehicle performance.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div key={step.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative bg-[#F5F5F5] rounded-3xl p-8 border border-gray-100 hover:border-[#E12F2F]/30 hover:shadow-lg transition-all group overflow-hidden">
                <span className="absolute top-5 right-6 text-6xl font-display text-black/5 group-hover:text-[#E12F2F]/10 transition-colors leading-none select-none">{step.n}</span>
                <div className="w-14 h-14 rounded-2xl bg-[#E12F2F] flex items-center justify-center mb-6 shadow-md shadow-red-500/20">
                  <span className="text-white text-2xl font-display">{step.n}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F0F0F] mb-3">{step.t}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <Testimonials />

      {/* ── STATS + IMAGE ── */}
      <section className="bg-[#F5F5F5] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 text-[#E12F2F] text-[11px] font-black uppercase tracking-widest mb-5">
                <span className="w-5 h-px bg-[#E12F2F]" /><span>Our Track Record</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-[#0F0F0F] uppercase leading-tight mb-6">
                Clean, Polished Results<br />By <span className="text-[#E12F2F]">Trusted Professionals</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-md">
                Over two decades of engineering excellence, delivering factory-grade results for thousands of clients worldwide.
              </p>
              <div className="grid grid-cols-2 gap-5">
                {STATS.map(s => (
                  <div key={s.l} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-4xl font-display text-[#E12F2F] leading-none">{s.v}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">{s.l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative hidden lg:block">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                <img src="/assets/automate/mechanic-1.jpg" alt="Professional mechanic" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-[#E12F2F]/20 pointer-events-none -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

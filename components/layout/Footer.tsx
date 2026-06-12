'use client';

import React from 'react';
import Link from 'next/link';
import { useToastStore } from '../../store/toastStore';

export function Footer() {
  const addToast = useToastStore((state) => state.addToast);

  const handleLegalClick = (type: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    addToast({
      type: 'info',
      title: type,
      message: `The full ${type} document will be available upon public launch.`,
    });
  };

  return (
    <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[200px] bg-[#FF2D2D]/5 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-20">
          <div className="col-span-1 md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-8 group w-fit">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D2D] to-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,45,45,0.4)]">
                <span className="text-white font-bold text-xl leading-none">A</span>
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">Automate</span>
            </Link>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm font-light">
              Elevating the standard of automotive ownership through intelligent, cinematic software experiences.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <h3 className="font-semibold text-white tracking-wide mb-6 uppercase text-sm">Services</h3>
            <ul className="space-y-4">
              <li><Link href="/dashboard" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block font-light">Car Management</Link></li>
              <li><Link href="/mechanics" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block font-light">Mechanic Booking</Link></li>
              <li><Link href="/shop" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block font-light">Spare Parts</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-white tracking-wide mb-6 uppercase text-sm">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/#features" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block font-light">About Us</Link></li>
              <li><Link href="/#how-it-works" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block font-light">How It Works</Link></li>
              <li><Link href="/#testimonials" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block font-light">Testimonials</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-white tracking-wide mb-6 uppercase text-sm">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" onClick={handleLegalClick('Privacy Policy')} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block font-light cursor-pointer">Privacy Policy</a></li>
              <li><a href="#" onClick={handleLegalClick('Terms of Service')} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block font-light cursor-pointer">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm text-center md:text-left font-light">
            © 2026 Automate Inc. All rights reserved. Designed in Silicon Valley.
          </p>
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors flex items-center justify-center text-gray-400 hover:text-white">
                <span className="sr-only">Social Link {i}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

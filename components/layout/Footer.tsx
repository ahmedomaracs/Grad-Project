'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Phone, Mail, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { Logo } from '../ui/Logo';
import { SOCIAL_LINKS } from '../ui/SocialIcons';
import { BrandLogo } from './layout';

const FOOTER_PAGES = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact us', href: '/request-quote' },
];

const FOOTER_SERVICES = [
  'Exterior Detailing',
  'Interior Detailing',
  'Mechanical Repairs',
  'Cosmetic Repairs',
  'Engine & Transmission',
];

export function Footer() {
  const addToast = useToastStore((s) => s.addToast);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    addToast({
      type: 'success',
      title: 'Subscribed!',
      message: 'You will now receive Automate updates and offers.',
    });
    setNewsletterEmail('');
  };

  return (
    <footer className="relative bg-ink text-muted-light selection:bg-brand/20 selection:text-brand">
      {/* ── Newsletter band ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14">
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-ink-soft">
          <img
            src="/assets/carhive/mechanic-2.jpg"
            alt=""
            className="absolute inset-y-0 right-0 w-1/2 h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-soft via-ink-soft/90 to-transparent" />
          <div className="relative px-6 sm:px-12 py-12 text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl text-white">
              Subscribe To Our Newsletter
            </h2>
            <p className="text-muted-light/70 mt-3 text-sm leading-relaxed">
              Get the latest automotive tips, service offers, and platform updates delivered straight to your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="mt-7 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 h-12 px-5 rounded-full bg-white text-ink placeholder-muted outline-none focus:ring-2 focus:ring-brand/40"
              />
              <button
                type="submit"
                className="h-12 px-7 rounded-full bg-brand text-white font-semibold inline-flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors"
              >
                Submit Now <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main footer columns ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            {/* Cleaned-up Footer Brand Identifier Section */}
            <div className="flex flex-col space-y-2 mb-5">
              
              <Link href="/" className="flex items-center text-lg sm:text-xl font-black uppercase tracking-tight font-sans select-none focus:outline-none w-max">
                {/* Clean text values - no outlines */}
                <span className="text-white">AUTO</span>
                <span className="text-[#E62424] ml-[1px]">MATE</span>
              </Link>

              <p className="text-xs font-normal text-slate-400 max-w-xs leading-relaxed">
                Elevating the standard of automotive ownership through intelligent, certified, and connected service experiences.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 grid place-items-center rounded-full bg-brand text-white hover:bg-brand-dark transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-display text-xl text-white mb-5">Pages</h3>
            <ul className="space-y-3">
              {FOOTER_PAGES.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-muted-light/80 hover:text-white transition-colors"
                  >
                    <span className="text-brand font-bold">»</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-xl text-white mb-5">Services</h3>
            <ul className="space-y-3">
              {FOOTER_SERVICES.map((label) => (
                <li key={label}>
                  <Link
                    href="/#services"
                    className="group inline-flex items-center gap-2 text-sm text-muted-light/80 hover:text-white transition-colors"
                  >
                    <span className="text-brand font-bold">»</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-display text-xl text-white mb-5">Contact Us</h3>
            <ul className="space-y-4 text-sm text-muted-light/80">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                <a href="mailto:domain@example.com" className="hover:text-white transition-colors">domain@example.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                <a href="tel:+12345678900" className="hover:text-white transition-colors">+12 345 678 900</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand flex-shrink-0" />
                <span>Mon - Fri, 09:00 am - 07:00 pm</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand flex-shrink-0" />
                <span>544, New York City, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Partner onboarding CTAs (links to static pages) */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <span className="font-display text-lg text-white">Partner with Automate</span>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/become-a-mechanic', title: 'Become a Mechanic' },
              { href: '/become-a-merchant', title: 'Become a Merchant' },
              { href: '/become-a-supplier', title: 'Become a Supplier' },
            ].map((partner) => (
              <Link
                key={partner.title}
                href={partner.href}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-brand hover:border-brand transition-all cursor-pointer"
              >
                {partner.title}
                <ChevronRight className="w-4 h-4 text-brand group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-light/60">
          <p>Automate © 2026. All Rights Reserved.</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; condition</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/request-quote" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

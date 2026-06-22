import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Manage your vehicles, book certified mechanics, and shop genuine automotive parts — all in one luxury platform.',
};
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/sections/Hero';
import { Statistics } from '../components/sections/Statistics';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { Services } from '../components/sections/Services';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Testimonials } from '../components/sections/Testimonials';
import { Cta } from '../components/sections/Cta';
import { Footer } from '../components/layout/Footer';
import { SmoothScroll } from '../components/SmoothScroll';

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white font-sans selection:bg-brand/20 selection:text-brand overflow-x-hidden text-ink relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] before:[background-size:24px_24px] before:opacity-30 before:pointer-events-none">
        <Navbar />

        <main>
          <Hero />
          <Statistics />
          <FeaturesSection />
          <Services />
          <HowItWorks />
          <Testimonials />
          <Cta />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}



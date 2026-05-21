import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/sections/Hero';
import { Statistics } from '../components/sections/Statistics';
import { Features } from '../components/sections/Features';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Testimonials } from '../components/sections/Testimonials';
import { Cta } from '../components/sections/Cta';
import { Footer } from '../components/layout/Footer';
import { SmoothScroll } from '../components/SmoothScroll';

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#FF2D2D]/20 selection:text-[#FF2D2D] overflow-x-hidden text-[#111111]">
        <Navbar />
        
        <main>
          <Hero />
          <Statistics />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Cta />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}

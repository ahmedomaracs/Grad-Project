import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { EnquiryForm } from '../../components/sections/EnquiryForm';

export default function RequestQuotePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans selection:bg-[#E12F2F]/20 selection:text-[#E12F2F] overflow-x-hidden text-[#0F0F0F]">
      <Navbar />
      
      <main className="pt-20">
        <EnquiryForm />
      </main>

      <Footer />
    </div>
  );
}

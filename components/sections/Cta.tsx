'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import Link from 'next/link';

export function Cta() {
  return (
    <section className="py-32 bg-surface relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-ink rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl"
        >
          {/* Animated Red Mesh Gradient Background */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
             <motion.div 
               animate={{ 
                 scale: [1, 1.2, 1],
                 rotate: [0, 90, 0],
               }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-[radial-gradient(ellipse_at_center,_#E12F2F_0%,_transparent_50%)] blur-[80px]"
             />
             <motion.div 
               animate={{ 
                 scale: [1, 1.5, 1],
                 x: [0, 100, 0],
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[120%] bg-[radial-gradient(ellipse_at_center,_#801515_0%,_transparent_50%)] blur-[100px]"
             />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-6xl text-white mb-6 leading-tight">
              Experience the Future of Automotive Care
            </h2>
            <p className="text-xl text-gray-400 mb-12 font-light">
              Join the elite tier of satisfied users managing their premium automotive needs with Automate.
            </p>
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-white text-ink hover:bg-gray-100 hover:text-black border-transparent shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] px-12 h-16 text-xl rounded-2xl"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

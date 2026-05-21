'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Create Account', desc: 'Securely sign up and join the exclusive Automate network.' },
  { num: '02', title: 'Add Your Cars', desc: 'Sync your vehicle details for AI-driven service recommendations.' },
  { num: '03', title: 'Book Services', desc: 'Schedule premium maintenance or buy certified parts effortlessly.' },
  { num: '04', title: 'Track & Manage', desc: 'Monitor service progress live from your cinematic dashboard.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight"
            >
              Intelligence in Motion
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-500"
            >
              Experience a streamlined, four-step process designed to remove the friction from automotive management.
            </motion.p>
          </div>
        </div>

        <div className="relative">
          {/* Animated Horizontal Line Desktop */}
          <div className="hidden lg:block absolute top-[44px] left-0 w-full h-[2px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-transparent via-[#FF2D2D] to-transparent"
            />
          </div>

          <div className="grid lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center lg:items-start text-center lg:text-left group"
              >
                {/* Mobile Vertical Line */}
                {index !== steps.length - 1 && (
                  <div className="lg:hidden absolute top-24 bottom-[-3rem] left-1/2 w-[2px] bg-gray-100 -translate-x-1/2 overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="w-full bg-gradient-to-b from-[#FF2D2D] to-transparent"
                    />
                  </div>
                )}

                {/* Glowing Circle */}
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 bg-[#FF2D2D]/20 rounded-full blur-xl scale-50 group-hover:scale-100 transition-transform duration-500" />
                  <div className="absolute inset-2 bg-white rounded-full border border-gray-100 shadow-xl flex items-center justify-center z-10">
                    <span className="text-2xl font-black text-gray-900 group-hover:text-[#FF2D2D] transition-colors duration-300">
                      {step.num}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

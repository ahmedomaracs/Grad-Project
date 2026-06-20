'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 10, suffix: 'K+', label: 'Active Users', description: 'Trusting our platform daily' },
  { value: 500, suffix: '+', label: 'Mechanics', description: 'Certified & vetted experts' },
  { value: 4.9, suffix: '★', label: 'User Rating', description: 'Across all app stores', isFloat: true },
];

function AnimatedCounter({ value, isFloat = false }: { value: number, isFloat?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{isFloat ? count.toFixed(1) : Math.floor(count)}</span>;
}

export function Statistics() {
  return (
    <section className="relative py-16 bg-ink-soft overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-brand/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 bg-white/[0.03] backdrop-blur-lg rounded-3xl border border-white/10 hover:border-brand/40 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand/20 to-transparent blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-baseline gap-1 mb-2">
                  <div className="font-display text-5xl lg:text-6xl text-white tracking-tight">
                    <AnimatedCounter value={stat.value} isFloat={stat.isFloat} />
                  </div>
                  <div className="font-display text-3xl text-brand">{stat.suffix}</div>
                </div>
                <div className="text-xl font-bold text-white mb-1">{stat.label}</div>
                <div className="text-sm font-medium text-muted-light/70">{stat.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

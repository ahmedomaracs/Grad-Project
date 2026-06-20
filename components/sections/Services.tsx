'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { servicesData } from '../../lib/servicesData';
import { useAuthStore } from '../../store/authStore';

export function Services() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  const handleServiceClick = (slug: string) => {
    const targetUrl = `/dashboard/book-quote?service=${slug}`;
    if (isAuthenticated) {
      router.push(targetUrl);
    } else {
      router.push(`/signup?callbackUrl=${encodeURIComponent(targetUrl)}`);
    }
  };

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand font-bold text-sm tracking-wider uppercase bg-brand/10 px-4 py-1.5 rounded-full inline-block mb-4">
              Premium Solutions
            </span>
            <h2 className="font-display text-4xl lg:text-5xl text-slate-900 mb-6">
              Our Services
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Explore our core technical services. Click any category to view full package specifications, pricing matrices, and customization options.
            </p>
          </motion.div>
        </div>

        {/* 8-Card Service Grid */}
        <div className="group/services-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => {
            const IconComponent = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.slug)}
                className="text-left p-6 lg:p-8 rounded-2xl transition-all duration-300 border bg-gradient-to-br from-slate-50 to-white text-slate-900 border-slate-200/60 hover:border-[#E62424]/40 flex flex-col justify-between min-h-[160px] relative overflow-hidden group/card cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E62424]
                  lg:group-hover/services-grid:opacity-60 lg:hover:!opacity-100 lg:hover:scale-105 lg:hover:z-20 lg:hover:shadow-[0_25px_50px_-12px_rgba(230,36,36,0.15)]
                  active:scale-[0.98] lg:active:scale-[0.98] shadow-sm
                "
                style={{
                  minHeight: '48px',
                  minWidth: '48px',
                }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-brand/10 text-brand group-hover/card:bg-[#E62424] group-hover/card:text-white">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 leading-snug group-hover/card:text-[#E62424] transition-colors duration-300 text-base lg:text-lg">
                    {service.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#E62424] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <span>Explore details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

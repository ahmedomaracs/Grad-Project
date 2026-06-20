'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { servicesData } from '../../lib/servicesData';
import { useAuthStore } from '../../store/authStore';

import acRepairImg from '../../app/services/OurServices/AcRepair-service.webp';
import batteryReplacementImg from '../../app/services/OurServices/BatteryReplacment-service.avif';
import carDiagnosticImg from '../../app/services/OurServices/CarDiagnostic-service.jpg';
import engineRepairImg from '../../app/services/OurServices/EngineRepair-service.jpg';
import oilChangeImg from '../../app/services/OurServices/OilChange-service.avif';
import scheduledMaintenanceImg from '../../app/services/OurServices/ScheduledMaintainance-service.png';
import tireBalanceImg from '../../app/services/OurServices/TireBalance-service.jpg';
import transmissionRepairImg from '../../app/services/OurServices/TransmissionRepair-service.webp';

const serviceImageMap: Record<string, any> = {
  'car-scanning-diagnostics': carDiagnosticImg,
  'car-battery-replacement': batteryReplacementImg,
  'car-engine-repair': engineRepairImg,
  'car-transmission-repair': transmissionRepairImg,
  'car-scheduled-maintenance': scheduledMaintenanceImg,
  'car-oil-change': oilChangeImg,
  'car-ac-repair': acRepairImg,
  'car-wheel-balancing-alignment': tireBalanceImg,
};

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
            const serviceImage = serviceImageMap[service.slug];

            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.slug)}
                className="text-left p-0 rounded-2xl transition-all duration-300 border bg-gradient-to-br from-slate-50 to-white text-slate-900 border-slate-200/60 hover:border-[#E62424]/40 flex flex-col relative overflow-hidden group/card cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E62424]
                  lg:group-hover/services-grid:opacity-60 lg:hover:!opacity-100 lg:hover:scale-105 lg:hover:z-20 lg:hover:shadow-[0_25px_50px_-12px_rgba(230,36,36,0.15)]
                  active:scale-[0.98] lg:active:scale-[0.98] shadow-sm min-h-[220px]
                "
              >
                {/* Image Section */}
                <div className="w-full h-36 relative bg-slate-200 overflow-hidden shrink-0">
                  {serviceImage && (
                    <Image
                      src={serviceImage}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 bg-white/20 backdrop-blur-sm text-white group-hover/card:bg-[#E62424] shadow-sm">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <h3 className="font-bold text-slate-900 leading-snug group-hover/card:text-[#E62424] transition-colors duration-300 text-base lg:text-lg">
                    {service.name}
                  </h3>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#E62424] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
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

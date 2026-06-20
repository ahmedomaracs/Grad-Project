'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Car, Wrench, Calendar, Bell, ShoppingCart } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  badge: { text: string; className: string };
  colSpan: string;
  route: string;
}

const features: Feature[] = [
  {
    icon: <Car className="w-6 h-6 text-brand" />,
    iconBg: 'bg-brand/10 text-brand',
    title: 'Vehicle Management',
    description:
      'Track maintenance, service history, mileage, and vehicle records in one centralized dashboard.',
    badge: { text: 'Active Feature', className: 'text-brand bg-brand/10 border border-brand/20' },
    colSpan: 'md:col-span-1 lg:col-span-2',
    route: '/dashboard/my-garage',
  },
  {
    icon: <Wrench className="w-6 h-6 text-brand" />,
    iconBg: 'bg-brand/10 text-brand',
    title: 'Certified Mechanics',
    description: '500+ verified mechanics available for instant booking.',
    badge: { text: 'Verified', className: 'text-brand bg-brand/10 border border-brand/20' },
    colSpan: 'md:col-span-1',
    route: '/mechanics',
  },
  {
    icon: <Calendar className="w-6 h-6 text-brand" />,
    iconBg: 'bg-brand/10 text-brand',
    title: 'Instant Booking',
    description: 'Book trusted mechanics in less than 60 seconds.',
    badge: { text: 'Fast & Easy', className: 'text-brand bg-brand/10 border border-brand/20' },
    colSpan: 'md:col-span-1',
    route: '/services',
  },
  {
    icon: <ShoppingCart className="w-6 h-6 text-brand" />,
    iconBg: 'bg-brand/10 text-brand',
    title: 'Spare Parts Shop',
    description:
      'Shop authentic automotive parts with comprehensive warranty protection.',
    badge: { text: '10,000+ Parts', className: 'text-brand bg-brand/10 border border-brand/20' },
    colSpan: 'md:col-span-1',
    route: '/shop',
  },
  {
    icon: <Bell className="w-6 h-6 text-brand" />,
    iconBg: 'bg-brand/10 text-brand',
    title: 'Smart Alerts',
    description:
      'Automated reminders for oil changes, inspections, and upcoming services.',
    badge: { text: 'AI Powered', className: 'text-brand bg-brand/10 border border-brand/20' },
    colSpan: 'md:col-span-1',
    route: '/dashboard',
  },
];

function BentoCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (feature.route) {
      router.push(feature.route);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={handleClick}
      className={`
        ${feature.colSpan}
        bg-white/80 backdrop-blur-xl
        border border-slate-100
        rounded-2xl p-6
        shadow-sm
        transition-all duration-300 ease-in-out
        hover:shadow-[0_0_30px_rgba(225,47,47,0.12)]
        hover:border-brand/40
        hover:scale-[1.015]
        active:scale-[0.99] active:bg-white/[0.04]
        cursor-pointer
      `}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.iconBg}`}
        >
          {feature.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 leading-tight truncate">
            {feature.title}
          </h3>
          <span
            className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${feature.badge.className}`}
          >
            {feature.badge.text}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-28 bg-surface relative overflow-hidden"
    >
      {/* Subtle ambient background glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-brand/5 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tl from-brand/5 to-transparent blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-semibold tracking-wide uppercase mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            Platform Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl lg:text-5xl text-ink mb-6"
          >
            Everything You Need for Your Car
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-gray-500"
          >
            A complete automotive service platform designed to make luxury car
            ownership easier and more convenient.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <BentoCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

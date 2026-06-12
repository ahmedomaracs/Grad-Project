'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, ShoppingBag } from 'lucide-react';

const features = [
  {
    icon: <Car className="w-8 h-8 text-[#FF2D2D]" />,
    title: 'Car Management',
    description: 'Keep track of your vehicle history, maintenance schedules, and important documents in an intelligent digital garage.',
  },
  {
    icon: <Wrench className="w-8 h-8 text-[#FF2D2D]" />,
    title: 'Expert Mechanics',
    description: 'Connect with certified, vetted mechanics for on-demand luxury service, repairs, and diagnostics at your location.',
  },
  {
    icon: <ShoppingBag className="w-8 h-8 text-[#FF2D2D]" />,
    title: 'Spare Parts Shop',
    description: 'Browse and purchase authentic, high-quality spare parts specifically guaranteed to fit your registered vehicles.',
  },
];

function PremiumFeatureCard({ feature, index }: { feature: any, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden group transition-all duration-500 ease-out group-hover:opacity-40 hover:!opacity-100 hover:scale-105 hover:z-50 hover:shadow-2xl will-change-transform"
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${(mousePosition.y - 150) / 30}deg) rotateY(${-(mousePosition.x - 150) / 30}deg)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: isHovered ? 'none' : 'transform 0.5s ease'
      }}
    >
      {/* Animated Glow following mouse */}
      <div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 45, 45, 0.08), transparent 40%)`
        }}
      />

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF2D2D]/10 to-transparent flex items-center justify-center mb-8 border border-[#FF2D2D]/20 shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out">
          <motion.div
            animate={{ y: isHovered ? [0, -5, 0] : 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {feature.icon}
          </motion.div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-[#FF2D2D] transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-lg">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-32 bg-[#FAFAFA] relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2D2D]/10 text-[#FF2D2D] text-sm font-semibold tracking-wide uppercase mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF2D2D] animate-pulse" />
            Platform Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight"
          >
            Everything You Need for Your Car
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500"
          >
            A complete automotive service platform designed to make luxury car ownership easier and more convenient.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 group">
          {features.map((feature, index) => (
            <PremiumFeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

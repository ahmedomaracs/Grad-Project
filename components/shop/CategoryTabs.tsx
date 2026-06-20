'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../../constants/shop';
import { Category } from '../../types/shop';
import { cn } from '../../lib/utils';

interface CategoryTabsProps {
  active: Category;
  onChange: (cat: Category) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            onHoverStart={() => setHoveredCat(cat)}
            onHoverEnd={() => setHoveredCat(null)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap',
              isActive
                ? 'text-white bg-[#E12F2F] shadow-[0_4px_12px_rgba(230,36,36,0.3)] border border-[#E12F2F]'
                : 'text-slate-700 bg-white border border-slate-200 hover:border-slate-300'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="activeCategoryBg"
                className="absolute inset-0 rounded-xl bg-[#E12F2F]"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {hoveredCat === cat && !isActive && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-xl bg-[#E12F2F]/5"
              />
            )}
            {cat}
          </motion.button>
        );
      })}
    </div>
  );
}

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
            whileTap={{ scale: 0.96 }}
            className={cn(
              'relative flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap',
              isActive
                ? 'text-white bg-[#FF2D2D] shadow-[0_0_20px_rgba(255,45,45,0.35)] border border-[#FF2D2D]/60'
                : 'text-gray-600 bg-white border border-gray-200 hover:border-[#FF2D2D]/40 hover:text-[#FF2D2D]'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="activeCategoryBg"
                className="absolute inset-0 rounded-xl bg-[#FF2D2D]"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {hoveredCat === cat && !isActive && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-xl bg-[#FF2D2D]/5"
              />
            )}
            {cat}
          </motion.button>
        );
      })}
    </div>
  );
}

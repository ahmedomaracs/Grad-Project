'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterState, SortOption } from '../../types/shop';
import { cn } from '../../lib/utils';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

export function FilterDrawer({ isOpen, onClose, filters, onChange, onReset }: FilterDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            key="filter-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 35 }}
            className="fixed left-0 top-0 bottom-0 w-full sm:w-[360px] bg-white z-50 flex flex-col shadow-[20px_0_60px_rgba(0,0,0,0.12)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E12F2F]/10 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-[#E12F2F]" />
                </div>
                <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold text-gray-500 hover:text-[#E12F2F] hover:bg-[#E12F2F]/5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {/* Sort By */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sort By</h3>
                <div className="space-y-2">
                  {SORT_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                      onClick={() => onChange({ sortBy: opt.value })}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        filters.sortBy === opt.value
                          ? 'bg-[#E12F2F]/8 text-[#E12F2F] border border-[#E12F2F]/20'
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                      )}
                    >
                      {opt.label}
                      {filters.sortBy === opt.value && (
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-[#E12F2F]"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Min ($)</label>
                      <input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) => onChange({ priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 outline-none focus:border-[#E12F2F]/40 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Max ($)</label>
                      <input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) => onChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 outline-none focus:border-[#E12F2F]/40 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[[0, 50], [50, 100], [100, 250], [250, 999]].map(([min, max]) => (
                      <motion.button
                        key={`${min}-${max}`}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onChange({ priceRange: [min, max] })}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
                          filters.priceRange[0] === min && filters.priceRange[1] === max
                            ? 'bg-[#E12F2F] text-white border-[#E12F2F]'
                            : 'border-gray-200 text-gray-600 hover:border-[#E12F2F]/40 hover:text-[#E12F2F]'
                        )}
                      >
                        ${min} – {max === 999 ? '999+' : `$${max}`}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* In stock toggle */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Availability</h3>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onChange({ inStockOnly: !filters.inStockOnly })}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200',
                    filters.inStockOnly
                      ? 'bg-[#E12F2F]/8 text-[#E12F2F] border-[#E12F2F]/20'
                      : 'text-gray-700 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  In Stock Only
                  <div className={cn(
                    'relative w-10 h-5.5 rounded-full transition-colors duration-300',
                    filters.inStockOnly ? 'bg-[#E12F2F]' : 'bg-gray-200'
                  )}>
                    <motion.div
                      animate={{ x: filters.inStockOnly ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm"
                    />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Apply button */}
            <div className="px-6 py-5 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full h-13 rounded-2xl bg-[#E12F2F] text-white font-semibold text-base shadow-[0_0_24px_rgba(255,45,45,0.3)] hover:shadow-[0_0_36px_rgba(255,45,45,0.5)] transition-all duration-300"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

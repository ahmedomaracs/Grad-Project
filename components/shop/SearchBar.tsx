'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onFilterOpen: () => void;
  activeFiltersCount?: number;
}

export function SearchBar({ value, onChange, onFilterOpen, activeFiltersCount = 0 }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      {/* Glow ring on focus */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#E12F2F]/20 via-[#E12F2F]/10 to-transparent blur-md pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ boxShadow: focused ? '0 0 0 2px rgba(255,45,45,0.25), 0 8px 32px rgba(0,0,0,0.06)' : '0 2px 12px rgba(0,0,0,0.04)' }}
        transition={{ duration: 0.2 }}
        className="relative flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 h-14 transition-colors duration-200"
        style={{ borderColor: focused ? 'rgba(255,45,45,0.4)' : undefined }}
      >
        <motion.div animate={{ color: focused ? '#E12F2F' : '#9CA3AF' }} transition={{ duration: 0.2 }}>
          <Search className="w-5 h-5 flex-shrink-0" />
        </motion.div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search spare parts, brands, categories…"
          className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-sm font-medium outline-none min-w-0"
        />

        {/* Clear button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => { onChange(''); inputRef.current?.focus(); }}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

        {/* Filter button */}
        <motion.button
          onClick={onFilterOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-semibold flex-shrink-0 transition-all duration-200',
            activeFiltersCount > 0
              ? 'bg-[#E12F2F] text-white shadow-[0_0_16px_rgba(255,45,45,0.3)]'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#E12F2F] text-xs font-bold"
            >
              {activeFiltersCount}
            </motion.span>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

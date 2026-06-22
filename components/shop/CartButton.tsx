'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { cn } from '../../lib/utils';

interface CartButtonProps {
  className?: string;
  variant?: 'navbar' | 'hero';
}

export function CartButton({ className, variant = 'navbar' }: CartButtonProps) {
  const { toggleCart, totalItems } = useCartStore();
  const count = totalItems();
  const [prevCount, setPrevCount] = useState(0);
  const [bumped, setBumped] = useState(false);

  useEffect(() => {
    if (count > prevCount) {
      setBumped(true);
      const t = setTimeout(() => setBumped(false), 500);
      setPrevCount(count);
      return () => clearTimeout(t);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  if (variant === 'hero') {
    return (
      <motion.button
        onClick={toggleCart}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'relative flex items-center gap-3 px-7 h-14 rounded-2xl text-base font-semibold text-white',
          'bg-[#E12F2F] border border-[#E12F2F]/50',
          'shadow-[0_0_30px_rgba(255,45,45,0.4)] hover:shadow-[0_0_50px_rgba(255,45,45,0.6)]',
          'transition-all duration-300 group overflow-hidden',
          className
        )}
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        <ShoppingCart className="w-5 h-5" />
        <span>View Cart</span>
        <AnimatePresence mode="popLayout">
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#E12F2F] text-xs font-bold"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={toggleCart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={bumped ? { scale: [1, 1.2, 1] } : {}}
      className={cn(
        'w-9 h-9 flex items-center justify-center bg-slate-50/80 border border-slate-200/60 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all cursor-pointer relative',
        className
      )}
    >
      <ShoppingCart className="w-4.5 h-4.5" />
      <AnimatePresence mode="popLayout">
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-[#E62424] text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1 border-2 border-white"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package2 } from 'lucide-react';
import { Product } from '../../types/shop';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden animate-pulse">
      <div className="h-52 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-gray-100 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-100 rounded-full" />
        <div className="h-4 w-1/2 bg-gray-100 rounded-full" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-100 rounded-lg" />
          <div className="h-6 w-16 bg-gray-100 rounded-lg" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-7 w-20 bg-gray-100 rounded-full" />
          <div className="h-10 w-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-3xl bg-[#E12F2F]/8 flex items-center justify-center mb-6"
        >
          <Package2 className="w-12 h-12 text-[#E12F2F]/40" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No parts found</h3>
        <p className="text-gray-400 max-w-xs">
          Try adjusting your search or filters to discover our full catalog of premium automotive parts.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

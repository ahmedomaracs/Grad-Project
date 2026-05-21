'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingStars({ rating, reviewCount, size = 'sm', className }: RatingStarsProps) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const partial = !filled && rating >= star - 0.5;
          return (
            <motion.div
              key={star}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: star * 0.06, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Star
                className={cn(
                  sizes[size],
                  'transition-colors duration-200',
                  filled || partial
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-gray-100 text-gray-300'
                )}
              />
            </motion.div>
          );
        })}
      </div>
      <span className={cn('font-bold text-gray-900', textSizes[size])}>{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className={cn('text-gray-400', textSizes[size])}>({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}

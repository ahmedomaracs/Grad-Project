'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Zap } from 'lucide-react';
import Image from 'next/image';
import { Product } from '../../types/shop';
import { useCartStore } from '../../store/cartStore';
import { RatingStars } from './RatingStars';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleAddToCart = () => {
    if (!product.inStock || justAdded) return;
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${(mousePos.y - 170) / 35}deg) rotateY(${-(mousePos.x - 150) / 35}deg)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: isHovered ? 'transform 0.05s linear' : 'transform 0.5s ease',
      }}
      className="relative group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#FF2D2D]/20 transition-shadow duration-500"
    >
      {/* Mouse-following glow */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,45,45,0.07), transparent 50%)`,
        }}
      />

      {/* Image container */}
      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Shimmer skeleton */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse" />

        <motion.div
          animate={{ scale: isHovered ? 1.07 : 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 z-10 relative"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback: hide broken img, show placeholder
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </motion.div>

        {/* Fallback SVG icon when image fails */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <svg className="w-20 h-20 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-full bg-gray-900/90 text-white text-xs font-bold tracking-widest uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badge */}
        {product.badge && product.inStock && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-xs font-bold tracking-wide',
              product.badge === 'Best Seller' && 'bg-amber-500 text-white',
              product.badge === 'Sale' && 'bg-[#FF2D2D] text-white',
              product.badge === 'New' && 'bg-blue-500 text-white',
              product.badge === 'Premium' && 'bg-[#111111] text-white',
            )}
          >
            {product.badge === 'Sale' && discount ? `-${discount}%` : product.badge}
          </motion.div>
        )}

        {/* Discount badge */}
        {discount && product.badge !== 'Sale' && (
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="relative z-10 p-5">
        {/* Brand */}
        <p className="text-xs font-bold text-[#FF2D2D] uppercase tracking-widest mb-1">{product.brand}</p>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-[#FF2D2D] transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 text-[11px] font-medium border border-gray-100">
              {tag}
            </span>
          ))}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Add to cart button */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            whileHover={product.inStock ? { scale: 1.05, y: -1 } : {}}
            whileTap={product.inStock ? { scale: 0.95 } : {}}
            className={cn(
              'relative flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300',
              product.inStock
                ? justAdded
                  ? 'bg-green-500 text-white shadow-[0_0_16px_rgba(34,197,94,0.4)]'
                  : 'bg-[#FF2D2D] text-white shadow-[0_0_16px_rgba(255,45,45,0.25)] hover:shadow-[0_0_24px_rgba(255,45,45,0.5)]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.inStock ? 'Add' : 'N/A'}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Bottom glow line on hover */}
      <motion.div
        animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF2D2D] to-transparent origin-center"
      />
    </motion.div>
  );
}

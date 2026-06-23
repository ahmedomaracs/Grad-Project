'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Zap, X, Heart, Star, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '../../types/shop';
import { useCartStore } from '../../store/cartStore';
import { RatingStars } from './RatingStars';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showQuickSpecsModal, setShowQuickSpecsModal] = useState(false);
  const { addItem, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Simulate vehicle verification
  const isVehicleVerified = index % 3 !== 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock || justAdded) return;
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/shop/${product.id}`)}
      className="group relative bg-white rounded-2xl border border-slate-100/80 p-3 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1 flex flex-col justify-between h-full cursor-pointer"
    >
      {/* Product Image Stage (Noon Style Absolute Layout Layers) */}
      <div className="bg-slate-50/50 rounded-xl p-4 flex items-center justify-center relative overflow-hidden h-44 border border-slate-100/30">
        {/* Top Left: Express Badge or Category Priority */}
        <span className="absolute top-2 left-2 bg-slate-900 text-white font-mono text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md shadow-sm">
          Express
        </span>
        
        {/* Top Right: Wishlist Interaction Node */}
        <button 
          onClick={(e) => { e.stopPropagation(); }} 
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-slate-400 hover:text-[#E62424] border border-slate-100 shadow-sm transition-colors duration-200"
        >
          <Heart className="w-3.5 h-3.5" />
        </button>

        {/* Primary Hardware Image Asset */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-auto h-full max-h-32 object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* Bottom Right: High-Conversion Discount Overlay Ribbon */}
        {discount && (
          <span className="absolute bottom-2 right-2 bg-emerald-500 text-white font-mono font-black text-[10px] px-1.5 py-0.5 rounded-md">
            -{discount}%
          </span>
        )}

        {/* Premium "Quick Specs" Hover Mask */}
        <div className="absolute inset-0 bg-slate-950/5 opacity-0 hover:opacity-100 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300 rounded-t-3xl pointer-events-auto cursor-pointer z-30 will-change-[opacity]">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowQuickSpecsModal(true);
            }}
            className="bg-white/95 text-slate-950 shadow-xl font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-100 transform translate-y-2 hover:translate-y-0 hover:bg-[#E62424] hover:text-white hover:border-[#E62424] transition-all duration-200 will-change-[transform,opacity]"
          >
            Quick Specs
          </button>
        </div>
      </div>

      {/* Product Core Typography & Info Rows */}
      <div className="flex flex-col flex-grow mt-3 space-y-1">
        {/* Brand Context Label */}
        <span className="text-[10px] font-bold text-[#E62424] uppercase tracking-wider font-mono">
          {product.brand}
        </span>
        
        {/* Main Title Heading Block */}
        <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 h-8 group-hover:text-slate-900 transition-colors">
          {product.name}
        </h3>
        
        {/* Trust & Star Rating Rows */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded-md">
            <span className="text-[10px] font-black text-slate-800">{product.rating || '4.6'}</span>
            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-[9px] font-medium text-slate-400 font-mono">({product.reviewCount || '1.2k'})</span>
        </div>
      </div>

      {/* Price & Cart Addition Action Base Segment */}
      <div className="flex items-end justify-between mt-3 pt-2.5 border-t border-slate-100/60">
        <div className="flex flex-col">
          {product.originalPrice && (
            <span className="text-[10px] text-slate-400 font-medium line-through font-mono leading-none">
              EGP {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-base font-black text-slate-900 tracking-tight font-mono mt-0.5">
            EGP {product.price.toFixed(2)}
          </span>
        </div>

        {/* Rounded Explicit Action Button Interface */}
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="bg-slate-50 border border-slate-100 hover:bg-[#E62424] hover:border-[#E62424] text-slate-700 hover:text-white p-2 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>

    {/* Quick Specs Micro-Modal Overlay */}
    {showQuickSpecsModal && mounted && createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowQuickSpecsModal(false);
          }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm will-change-[opacity]"
        />
        
        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white/95 backdrop-blur-lg border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 will-change-[transform,opacity]"
        >
          <button
            onClick={() => setShowQuickSpecsModal(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-5 mb-6">
            <div className="w-24 h-24 relative rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-bold text-[#E12F2F] uppercase tracking-widest mb-1">{product.brand}</p>
              <h4 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2">{product.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900">EGP {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">EGP {product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specs Table */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 mb-6">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Technical Indices</h5>
            <div className="space-y-2">
              {product.characteristics ? (
                product.characteristics.technicalSpecs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-slate-100/50 last:border-0">
                    <span className="text-xs text-slate-500 font-medium">{spec.label}</span>
                    <span className="text-xs text-slate-900 font-bold">{spec.value}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/50">
                    <span className="text-xs text-slate-500 font-medium">Part MPN Code</span>
                    <span className="text-xs text-slate-900 font-bold font-mono">MPN-{product.id.toString().padStart(4, '0')}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/50">
                    <span className="text-xs text-slate-500 font-medium">OEM Reference Cross-Check Key</span>
                    <span className="text-xs text-slate-900 font-bold font-mono">34-11-6-792-{product.id.toString().padStart(3, '0')}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-slate-500 font-medium">Material Type</span>
                    <span className="text-xs text-slate-900 font-bold">Standard</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              handleAddToCart(e);
              setTimeout(() => setShowQuickSpecsModal(false), 800);
            }}
            disabled={!product.inStock}
            className={cn(
              "w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 will-change-[transform,opacity]",
              product.inStock
                ? justAdded
                  ? "bg-green-500 text-white shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
                  : "bg-[#E62424] text-white hover:bg-[#d01f1f] shadow-[0_4px_20px_rgba(230,36,36,0.2)] hover:shadow-[0_4px_24px_rgba(230,36,36,0.3)] hover:-translate-y-0.5"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {justAdded ? (
              <>
                <Check className="w-5 h-5" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Instant Add to Cart
              </>
            )}
          </button>
        </motion.div>
      </div>,
      document.body
    )}
    </>
  );
}

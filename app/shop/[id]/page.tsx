'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ZoomIn, ZoomOut, Info, MapPin, Truck, Check } from 'lucide-react';
import Link from 'next/link';
import { PRODUCTS } from '../../../constants/shop';
import { useCartStore } from '../../../store/cartStore';

export default function ProductCharacteristicsPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS.find((p) => p.id === params.id);
  const [zoomScale, setZoomScale] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState('center center');
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCartStore();

  if (!product) {
    return notFound();
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomScale > 1) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setTransformOrigin(`${x}% ${y}%`);
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock || justAdded) return;
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-slate-900 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#E62424] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT COLUMN: Precision Media Gallery */}
          <div className="relative theme-glass-card rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.03)] bg-white aspect-square flex items-center justify-center group">
            
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setZoomScale(Math.min(zoomScale + 0.5, 3))}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setZoomScale(Math.max(zoomScale - 0.5, 1))}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>

            {/* Image Wrapper */}
            <div 
              className="w-full h-full relative cursor-crosshair overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTransformOrigin('center center')}
            >
              <motion.div
                className="w-full h-full relative"
                animate={{ scale: zoomScale }}
                style={{ transformOrigin }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-12"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </div>
            
            {/* Context Badge */}
            <div className="absolute bottom-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> Hover to Inspect
            </div>
          </div>

          {/* RIGHT COLUMN: Characteristics Panel */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-3xl p-8 flex flex-col h-full">
            
            <div className="mb-6 border-b border-slate-100 pb-6">
              <p className="text-xs font-bold text-[#E62424] uppercase tracking-widest mb-2">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-display text-slate-950 leading-tight mb-4">{product.name}</h1>
              
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-extrabold text-[#E62424] tracking-tight">${product.price.toFixed(2)}</span>
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start mt-2">
                  + $50 Core Deposit, fully refundable on old part return
                </span>
              </div>
            </div>

            {/* Local Stock Widget */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse shrink-0" />
                <p className="text-sm font-semibold text-emerald-800 leading-snug">
                  In Stock - Available for immediate pickup at 10th of Ramadan Branch.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-700 ml-5">
                <Truck className="w-4 h-4" /> Same-day delivery eligible
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="mb-8 flex-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E62424]" />
                Technical Characteristics
              </h3>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden text-sm">
                <div className="grid grid-cols-3 border-b border-slate-200">
                  <div className="col-span-1 bg-slate-100/50 p-3 font-semibold text-slate-600 border-r border-slate-200">MPN</div>
                  <div className="col-span-2 p-3 text-slate-900 font-mono text-xs">{product.id.toString().padStart(6, '0')}-AX</div>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200">
                  <div className="col-span-1 bg-slate-100/50 p-3 font-semibold text-slate-600 border-r border-slate-200">OEM Cross-Ref</div>
                  <div className="col-span-2 p-3 text-slate-900 font-mono text-xs">34-11-6-792-{product.id.toString().padStart(3, '0')}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200">
                  <div className="col-span-1 bg-slate-100/50 p-3 font-semibold text-slate-600 border-r border-slate-200">Material</div>
                  <div className="col-span-2 p-3 text-slate-900">Advanced Ceramic / Semi-Metallic</div>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-200">
                  <div className="col-span-1 bg-slate-100/50 p-3 font-semibold text-slate-600 border-r border-slate-200">Placement</div>
                  <div className="col-span-2 p-3 text-slate-900">Front Axle / Universal Mount</div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="col-span-1 bg-slate-100/50 p-3 font-semibold text-slate-600 border-r border-slate-200">Dimensions</div>
                  <div className="col-span-2 p-3 text-slate-900">12" x 8" x 4" (Gross: 2.4 lbs)</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              whileHover={product.inStock ? { scale: 1.02 } : {}}
              whileTap={product.inStock ? { scale: 0.98 } : {}}
              className={`w-full flex justify-center items-center gap-2 h-14 rounded-2xl text-base font-bold text-white transition-all shadow-[0_8px_30px_rgba(230,36,36,0.2)] ${
                product.inStock
                  ? justAdded
                    ? 'bg-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.3)]'
                    : 'bg-[#E62424] hover:shadow-[0_8px_40px_rgba(230,36,36,0.4)]'
                  : 'bg-slate-300 shadow-none cursor-not-allowed'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-5 h-5" /> Added to Cart
                </>
              ) : (
                <>
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </motion.button>
            
          </div>
        </div>

      </div>
    </div>
  );
}

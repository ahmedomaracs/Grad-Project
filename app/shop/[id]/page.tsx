'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '../../../store/cartStore';
import type { Product } from '../../../types/shop';

interface ProductDetails {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string; 
  description: string;
  characteristics: { category: string; technicalSpecs: { label: string; value: string }[] };
}

const EXTRACTED_DATABASE: Record<string, ProductDetails> = {
  "1": {
    id: "1",
    title: "Brembo Venting Brake Rotor (Front)",
    brand: "Brembo",
    price: 14500.00,
    originalPrice: 19300.00,
    discount: "-25%",
    rating: 4.9,
    reviewsCount: 154,
    imageUrl: "/shop/ShopImages/brembobrakerotor.webp", 
    description: "High-carbon venting brake rotors designed to offer superior thermal capacity and resistance to fade, ensuring maximum deceleration profiles under intensive application constraints.",
    characteristics: {
      category: "Braking System Dynamics",
      technicalSpecs: [
        { label: "Material Structure", value: "High-Carbon Cast Iron" },
        { label: "Rotor Core Type", value: "Vented Cooling Channels" },
        { label: "Outer Diameter", value: "320mm" },
        { label: "Nominal Thickness", value: "30mm" },
        { label: "Axle Placement", value: "Front Axle Pair" }
      ]
    }
  },
  "2": {
    id: "2",
    title: "Brembo Premium Ceramic Brake Pads Set",
    brand: "Brembo",
    price: 8900.00,
    originalPrice: 12500.00,
    discount: "-29%",
    rating: 4.8,
    reviewsCount: 89,
    imageUrl: "/shop/ShopImages/Ceramicpads.webp",
    description: "Premium low-dust ceramic formulation designed for reliable stopping performance, low noise emission rates, and increased component service longevity.",
    characteristics: {
      category: "Friction Materials Layout",
      technicalSpecs: [
        { label: "Friction Material", value: "Premium Ceramic Matrix" },
        { label: "Shim Technology", value: "EGI Multi-Layer Anti-Noise" },
        { label: "Dust Generation", value: "Ultra-Low Operating Dust" }
      ]
    }
  }
};

export default function ProductCharacteristicsPage() {
  const params = useParams();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  
  const productId = params?.id as string;
  const product = EXTRACTED_DATABASE[productId] || EXTRACTED_DATABASE["1"];

  const handleAddToCartAndRedirect = () => {
    setIsAdding(true);

    // Convert ProductDetails to the shared Product type for the Zustand cart store
    const cartProduct: Product = {
      id: product.id,
      name: product.title,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.imageUrl || '',
      rating: product.rating,
      reviewCount: product.reviewsCount,
      category: 'Brakes',
      inStock: true,
      description: product.description,
      tags: [],
    };

    addItem(cartProduct);
    router.push('/shop');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 sm:px-10 font-sans mt-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Crumb navigation */}
        <button 
          onClick={() => router.push('/shop')}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-[#E62424] transition-colors mb-8"
        >
          ← Back To Shop Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Left Block Image Frame */}
          <div className="lg:col-span-2 space-y-4">
            <div className="w-full aspect-square bg-white border border-slate-200/60 rounded-[32px] shadow-sm flex flex-col items-center justify-center relative overflow-hidden p-8">
              {product.discount && (
                <span className="absolute top-6 left-6 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider">
                  {product.discount} Save
                </span>
              )}
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="w-full h-full object-contain relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200 bg-slate-50/50 pointer-events-none">
                <span className="text-6xl">⚙️</span>
              </div>
            </div>
          </div>

          {/* Right Core Description Details */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200/60 p-8 rounded-[32px] shadow-sm space-y-3">
              <span className="text-[10px] bg-red-50 text-[#E62424] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                Verified {product.brand} Component
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight leading-snug">
                {product.title}
              </h1>
              <div className="pt-2">
                <span className="text-2xl font-black text-slate-900">EGP {product.price.toLocaleString()}</span>
              </div>
              <hr className="border-slate-100 my-4" />
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Characteristics Sheet Component Container */}
            <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[32px] shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Product Characteristics</h3>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">
                  Category: {product.characteristics.category}
                </p>
              </div>

              <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm mb-6">
                {product.characteristics.technicalSpecs.map((spec, index) => (
                  <div key={index} className="grid grid-cols-2 p-3.5 text-xs">
                    <span className="font-black text-slate-400 uppercase tracking-tight">{spec.label}</span>
                    <span className="font-bold text-slate-800">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTON WRAPPER ROW */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button 
                  onClick={handleAddToCartAndRedirect}
                  disabled={isAdding}
                  className="w-full sm:w-auto px-10 py-4 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#E62424] transition-all shadow-md active:scale-[0.98] disabled:bg-slate-300"
                >
                  {/* ✨ CHANGED COMPONENT BUTTON STRING TEXT COPY */}
                  {isAdding ? 'Adding Item...' : 'Add to Cart'}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

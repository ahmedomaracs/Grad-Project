'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, PackageOpen, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export function CartDrawer() {
  const router = useRouter();
  const { cartItems, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalItems, totalPrice, _hasHydrated } = useCartStore();
  const { user, checkoutCart } = useAuthStore();

  // SSR hydration guard — prevent localStorage mismatch on first paint
  const [hasHydrated, setHasHydrated] = React.useState(false);
  useEffect(() => { setHasHydrated(true); }, []);

  const count = hasHydrated ? totalItems() : 0;
  const total = hasHydrated ? totalPrice() : 0;
  const safeItems = hasHydrated ? cartItems : [];

  const [workshopInstall, setWorkshopInstall] = useState(false);

  const handleCheckout = () => {
    closeCart();
    router.push(workshopInstall ? '/shop/checkout?workshopInstall=true' : '/shop/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.12)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E12F2F]/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[#E12F2F]" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Your Cart</h2>
                  <p className="text-xs text-gray-400">{count} {count === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCart}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-3">
              {/* Hydration skeleton */}
              {!hasHydrated ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2].map((n) => (
                    <div key={n} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
              <AnimatePresence initial={false}>
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center gap-4"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 rounded-3xl bg-[#E12F2F]/8 flex items-center justify-center"
                    >
                      <PackageOpen className="w-10 h-10 text-[#E12F2F]/50" />
                    </motion.div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg mb-1">Your cart is empty</p>
                      <p className="text-gray-400 text-sm">Add some premium parts to get started</p>
                    </div>
                  </motion.div>
                ) : (
                  safeItems.map((item, idx) => (
                    <motion.div
                      key={`${item.product.id}-${idx}`}
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#E12F2F]/20 transition-colors group"
                    >
                      <div className="relative w-16 h-16 rounded-xl bg-white border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <ShoppingCart className="w-6 h-6 text-gray-200 absolute" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#E12F2F] uppercase tracking-widest">{item.product.brand}</p>
                        <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">{item.product.name}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-[#E12F2F]/40 hover:text-[#E12F2F] transition-colors">
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <motion.span key={item.quantity} initial={{ scale: 1.3, color: '#E12F2F' }} animate={{ scale: 1, color: '#0F0F0F' }}
                              className="w-6 text-center text-sm font-bold">
                              {item.quantity}
                            </motion.span>
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-[#E12F2F]/40 hover:text-[#E12F2F] transition-colors">
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <span className="font-bold text-gray-900 text-sm">EGP {(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeItem(item.product.id)}
                        className="self-start w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:border-red-200 hover:text-red-400 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              )} {/* end hydration guard */}
            </div>

            {/* Footer */}
            <AnimatePresence>
              {cartItems.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                  className="px-6 py-5 border-t border-gray-100 space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Subtotal</span><span className="font-semibold text-gray-700">EGP {total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Shipping</span><span className="font-semibold text-green-500">Free</span>
                  </div>

                  {/* Mechanic Delivery Checkbox */}
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer group hover:border-[#E62424]/30 transition-colors">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        checked={workshopInstall}
                        onChange={(e) => setWorkshopInstall(e.target.checked)}
                        className="peer appearance-none w-4 h-4 rounded border border-slate-300 checked:bg-[#E62424] checked:border-[#E62424] transition-colors cursor-pointer"
                      />
                      <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 font-medium text-xs leading-relaxed group-hover:text-slate-900 transition-colors">
                      🔧 Deliver directly to my selected partner mechanic workshop for installation.
                    </span>
                  </label>

                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <span className="font-extrabold text-gray-900 text-xl">EGP {total.toLocaleString()}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-[#E12F2F] text-white font-semibold text-base shadow-[0_0_30px_rgba(255,45,45,0.35)] hover:shadow-[0_0_40px_rgba(255,45,45,0.55)] transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

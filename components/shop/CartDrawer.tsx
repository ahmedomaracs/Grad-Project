'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, PackageOpen } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore();
  const { user, checkoutCart } = useAuthStore();
  const count = totalItems();
  const total = totalPrice();

  const handleCheckout = () => {
    // Task A: fire cross-role event — creates MerchantOrders + notifies each Merchant
    if (user && items.length > 0) {
      checkoutCart(
        items.map((i) => ({
          productLabel: i.product.name,
          // In a real system, each Product carries a merchantId field.
          // We use a stable fallback so the Merchant demo account (keyed by email) receives the alert.
          merchantId: (i.product as any).merchantId ?? 'merchant@automate.com',
          merchantName: (i.product as any).merchantName ?? 'Automate Merchant',
          totalPrice: i.product.price * i.quantity,
          deliveryType: 'standard' as const,
        })),
        user.email,
        user.name
      );
      clearCart();
    }
    closeCart();
    router.push('/shop/checkout');
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
                <div className="w-9 h-9 rounded-xl bg-[#FF2D2D]/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[#FF2D2D]" />
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
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center gap-4"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 rounded-3xl bg-[#FF2D2D]/8 flex items-center justify-center"
                    >
                      <PackageOpen className="w-10 h-10 text-[#FF2D2D]/50" />
                    </motion.div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg mb-1">Your cart is empty</p>
                      <p className="text-gray-400 text-sm">Add some premium parts to get started</p>
                    </div>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#FF2D2D]/20 transition-colors group"
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
                        <p className="text-[11px] font-bold text-[#FF2D2D] uppercase tracking-widest">{item.product.brand}</p>
                        <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">{item.product.name}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-[#FF2D2D]/40 hover:text-[#FF2D2D] transition-colors">
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <motion.span key={item.quantity} initial={{ scale: 1.3, color: '#FF2D2D' }} animate={{ scale: 1, color: '#111111' }}
                              className="w-6 text-center text-sm font-bold">
                              {item.quantity}
                            </motion.span>
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-[#FF2D2D]/40 hover:text-[#FF2D2D] transition-colors">
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <span className="font-bold text-gray-900 text-sm">${(item.product.price * item.quantity).toFixed(2)}</span>
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
            </div>

            {/* Footer */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                  className="px-6 py-5 border-t border-gray-100 space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Subtotal</span><span className="font-semibold text-gray-700">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Shipping</span><span className="font-semibold text-green-500">Free</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <span className="font-extrabold text-gray-900 text-xl">${total.toFixed(2)}</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-[#FF2D2D] text-white font-semibold text-base shadow-[0_0_30px_rgba(255,45,45,0.35)] hover:shadow-[0_0_40px_rgba(255,45,45,0.55)] transition-all duration-300 relative overflow-hidden group"
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

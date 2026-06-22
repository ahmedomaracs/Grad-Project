'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ShieldCheck, Ticket, Check, Loader2, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useToastStore } from '../../../store/toastStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Prefill user details if available
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const subtotal = totalPrice();
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = 0; // FREE
  const taxFee = 0;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'AUTOMATE10') {
      setAppliedCoupon('AUTOMATE10');
      setDiscountPercent(10);
      addToast({
        type: 'success',
        title: 'Coupon Applied',
        message: '10% discount has been applied to your order!'
      });
    } else if (code) {
      addToast({
        type: 'error',
        title: 'Invalid Coupon',
        message: 'The coupon code you entered is invalid or expired.'
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    addToast({
      type: 'success',
      title: 'Coupon Removed',
      message: 'Discount coupon has been removed.'
    });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      addToast({
        type: 'error',
        title: 'Empty Cart',
        message: 'You have no items in your cart to checkout.'
      });
      return;
    }

    if (!fullName || !email || !address) {
      addToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please fill in all checkout fields.'
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    const generatedId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderPlaced(true);
    addToast({
      type: 'success',
      title: 'Order Placed!',
      message: `Your order ${generatedId} was placed successfully.`
    });
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-lg animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 mx-auto mb-6">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Order Confirmed!</h2>
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
            Order ID: {orderId}
          </p>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Thank you for shopping with us, {fullName}. Your parts order has been processed. We will send shipping updates to <span className="font-semibold text-slate-800">{email}</span>.
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-6 rounded-2xl transition-colors block text-center"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/shop"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-3 px-6 rounded-2xl transition-colors block text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-6xl mx-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm max-w-xl mx-auto">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
            <p className="text-slate-500 text-sm mb-6">
              You haven't added any premium parts to your cart yet.
            </p>
            <Link
              href="/shop"
              className="bg-[#E62424] hover:bg-red-700 text-white font-bold text-sm py-3 px-6 rounded-2xl transition-colors inline-block"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT 2-COLUMNS: SHIPPING & SECURE FORMS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">Secure Checkout</h1>
                  <p className="text-xs font-bold text-slate-400 font-mono tracking-wide uppercase mt-1">
                    Automate Precision Retail System
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ahmed ElSayed Omara"
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E62424] focus:bg-white transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ahmedmara@gmail.com"
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E62424] focus:bg-white transition-all duration-150"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase mb-1.5">
                      Shipping &amp; Workshop Address
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="10th of Ramadan City, Al-Sharqia Governorate, Egypt..."
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E62424] focus:bg-white transition-all duration-150 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items Manifest */}
              <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <ShoppingBag className="w-4 h-4 text-slate-800" />
                  <h2 className="text-xs font-black text-slate-900 uppercase font-mono tracking-wider">
                    Review Order Manifest ({items.length} {items.length === 1 ? 'Item' : 'Items'})
                  </h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 items-center py-3 first:pt-0 last:pb-0">
                      <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="object-contain max-h-full max-w-full rounded-lg" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.name}</h3>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">
                          Qty: {item.quantity} • Fitment Verified
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 font-mono">
                          EGP {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SUMMARY & CONFIRM */}
            <div className="space-y-4 lg:sticky lg:top-24">
              {/* Promo Code Widget */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <label className="block text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase mb-1.5">
                  Got a coupon?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter Coupon Code"
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl pl-8 pr-3 py-2 text-xs font-bold uppercase font-mono tracking-wider focus:outline-none focus:border-slate-900 transition-all"
                    />
                    <Ticket className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="bg-red-500 hover:bg-red-600 text-white font-mono text-xs font-extrabold px-4 py-2 rounded-xl transition-colors"
                    >
                      REMOVE
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-extrabold px-4 py-2 rounded-xl transition-colors"
                    >
                      APPLY
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-[10px] text-green-500 font-mono font-bold mt-2 animate-pulse">
                    ✓ Code {appliedCoupon} applied! (10% off)
                  </p>
                )}
                <p className="text-[9px] text-slate-400 mt-1.5">
                  Try code: <span className="font-bold text-slate-600">AUTOMATE10</span>
                </p>
              </div>

              {/* Billing Calculations */}
              <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
                <h2 className="text-xs font-black text-slate-900 uppercase font-mono tracking-wider pb-2 border-b border-slate-100">
                  Order Summary
                </h2>

                <div className="space-y-2.5 font-mono">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-slate-800">EGP {subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs font-semibold text-red-500">
                      <span>Discount (10%)</span>
                      <span>-EGP {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Shipping Fee</span>
                    <span className="text-emerald-500 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500 pb-2.5 border-b border-slate-100">
                    <span>Platform Secure Tax</span>
                    <span className="text-slate-800">EGP {taxFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1.5">
                    <span className="text-sm font-black text-slate-900 uppercase">Total</span>
                    <span className="text-xl font-black text-slate-900">EGP {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E62424] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-sm py-4 rounded-2xl transition-all duration-150 shadow-md shadow-red-600/10 tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Order…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Confirm &amp; Pay
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

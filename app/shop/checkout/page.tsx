'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  CheckCircle,
  ShoppingBag,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useToastStore } from '../../../store/toastStore';
import { Button } from '../../../components/ui/Button';

// Validation Schema using Zod
const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name is required (min 3 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  address: z.string().min(5, 'Shipping address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(4, 'ZIP / Postal code is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be exactly 16 digits'),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Format must be MM/YY'),
  cardCvc: z.string().regex(/^\d{3}$/, 'CVC must be exactly 3 digits'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, updateQuantity, removeItem } = useCartStore();
  const { user, addTransaction, addNotification, addOrder, isAuthenticated } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Hydrate stores on mount
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  // Auth enforcement: redirect to signin if not authenticated after hydration
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      addToast({ type: 'warning', title: 'Sign In Required', message: 'Please sign in to proceed with checkout.' });
      router.push('/signin');
    }
  }, [hydrated, isAuthenticated, router, addToast]);

  const cartTotal = totalPrice();
  const subtotal = cartTotal;
  const finalTotal = Math.max(0, subtotal - discount);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: 'Amman',
      zipCode: '11110',
      cardNumber: '4000123456789010',
      cardExpiry: '12/28',
      cardCvc: '123'
    }
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setValue('fullName', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone);
      setValue('address', user.address);
    }
  }, [user, setValue]);

  // If cart is empty, redirect back to shop
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push('/shop');
    }
  }, [items, router, isProcessing]);

  // Show loading while hydrating
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center font-sans text-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-[#FF2D2D] rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Checkout...</p>
        </div>
      </div>
    );
  }

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'AUTOMATE10') {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
      addNotification('Promo Applied 🏷️', '10% discount has been applied to your checkout cart.', 'system');
      addToast({ type: 'success', title: 'Promo Applied!', message: '10% discount activated on your order.' });
    } else {
      addNotification('Invalid Code ❌', 'The promo code entered is either invalid or expired.', 'system');
      addToast({ type: 'error', title: 'Invalid Code', message: 'The promo code is invalid or expired.' });
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    
    // Simulate payment transaction server delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Process wallet checkout transactions
    addTransaction('purchase', `Marketplace checkout`, -finalTotal);
    
    // Populate store orders
    items.forEach((item) => {
      addOrder({
        productName: item.product.name,
        brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
        status: 'Processing',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: item.product.image,
        trackingNumber: 'TRK-' + Math.floor(Math.random() * 90000 + 10000),
      });
    });

    addNotification(
      'Order Confirmed! 📦',
      `Your payment of $${finalTotal.toFixed(2)} was processed successfully. Track status under orders.`,
      'order'
    );
    addToast({ type: 'success', title: 'Order Confirmed!', message: `$${finalTotal.toFixed(2)} processed. Shipping within 3-4 days.` });

    clearCart();
    setStep(2);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Back Link */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FF2D2D] transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Parts Store</span>
        </Link>

        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Checkout Forms */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-gray-50">
                  <div className="w-11 h-11 bg-[#FF2D2D]/10 rounded-2xl flex items-center justify-center text-[#FF2D2D]">
                    <ShieldCheck className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Secured checkout</h1>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Please provide delivery address and credit card details.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Delivery details header */}
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                      <Truck className="w-4.5 h-4.5 text-[#FF2D2D]" />
                      1. Delivery Address Coordinates
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                      <input
                        type="text"
                        {...register('fullName')}
                        className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors ${
                          errors.fullName ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                        }`}
                      />
                      {errors.fullName && <p className="text-[10px] font-bold text-red-500">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                      <input
                        type="email"
                        {...register('email')}
                        className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors ${
                          errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                        }`}
                      />
                      {errors.email && <p className="text-[10px] font-bold text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors ${
                          errors.phone ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                        }`}
                      />
                      {errors.phone && <p className="text-[10px] font-bold text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Shipping Address</label>
                      <input
                        type="text"
                        {...register('address')}
                        className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors ${
                          errors.address ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                        }`}
                      />
                      {errors.address && <p className="text-[10px] font-bold text-red-500">{errors.address.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">City</label>
                      <input
                        type="text"
                        {...register('city')}
                        className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors ${
                          errors.city ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                        }`}
                      />
                      {errors.city && <p className="text-[10px] font-bold text-red-500">{errors.city.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">ZIP / Postal Code</label>
                      <input
                        type="text"
                        {...register('zipCode')}
                        className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors ${
                          errors.zipCode ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                        }`}
                      />
                      {errors.zipCode && <p className="text-[10px] font-bold text-red-500">{errors.zipCode.message}</p>}
                    </div>
                  </div>

                  {/* Payment details header */}
                  <div className="pt-4 border-t border-gray-50">
                    <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-4.5 h-4.5 text-[#FF2D2D]" />
                      2. Payment Method Details
                    </h3>
                  </div>

                  {/* Card numbers details input */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Credit Card Number</label>
                      <input
                        type="text"
                        placeholder="4000123456789010"
                        {...register('cardNumber')}
                        maxLength={16}
                        className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors ${
                          errors.cardNumber ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                        }`}
                      />
                      {errors.cardNumber && <p className="text-[10px] font-bold text-red-500">{errors.cardNumber.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Expiration (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          {...register('cardExpiry')}
                          maxLength={5}
                          className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors ${
                            errors.cardExpiry ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                          }`}
                        />
                        {errors.cardExpiry && <p className="text-[10px] font-bold text-red-500">{errors.cardExpiry.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">CVC Code</label>
                        <input
                          type="password"
                          placeholder="123"
                          {...register('cardCvc')}
                          maxLength={3}
                          className={`w-full h-11 px-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors ${
                            errors.cardCvc ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                          }`}
                        />
                        {errors.cardCvc && <p className="text-[10px] font-bold text-red-500">{errors.cardCvc.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Submission and SECURE notice */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      fullWidth
                      size="lg"
                      className="h-14 bg-[#FF2D2D] text-white hover:bg-red-600 shadow-xl shadow-red-500/25 border-none font-bold"
                    >
                      {isProcessing ? 'Processing Secure Checkout...' : `Confirm & Pay $${finalTotal.toFixed(2)}`}
                    </Button>
                    <span className="text-[10.5px] text-gray-400 font-bold block text-center mt-3">
                      🔒 Payments are authenticated, encrypted, and processed via Stripe Secure.
                    </span>
                  </div>

                </form>
              </div>

            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order Summary Widget */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-5">Order summary</h3>
                
                {/* Cart Items list */}
                <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1 pb-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center justify-between border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xs overflow-hidden relative">
                          <img src={item.product.image} alt={item.product.name} className="object-contain p-1" />
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-900 text-xs truncate max-w-[130px]">{item.product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="text-gray-400 hover:text-gray-900"><Minus className="w-3 h-3" /></button>
                            <span className="text-[10px] font-bold text-gray-800">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="text-gray-400 hover:text-gray-900"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeItem(item.product.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code section */}
                <div className="pt-5 border-t border-gray-100 mt-5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (AUTOMATE10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      className="flex-1 h-9 px-3 rounded-lg border border-gray-250 bg-gray-50/50 text-xs font-semibold outline-none focus:border-[#FF2D2D]/40"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !promoCode}
                      className="h-9 px-4 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all"
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                </div>

                {/* Pricing totals */}
                <div className="pt-5 border-t border-gray-100 mt-5 space-y-2 text-xs font-bold">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Promo Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">Final Total</span>
                    <span className="text-gray-900 font-extrabold">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* Step 2: Confirmation / Success state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white border border-gray-150 rounded-3xl p-8 text-center shadow-xl space-y-6 pt-12"
          >
            <div className="w-18 h-18 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/10 animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Confirmed!</h2>
              <p className="text-sm text-gray-400 font-semibold leading-relaxed mt-2.5">
                We have processed your transaction successfully. You will receive email tracking logs soon.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-left text-xs font-semibold text-gray-500 space-y-2">
              <div className="flex justify-between">
                <span>Shipping Method:</span>
                <span className="text-gray-900 font-extrabold">FedEx Priority</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="text-[#FF2D2D] font-extrabold">Within 3-4 business days</span>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <Button
                onClick={() => router.push('/dashboard')}
                fullWidth
                className="h-12 bg-gray-900 text-white rounded-xl text-xs font-bold"
              >
                Go to Workspace Dashboard
              </Button>
              <Button
                onClick={() => router.push('/shop')}
                variant="secondary"
                className="h-12 rounded-xl text-xs font-bold"
              >
                Continue Shopping
              </Button>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}

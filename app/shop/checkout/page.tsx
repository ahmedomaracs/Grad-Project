'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShoppingBag, ShieldCheck, Ticket, Check, Loader2, ArrowLeft,
  Wrench, Home, MapPin, AlertCircle, CreditCard, Lock, Info,
} from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore, Appointment } from '../../../store/authStore';
import { useToastStore } from '../../../store/toastStore';

/* ── Currency helper ─────────────────────────────────────────── */
const formatEGP = (val: number) =>
  `EGP ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── Card-brand detector ─────────────────────────────────────── */
type CardBrand = 'visa' | 'mastercard' | 'amex' | null;
function detectBrand(num: string): CardBrand {
  const clean = num.replace(/\s/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^5[1-5]/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  return null;
}

function BrandIcon({ brand }: { brand: CardBrand }) {
  if (!brand) return <CreditCard className="w-5 h-5 text-slate-300" />;
  if (brand === 'visa') return (
    <svg viewBox="0 0 780 500" className="w-8 h-5" xmlns="http://www.w3.org/2000/svg">
      <rect width="780" height="500" rx="40" fill="#1A1F71"/>
      <text x="390" y="330" fontFamily="Arial" fontWeight="bold" fontSize="220" fill="white" textAnchor="middle" dominantBaseline="middle">VISA</text>
    </svg>
  );
  if (brand === 'mastercard') return (
    <svg viewBox="0 0 152 108" className="w-8 h-5" xmlns="http://www.w3.org/2000/svg">
      <circle cx="52" cy="54" r="52" fill="#EB001B"/>
      <circle cx="100" cy="54" r="52" fill="#F79E1B"/>
      <path d="M76 16.7A52 52 0 0 1 97.3 54 52 52 0 0 1 76 91.3 52 52 0 0 1 54.7 54 52 52 0 0 1 76 16.7z" fill="#FF5F00"/>
    </svg>
  );
  // amex
  return (
    <svg viewBox="0 0 160 100" className="w-8 h-5" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="100" rx="8" fill="#2E77BC"/>
      <text x="80" y="62" fontFamily="Arial" fontWeight="bold" fontSize="30" fill="white" textAnchor="middle">AMEX</text>
    </svg>
  );
}

/* ── Inline error alert ─────────────────────────────────────── */
function InlineError({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold animate-in slide-in-from-top-1 duration-200">
      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
      {msg}
    </div>
  );
}

/* ── Main checkout content ──────────────────────────────────── */
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, totalPrice, clearCart } = useCartStore();
  const { user, appointments, addOrderManifest } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  /* Hydration guard */
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  /* Shipping fields */
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  /* Card fields */
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const brand = detectBrand(cardNumber);

  /* Coupon */
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  /* Workshop delivery */
  const [deliverToWorkshop, setDeliverToWorkshop] = useState(
    searchParams.get('workshopInstall') === 'true'
  );
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');

  /* Submission state */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const upcomingAppointments: Appointment[] = appointments.filter(
    (a) => a.status === 'Upcoming'
  );
  const selectedAppt = upcomingAppointments.find((a) => a.id === selectedAppointmentId) ?? null;

  /* Prefill user data */
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  /* Auto-select first appointment */
  useEffect(() => {
    if (deliverToWorkshop && upcomingAppointments.length > 0 && !selectedAppointmentId) {
      setSelectedAppointmentId(upcomingAppointments[0].id);
    }
  }, [deliverToWorkshop, upcomingAppointments.length, selectedAppointmentId]);

  /* Lock address to workshop */
  useEffect(() => {
    if (deliverToWorkshop && selectedAppt) {
      setAddress(selectedAppt.garageName);
    } else if (!deliverToWorkshop && user) {
      setAddress(user.address || '');
    }
  }, [deliverToWorkshop, selectedAppt?.id, user]);

  /* ── Price calculations — prices are natively in EGP ── */
  const safeItems = hydrated ? cartItems : [];
  const subtotalEGP = hydrated ? totalPrice() : 0; // product.price is already EGP
  const discountEGP = (subtotalEGP * discountPercent) / 100;
  const shippingEGP = 0;
  const taxEGP = 0;
  const totalEGP = subtotalEGP - discountEGP;

  /* Card number formatter */
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') ?? raw;
    setCardNumber(formatted);
  };

  /* Expiry formatter MM/YY */
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length > 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'AUTOMATE10') {
      setAppliedCoupon('AUTOMATE10');
      setDiscountPercent(10);
      addToast({ type: 'success', title: 'Coupon Applied', message: '10% discount applied!' });
    } else if (code) {
      addToast({ type: 'error', title: 'Invalid Coupon', message: 'The coupon code is invalid or expired.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (safeItems.length === 0) { setFormError('Your cart is empty.'); return; }
    if (!fullName || !email || !address) { setFormError('Please complete all shipping fields.'); return; }
    if (cardNumber.replace(/\s/g, '').length < 16) { setFormError('Please enter a valid 16-digit card number.'); return; }
    if (cardExpiry.length < 5) { setFormError('Please enter a valid expiry date (MM/YY).'); return; }
    if (cardCvc.length < 3) { setFormError('Please enter your 3-digit CVC security code.'); return; }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsSubmitting(false);

    addOrderManifest({
      customerDetails: { fullName, email },
      purchasedItems: safeItems.map((item) => ({
        productId: String(item.product.id),
        name: item.product.name,
        quantity: item.quantity,
        unitPriceEGP: item.product.price, // already EGP
      })),
      financialSummary: {
        subtotalEGP,
        shippingFeeEGP: shippingEGP,
        taxEGP,
        totalPaidEGP: totalEGP,
      },
      deliveryType: deliverToWorkshop ? 'SHIP_TO_WORKSHOP' : 'DIRECT_TO_HOME',
      shippingAddress: address,
      deliveryStatus: 'Processing',
      ...(deliverToWorkshop && selectedAppointmentId ? { linkedAppointmentId: selectedAppointmentId } : {}),
    });

    clearCart();

    addToast({
      type: 'success',
      title: 'Order Confirmed!',
      message: deliverToWorkshop
        ? `Parts dispatched to ${selectedAppt?.garageName ?? 'your mechanic'}.`
        : 'Your order is confirmed and being processed.',
    });

    router.push('/dashboard/orders');
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E62424] rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Empty cart state ── */
  if (safeItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm max-w-sm w-full">
          <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 mb-6">Add some parts before checking out.</p>
          <Link href="/shop" className="bg-[#E62424] hover:bg-red-700 text-white font-bold text-sm py-3 px-6 rounded-2xl transition-colors inline-block">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  /* ── Full checkout layout ── */
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 mt-14">
      <div className="max-w-5xl mx-auto">

        {/* Back link */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E62424]/8 border border-[#E62424]/20 text-[#E62424] text-[10px] font-black tracking-widest uppercase mb-3">
            <Lock className="w-3 h-3" /> Secure Checkout
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Review &amp; Pay</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── LEFT: SHIPPING + PAYMENT ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Shipping section */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  Shipping Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ahmed ElSayed"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:border-[#E62424] focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="ahmed@automate.eg"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:border-[#E62424] focus:bg-white transition-all" />
                  </div>
                </div>

                {/* Workshop toggle */}
                {upcomingAppointments.length > 0 && (
                  <div className={`rounded-2xl border p-4 transition-all ${deliverToWorkshop ? 'border-[#E62424]/30 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input type="checkbox" checked={deliverToWorkshop}
                          onChange={(e) => setDeliverToWorkshop(e.target.checked)}
                          className="peer appearance-none w-4 h-4 rounded border border-slate-300 checked:bg-[#E62424] checked:border-[#E62424] transition-colors cursor-pointer" />
                        <Check className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-[#E62424]" /> Deliver to Service Provider Workshop</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Ship parts directly to your mechanic for installation.</p>
                      </div>
                    </label>

                    {deliverToWorkshop && upcomingAppointments.length > 1 && (
                      <div className="mt-3 pl-7">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Select Appointment</label>
                        <select value={selectedAppointmentId} onChange={(e) => setSelectedAppointmentId(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#E62424] cursor-pointer">
                          {upcomingAppointments.map((a) => (
                            <option key={a.id} value={a.id}>{a.mechanicName} — {a.garageName} ({a.date})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {deliverToWorkshop && selectedAppt && (
                      <div className="mt-3 pl-7 flex items-start gap-2 text-xs bg-white border border-slate-200 rounded-xl p-3">
                        <MapPin className="w-3.5 h-3.5 text-[#E62424] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-slate-900">{selectedAppt.garageName}</p>
                          <p className="text-[10px] font-mono text-slate-400">Booking: {selectedAppt.id} · {selectedAppt.date} at {selectedAppt.time}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Address field */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    {deliverToWorkshop ? <><Wrench className="w-3 h-3 text-[#E62424]" />Workshop Address</> : <><Home className="w-3 h-3" />Delivery Address</>}
                  </label>
                  {deliverToWorkshop ? (
                    <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 select-none cursor-not-allowed">
                      {address || 'Select an appointment above'}
                    </div>
                  ) : (
                    <textarea rows={2} required value={address} onChange={(e) => setAddress(e.target.value)}
                      placeholder="10th of Ramadan City, Al-Sharqia, Egypt..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:border-[#E62424] focus:bg-white transition-all resize-none" />
                  )}
                </div>
              </div>
            </div>

            {/* ── Stripe-Style Card Element ── */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  Payment Details
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                    <Lock className="w-3 h-3" /> 256-bit SSL Encrypted
                  </span>
                </h2>
              </div>
              <div className="p-6">
                {/* Coupon */}
                <div className="mb-5 flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (try AUTOMATE10)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold uppercase font-mono tracking-wider focus:outline-none focus:border-slate-900 transition-all" />
                  </div>
                  {appliedCoupon ? (
                    <button type="button" onClick={() => { setAppliedCoupon(null); setDiscountPercent(0); }}
                      className="bg-red-100 text-red-600 hover:bg-red-200 font-mono text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors">REMOVE</button>
                  ) : (
                    <button type="button" onClick={handleApplyCoupon}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors">APPLY</button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold mb-4">
                    <Check className="w-3 h-3" strokeWidth={3} /> Code {appliedCoupon} applied — 10% off!
                  </div>
                )}

                {/* Stripe-style card input block */}
                <div className="border border-slate-200 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                  {/* Card number row */}
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-white group focus-within:border-[#E62424] transition-colors">
                    <CreditCard className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <input
                      type="text" inputMode="numeric" value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="flex-1 text-sm font-semibold text-slate-900 placeholder-slate-300 font-mono bg-transparent outline-none tracking-widest"
                    />
                    <div className="flex-shrink-0">
                      <BrandIcon brand={brand} />
                    </div>
                  </div>
                  {/* Expiry + CVC row */}
                  <div className="flex items-center divide-x divide-slate-100 bg-white">
                    <div className="flex items-center gap-2 px-4 py-3.5 flex-1">
                      <input type="text" inputMode="numeric" value={cardExpiry} onChange={handleExpiryChange}
                        placeholder="MM / YY" maxLength={5}
                        className="w-full text-sm font-semibold text-slate-900 placeholder-slate-300 font-mono bg-transparent outline-none tracking-widest" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3.5 flex-1">
                      <input type="text" inputMode="numeric" value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, brand === 'amex' ? 4 : 3))}
                        placeholder={brand === 'amex' ? 'CVC (4)' : 'CVC'}
                        className="w-full text-sm font-semibold text-slate-900 placeholder-slate-300 font-mono bg-transparent outline-none tracking-widest" />
                      <Lock className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Inline validation error */}
                {formError && <div className="mt-4"><InlineError msg={formError} /></div>}

                {/* CTA Button */}
                <button type="submit" disabled={isSubmitting}
                  className="mt-6 w-full flex items-center justify-center gap-2.5 h-14 rounded-2xl bg-[#E62424] hover:bg-red-700 active:scale-[0.99] text-white font-black text-sm tracking-wide shadow-[0_4px_24px_rgba(230,36,36,0.35)] hover:shadow-[0_6px_32px_rgba(230,36,36,0.45)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing Payment…</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4" /> Confirm &amp; Pay {formatEGP(totalEGP)}</>
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Your payment info is secured with AES-256 encryption.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:sticky lg:top-24">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Order Summary
                  <span className="ml-auto text-[10px] text-slate-400 font-semibold">
                    {safeItems.length} {safeItems.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>
              </div>

              {/* Items list */}
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {safeItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 p-1 flex-shrink-0 flex items-center justify-center">
                      <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">{item.product.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-slate-900 font-mono flex-shrink-0">
                      {formatEGP(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial summary */}
              <div className="px-5 py-4 border-t border-slate-100 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span><span className="text-slate-800 font-bold">{formatEGP(subtotalEGP)}</span>
                </div>
                {discountEGP > 0 && (
                  <div className="flex justify-between text-red-500 font-bold">
                    <span>Discount (10%)</span><span>-{formatEGP(discountEGP)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span><span className="text-emerald-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax</span><span>{formatEGP(taxEGP)}</span>
                </div>

                {/* Delivery type badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase w-fit transition-colors ${deliverToWorkshop ? 'bg-[#E62424]/10 text-[#E62424] border border-[#E62424]/20' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                  {deliverToWorkshop ? <><Wrench className="w-2.5 h-2.5" /> Ship to Workshop</> : <><Home className="w-2.5 h-2.5" /> Direct to Home</>}
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                  <span className="text-sm font-black text-slate-900 uppercase">Total</span>
                  <span className="text-xl font-black text-[#E62424]">{formatEGP(totalEGP)}</span>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#E62424] rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

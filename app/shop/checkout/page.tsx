import { ShoppingBag, ShieldCheck, Ticket } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Core Layout Grid System Mapping */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2-COLUMNS: SHIPPING, LOGISTICS, & SECURE FORMS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Form Master Panel Wrapper */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Secure Checkout</h1>
                <p className="text-xs font-bold text-slate-400 font-mono tracking-wide uppercase mt-1">
                  Automate Precision Retail System
                </p>
              </div>

              {/* Data Input Pipeline Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase mb-1.5">
                      Full Name
                    </label>
                    <input 
                      type="text" 
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
                      placeholder="ahmedmara@gmail.com"
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E62424] focus:bg-white transition-all duration-150"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase mb-1.5">
                    Shipping & Workshop Address
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="10th of Ramadan City, Al-Sharqia Governorate, Egypt..."
                    className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E62424] focus:bg-white transition-all duration-150 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Simulated Order Items Manifest Panel (Noon Flow Variant) */}
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <ShoppingBag className="w-4 h-4 text-slate-800" />
                <h2 className="text-xs font-black text-slate-900 uppercase font-mono tracking-wider">
                  Review Order Manifest (1 Item)
                </h2>
              </div>
              
              {/* Product Layout Line */}
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center flex-shrink-0">
                  <img src="/shop/rotor.jpg" alt="Product" className="object-contain max-h-full" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1">Brembo Venting Brake Rotor (Front)</h3>
                  <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">Qty: 1 • Fitment Verified</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 font-mono">EGP 850.00</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 1-COLUMN: STICKY ORDER SUMMARY PANEL (NOON EQUIVALENT) */}
          <div className="space-y-4 lg:sticky lg:top-24">
            
            {/* Promo Code Entry Widget Box */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <label className="block text-[10px] font-black text-slate-500 font-mono tracking-wider uppercase mb-1.5">
                Got a coupon?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code" 
                    className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl pl-8 pr-3 py-2 text-xs font-bold uppercase font-mono tracking-wider focus:outline-none focus:border-slate-900 transition-all"
                  />
                  <Ticket className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-extrabold px-4 py-2 rounded-xl transition-colors">
                  APPLY
                </button>
              </div>
            </div>

            {/* Billing Calculation Panel Matrix */}
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-black text-slate-900 uppercase font-mono tracking-wider pb-2 border-b border-slate-100">
                Order Summary
              </h2>
              
              <div className="space-y-2.5 font-mono">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-800">EGP 850.00</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 pb-2.5 border-b border-slate-100">
                  <span>Platform Secure Tax</span>
                  <span className="text-slate-800">EGP 0.00</span>
                </div>
                <div className="flex justify-between items-baseline pt-1.5">
                  <span className="text-sm font-black text-slate-900 uppercase">Total</span>
                  <span className="text-xl font-black text-slate-900">EGP 850.00</span>
                </div>
              </div>

              {/* Definitive Action Trigger Input */}
              <button className="w-full bg-[#E62424] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-sm py-4 rounded-2xl transition-all duration-150 shadow-md shadow-red-600/10 tracking-wide flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Confirm & Pay
              </button>
            </div>

          </div>

        </div>
        
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, TrendingUp, Package, Star, Box, Terminal, Car, ChevronDown, Check } from 'lucide-react';
import { ShopNavbar } from '../../components/shop/ShopNavbar';
import { SearchBar } from '../../components/shop/SearchBar';
import { ProductGrid } from '../../components/shop/ProductGrid';
import { CartDrawer } from '../../components/shop/CartDrawer';
import { FilterDrawer } from '../../components/shop/FilterDrawer';
import { CartButton } from '../../components/shop/CartButton';
import { PRODUCTS } from '../../constants/shop';
import { FilterState } from '../../types/shop';
import { useAuthStore } from '../../store/authStore';
import { Vehicle } from '../../store/authStore';

const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  search: '',
  priceRange: [0, 999],
  inStockOnly: false,
  sortBy: 'featured',
};

const STATS = [
  { icon: Package, label: 'Parts Available', value: '2,400+' },
  { icon: Star, label: 'Avg. Rating', value: '4.8★' },
  { icon: TrendingUp, label: 'Orders Fulfilled', value: '18K+' },
  { icon: Sparkles, label: 'Brands Listed', value: '120+' },
];

/* ── Vehicle Popover Component ─────────────────────────────────── */
function VehiclePopover({
  vehicles,
  selectedVehicleId,
  onSelect,
}: {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = vehicles.find((v) => v.id === selectedVehicleId) ?? null;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (vehicles.length === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
        <Car className="w-4 h-4" />
        No vehicles registered. <a href="/dashboard/my-garage" className="underline hover:text-amber-900">Add one →</a>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold hover:border-[#E62424] transition-colors"
      >
        <Car className="w-3.5 h-3.5 text-[#E62424]" />
        {selected
          ? `${selected.year} ${selected.brand || selected.make || ''} ${selected.model}`.trim()
          : 'Select Vehicle'}
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute left-0 top-12 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl w-72 overflow-hidden"
        >
          {/* Clear filter option */}
          <button
            onClick={() => { onSelect(null); setOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 border-b border-slate-100 transition-colors"
          >
            All Vehicles (No Filter)
          </button>
          {vehicles.map((v) => {
            const label = `${v.year} ${v.brand || v.make || ''} ${v.model}`.trim();
            const isActive = v.id === selectedVehicleId;
            return (
              <button
                key={v.id}
                onClick={() => { onSelect(v.id); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-xs font-semibold transition-colors hover:bg-slate-50 ${isActive ? 'text-[#E62424]' : 'text-slate-800'}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {v.image ? (
                      <img src={v.image} alt={label} className="w-full h-full object-cover" />
                    ) : (
                      <Car className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="font-bold truncate">{label}</p>
                    {v.plate && <p className="text-[10px] font-mono text-slate-400">{v.plate}</p>}
                  </div>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 flex-shrink-0 text-[#E62424]" strokeWidth={3} />}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* ── Main shop content ─────────────────────────────────────────── */
function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { vehicles } = useAuthStore();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'search' | 'vehicle' | 'vin'>('search');

  // ── Filter states — seeded from URL params ──
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') ? [searchParams.get('brand')!] : ['Brembo']
  );
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState<number>(100000);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    searchParams.get('vehicleId') || null
  );

  // ── Diagnostics animation ──
  const [analysisState, setAnalysisState] = useState('scanning');
  const [matchedAsset, setMatchedAsset] = useState({ name: '', icon: '' });

  // ── Debounce the price slider (300ms) ──
  useEffect(() => {
    const t = setTimeout(() => setDebouncedMaxPrice(maxPrice), 300);
    return () => clearTimeout(t);
  }, [maxPrice]);

  // ── Sync filter state → URL params ──
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedBrands.length === 1) params.set('brand', selectedBrands[0]);
    if (searchQuery) params.set('q', searchQuery);
    if (selectedVehicleId) params.set('vehicleId', selectedVehicleId);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [selectedCategory, selectedBrands, searchQuery, selectedVehicleId, pathname, router]);

  // ── Diagnostics animation ──
  useEffect(() => {
    const hasAnimated = sessionStorage.getItem('diagnosticsAnimated');
    if (hasAnimated) {
      setAnalysisState('matched');
      setMatchedAsset({ name: 'Precision Hardware Grid Vector Match', icon: 'Box' });
      return;
    }
    const timer1 = setTimeout(() => setAnalysisState('analyzing'), 800);
    const timer2 = setTimeout(() => {
      setAnalysisState('matched');
      setMatchedAsset({ name: 'Precision Hardware Grid Vector Match', icon: 'Box' });
      sessionStorage.setItem('diagnosticsAnimated', 'true');
    }, 2200);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { setIsScrolled(window.scrollY > 40); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Vehicle for fitment filter ──
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) ?? null;

  // ── Filtered products (uses debouncedMaxPrice) ──
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price <= debouncedMaxPrice;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      // When a garage vehicle is selected, filter to compatible categories
      const compatibleCats = ['Brakes', 'Engine', 'Accessories', 'Lighting', 'Tires'];
      const matchesVehicle = !selectedVehicle || compatibleCats.includes(product.category);
      return matchesCategory && matchesBrand && matchesPrice && matchesSearch && matchesVehicle;
    });
  }, [selectedCategory, selectedBrands, debouncedMaxPrice, searchQuery, selectedVehicle]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      <ShopNavbar />
      <CartDrawer />
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={DEFAULT_FILTERS}
        onChange={() => { }}
        onReset={() => { }}
      />

      {/* ── HERO HEADER ── */}
      <div
        className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${isScrolled ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
      >
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#E12F2F]/10 to-transparent blur-[120px]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-red-400/5 to-transparent blur-[100px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-gradient-to-t from-[#F5F5F5] to-transparent" />
            <div
              className="absolute inset-0 opacity-30"
              style={{ backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E12F2F]/10 border border-[#E12F2F]/20 text-[#E12F2F] text-xs font-bold tracking-wider uppercase mb-5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E12F2F] animate-pulse" />
                  Automate Parts Marketplace
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-5xl sm:text-6xl text-ink leading-[1.05] mb-5"
                >
                  Spare Parts{' '}
                  <span className="relative">
                    <span className="absolute -inset-2 bg-gradient-to-r from-[#E12F2F]/20 to-transparent blur-xl rounded-xl" />
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-[#E12F2F] to-red-700">Shop</span>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl"
                >
                  Browse authentic automotive parts &amp; accessories from world-class brands — guaranteed to fit your registered vehicles.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start lg:items-end gap-5"
              >
                <CartButton variant="hero" />
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                  {STATS.map(({ icon: Icon, label, value }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-100 shadow-sm"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#E12F2F]/8 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-[#E12F2F]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 leading-none">{value}</p>
                        <p className="text-[10px] text-gray-400 truncate">{label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* ── SEARCH & FILTER ── */}
      <section className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 md:py-6 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3 sm:gap-4">

          {/* Unified Control Surface */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">

            {/* Tabs Switcher Segment */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl w-full sm:max-w-md border border-slate-200/40">
              {(['search', 'vehicle', 'vin'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilterTab(tab)}
                  className={`flex-1 min-w-[120px] text-xs font-bold font-mono tracking-wide px-4 py-2 rounded-lg transition-all duration-200 ${activeFilterTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  {tab === 'search' ? '🔍 SEARCH PARTS' : tab === 'vehicle' ? '🚗 BY VEHICLE' : '🆔 ENTER VIN'}
                </button>
              ))}
            </div>

            {/* Input field + Filter Anchor */}
            <div className="flex gap-2 items-center w-full">
              <div className="relative flex-1 w-full">

                {/* SEARCH tab */}
                {activeFilterTab === 'search' && (
                  <SearchBar
                    value={searchQuery}
                    onChange={(v) => setSearchQuery(v)}
                    onFilterOpen={() => setFilterDrawerOpen(true)}
                    activeFiltersCount={0}
                  />
                )}

                {/* BY VEHICLE tab — garage popover */}
                {activeFilterTab === 'vehicle' && (
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <VehiclePopover
                      vehicles={vehicles}
                      selectedVehicleId={selectedVehicleId}
                      onSelect={setSelectedVehicleId}
                    />
                    {selectedVehicle && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold w-full lg:w-auto">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={3} />
                        <span className="truncate">Showing parts compatible with {`${selectedVehicle.year} ${selectedVehicle.brand || selectedVehicle.make || ''} ${selectedVehicle.model}`.trim()}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* VIN tab */}
                {activeFilterTab === 'vin' && (
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                    <div className="relative flex-1 w-full">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter 17-digit VIN..."
                        className="w-full h-14 text-sm px-3 rounded-2xl border border-gray-200 bg-white text-slate-800 pl-10 pr-4 outline-none focus:border-[#E62424] transition-colors uppercase placeholder:normal-case font-semibold"
                        maxLength={17}
                      />
                    </div>
                    <button className="bg-[#E62424] text-white font-bold h-14 px-6 rounded-2xl hover:bg-red-700 transition-colors shrink-0 w-full sm:w-auto shadow-sm text-sm">
                      Verify Fitment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap pb-2 -mb-2 w-full">
            {['All', 'Engine', 'Brakes', 'Lighting', 'Accessories', 'Tires'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedCategory === cat
                    ? 'bg-[#E62424] text-white shadow-md shadow-red-500/10'
                    : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT: SIDEBAR FILTERS */}
          <div className="hidden lg:block">
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 sticky top-24 shadow-[0_4px_24px_rgba(0,0,0,0.01)] transition-all will-change-[transform,opacity]">

              {/* Diagnostics panel */}
              <div className="border border-slate-200/80 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm space-y-3 mb-8">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> Diagnostic Matcher
                </span>
                {analysisState !== 'matched' ? (
                  <div className="text-[10px] font-mono text-slate-400 animate-pulse bg-slate-50 p-2 rounded-lg border border-slate-100">
                    AGENT_LOG: Reading file tree...<br />Analyzing system components matching /shop routes...
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center animate-in zoom-in duration-300">
                      <Box className="w-8 h-8 text-[#E62424]" />
                    </div>
                    <div className="bg-[#E62424]/10 text-[#E62424] px-3 py-1.5 rounded-full text-[10px] font-bold text-center leading-tight animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {matchedAsset.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Brands */}
              <div className="mb-8">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3 block">Brands</span>
                <div className="space-y-2">
                  {['Brembo', 'Bosch', 'Philips', 'K&N'].map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => {
                          setSelectedBrands((prev) =>
                            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
                          );
                        }}
                        className="accent-[#E62424] w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Bracket — debounced */}
              <div className="mb-8">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3 block">Price Bracket</span>
                <input
                  type="range" min="0" max="100000" value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#E62424]"
                />
                <div className="flex justify-between text-xs font-bold text-slate-700 font-mono mt-2">
                  <span>EGP 0</span>
                  <span>Max: EGP {maxPrice.toLocaleString()}+</span>
                </div>
              </div>

              {/* Condition Status */}
              <div className="mb-8">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3 block">Condition Status</span>
                <div className="flex flex-col gap-2">
                  <button className="text-left px-3 py-2 rounded-xl border border-[#E62424] bg-red-50 text-[#E62424] text-xs font-bold transition-colors">OEM Original Factory</button>
                  <button className="text-left px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 text-xs font-bold transition-colors">Premium Aftermarket</button>
                </div>
              </div>

              {/* Availability */}
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3 block">Availability</span>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors max-w-[140px]">
                    In-Stock Only at 10th of Ramadan Branch
                  </span>
                  <div className="relative w-10 h-6 bg-[#E62424] rounded-full transition-colors">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                  </div>
                </label>
              </div>

            </div>
          </div>

          {/* RIGHT: PRODUCT GRID */}
          <div className="lg:col-span-3 flex flex-col will-change-[transform,opacity]">

            {/* Fitment breadcrumb strip */}
            {selectedVehicle && (
              <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl px-4 py-2 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 will-change-[transform,opacity]">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    Fitment: {`${selectedVehicle.year} ${selectedVehicle.brand || selectedVehicle.make || ''} ${selectedVehicle.model}`.trim()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedVehicleId(null)}
                  className="text-slate-400 hover:text-[#E62424] font-mono font-bold transition-colors whitespace-nowrap"
                >
                  [× Clear Vehicle]
                </button>
              </div>
            )}

            {/* Results counter + sort */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 will-change-[transform,opacity]">
              <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> premium components matched
              </div>
              <select className="bg-white border border-slate-200 shadow-sm text-xs font-bold rounded-lg px-3 py-2 text-slate-800 transition-all focus:outline-none focus:ring-1 focus:ring-[#E62424] focus:border-[#E62424] cursor-pointer appearance-none min-w-[160px]">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Mechanics Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <ProductGrid products={filteredProducts as any} isLoading={isLoading} />

            {!isLoading && filteredProducts.length > 0 && (
              <div className="mt-12 will-change-[transform,opacity]">
                <span className="text-xs text-slate-400 font-medium tracking-wide text-center block mb-3">
                  Viewing {filteredProducts.length} of {filteredProducts.length + 72} verified products
                </span>
                <button className="mx-auto block bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-bold text-xs px-8 py-3 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] w-max cursor-pointer">
                  Load More Components
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#E12F2F] to-red-600 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(255,45,45,0.4)]">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-gray-900">Automate</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-400">Spare Parts Shop</span>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Automate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-slate-400">INITIALIZING CATALOG...</div>}>
      <ShopContent />
    </Suspense>
  );
}

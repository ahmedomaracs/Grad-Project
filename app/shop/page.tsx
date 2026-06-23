'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, TrendingUp, Package, Star, Box, Terminal } from 'lucide-react';
import { ShopNavbar } from '../../components/shop/ShopNavbar';
import { SearchBar } from '../../components/shop/SearchBar';
import { CategoryTabs } from '../../components/shop/CategoryTabs';
import { ProductGrid } from '../../components/shop/ProductGrid';
import { CartDrawer } from '../../components/shop/CartDrawer';
import { FilterDrawer } from '../../components/shop/FilterDrawer';
import { CartButton } from '../../components/shop/CartButton';
import { PRODUCTS } from '../../constants/shop';
import { Category, FilterState } from '../../types/shop';

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

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'search' | 'vehicle' | 'vin'>('search');
  
  // Read initial values from URL
  const initialCategory = searchParams.get('category') || 'All';
  const initialVehicle = searchParams.get('vehicle') || "2018 BMW 330i";

  // Active filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Brembo']);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [vehicleFitment, setVehicleFitment] = useState<string | null>(searchParams.get('vehicle') !== null ? searchParams.get('vehicle') : "2018 BMW 330i");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [analysisState, setAnalysisState] = useState('scanning');
  const [matchedAsset, setMatchedAsset] = useState({ name: '', icon: '' });

  // Sync state changes to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    let changed = false;
    if (selectedCategory !== 'All') {
      if (params.get('category') !== selectedCategory) {
        params.set('category', selectedCategory);
        changed = true;
      }
    } else {
      if (params.has('category')) {
        params.delete('category');
        changed = true;
      }
    }
    
    if (vehicleFitment) {
      if (params.get('vehicle') !== vehicleFitment) {
        params.set('vehicle', vehicleFitment);
        changed = true;
      }
    } else {
      if (params.has('vehicle')) {
        params.delete('vehicle');
        changed = true;
      }
    }

    if (changed) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [selectedCategory, vehicleFitment, pathname, router, searchParams]);

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem('diagnosticsAnimated');
    if (hasAnimated) {
      setAnalysisState('matched');
      setMatchedAsset({ name: "Precision Hardware Grid Vector Match", icon: "Box" });
      return;
    }

    const timer1 = setTimeout(() => setAnalysisState('analyzing'), 800);
    const timer2 = setTimeout(() => {
      setAnalysisState('matched');
      setMatchedAsset({
        name: "Precision Hardware Grid Vector Match",
        icon: "Box"
      });
      sessionStorage.setItem('diagnosticsAnimated', 'true');
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price <= maxPrice;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFitment = !vehicleFitment || product.category === "Brakes";

      return matchesCategory && matchesBrand && matchesPrice && matchesSearch && matchesFitment;
    });
  }, [selectedCategory, selectedBrands, maxPrice, searchQuery, vehicleFitment]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      <ShopNavbar />
      <CartDrawer />
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={DEFAULT_FILTERS}
        onChange={() => {}}
        onReset={() => {}}
      />

      {/* ── HERO HEADER ── */}
      <div 
        className={`transition-all duration-300 ease-out will-change-[transform,opacity] ${
          isScrolled 
            ? 'opacity-0 -translate-y-6 pointer-events-none' 
            : 'opacity-100 translate-y-0'
        }`}
      >
        <section className="relative pt-32 pb-16 overflow-hidden">
          {/* Ambient background blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#E12F2F]/10 to-transparent blur-[120px]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-red-400/5 to-transparent blur-[100px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-gradient-to-t from-[#F5F5F5] to-transparent" />
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left copy */}
              <div className="max-w-2xl">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E12F2F]/10 border border-[#E12F2F]/20 text-[#E12F2F] text-xs font-bold tracking-wider uppercase mb-5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E12F2F] animate-pulse" />
                  Automate Parts Marketplace
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-5xl sm:text-6xl text-ink leading-[1.05] mb-5"
                >
                  Spare Parts{' '}
                  <span className="relative">
                    <span className="absolute -inset-2 bg-gradient-to-r from-[#E12F2F]/20 to-transparent blur-xl rounded-xl" />
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-[#E12F2F] to-red-700">
                      Shop
                    </span>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl"
                >
                  Browse authentic automotive parts & accessories from world-class brands — guaranteed to fit your registered vehicles.
                </motion.p>
              </div>

              {/* Right: hero cart button + stats strip */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start lg:items-end gap-5"
              >
                <CartButton variant="hero" />

                {/* Mini stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                  {STATS.map(({ icon: Icon, label, value }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.07 }}
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
      <section className="sticky top-20 z-30 bg-[#F5F5F5]/90 backdrop-blur-md border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ── UNIFIED CONTROL SURFACE ── */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4 mb-5">
            <div className="flex items-center gap-1 bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl max-w-md border border-slate-200/40">
              <button
                type="button"
                onClick={() => setActiveFilterTab('search')}
                className={`flex-1 text-xs font-bold font-mono tracking-wide px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeFilterTab === 'search' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔍 SEARCH PARTS
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterTab('vehicle')}
                className={`flex-1 text-xs font-bold font-mono tracking-wide px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeFilterTab === 'vehicle' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🚗 BY VEHICLE
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterTab('vin')}
                className={`flex-1 text-xs font-bold font-mono tracking-wide px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeFilterTab === 'vin' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🆔 ENTER VIN
              </button>
            </div>

            {/* Conditional Layout Views */}
            {activeFilterTab === 'search' && (
              <SearchBar
                value={searchQuery}
                onChange={(v) => setSearchQuery(v)}
                onFilterOpen={() => setFilterDrawerOpen(true)}
                activeFiltersCount={0}
              />
            )}

            {activeFilterTab === 'vehicle' && (
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                  <select className="w-full h-10 text-xs px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-[#E62424] transition-colors cursor-pointer appearance-none font-semibold">
                    <option value="">Year</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                  <select className="w-full h-10 text-xs px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-[#E62424] transition-colors cursor-pointer appearance-none font-semibold">
                    <option value="">Make</option>
                    <option value="bmw">BMW</option>
                    <option value="mercedes">Mercedes-Benz</option>
                    <option value="toyota">Toyota</option>
                  </select>
                  <select className="w-full h-10 text-xs px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-[#E62424] transition-colors cursor-pointer appearance-none font-semibold">
                    <option value="">Model</option>
                    <option value="3series">3 Series</option>
                    <option value="cclass">C-Class</option>
                  </select>
                  <select className="w-full h-10 text-xs px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-[#E62424] transition-colors cursor-pointer appearance-none font-semibold">
                    <option value="">Engine</option>
                    <option value="v6">V6 3.0L</option>
                    <option value="i4">I4 2.0L</option>
                  </select>
                </div>
              </div>
            )}

            {activeFilterTab === 'vin' && (
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 17-digit VIN..."
                      className="w-full h-10 text-xs px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 pl-9 pr-4 outline-none focus:border-[#E62424] transition-colors uppercase placeholder:normal-case font-semibold"
                      maxLength={17}
                    />
                  </div>
                  <button className="bg-[#E62424] text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors shrink-0 w-full sm:w-auto shadow-sm">
                    Verify Fitment
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-0 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["All", "Engine", "Brakes", "Lighting", "Accessories", "Tires"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat 
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
          
          {/* ── LEFT COLUMN: SIDEBAR FILTERS ── */}
          <div className="hidden lg:block">
            <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 sticky top-24 shadow-[0_4px_24px_rgba(0,0,0,0.01)] transition-all will-change-[transform,opacity]">
              
              {/* UI Scanner Panel */}
              <div className="border border-slate-200/80 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm space-y-3 mb-8">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> Diagnostic Matcher
                </span>
                {analysisState !== 'matched' ? (
                  <div className="text-[10px] font-mono text-slate-400 animate-pulse bg-slate-50 p-2 rounded-lg border border-slate-100">
                    AGENT_LOG: Reading file tree...<br/>Analyzing system components matching /shop routes...
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
                          if (selectedBrands.includes(brand)) {
                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                          } else {
                            setSelectedBrands([...selectedBrands, brand]);
                          }
                        }}
                        className="accent-[#E62424] w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Bracket */}
              <div className="mb-8">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3 block">Price Bracket</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100000" 
                  value={maxPrice} 
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
                  <button className="text-left px-3 py-2 rounded-xl border border-[#E62424] bg-red-50 text-[#E62424] text-xs font-bold transition-colors">
                    OEM Original Factory
                  </button>
                  <button className="text-left px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 text-xs font-bold transition-colors">
                    Premium Aftermarket
                  </button>
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

          {/* ── RIGHT COLUMN: ACTIVE WORKSPACE GRID ── */}
          <div className="lg:col-span-3 flex flex-col will-change-[transform,opacity]">
            
            {/* Dynamic Results Engine */}
            <div className="mb-6">
              {/* Row A: Active Fitment Breadcrumbs */}
              {vehicleFitment ? (
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 will-change-[transform,opacity]">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Home</span>
                    <span className="text-slate-400">/</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Shop</span>
                    <span className="text-slate-400">/</span>
                    <span className="font-bold text-slate-800">Brake System</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-[#E62424] font-bold font-mono">Fitment: {vehicleFitment}</span>
                  </div>
                  <button 
                    onClick={() => setVehicleFitment(null)}
                    className="text-slate-400 hover:text-[#E62424] font-mono font-bold transition-colors whitespace-nowrap"
                  >
                    [× Clear Vehicle]
                  </button>
                </div>
              ) : null}

              {/* Row B: Inventory Counter & Sorting Selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 will-change-[transform,opacity]">
                <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> premium components matched
                </div>
                <select
                  className="bg-white border border-slate-200 shadow-sm text-xs font-bold rounded-lg px-3 py-2 text-slate-800 transition-all focus:outline-none focus:ring-1 focus:ring-[#E62424] focus:border-[#E62424] cursor-pointer appearance-none min-w-[160px]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Mechanics Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            <ProductGrid products={filteredProducts as any} isLoading={isLoading} />

            {/* Pagination Capacity Indicator */}
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

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, TrendingUp, Package, Star } from 'lucide-react';
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

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const updateFilters = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.inStockOnly) count++;
    if (filters.sortBy !== 'featured') count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 999) count++;
    return count;
  }, [filters]);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (filters.category !== 'All') {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }
    list = list.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    switch (filters.sortBy) {
      case 'price-asc':   list.sort((a, b) => a.price - b.price); break;
      case 'price-desc':  list.sort((a, b) => b.price - a.price); break;
      case 'rating':      list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':      list.reverse(); break;
    }

    return list;
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <ShopNavbar />
      <CartDrawer />
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      {/* ── HERO HEADER ── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Ambient background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FF2D2D]/10 to-transparent blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-red-400/5 to-transparent blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
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
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 text-[#FF2D2D] text-xs font-bold tracking-wider uppercase mb-5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D2D] animate-pulse" />
                Automate Parts Marketplace
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-6xl font-extrabold text-[#111111] tracking-[-0.02em] leading-[1.05] mb-5"
              >
                Spare Parts{' '}
                <span className="relative">
                  <span className="absolute -inset-2 bg-gradient-to-r from-[#FF2D2D]/20 to-transparent blur-xl rounded-xl" />
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-[#FF2D2D] to-red-700">
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
                    <div className="w-7 h-7 rounded-lg bg-[#FF2D2D]/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#FF2D2D]" />
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

      {/* ── SEARCH & FILTER ── */}
      <section className="sticky top-20 z-30 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <SearchBar
            value={filters.search}
            onChange={(v) => updateFilters({ search: v })}
            onFilterOpen={() => setFilterDrawerOpen(true)}
            activeFiltersCount={activeFiltersCount}
          />
          <CategoryTabs
            active={filters.category}
            onChange={(cat: Category) => updateFilters({ category: cat })}
          />
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Results bar */}
        <motion.div
          layout
          className="flex items-center justify-between mb-8"
        >
          <motion.p
            key={filtered.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-gray-500"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
            ) : (
              <>
                <span className="font-bold text-gray-900">{filtered.length}</span>{' '}
                {filtered.length === 1 ? 'part' : 'parts'} found
                {filters.category !== 'All' && (
                  <> in <span className="text-[#FF2D2D] font-semibold">{filters.category}</span></>
                )}
              </>
            )}
          </motion.p>

          {/* Sort select */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#FF2D2D]/40 transition-colors cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </motion.div>

        <ProductGrid products={filtered} isLoading={isLoading} />

        {/* Bottom CTA */}
        {!isLoading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 relative bg-[#111111] rounded-[3rem] p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Animated gradient */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute top-[-50%] left-[-20%] w-full h-[150%] bg-[radial-gradient(ellipse_at_center,_#FF2D2D_0%,_transparent_50%)] blur-[80px]"
              />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-bold tracking-widest uppercase mb-6">
                <ShoppingBag className="w-3.5 h-3.5" />
                Free Shipping on All Orders
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Can&apos;t Find What You Need?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                Our team of automotive experts can source any part for your vehicle. Just ask.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/signup"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-2xl bg-white text-[#111111] font-bold text-base shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] transition-all"
                >
                  Request a Part
                </motion.a>
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all"
                >
                  Back to Platform
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF2D2D] to-red-600 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(255,45,45,0.4)]">
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

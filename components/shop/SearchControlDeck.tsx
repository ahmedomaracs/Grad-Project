'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Car, ChevronDown, Check } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useShopFilterStore } from '@/store/shopFilterStore';
import { useAuthStore, Vehicle } from '@/store/authStore';

interface SearchControlDeckProps {
  onFilterOpen: () => void;
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  activeFiltersCount: number;
}

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

export function SearchControlDeck({
  onFilterOpen,
  selectedVehicleId,
  onSelectVehicle,
  activeFiltersCount,
}: SearchControlDeckProps) {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useShopFilterStore();
  const { vehicles } = useAuthStore();
  const [activeFilterTab, setActiveFilterTab] = useState<'search' | 'vehicle' | 'vin'>('search');

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) ?? null;

  return (
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
                  onChange={setSearchQuery}
                  onFilterOpen={onFilterOpen}
                  activeFiltersCount={activeFiltersCount}
                />
              )}

              {/* BY VEHICLE tab — garage popover */}
              {activeFilterTab === 'vehicle' && (
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <VehiclePopover
                    vehicles={vehicles}
                    selectedVehicleId={selectedVehicleId}
                    onSelect={onSelectVehicle}
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
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeCategory === cat
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
  );
}

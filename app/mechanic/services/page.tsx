'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useRequireRole } from '@/hooks/useRequireRole';
import { useLocalDB } from '@/store/localDB';
import { Button } from '@/components/ui/Button';
import { Settings2, Save, Wrench, ShieldAlert } from 'lucide-react';

const DEFAULT_SPECIALTIES = [
  { id: 'engine_diag', name: 'Engine Diagnostics', price: 500, enabled: false },
  { id: 'brake_sys', name: 'Brake Systems', price: 800, enabled: false },
  { id: 'ev_tune', name: 'EV Tuning', price: 1500, enabled: false },
  { id: 'batt_cal', name: 'Battery Calibration', price: 1200, enabled: false },
];

export default function MechanicServicesPage() {
  const { isLoading, user } = useRequireRole('Mechanic');
  const mechanicsRegistry = useLocalDB((s) => s.mechanicsRegistry);
  const updateMechanicServices = useLocalDB((s) => s.updateMechanicServices);

  const [services, setServices] = useState(DEFAULT_SPECIALTIES);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const mechanicProfile = mechanicsRegistry.find((m) => m.email === user.email);
      if (mechanicProfile && mechanicProfile.services && mechanicProfile.services.length > 0) {
        // Merge saved services with defaults to ensure all options are present
        const merged = DEFAULT_SPECIALTIES.map(def => {
          const saved = mechanicProfile.services!.find(s => s.id === def.id);
          return saved ? { ...def, ...saved } : def;
        });
        setServices(merged);
      }
    }
  }, [user, mechanicsRegistry]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" />
      </div>
    );
  }

  const handleToggle = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    setServices(services.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate network delay
    setTimeout(() => {
      updateMechanicServices(user.email, services);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <WorkspaceLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display text-gray-900">Services & Rates</h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">Configure your offered capabilities and explicitly set base labor fees in EGP.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
              <Settings2 className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Core Capabilities Matrix</h2>
              <p className="text-xs text-gray-500 font-bold">Select the services your bay currently provides to customers.</p>
            </div>
          </div>

          <div className="space-y-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all ${
                  service.enabled ? 'border-[#E12F2F]/40 bg-red-50/30' : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-6">
                      <input
                        id={service.id}
                        name={service.id}
                        type="checkbox"
                        checked={service.enabled}
                        onChange={() => handleToggle(service.id)}
                        className="w-5 h-5 rounded border-gray-300 text-[#E12F2F] focus:ring-[#E12F2F] cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={service.id} className="text-base font-extrabold text-gray-900 cursor-pointer select-none">
                      {service.name}
                    </label>
                    <p className="text-xs text-gray-500 font-bold mt-0.5 flex items-center gap-1">
                      <Wrench className="w-3 h-3" /> Standard Procedure
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs font-bold text-gray-500 uppercase">Base Labor Fee</span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-xs font-extrabold text-gray-400">EGP</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      disabled={!service.enabled}
                      value={service.price}
                      onChange={(e) => handlePriceChange(service.id, Number(e.target.value))}
                      className={`w-32 pl-10 pr-4 py-2 text-sm font-extrabold text-right border rounded-xl focus:ring-2 focus:ring-[#E12F2F]/20 focus:border-[#E12F2F] transition-colors ${
                        service.enabled ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 w-full sm:w-auto">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-bold">Rates are visible to all marketplace users.</span>
            </div>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`w-full sm:w-auto h-12 px-8 font-bold text-sm transition-all ${
                saveSuccess 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-[#E12F2F] hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
              }`}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saveSuccess ? (
                'Rates Synced ✓'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Configurations
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </WorkspaceLayout>
  );
}

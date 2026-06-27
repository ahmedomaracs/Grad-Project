'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useRequireRole } from '@/hooks/useRequireRole';
import { useLocalDB } from '@/store/localDB';
import { Button } from '@/components/ui/Button';
import { Settings2, Save, Wrench, ShieldAlert, Plus, Edit2, Trash2, X } from 'lucide-react';

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

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

  // Form states for Add/Edit
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number | ''>('');

  useEffect(() => {
    if (user) {
      const mechanicProfile = mechanicsRegistry.find((m) => m.email === user.email);
      if (mechanicProfile && mechanicProfile.services && mechanicProfile.services.length > 0) {
        setServices(mechanicProfile.services);
      } else {
        setServices(DEFAULT_SPECIALTIES);
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
    
    setTimeout(() => {
      updateMechanicServices(user.email, services);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  // Add logic
  const openAddModal = () => {
    setFormName('');
    setFormPrice(0);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice === '' || formPrice < 0) return;
    const newService = {
      id: 'srv_' + Math.random().toString(36).substr(2, 9),
      name: formName.trim(),
      price: Number(formPrice),
      enabled: true,
    };
    setServices([...services, newService]);
    setIsAddOpen(false);
  };

  // Edit logic
  const openEditModal = (service: typeof services[0]) => {
    setFormName(service.name);
    setFormPrice(service.price);
    setEditServiceId(service.id);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice === '' || formPrice < 0 || !editServiceId) return;
    setServices(services.map(s => 
      s.id === editServiceId ? { ...s, name: formName.trim(), price: Number(formPrice) } : s
    ));
    setEditServiceId(null);
  };

  // Delete logic
  const confirmDelete = () => {
    if (!deleteServiceId) return;
    setServices(services.filter(s => s.id !== deleteServiceId));
    setDeleteServiceId(null);
  };

  return (
    <WorkspaceLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display text-gray-900">Services & Rates</h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">Configure your offered capabilities and explicitly set base labor fees in EGP.</p>
          </div>
          <Button onClick={openAddModal} className="h-10 px-4 font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Service
          </Button>
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

          <div className="space-y-4">
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

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="flex items-center gap-3">
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
                        className={`w-28 pl-10 pr-3 py-2 text-sm font-extrabold text-right border rounded-xl focus:ring-2 focus:ring-[#E12F2F]/20 focus:border-[#E12F2F] transition-colors ${
                          service.enabled ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteServiceId(service.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {services.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm font-bold text-gray-400">No services added yet. Click "Add Custom Service" to begin.</p>
              </div>
            )}
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

      {/* --- MODALS --- */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-black text-slate-900">Add New Service</h3>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-2">Service Name</label>
                  <input type="text" autoFocus required value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Full Synthetic Oil Change" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#E12F2F] focus:ring-1 focus:ring-[#E12F2F]" />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-2">Base Labor Fee (EGP)</label>
                  <input type="number" required min="0" value={formPrice} onChange={(e) => setFormPrice(e.target.value ? Number(e.target.value) : '')} placeholder="e.g. 500" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#E12F2F] focus:ring-1 focus:ring-[#E12F2F]" />
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 px-4 bg-[#E12F2F] hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-red-500/20">Add Service</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {editServiceId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-black text-slate-900">Edit Service</h3>
                <button onClick={() => setEditServiceId(null)} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-2">Service Name</label>
                  <input type="text" autoFocus required value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#E12F2F] focus:ring-1 focus:ring-[#E12F2F]" />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 mb-2">Base Labor Fee (EGP)</label>
                  <input type="number" required min="0" value={formPrice} onChange={(e) => setFormPrice(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#E12F2F] focus:ring-1 focus:ring-[#E12F2F]" />
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setEditServiceId(null)} className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-500/20">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {deleteServiceId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[24px] shadow-2xl border border-red-100 w-full max-w-sm overflow-hidden text-center p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Delete Service?</h3>
              <p className="text-sm text-slate-500 font-semibold mb-6">Are you sure you want to remove this service from your offerings? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteServiceId(null)} className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 px-4 bg-[#E12F2F] hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-red-500/20">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </WorkspaceLayout>
  );
}


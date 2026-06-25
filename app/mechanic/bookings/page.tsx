'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useRequireRole } from '@/hooks/useRequireRole';
import { useLocalDB, GlobalBooking } from '@/store/localDB';
import { MOCK_ACTIVE_BOOKINGS } from '@/store/mockData';
import { PRODUCTS } from '@/constants/shop';
import { Button } from '@/components/ui/Button';
import { X, Search, Plus, Wrench, Package, CheckCircle } from 'lucide-react';

export default function MechanicBookingsPage() {
  const { isLoading, user } = useRequireRole('Mechanic');
  const allBookings = useLocalDB((s) => s.globalBookings);
  const updateBookingInvoice = useLocalDB((s) => s.updateBookingInvoice);

  const [selectedJob, setSelectedJob] = useState<GlobalBooking | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" />
      </div>
    );
  }

  const mechanicBookings = allBookings.filter(
    (b) => b.mechanicId === user.email || b.mechanicName === user.email
  );

  const activeBookings = mechanicBookings.filter(b => b.status !== 'Completed');
  const displayBookings = activeBookings.length > 0 ? activeBookings : MOCK_ACTIVE_BOOKINGS;

  // Filter catalog based on search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQ = searchQuery.toLowerCase();
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(lowerQ) || 
      p.brand.toLowerCase().includes(lowerQ) ||
      p.category.toLowerCase().includes(lowerQ)
    ).slice(0, 5); // Limit to 5 results for clean UI
  }, [searchQuery]);

  const handleAddPart = (part: { id: string; name: string; price: number }) => {
    if (!selectedJob) return;

    const currentInvoice = selectedJob.invoice || { parts: [], laborTotal: 0, isPaid: false };
    const updatedInvoice = {
      ...currentInvoice,
      parts: [...currentInvoice.parts, { id: part.id, name: part.name, price: part.price }]
    };

    updateBookingInvoice(selectedJob.id, updatedInvoice);
    
    // Update local state to reflect change instantly in the drawer
    setSelectedJob({ ...selectedJob, invoice: updatedInvoice });
  };

  const handleRemovePart = (indexToRemove: number) => {
    if (!selectedJob || !selectedJob.invoice) return;

    const updatedParts = selectedJob.invoice.parts.filter((_, idx) => idx !== indexToRemove);
    const updatedInvoice = { ...selectedJob.invoice, parts: updatedParts };

    updateBookingInvoice(selectedJob.id, updatedInvoice);
    setSelectedJob({ ...selectedJob, invoice: updatedInvoice });
  };

  const updateLaborFee = (amount: number) => {
    if (!selectedJob) return;

    const currentInvoice = selectedJob.invoice || { parts: [], laborTotal: 0, isPaid: false };
    const updatedInvoice = { ...currentInvoice, laborTotal: amount };

    updateBookingInvoice(selectedJob.id, updatedInvoice);
    setSelectedJob({ ...selectedJob, invoice: updatedInvoice });
  };

  const calculateTotal = (invoice?: GlobalBooking['invoice']) => {
    if (!invoice) return 0;
    const partsTotal = invoice.parts.reduce((sum, p) => sum + p.price, 0);
    return partsTotal + invoice.laborTotal;
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-6 relative">
        <div>
          <h1 className="text-3xl font-display text-gray-900">Active Jobs Tracker</h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">Select a ticket to open the repair workspace and manage the invoice.</p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBookings.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-gray-200">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-bold">No active jobs right now.</p>
            </div>
          )}
          {displayBookings.map((b) => (
            <motion.div
              key={b.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm cursor-pointer hover:border-[#E12F2F]/30 hover:shadow-md transition-all"
              onClick={() => setSelectedJob(b)}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold uppercase">
                  {b.status}
                </span>
                <span className="text-xs font-extrabold text-gray-400">ID: {b.id.substring(0, 8)}</span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">{b.clientName}</h3>
              <p className="text-sm font-bold text-gray-500 mb-4">{b.vehicle}</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 p-2 rounded-xl">
                <Wrench className="w-4 h-4 text-gray-400" />
                {b.serviceType}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Invoice Total</span>
                <span className="text-sm font-extrabold text-gray-900">
                  EGP {calculateTotal(b.invoice).toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overlay / Modal for Drawer */}
        <AnimatePresence>
          {selectedJob && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedJob(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              />

              {/* Slide-out Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">Repair Workspace</h2>
                    <p className="text-xs font-bold text-gray-500 mt-1">Ticket: {selectedJob.id.substring(0, 8)}</p>
                  </div>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full bg-gray-200 hover:bg-gray-300" onClick={() => setSelectedJob(null)}>
                    <X className="w-4 h-4 text-gray-700" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Job Details */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-2">Customer Info</h3>
                    <p className="text-sm text-gray-600 font-semibold">{selectedJob.clientName}</p>
                    <p className="text-xs text-gray-500 font-bold mt-1">{selectedJob.vehicle} • {selectedJob.serviceType}</p>
                  </div>

                  {/* Catalog Part Search */}
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#E12F2F]" /> Shop Catalog Query
                    </h3>
                    <div className="relative mb-3">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search parts by name or brand..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#E12F2F]/20 focus:border-[#E12F2F] transition-all bg-gray-50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Search Results */}
                    {searchQuery.trim() && searchResults.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm max-h-48 overflow-y-auto">
                        {searchResults.map((part) => (
                          <div key={part.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="flex-1 min-w-0 pr-3">
                              <p className="text-xs font-extrabold text-gray-900 truncate">{part.name}</p>
                              <p className="text-[10px] font-bold text-gray-500">ID: {part.id} • EGP {part.price.toFixed(2)}</p>
                            </div>
                            <Button
                              variant="outline"
                              className="h-7 w-7 p-0 flex-shrink-0 border-gray-200 text-gray-600 hover:text-[#E12F2F] hover:border-[#E12F2F]/30 hover:bg-red-50"
                              onClick={() => handleAddPart(part)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchQuery.trim() && searchResults.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-2 font-semibold">No parts found matching "{searchQuery}"</p>
                    )}
                  </div>

                  {/* Active Invoice Ledger */}
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-700" /> Repair Manifest
                    </h3>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      {/* Parts List */}
                      <div className="space-y-2 mb-4">
                        {(!selectedJob.invoice?.parts || selectedJob.invoice.parts.length === 0) ? (
                          <p className="text-xs text-gray-400 font-semibold italic">No parts added to invoice.</p>
                        ) : (
                          selectedJob.invoice.parts.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg border border-gray-100">
                              <span className="font-bold text-gray-700 truncate mr-2 flex-1">{p.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-extrabold text-gray-900 text-xs w-20 text-right">EGP {p.price.toFixed(2)}</span>
                                <button onClick={() => handleRemovePart(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Labor Fee Input */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-4">
                        <span className="text-xs font-bold text-gray-600">Labor Fee (EGP)</span>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={selectedJob.invoice?.laborTotal || 0}
                          onChange={(e) => updateLaborFee(Number(e.target.value))}
                          className="w-24 px-2 py-1 text-sm font-extrabold text-right border border-gray-200 rounded-md focus:ring-2 focus:ring-[#E12F2F]/20 focus:border-[#E12F2F] bg-white"
                        />
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900/10">
                        <span className="text-sm font-extrabold text-gray-900">Total</span>
                        <span className="text-lg font-extrabold text-[#E12F2F]">
                          EGP {calculateTotal(selectedJob.invoice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Drawer Footer */}
                <div className="p-6 border-t border-gray-100 bg-white">
                  <Button className="w-full bg-[#E12F2F] hover:bg-red-600 text-white font-bold h-12 text-sm shadow-lg shadow-red-500/20" onClick={() => setSelectedJob(null)}>
                    Save & Close Workspace
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </WorkspaceLayout>
  );
}

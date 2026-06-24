'use client';

import React, { useState, useRef, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Upload,
  Pencil,
  Wrench,
  Trash2,
  Car,
  Gauge,
  Shield,
} from 'lucide-react';
import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateCode: string;
  plateNumber: string;
  mileage: number;
  images: string[];
}

/* ------------------------------------------------------------------ */
/*  Vehicle Data (Make → Models)                                       */
/* ------------------------------------------------------------------ */
const VEHICLE_MAKES: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Hilux', 'Supra'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'G-Wagon'],
  BMW: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', 'M4'],
  Audi: ['A3', 'A4', 'A6', 'A8', 'Q5', 'Q7', 'RS6'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Defender', 'Discovery'],
  Porsche: ['911', 'Cayenne', 'Panamera', 'Taycan', 'Macan'],
  Lexus: ['IS', 'ES', 'LS', 'RX', 'LX', 'RC F'],
  Nissan: ['Altima', 'Maxima', 'Patrol', 'GT-R', '370Z'],
  Ford: ['Mustang', 'F-150', 'Explorer', 'Bronco'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'NSX'],
};

const MAKES = Object.keys(VEHICLE_MAKES);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
function MyGarageContent() {
  const router = useRouter();

  /* -- state -- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [plateCode, setPlateCode] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -- store --
   * Vehicle data is managed locally via Zustand (persisted to localStorage).
   * The backend does not yet expose vehicle endpoints; this will be wired up
   * to garageApi once /api/Vehicles is available on the server.
   */
  const { vehicles: storeVehicles, addVehicle: storeAdd, updateVehicle: storeUpdate, removeVehicle: storeRemove } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  /* -- derived -- */
  const availableModels = make ? VEHICLE_MAKES[make] || [] : [];

  const vehicles = storeVehicles.map(v => ({
    id: v.id,
    make: v.make || v.brand,
    model: v.model,
    year: v.year,
    plateCode: v.plateCode || '',
    plateNumber: v.plateNumber || v.plate || '',
    mileage: v.mileage,
    images: v.images || (v.image ? [v.image] : []),
  }));

  const openAdd = () => {
    setEditingId(null);
    setMake('');
    setModel('');
    setYear('');
    setMileage('');
    setPlateCode('');
    setPlateNumber('');
    setImagePreviews([]);
    setFiles([]);
    setIsModalOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setMake(v.make);
    setModel(v.model);
    setYear(String(v.year));
    setMileage(String(v.mileage));
    setPlateCode(v.plateCode);
    setPlateNumber(v.plateNumber);
    setImagePreviews(v.images);
    setFiles([]);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...newFiles]);
    const newUrls = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newUrls]);
  }, []);

  const removeImage = (idx: number) => {
    const previewToRemove = imagePreviews[idx];
    if (previewToRemove.startsWith('blob:')) {
      const blobIndex = imagePreviews.slice(0, idx).filter(url => url.startsWith('blob:')).length;
      setFiles((prev) => prev.filter((_, i) => i !== blobIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(active);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const saveVehicle = async () => {
    if (!make || !model || !year || !mileage) return;
    setIsSaving(true);
    try {
      const uploadedImages = await Promise.all(files.map(f => convertToBase64(f)));
      const existingImages = imagePreviews.filter(url => !url.startsWith('blob:'));
      const finalImages = [...existingImages, ...uploadedImages];

      if (editingId) {
        storeUpdate(editingId, {
          make,
          model,
          year: Number(year),
          plateCode: plateCode.toUpperCase(),
          plateNumber,
          mileage: Number(mileage),
          images: finalImages,
        });
        addToast({ type: 'success', title: 'Vehicle Saved', message: `${make} ${model} updated successfully.` });
      } else {
        storeAdd({
          brand: make,
          make,
          model,
          year: Number(year),
          plateCode: plateCode.toUpperCase(),
          plateNumber,
          mileage: Number(mileage),
          images: finalImages,
          image: finalImages[0] || '',
          plate: `${plateCode.toUpperCase()} ${plateNumber}`.trim(),
          status: 'Perfect',
        });
        addToast({ type: 'success', title: 'Vehicle Added', message: `${make} ${model} added to your garage.` });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Failed to save vehicle',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteVehicle = (id: string) => {
    storeRemove(id);
    addToast({ type: 'success', title: 'Vehicle Deleted', message: 'Vehicle removed from your garage.' });
  };

  const isFormValid =
    make && model && year && Number(year) >= 1900 && Number(year) <= new Date().getFullYear() + 1 && mileage !== '';

  /* ---------------------------------------------------------------- */
  /*  Empty State                                                       */
  /* ---------------------------------------------------------------- */
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center py-24 bg-white/40 border border-slate-200/60 rounded-3xl p-6"
    >
      <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-8 shadow-sm">
        <Car className="w-12 h-12 text-slate-400" strokeWidth={1.2} />
      </div>
      <h2 className="text-3xl font-display text-slate-900 mb-3">
        Your garage is empty
      </h2>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-8 font-medium">
        Add your vehicle model, year, and mileage to unlock smart service scheduling.
      </p>
      <button
        onClick={openAdd}
        className="min-h-[52px] px-8 py-3 bg-[#E12F2F] hover:bg-[#C41F1F] text-white font-extrabold text-sm rounded-2xl shadow-md shadow-red-500/10 transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer outline-none border border-[#E12F2F]/10"
      >
        <Plus className="w-5 h-5" />
        Add Car
      </button>
    </motion.div>
  );

  /* ---------------------------------------------------------------- */
  /*  Vehicle Card                                                      */
  /* ---------------------------------------------------------------- */
  const VehicleCard = ({ vehicle, index }: { vehicle: Vehicle; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group theme-glass-card bg-white/80 border border-slate-200/70 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Header image or gradient */}
      <div className="relative h-44 w-full overflow-hidden">
        {vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center">
            <Car className="w-12 h-12 text-slate-400/40" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-extrabold text-white tracking-tight">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-xs text-slate-100/90 font-medium">{vehicle.year}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {vehicle.plateCode && vehicle.plateNumber && (
            <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 border border-slate-200">
              <Shield className="w-3 h-3 text-[#E12F2F]" />
              {vehicle.plateCode} {vehicle.plateNumber}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 border border-slate-200">
            <Gauge className="w-3 h-3 text-[#E12F2F]" />
            {Number(vehicle.mileage).toLocaleString()} km
          </span>
        </div>

        {/* Action footer */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => openEdit(vehicle)}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all outline-none cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Info
          </button>
          <button
            onClick={() => router.push('/services')}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E12F2F]/5 border border-[#E12F2F]/10 text-sm font-bold text-[#E12F2F] hover:bg-[#E12F2F]/10 transition-all outline-none cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            Book Service
          </button>
          <button
            onClick={() => deleteVehicle(vehicle.id)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#E12F2F] hover:bg-red-50 transition-all outline-none cursor-pointer"
            aria-label="Delete vehicle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  /* ---------------------------------------------------------------- */
  /*  Modal                                                              */
  /* ---------------------------------------------------------------- */
  const fieldCls =
    'w-full theme-glass-input rounded-xl px-4 py-3 text-sm font-semibold min-h-[44px]';

  const labelCls = 'text-xs font-bold text-slate-500 uppercase tracking-wider';

  return (
    <div className="min-h-full bg-[#F8FAFC] text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-display text-slate-950">My Garage</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">Manage your fleet and schedule maintenance.</p>
        </div>
        {vehicles.length > 0 && (
          <button
            onClick={openAdd}
            className="min-h-[44px] px-5 py-2.5 bg-[#E12F2F] hover:bg-[#C41F1F] text-white font-extrabold text-sm rounded-2xl shadow-md shadow-red-500/10 transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer outline-none border border-[#E12F2F]/10"
          >
            <Plus className="w-4 h-4" />
            Add Car
          </button>
        )}
      </div>

      {/* Content */}
      {vehicles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 md:p-8 my-8"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                  {editingId ? 'Edit Vehicle' : 'Add Vehicle'}
                </h2>
                <button
                  onClick={closeModal}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all outline-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Make */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Make *</label>
                  <div className="relative">
                    <select
                      value={make}
                      onChange={(e) => {
                        setMake(e.target.value);
                        setModel('');
                      }}
                      className={`${fieldCls} appearance-none cursor-pointer`}
                    >
                      <option value="" className="bg-white text-slate-500">
                        -- Select Make --
                      </option>
                      {MAKES.map((m) => (
                        <option key={m} value={m} className="bg-white text-slate-900">
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Model */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Model *</label>
                  <div className="relative">
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      disabled={!make}
                      className={`${fieldCls} appearance-none cursor-pointer disabled:opacity-40`}
                    >
                      <option value="" className="bg-white text-slate-500">
                        -- Select Model --
                      </option>
                      {availableModels.map((m) => (
                        <option key={m} value={m} className="bg-white text-slate-900">
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Year & Mileage */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Year *</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className={fieldCls}
                      placeholder="e.g., 2024"
                      min={1900}
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Mileage (km) *</label>
                    <input
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      className={fieldCls}
                      placeholder="e.g., 45,000"
                      min={0}
                    />
                  </div>
                </div>

                {/* Plate Code & Number */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Plate Code</label>
                    <input
                      type="text"
                      value={plateCode}
                      onChange={(e) => setPlateCode(e.target.value.toUpperCase())}
                      className={fieldCls}
                      placeholder="A"
                      maxLength={5}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Plate Number</label>
                    <input
                      type="text"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      className={fieldCls}
                      placeholder="12345"
                      maxLength={8}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Car Photos</label>
                  <div
                    onDragEnter={(e) => handleDrag(e, true)}
                    onDragOver={(e) => handleDrag(e, true)}
                    onDragLeave={(e) => handleDrag(e, false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[130px]
                      ${isDragOver
                        ? 'border-[#E12F2F] bg-[#E12F2F]/5'
                        : 'border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFiles(e.target.files)}
                      className="hidden"
                    />
                    <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl mb-2.5 text-slate-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      Drag &amp; Drop your car photos or{' '}
                      <span className="text-[#E12F2F]">Browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      JPG, PNG — up to 10 MB each
                    </p>
                  </div>

                  {/* Preview grid */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {imagePreviews.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            className="absolute top-1 right-1 w-7 h-7 min-w-[28px] min-h-[28px] bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-[#E12F2F] transition-all outline-none cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal actions */}
              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={closeModal}
                  className="flex-1 min-h-[48px] py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVehicle}
                  disabled={!isFormValid || isSaving}
                  className="flex-1 min-h-[48px] py-3 rounded-xl bg-[#E12F2F] hover:bg-[#C41F1F] text-white font-extrabold text-sm shadow-md shadow-red-500/10 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed outline-none border border-[#E12F2F]/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : editingId ? (
                    'Save Changes'
                  ) : (
                    'Add Vehicle'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Wrapped Export                                                     */
/* ------------------------------------------------------------------ */
export default function MyGaragePage() {
  return (
    <WorkspaceLayout>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="w-10 h-10 border-[3px] border-slate-200 border-t-[#E12F2F] rounded-full animate-spin" />
          </div>
        }
      >
        <MyGarageContent />
      </Suspense>
    </WorkspaceLayout>
  );
}

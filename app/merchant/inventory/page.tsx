'use client';

import React, { useState, useRef, Suspense } from 'react';
import { Package, Plus, Save, Trash2, EyeOff, Eye, AlertCircle, UploadCloud, Image as ImageIcon, X, Edit } from 'lucide-react';
import { useLocalDB, GlobalProduct } from '../../../store/localDB';
import Image from 'next/image';

const AVAILABLE_BRANDS = ['Brembo', 'NGK', 'Bosch', 'Denso', 'Castrol', 'Michelin'];
const AVAILABLE_CATEGORIES = ['Brakes', 'Engine', 'Transmission', 'Suspension', 'Fluids', 'Tires'];
const COMPATIBILITY_OPTIONS = ['BMW', 'Porsche', 'Audi', 'Mercedes', 'Volkswagen', 'Toyota'];

export function InventoryTab({ merchantId }: { merchantId: string }) {
  const { globalProducts, addProduct, updateProduct, deleteProduct, toggleProductVisibility } = useLocalDB();
  const products = (globalProducts || []).filter((p) => p.merchantId === merchantId);

  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GlobalProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<GlobalProduct | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setIsAdding(false);
    setEditingProduct(null);
    setTitle('');
    setBrand(AVAILABLE_BRANDS[0]);
    setCategory(AVAILABLE_CATEGORIES[0]);
    setBasePrice('');
    setStockQuantity('');
    setOuterDiameterMM('');
    setThicknessMM('');
    setBoltHoleCircleMM('');
    setLengthMM('');
    setThreadSize('');
    setVinPattern('');
    setSelectedTags([]);
    setPreviewUrl(null);
  };

  const openEditForm = (product: GlobalProduct) => {
    setEditingProduct(product);
    setTitle(product.title);
    setBrand(product.brand);
    setCategory(product.category);
    setBasePrice(product.basePrice);
    setStockQuantity(product.stockQuantity);
    setOuterDiameterMM(product.characteristics?.outerDiameterMM ?? '');
    setThicknessMM(product.characteristics?.thicknessMM ?? '');
    setBoltHoleCircleMM(product.characteristics?.boltHoleCircleMM ?? '');
    setLengthMM(product.characteristics?.lengthMM ?? '');
    setThreadSize(product.characteristics?.threadSize ?? '');
    setVinPattern(product.vinCompatibilityPattern || '');
    setSelectedTags(product.compatibilityTags || []);
    setPreviewUrl(product.image || null);
    setIsAdding(true);
  };

  // Form State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState(AVAILABLE_BRANDS[0]);
  const [category, setCategory] = useState(AVAILABLE_CATEGORIES[0]);
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number | ''>('');

  // Dimensions (Metrics)
  const [outerDiameterMM, setOuterDiameterMM] = useState<number | ''>('');
  const [thicknessMM, setThicknessMM] = useState<number | ''>('');
  const [boltHoleCircleMM, setBoltHoleCircleMM] = useState<number | ''>('');
  const [lengthMM, setLengthMM] = useState<number | ''>('');
  const [threadSize, setThreadSize] = useState('');

  // Fitment
  const [vinPattern, setVinPattern] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Media
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    // Validation
    if (!title || basePrice === '' || stockQuantity === '') return;

    const newProduct: Partial<GlobalProduct> = {
      merchantId,
      title,
      brand,
      category,
      basePrice: Number(basePrice),
      stockQuantity: Number(stockQuantity),
      image: previewUrl || undefined,
      vinCompatibilityPattern: vinPattern || ".*",
      characteristics: {
        outerDiameterMM: outerDiameterMM !== '' ? Number(outerDiameterMM) : undefined,
        thicknessMM: thicknessMM !== '' ? Number(thicknessMM) : undefined,
        boltHoleCircleMM: boltHoleCircleMM !== '' ? Number(boltHoleCircleMM) : undefined,
        lengthMM: lengthMM !== '' ? Number(lengthMM) : undefined,
        threadSize: threadSize || undefined,
      },
      compatibilityTags: selectedTags,

      // Default filler for old schema
      mpn: '',
      salePrice: Number(basePrice),
      itemCost: Number(basePrice) * 0.7,
      fitment: selectedTags.join(', '),
      weight: 0,
      condition: 'New',
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      lowStockThreshold: 5,
      workshopDeliveryEnabled: true,
      isVisible: true,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, newProduct);
    } else {
      addProduct(newProduct as GlobalProduct);
    }

    resetForm();
  };

  const handleInlineUpdate = (id: string, field: keyof GlobalProduct, value: any) => {
    updateProduct(id, { [field]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-150 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Inventory Control Desk</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your automotive parts catalog and fitment specs.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAdding(true); }}
          className="px-4 py-2 bg-[#E12F2F] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
        >
          <Plus className="w-4 h-4" /> Create Product
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-2xl flex flex-col gap-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Automotive Product' : 'Create Automotive Product'}</h2>
                <p className="text-sm text-gray-500 mt-1">{editingProduct ? 'Update part specifications and fitment' : 'Configure part specifications and fitment'}</p>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Base Product Data Section */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">1. Base Product Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E12F2F] outline-none" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Brembo Venting Brake Rotor" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E12F2F] outline-none" value={brand} onChange={e => setBrand(e.target.value)}>
                    {AVAILABLE_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E12F2F] outline-none" value={category} onChange={e => setCategory(e.target.value)}>
                    {AVAILABLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Base Price</label>
                  <div className="relative">
                    <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-2 text-sm focus:ring-2 focus:ring-[#E12F2F] outline-none" value={basePrice} onChange={e => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0.00" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">EGP</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock Level</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E12F2F] outline-none" value={stockQuantity} onChange={e => setStockQuantity(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Quantity" />
                </div>
              </div>
            </section>

            {/* Automotive Metric Profile Matrix */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">2. Automotive Metric Profile Matrix</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Outer Diameter', value: outerDiameterMM, setter: setOuterDiameterMM, unit: 'mm', type: 'number' },
                  { label: 'Thickness/Depth', value: thicknessMM, setter: setThicknessMM, unit: 'mm', type: 'number' },
                  { label: 'Bolt Hole Circle', value: boltHoleCircleMM, setter: setBoltHoleCircleMM, unit: 'mm', type: 'number' },
                  { label: 'Structural Length', value: lengthMM, setter: setLengthMM, unit: 'mm', type: 'number' },
                  { label: 'Thread Pitch/Size', value: threadSize, setter: setThreadSize, unit: 'txt', type: 'text', placeholder: 'e.g. M14 x 1.25' }
                ].map((field, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.type}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-[#E12F2F] outline-none"
                        value={field.value}
                        onChange={e => field.setter(field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value as any)}
                        placeholder={field.placeholder || "0"}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{field.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Multi-Vehicle Fitment Compatibility */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">3. Multi-Vehicle Fitment Reconciler</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Manufacturer Fleet</label>
                  <div className="flex flex-wrap gap-2">
                    {COMPATIBILITY_OPTIONS.map(opt => {
                      const isSelected = selectedTags.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleTag(opt)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${isSelected ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}
                        >
                          {isSelected ? '✓' : '+'} {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="max-w-md">
                  <label className="block text-sm font-bold text-gray-700 mb-1">VIN Pattern Matching (RegEx)</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-[#E12F2F] outline-none" value={vinPattern} onChange={e => setVinPattern(e.target.value)} placeholder="e.g. ^(WP0|WP1)" />
                  <p className="text-xs text-gray-500 mt-1">Strict 17-character VIN pattern binding for automated fitment verification.</p>
                </div>
              </div>
            </section>

            {/* Interactive Asset Upload */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">4. Interactive Asset Upload</h3>
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex items-center justify-center cursor-pointer hover:border-[#E12F2F]/50 hover:bg-red-50/30 transition-all group overflow-hidden relative"
              >
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                {previewUrl ? (
                  <>
                    <Image src={previewUrl} alt="Preview" fill className="object-contain p-2" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#E12F2F]">
                    <UploadCloud className="w-8 h-8" />
                    <p className="text-sm font-bold">Drag & drop or click to upload</p>
                  </div>
                )}
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title || basePrice === '' || stockQuantity === ''}
                className="px-6 py-2 bg-[#E12F2F] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" /> Save / Defer Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Product Asset</th>
                <th className="p-4 font-bold">Base Price</th>
                <th className="p-4 font-bold">Stock</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${!product.isVisible ? 'opacity-50' : ''}`}>
                  <td className="p-4 flex gap-4 items-center">
                    <div className="relative w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.image ? (
                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{product.title}</p>
                      <p className="text-xs text-gray-500">{product.brand} | {product.category}</p>
                      {product.compatibilityTags && product.compatibilityTags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {product.compatibilityTags.map(tag => (
                            <span key={tag} className="text-[9px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-500">EGP</span>
                      <input
                        type="number"
                        className="w-24 bg-transparent border-b border-gray-200 focus:border-[#E12F2F] outline-none text-sm font-bold"
                        value={product.basePrice}
                        onChange={(e) => handleInlineUpdate(product.id, 'basePrice', parseFloat(e.target.value))}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-16 bg-transparent border-b border-gray-200 focus:border-[#E12F2F] outline-none text-sm font-bold"
                        value={product.stockQuantity}
                        onChange={(e) => handleInlineUpdate(product.id, 'stockQuantity', parseInt(e.target.value))}
                      />
                      {product.stockQuantity <= product.lowStockThreshold && (
                        <AlertCircle className={`w-4 h-4 ${product.stockQuantity === 0 ? 'text-red-500' : 'text-orange-500'}`} />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${product.stockQuantity === 0 ? 'bg-red-100 text-red-700' : product.stockQuantity <= product.lowStockThreshold ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-800'
                      }`}>
                      {product.stockQuantity === 0 ? 'Out of Stock' : product.stockQuantity <= product.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleProductVisibility(product.id)}
                        className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        title="Toggle Visibility"
                      >
                        {product.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditForm(product); }}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-bold">No products found</p>
                    <p className="text-sm mt-1">Add your first product to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null) }}>
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-2xl flex flex-col gap-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex gap-4 items-center">
                {selectedProduct.image ? (
                  <div className="relative w-16 h-16 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <Image src={selectedProduct.image} alt={selectedProduct.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="relative w-16 h-16 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedProduct.title}</h2>
                  <p className="text-sm text-gray-500 font-medium">{selectedProduct.brand} | {selectedProduct.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const p = selectedProduct; setSelectedProduct(null); openEditForm(p); }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Metrics & Dimensions</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Outer Diameter</span><span className="text-sm font-bold text-gray-900">{selectedProduct.characteristics?.outerDiameterMM || 'N/A'} mm</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Thickness/Depth</span><span className="text-sm font-bold text-gray-900">{selectedProduct.characteristics?.thicknessMM || 'N/A'} mm</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Bolt Hole Circle</span><span className="text-sm font-bold text-gray-900">{selectedProduct.characteristics?.boltHoleCircleMM || 'N/A'} mm</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Structural Length</span><span className="text-sm font-bold text-gray-900">{selectedProduct.characteristics?.lengthMM || 'N/A'} mm</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Thread Pitch</span><span className="text-sm font-bold text-gray-900">{selectedProduct.characteristics?.threadSize || 'N/A'}</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Vehicle Fitment</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100 h-full">
                  <div>
                    <span className="text-sm text-gray-500 block mb-2">Compatible Fleets</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.compatibilityTags?.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-black text-white text-xs font-bold rounded uppercase">{tag}</span>
                      ))}
                      {(!selectedProduct.compatibilityTags || selectedProduct.compatibilityTags.length === 0) && (
                        <span className="text-sm font-bold text-gray-400">Universal Fit</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">VIN Regex Pattern</span>
                    <code className="text-sm font-mono font-bold text-[#E12F2F] bg-red-50 px-2 py-1 rounded border border-red-100">
                      {selectedProduct.vinCompatibilityPattern || '.*'}
                    </code>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

import { WorkspaceLayout } from '@/components/dashboard/WorkspaceLayout';
import { useAuthStore } from '@/store/authStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AlertTriangle } from 'lucide-react';

export default function MerchantInventoryPage() {
  const { user } = useRequireAuth();
  const { user: storeUser } = useAuthStore();
  const merchantId = storeUser?.email ?? 'merchant_demo';

  if (!user || user.role !== 'Merchant') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">You do not have permission to view the merchant dashboard.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-3 border-gray-200 border-t-[#E12F2F] rounded-full animate-spin" /></div>}>
      <WorkspaceLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display text-gray-900">Inventory Management</h1>
              <p className="text-gray-500 font-medium mt-1">Manage your product catalog and stock levels</p>
            </div>
          </div>
          <InventoryTab merchantId={merchantId} />
        </div>
      </WorkspaceLayout>
    </Suspense>
  );
}

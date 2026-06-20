'use client';

import React, { useState } from 'react';
import { Package, Plus, Save, Trash2, Edit3, EyeOff, Eye, AlertCircle } from 'lucide-react';
import { useLocalDB, GlobalProduct } from '../../../store/localDB';

export function InventoryTab({ merchantId }: { merchantId: string }) {
  const { globalProducts, addProduct, updateProduct, deleteProduct, toggleProductVisibility } = useLocalDB();
  const products = globalProducts.filter((p) => p.merchantId === merchantId);

  const [isAdding, setIsAdding] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<GlobalProduct>>({
    title: '',
    brand: '',
    mpn: '',
    category: '',
    basePrice: 0,
    salePrice: 0,
    itemCost: 0,
    fitment: '',
    weight: 0,
    condition: 'New',
    sku: '',
    stockQuantity: 0,
    lowStockThreshold: 5,
    workshopDeliveryEnabled: false,
    isVisible: true,
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));
  const handleSubmit = () => {
    addProduct({ ...formData, merchantId } as any);
    setIsAdding(false);
    setStep(1);
    setFormData({
      title: '', brand: '', mpn: '', category: '',
      basePrice: 0, salePrice: 0, itemCost: 0,
      fitment: '', weight: 0, condition: 'New',
      sku: '', stockQuantity: 0, lowStockThreshold: 5,
      workshopDeliveryEnabled: false, isVisible: true,
    });
  };

  const handleInlineUpdate = (id: string, field: keyof GlobalProduct, value: any) => {
    updateProduct(id, { [field]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-150 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Inventory Control Desk</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your active listings and add new products.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#E12F2F] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Product</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`flex items-center gap-2 ${step === i ? 'text-[#E12F2F]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === i ? 'bg-red-50' : 'bg-gray-50'}`}>
                  {i}
                </div>
                <span className="font-bold text-sm hidden md:block">
                  {i === 1 && 'Identity'}
                  {i === 2 && 'Pricing'}
                  {i === 3 && 'Compatibility'}
                  {i === 4 && 'Fulfillment'}
                </span>
                {i < 4 && <div className="w-8 h-px bg-gray-200 ml-2" />}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Title</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. High Performance Brake Pads" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g. Brembo" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">MPN</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.mpn} onChange={e => setFormData({ ...formData, mpn: e.target.value })} placeholder="Manufacturer Part Number" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Brakes" />
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Base Price ($)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Sale Price ($)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.salePrice} onChange={e => setFormData({ ...formData, salePrice: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Item Cost ($) - Internal</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.itemCost} onChange={e => setFormData({ ...formData, itemCost: parseFloat(e.target.value) })} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Fitment Rules</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.fitment} onChange={e => setFormData({ ...formData, fitment: e.target.value })} placeholder="e.g. Fits: 2021-2024 Porsche 911 GT3 RS" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Weight (kg)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.weight} onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Condition</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                    <option>New</option>
                    <option>Refurbished</option>
                    <option>OEM</option>
                    <option>Aftermarket</option>
                  </select>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">SKU / Barcode</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Initial Stock Quantity</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Low Stock Threshold</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" value={formData.lowStockThreshold} onChange={e => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })} />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded text-[#E12F2F] focus:ring-[#E12F2F]" checked={formData.workshopDeliveryEnabled} onChange={e => setFormData({ ...formData, workshopDeliveryEnabled: e.target.checked })} />
                    <span className="text-sm font-bold text-gray-700">Allow direct workshop delivery</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 disabled:opacity-50"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-800"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#E12F2F] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 shadow-lg shadow-red-500/25"
              >
                <Save className="w-4 h-4" /> Save Product
              </button>
            )}
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Stock</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${!product.isVisible ? 'opacity-50' : ''}`}>
                  <td className="p-4">
                    <p className="text-sm font-bold text-gray-900">{product.title}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku} | {product.category}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-500">$</span>
                      <input
                        type="number"
                        className="w-20 bg-transparent border-b border-gray-200 focus:border-[#E12F2F] outline-none text-sm font-bold"
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      product.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isVisible ? 'Live' : 'Draft'}
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
                        onClick={() => deleteProduct(product.id)}
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
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Bell, Settings, Car, ShieldAlert, Check, RefreshCw, Trash2, Plus, X } from 'lucide-react';
import { WorkspaceLayout } from '../../components/dashboard/WorkspaceLayout';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';

export default function ProfilePage() {
  const { 
    user, 
    vehicles, 
    updateProfile, 
    addVehicle, 
    removeVehicle, 
    addNotification 
  } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  // Profile coordinates states
  const [name, setName] = useState(user?.name || 'Ahmed Al-Masri');
  const [email, setEmail] = useState(user?.email || 'ahmed@example.com');
  const [phone, setPhone] = useState(user?.phone || '+962 7 9876 5432');
  const [address, setAddress] = useState(user?.address || 'Amman, Jordan');
  const [notify, setNotify] = useState(user?.notificationsEnabled ?? true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Security password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Garage quick edit states
  const [showAddModal, setShowAddModal] = useState(false);
  const [vBrand, setVBrand] = useState('');
  const [vModel, setVModel] = useState('');
  const [vYear, setVYear] = useState('');
  const [vMileage, setVMileage] = useState('');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsUpdating(false);

    updateProfile({ name, email, phone, address, notificationsEnabled: notify });
    setSuccess(true);
    addNotification('Profile Updated 👤', 'Your account settings have been successfully synchronized.', 'system');
    addToast({ type: 'success', title: 'Profile Saved', message: 'Account settings updated successfully.' });
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');

    // Validate
    if (!oldPassword) {
      setPwdError('Current password is required.');
      addToast({ type: 'error', title: 'Missing Field', message: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      addToast({ type: 'error', title: 'Too Short', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      addToast({ type: 'error', title: 'Mismatch', message: 'New password and confirmation do not match.' });
      return;
    }

    setIsChangingPwd(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsChangingPwd(false);

    setPwdSuccess(true);
    addNotification('Password Updated 🔐', 'Your security passcode credentials have been reset.', 'system');
    addToast({ type: 'success', title: 'Password Changed', message: 'Your password has been updated successfully.' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwdError('');
    setTimeout(() => setPwdSuccess(false), 2000);
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vBrand || !vModel || !vYear || !vMileage) return;

    setIsAddingVehicle(true);
    await new Promise((r) => setTimeout(r, 600));

    addVehicle({
      brand: vBrand,
      model: vModel,
      year: Number(vYear),
      mileage: Number(vMileage),
      status: 'Perfect',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=80'
    });

    addNotification('Vehicle Added 🏎️', `${vBrand} ${vModel} registered to your profile garage.`, 'system');
    addToast({ type: 'success', title: 'Vehicle Added', message: `${vBrand} ${vModel} is now in your garage.` });

    setVBrand('');
    setVModel('');
    setVYear('');
    setVMileage('');
    setShowAddModal(false);
    setIsAddingVehicle(false);
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-8 select-none max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile & Preferences</h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">Configure profile coordinates, dynamic passcodes and registered cars.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Coordinates Account settings */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-[#FF2D2D]" />
                Account Coordinates
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isUpdating}
                      className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isUpdating}
                      className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isUpdating}
                      className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Registered Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={isUpdating}
                      className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 select-none">
                  <div className="flex items-center">
                    <input
                      id="notifyToggle"
                      type="checkbox"
                      checked={notify}
                      onChange={(e) => setNotify(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-gray-300 focus:ring-red-400 accent-[#FF2D2D] cursor-pointer"
                    />
                    <label htmlFor="notifyToggle" className="ml-2.5 text-sm font-semibold text-gray-500 cursor-pointer">
                      Enable real-time dashboard notifications
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="h-10 bg-[#FF2D2D] hover:bg-red-600 text-white rounded-xl text-xs font-bold border-none px-6"
                  >
                    {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : success ? <Check className="w-4 h-4 animate-bounce" /> : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Passcodes security settings */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-[#FF2D2D]" />
                Security passcode reset
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={isChangingPwd}
                    className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isChangingPwd}
                      className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isChangingPwd}
                      className="w-full h-11 px-4 rounded-xl border border-gray-250 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Error feedback */}
                {pwdError && (
                  <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                    ⚠️ {pwdError}
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isChangingPwd}
                    className="h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold border-none px-6"
                  >
                    {isChangingPwd ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : pwdSuccess ? <Check className="w-4 h-4 animate-bounce" /> : 'Reset Password'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right sidebar column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Garage vehicle card lists */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Car className="w-4.5 h-4.5 text-[#FF2D2D]" />
                  Garage Manager
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-[#FF2D2D]/10 hover:text-[#FF2D2D] transition-colors border border-gray-200"
                >
                  <Plus className="w-4.5 h-4.5" />
                </motion.button>
              </div>

              <div className="space-y-3.5">
                {vehicles.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6 font-semibold">Your garage list is empty.</p>
                ) : (
                  vehicles.map((v) => (
                    <div key={v.id} className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 border border-gray-150">
                      <div>
                        <p className="font-extrabold text-gray-900 text-xs">{v.brand} {v.model}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{v.year} · {v.mileage.toLocaleString()} mi</p>
                      </div>
                      <button
                        onClick={() => {
                          removeVehicle(v.id);
                          addToast({ type: 'info', title: 'Vehicle Removed', message: `${v.brand} ${v.model} removed from garage.` });
                        }}
                        className="w-7 h-7 bg-white hover:bg-red-50 border border-gray-150 hover:border-red-200 text-gray-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add vehicle modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 top-1/4 sm:top-1/3 max-w-md mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-150 p-6 z-55"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-gray-900 text-lg">Add New Vehicle</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Make / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Porsche"
                    value={vBrand}
                    onChange={(e) => setVBrand(e.target.value)}
                    disabled={isAddingVehicle}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 911 GT3 RS"
                    value={vModel}
                    onChange={(e) => setVModel(e.target.value)}
                    disabled={isAddingVehicle}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Year</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 2024"
                      value={vYear}
                      onChange={(e) => setVYear(e.target.value)}
                      disabled={isAddingVehicle}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Current Mileage</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 3500"
                      value={vMileage}
                      onChange={(e) => setVMileage(e.target.value)}
                      disabled={isAddingVehicle}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-[#FF2D2D]/40 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button type="submit" fullWidth disabled={isAddingVehicle} className="h-12 bg-[#FF2D2D] text-white hover:bg-red-600 font-bold">
                    {isAddingVehicle ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      'Park Vehicle In Garage'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </WorkspaceLayout>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, LogOut, Settings, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function DashboardNavbar() {
  const router = useRouter();
  const { user, notifications, logout, markNotificationsAsRead } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Role-isolated feed: only show notifications targeted at this specific user
  const activeNotifications = notifications.filter(
    (n) => n.targetRole === user?.role && n.targetUserId === user?.email
  );
  const unreadCount = activeNotifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 sm:px-8 select-none transition-colors duration-300">
      {/* Search / Greetings */}
      <div>
        <Link href="/" className="cursor-pointer">
          <h2 className="text-base font-extrabold leading-none text-slate-900 hover:text-[#E62424] transition-colors">
            {user?.role === 'Admin' ? 'Automate Platform Controller' : user?.role === 'Merchant' ? 'Automate Seller Central' : 'Automate Workspace'}
          </h2>
          <p className="text-xs font-semibold mt-1 hidden sm:block text-slate-500">
            {user?.role === 'Admin' ? 'System Master Node v2.0' : user?.role === 'Merchant' ? 'Merchant Dashboard v1.0.4' : 'SaaS Engine Premium v1.0.4'}
          </p>
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 relative">
        {/* Role Badge */}
        {user && (
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#E62424]/10 border border-[#E62424]/20 text-[#E62424] text-[11px] font-bold tracking-wide uppercase">
            {user.role}
          </span>
        )}

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center relative transition-colors cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5 text-slate-600" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#E62424] text-white text-[9px] font-bold shadow-[0_0_8px_rgba(230,36,36,0.3)]"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E62424]" />
                      <span className="font-bold text-slate-900 text-sm">Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markNotificationsAsRead}
                        className="text-xs font-bold text-[#E62424] hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 bg-white">
                    {activeNotifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs font-medium">
                        No notifications yet.
                      </div>
                    ) : (
                      activeNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 transition-colors ${n.unread ? 'bg-[#E62424]/5' : 'bg-transparent'}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                              <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-1">{n.message}</p>
                              <span className="text-[10px] text-slate-400 font-bold block mt-1.5">{n.time}</span>
                            </div>
                            {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#E62424] flex-shrink-0 mt-1" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors"
          >
            <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm shadow-inner overflow-hidden relative ${user?.role === 'Merchant' ? 'bg-[#E62424] text-white [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]' : 'rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700'}`}>
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="object-cover w-full h-full" />
              ) : (
                user?.name.charAt(0) || 'M'
              )}
            </div>
            <span className="text-xs font-bold text-slate-700 hidden sm:block">
              {user?.name.split(' ')[0] || 'User'}
            </span>
          </motion.button>

          {/* Profile Dropdown List */}
          <AnimatePresence>
            {showProfileDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 flex flex-col bg-slate-50/50">
                    <span className="font-extrabold text-slate-900 text-sm">{user?.name}</span>
                    <span className="text-xs text-slate-500 mt-0.5 truncate">{user?.email}</span>
                  </div>
                  <div className="p-2 space-y-1 bg-white">
                    <Link href="/profile" onClick={() => setShowProfileDropdown(false)}>
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer">
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings Profile
                      </div>
                    </Link>
                    <div
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

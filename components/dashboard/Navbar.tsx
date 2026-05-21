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

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-gray-150 flex items-center justify-between px-6 sm:px-8 select-none">
      {/* Search / Greetings */}
      <div>
        <h2 className="text-base font-extrabold text-gray-900 leading-none">
          Automate Workspace
        </h2>
        <p className="text-xs text-gray-400 font-semibold mt-1 hidden sm:block">
          SaaS Engine Premium v1.0.4
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 relative">
        {/* Role Badge */}
        {user && (
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 text-[#FF2D2D] text-[11px] font-bold tracking-wide uppercase">
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
            className="w-10 h-10 rounded-xl bg-gray-100/70 border border-gray-200/50 hover:bg-gray-100 flex items-center justify-center relative transition-colors"
          >
            <Bell className="w-4.5 h-4.5 text-gray-600" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF2D2D] text-white text-[9px] font-bold shadow-[0_0_8px_rgba(255,45,45,0.5)]"
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
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-150 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF2D2D]" />
                      <span className="font-bold text-gray-900 text-sm">Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markNotificationsAsRead}
                        className="text-xs font-bold text-[#FF2D2D] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-gray-400 text-xs font-medium">
                        No notifications.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 transition-colors ${n.unread ? 'bg-red-50/20' : 'bg-transparent'}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-gray-900 leading-snug">{n.title}</h4>
                              <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-1">{n.message}</p>
                              <span className="text-[10px] text-gray-400 font-bold block mt-1.5">{n.time}</span>
                            </div>
                            {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D2D] flex-shrink-0 mt-1" />}
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
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200/50 cursor-pointer transition-colors"
          >
            <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-inner overflow-hidden relative">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="object-cover w-full h-full" />
              ) : (
                'A'
              )}
            </div>
            <span className="text-xs font-bold text-gray-800 hidden sm:block">
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
                  className="absolute right-0 mt-3 w-56 bg-white border border-gray-150 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 flex flex-col">
                    <span className="font-extrabold text-gray-900 text-sm">{user?.name}</span>
                    <span className="text-xs text-gray-400 mt-0.5 truncate">{user?.email}</span>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link href="/profile" onClick={() => setShowProfileDropdown(false)}>
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer">
                        <Settings className="w-4 h-4" />
                        Settings Profile
                      </div>
                    </Link>
                    <div
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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

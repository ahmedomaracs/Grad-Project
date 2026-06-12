'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useToastStore, ToastType } from '../../store/toastStore';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
  error: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
};

const borderMap: Record<ToastType, string> = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
};

const bgMap: Record<ToastType, string> = {
  success: 'bg-green-500/5',
  error: 'bg-red-500/5',
  warning: 'bg-amber-500/5',
  info: 'bg-blue-500/5',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95, x: 80 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-l-4 ${borderMap[toast.type]} ${bgMap[toast.type]} bg-white shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-md`}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-bold text-gray-900 leading-tight">{toast.title}</p>
              )}
              <p className={`text-xs font-semibold text-gray-500 leading-relaxed ${toast.title ? 'mt-0.5' : ''}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

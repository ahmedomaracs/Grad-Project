'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { ToastContainer } from '../components/ui/Toast';

/**
 * Client-side provider that:
 * 1. Rehydrates the auth store on mount
 * 2. Renders the global ToastContainer for notifications
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

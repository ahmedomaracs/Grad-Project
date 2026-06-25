'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export function useRequireRole(requiredRole: UserRole) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (_hasHydrated) {
      if (!isAuthenticated) {
        router.push('/signin');
      } else if (user?.role !== requiredRole) {
        addToast({ type: 'error', title: 'Access Denied', message: `You do not have the ${requiredRole} role.` });
        router.push('/dashboard');
      }
    }
  }, [_hasHydrated, isAuthenticated, user, requiredRole, router, addToast]);

  return { isLoading: !_hasHydrated || (!isAuthenticated && _hasHydrated) || (_hasHydrated && user?.role !== requiredRole), user };
}

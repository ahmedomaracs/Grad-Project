'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export function useRequireRole(requiredRole: UserRole) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const [hydrated, setHydrated] = useState(false);

  // Zustand persistent store hydration check
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      if (!isAuthenticated) {
        router.push('/signin');
      } else if (user?.role !== requiredRole) {
        addToast({ type: 'error', title: 'Access Denied', message: `You do not have the ${requiredRole} role.` });
        router.push('/dashboard');
      }
    }
  }, [hydrated, isAuthenticated, user, requiredRole, router, addToast]);

  return { isLoading: !hydrated || (!isAuthenticated && hydrated) || (hydrated && user?.role !== requiredRole), user };
}

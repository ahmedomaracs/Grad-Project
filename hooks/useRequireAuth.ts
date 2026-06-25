'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/signin');
    }
  }, [_hasHydrated, isAuthenticated, router]);

  return { isLoading: !_hasHydrated || (!isAuthenticated && _hasHydrated), user };
}

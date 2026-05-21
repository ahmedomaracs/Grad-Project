'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // Zustand persistent store hydration check
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push('/signin');
    }
  }, [hydrated, isAuthenticated, router]);

  return { isLoading: !hydrated || (!isAuthenticated && hydrated), user };
}

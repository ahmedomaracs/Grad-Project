import { UserRole } from '../store/authStore';

/**
 * Returns the appropriate dashboard path for a given user role.
 * - Client → /dashboard
 * - Mechanic → /dashboard (mechanic-specific views handled inside)
 * - Partner → /admin
 */
export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case 'Partner':
      return '/admin';
    case 'Mechanic':
      return '/dashboard/mechanic';
    case 'Merchant':
      return '/dashboard/merchant';
    case 'Client':
    default:
      return '/dashboard';
  }
}

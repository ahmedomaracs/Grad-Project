'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';

// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface MechanicProfile {
  id: string;
  name: string;
  /** Email doubles as the targetUserId key for cross-role notification routing */
  email: string;
  specialization: string;
  rating: number;
  garageName?: string;
  available: boolean;
  joinedAt: string;
}

export interface GlobalBooking {
  id: string;
  clientUserId: string;
  clientName: string;
  mechanicId: string;
  mechanicName: string;
  vehicle: string;
  serviceType: string;
  scheduledAt: string;
  status: 'Pending' | 'Confirmed' | 'Checked-In' | 'In-Progress' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface GlobalOrder {
  id: string;
  clientUserId: string;
  clientName: string;
  merchantId: string;
  merchantName: string;
  productLabel: string;
  totalPrice: number;
  deliveryType: 'standard' | 'workshop';
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface GlobalProduct {
  id: string;
  merchantId: string;
  // Step 1
  title: string;
  brand: string;
  mpn: string;
  category: string;
  // Step 2
  basePrice: number;
  salePrice: number;
  itemCost: number;
  // Step 3
  fitment: string;
  weight: number;
  condition: string;
  // Step 4
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  workshopDeliveryEnabled: boolean;
  isVisible: boolean;
  createdAt: string;
}

export interface GlobalNotification {
  id: string;
  targetRole: 'Client' | 'Mechanic' | 'Merchant';
  /** Matches user.email — the stable cross-session identity key */
  targetUserId: string;
  title: string;
  message: string;
  type: 'booking' | 'order' | 'system' | 'wallet' | 'reminder';
  unread: boolean;
  link?: string;
  createdAt: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_MECHANICS: MechanicProfile[] = [
  {
    id: 'm1',
    name: 'Marcus Vance',
    email: 'm1@automate.com',
    specialization: 'Full Engine Diagnostics',
    rating: 4.9,
    garageName: 'Apex Precision Automotive',
    available: true,
    joinedAt: 'May 2026',
  },
  {
    id: 'm2',
    name: 'Sarah Connor',
    email: 'm2@automate.com',
    specialization: 'EV Tuning & Battery Calibration',
    rating: 4.8,
    garageName: 'Electric Garage Co.',
    available: true,
    joinedAt: 'May 2026',
  },
  {
    id: 'm3',
    name: 'Dinesh Chawla',
    email: 'm3@automate.com',
    specialization: 'Performance Exhausts & ECU Remapping',
    rating: 4.95,
    garageName: 'Classic & Performance Care',
    available: false,
    joinedAt: 'April 2026',
  },
  {
    id: 'm4',
    name: 'Lena Müller',
    email: 'm4@automate.com',
    specialization: 'BMW / Mercedes-Benz / Audi Systems',
    rating: 4.85,
    garageName: 'German Auto Experts',
    available: true,
    joinedAt: 'May 2026',
  },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface LocalDBStore {
  // Global tables
  mechanicsRegistry: MechanicProfile[];
  globalBookings: GlobalBooking[];
  globalOrders: GlobalOrder[];
  globalProducts: GlobalProduct[];
  globalNotifications: GlobalNotification[];

  // ── Mechanic Registry ────────────────────────────────────────────────────
  /** On Mechanic Signup: push new profile to registry (idempotent by id/email). */
  registerMechanic: (profile: Omit<MechanicProfile, 'joinedAt'>) => void;
  setMechanicAvailability: (mechanicId: string, available: boolean) => void;

  // ── Global Bookings ──────────────────────────────────────────────────────
  /** On Client Booking: create booking record + push targeted Mechanic alert. */
  appendBooking: (booking: Omit<GlobalBooking, 'id' | 'createdAt'>) => GlobalBooking;
  /** On Advance Status: rewrite booking record + push targeted Client alert. */
  advanceBookingStatus: (
    bookingId: string,
    status: GlobalBooking['status'],
    clientUserId: string,
    serviceType: string
  ) => void;

  // ── Global Orders ────────────────────────────────────────────────────────
  /** On Client Purchase: create order record + push targeted Merchant alert. */
  appendOrder: (order: Omit<GlobalOrder, 'id' | 'createdAt'>) => GlobalOrder;
  /** On Merchant Shipped: rewrite order record + push targeted Client alert. */
  advanceOrderStatus: (
    orderId: string,
    status: GlobalOrder['status'],
    clientUserId: string,
    productLabel: string
  ) => void;

  // ── Global Products ────────────────────────────────────────────────────────
  addProduct: (product: Omit<GlobalProduct, 'id' | 'createdAt'>) => GlobalProduct;
  updateProduct: (productId: string, updates: Partial<GlobalProduct>) => void;
  deleteProduct: (productId: string) => void;
  toggleProductVisibility: (productId: string) => void;

  // ── Global Notifications ─────────────────────────────────────────────────
  pushGlobalNotification: (n: Omit<GlobalNotification, 'id' | 'createdAt'>) => void;
  getNotificationsFor: (role: GlobalNotification['targetRole'], userId: string) => GlobalNotification[];
  markGlobalNotificationsRead: (role: GlobalNotification['targetRole'], userId: string) => void;
  deleteGlobalNotification: (id: string) => void;
}

// ─── localStorage Key ─────────────────────────────────────────────────────────
const LOCAL_DB_KEY = 'automate-localdb';

// ─── Store Implementation ─────────────────────────────────────────────────────

export const useLocalDB = create<LocalDBStore>()(
  persist(
    (set, get) => ({
      mechanicsRegistry: SEED_MECHANICS,
      globalBookings: [],
      globalOrders: [],
      globalProducts: [],
      globalNotifications: [],

      // ── Mechanic Registry ──────────────────────────────────────────────────
      registerMechanic: (profile) => {
        const existing = get().mechanicsRegistry.find(
          (m) => m.id === profile.id || m.email === profile.email
        );
        if (existing) return; // idempotent — no duplicate registrations
        const joinedAt = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        set((s) => ({
          mechanicsRegistry: [...s.mechanicsRegistry, { ...profile, joinedAt }],
        }));
      },

      setMechanicAvailability: (mechanicId, available) => {
        set((s) => ({
          mechanicsRegistry: s.mechanicsRegistry.map((m) =>
            m.id === mechanicId ? { ...m, available } : m
          ),
        }));
      },

      // ── Global Bookings ────────────────────────────────────────────────────
      appendBooking: (booking) => {
        const id = 'gb_' + Math.random().toString(36).substr(2, 9);
        const createdAt = new Date().toISOString();
        const newBooking: GlobalBooking = { ...booking, id, createdAt };
        set((s) => ({ globalBookings: [newBooking, ...s.globalBookings] }));
        // Targeted Mechanic notification
        get().pushGlobalNotification({
          targetRole: 'Mechanic',
          targetUserId: booking.mechanicId,
          title: 'New Booking Request 🔧',
          message: `New pending booking from ${booking.clientName} for ${booking.serviceType}.`,
          type: 'booking',
          unread: true,
          link: '/dashboard/mechanic',
        });
        return newBooking;
      },

      advanceBookingStatus: (bookingId, status, clientUserId, serviceType) => {
        set((s) => ({
          globalBookings: s.globalBookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          ),
        }));
        // Targeted Client notification
        get().pushGlobalNotification({
          targetRole: 'Client',
          targetUserId: clientUserId,
          title: 'Appointment Update 🛠️',
          message: `Your vehicle status is now "${status}" for your ${serviceType} appointment.`,
          type: 'booking',
          unread: true,
          link: '/dashboard',
        });
      },

      // ── Global Orders ──────────────────────────────────────────────────────
      appendOrder: (order) => {
        const id = 'go_' + Math.random().toString(36).substr(2, 9);
        const createdAt = new Date().toISOString();
        const newOrder: GlobalOrder = { ...order, id, createdAt };
        set((s) => ({ globalOrders: [newOrder, ...s.globalOrders] }));
        // Targeted Merchant notification
        get().pushGlobalNotification({
          targetRole: 'Merchant',
          targetUserId: order.merchantId,
          title: 'New Order Received 🛒',
          message: `Order #${id} from ${order.clientName} for ${order.productLabel}.`,
          type: 'order',
          unread: true,
          link: '/dashboard/merchant',
        });
        return newOrder;
      },

      advanceOrderStatus: (orderId, status, clientUserId, productLabel) => {
        set((s) => ({
          globalOrders: s.globalOrders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        }));
        // Only notify Client on Shipped
        if (status === 'Shipped') {
          get().pushGlobalNotification({
            targetRole: 'Client',
            targetUserId: clientUserId,
            title: 'Order In Transit 📦',
            message: `Your ${productLabel} is on the way. Hang tight!`,
            type: 'order',
            unread: true,
            link: '/dashboard',
          });
        }
      },

      // ── Global Products ────────────────────────────────────────────────────
      addProduct: (product) => {
        const id = 'gp_' + Math.random().toString(36).substr(2, 9);
        const createdAt = new Date().toISOString();
        const newProduct: GlobalProduct = { ...product, id, createdAt };
        set((s) => ({ globalProducts: [newProduct, ...s.globalProducts] }));
        return newProduct;
      },

      updateProduct: (productId, updates) => {
        set((s) => ({
          globalProducts: s.globalProducts.map((p) =>
            p.id === productId ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProduct: (productId) => {
        set((s) => ({
          globalProducts: s.globalProducts.filter((p) => p.id !== productId),
        }));
      },
      
      toggleProductVisibility: (productId) => {
        set((s) => ({
          globalProducts: s.globalProducts.map((p) =>
            p.id === productId ? { ...p, isVisible: !p.isVisible } : p
          ),
        }));
      },

      // ── Global Notifications ───────────────────────────────────────────────
      pushGlobalNotification: (notification) => {
        const id = 'gn_' + Math.random().toString(36).substr(2, 9);
        const createdAt = new Date().toISOString();
        set((s) => ({
          globalNotifications: [{ ...notification, id, createdAt }, ...s.globalNotifications],
        }));
      },

      getNotificationsFor: (role, userId) =>
        get().globalNotifications.filter(
          (n) => n.targetRole === role && n.targetUserId === userId
        ),

      markGlobalNotificationsRead: (role, userId) => {
        set((s) => ({
          globalNotifications: s.globalNotifications.map((n) =>
            n.targetRole === role && n.targetUserId === userId ? { ...n, unread: false } : n
          ),
        }));
      },

      deleteGlobalNotification: (id) => {
        set((s) => ({
          globalNotifications: s.globalNotifications.filter((n) => n.id !== id),
        }));
      },
    }),
    {
      name: LOCAL_DB_KEY,
      // skipHydration: false — we want auto-hydration on mount
      // Zustand persist automatically re-hydrates from the storage event
      // when another tab writes to the same key, giving us cross-tab sync.
    }
  )
);

// ─── Cross-Tab Storage Sync Hook ──────────────────────────────────────────────
/**
 * Mount once inside WorkspaceLayout (or any layout shell) to guarantee:
 * 1. The localDB store is hydrated from localStorage on component mount.
 * 2. Whenever another browser tab writes to the localDB key (e.g., a Merchant
 *    ships an order from Tab B), Tab A's React components re-render with the
 *    updated data — no polling, no websockets needed.
 */
export function useStorageSyncListener() {
  useEffect(() => {
    // Force re-hydration on every mount to pick up changes from other tabs
    useLocalDB.persist.rehydrate();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCAL_DB_KEY && event.newValue !== null) {
        // Another tab updated the localDB — re-hydrate this tab's store
        useLocalDB.persist.rehydrate();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
}

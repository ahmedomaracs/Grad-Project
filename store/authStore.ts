'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'Client' | 'Mechanic' | 'Partner';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  status: 'Perfect' | 'Needs Attention' | 'In Service';
  image?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  garageName: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  distance: string;
  price: string;
  available: boolean;
  avatar: string;
  isFavorite?: boolean;
}

export interface Order {
  id: string;
  productName: string;
  brand: string;
  price: number;
  status: 'Delivered' | 'In Transit' | 'Pending';
  date: string;
  image: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'booking' | 'purchase';
  title: string;
  amount: number;
  date: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'booking' | 'order' | 'system';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  address: string;
  notificationsEnabled: boolean;
}

interface AuthStore {
  user: UserProfile | null;
  vehicles: Vehicle[];
  mechanics: Mechanic[];
  orders: Order[];
  transactions: WalletTransaction[];
  notifications: NotificationItem[];
  walletBalance: number;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  removeVehicle: (id: string) => void;
  toggleFavoriteMechanic: (id: string) => void;
  addTransaction: (type: 'deposit' | 'booking' | 'purchase', title: string, amount: number) => void;
  addNotification: (title: string, message: string, type: 'booking' | 'order' | 'system') => void;
  markNotificationsAsRead: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      walletBalance: 420.50,
      vehicles: [
        {
          id: 'v1',
          brand: 'Porsche',
          model: '911 Carrera S',
          year: 2022,
          mileage: 14200,
          status: 'Perfect',
          image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500&auto=format&fit=crop&q=80',
        },
        {
          id: 'v2',
          brand: 'Audi',
          model: 'RS e-tron GT',
          year: 2023,
          mileage: 5100,
          status: 'Needs Attention',
          image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500&auto=format&fit=crop&q=80',
        },
      ],
      mechanics: [
        {
          id: 'm1',
          name: 'Marcus Vance',
          garageName: 'Apex Precision Automotive',
          rating: 4.9,
          reviewsCount: 142,
          specialties: ['Engine Diagnostics', 'Brake Systems', 'Porsche Vetted'],
          distance: '2.4 miles',
          price: '$$$',
          available: true,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isFavorite: true,
        },
        {
          id: 'm2',
          name: 'Sarah Connor',
          garageName: 'Electric Garage Co.',
          rating: 4.8,
          reviewsCount: 98,
          specialties: ['EV Tuning', 'Battery Calibration', 'Tesla Specialist'],
          distance: '4.1 miles',
          price: '$$',
          available: true,
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          isFavorite: false,
        },
        {
          id: 'm3',
          name: 'Dinesh Chawla',
          garageName: 'Classic & Performance Care',
          rating: 4.95,
          reviewsCount: 203,
          specialties: ['Performance Exhausts', 'Suspension Alignment'],
          distance: '5.8 miles',
          price: '$$$',
          available: false,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          isFavorite: true,
        },
      ],
      orders: [
        {
          id: 'o1',
          productName: 'Premium Ceramic Brake Pads',
          brand: 'Brembo',
          price: 89.99,
          status: 'In Transit',
          date: 'May 19, 2026',
          image: '/shop/brake-pads.jpg',
        },
        {
          id: 'o2',
          productName: 'High-Flow Engine Oil Filter',
          brand: 'Bosch',
          price: 24.99,
          status: 'Delivered',
          date: 'May 15, 2026',
          image: '/shop/oil-filter.jpg',
        },
      ],
      transactions: [
        { id: 't1', type: 'purchase', title: 'Brembo Brake Pads', amount: -89.99, date: 'May 19, 2026' },
        { id: 't2', type: 'deposit', title: 'Top-up via Stripe', amount: 200.00, date: 'May 18, 2026' },
        { id: 't3', type: 'booking', title: 'Porsche Maintenance Service', amount: -150.00, date: 'May 14, 2026' },
      ],
      notifications: [
        {
          id: 'n1',
          title: 'Order Dispatched 📦',
          message: 'Your Brembo Ceramic Brake Pads are on their way and will arrive tomorrow.',
          time: '2 hours ago',
          unread: true,
          type: 'order',
        },
        {
          id: 'n2',
          title: 'Booking Confirmed 🔧',
          message: 'Appointment with Marcus Vance at Apex Precision is scheduled for May 22 at 10:00 AM.',
          time: '1 day ago',
          unread: false,
          type: 'booking',
        },
        {
          id: 'n3',
          title: 'New Feature Available Sparkles',
          message: 'You can now link multiple vehicles to your diagnostic wallet for automated insurance payouts.',
          time: '3 days ago',
          unread: false,
          type: 'system',
        },
      ],

      login: (email: string, role: UserRole, name?: string) => {
        set({
          isAuthenticated: true,
          user: {
            name: name || (role === 'Client' ? 'Ahmed Al-Masri' : role === 'Mechanic' ? 'Alex Rivera' : 'Turbo Parts Inc.'),
            email,
            phone: '+962 7 9876 5432',
            role,
            avatar: role === 'Mechanic' 
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
            address: 'Amman, Jordan',
            notificationsEnabled: true,
          },
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (profile: Partial<UserProfile>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        }));
      },

      addVehicle: (vehicle: Omit<Vehicle, 'id'>) => {
        const id = 'v_' + Math.random().toString(36).substr(2, 9);
        set((state) => ({
          vehicles: [...state.vehicles, { ...vehicle, id }],
        }));
      },

      removeVehicle: (id: string) => {
        set((state) => ({
          vehicles: state.vehicles.filter((v) => v.id !== id),
        }));
      },

      toggleFavoriteMechanic: (id: string) => {
        set((state) => ({
          mechanics: state.mechanics.map((m) =>
            m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
          ),
        }));
      },

      addTransaction: (type, title, amount) => {
        const id = 't_' + Math.random().toString(36).substr(2, 9);
        const date = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        set((state) => ({
          walletBalance: state.walletBalance + amount,
          transactions: [{ id, type, title, amount, date }, ...state.transactions],
        }));
      },

      addNotification: (title, message, type) => {
        const id = 'n_' + Math.random().toString(36).substr(2, 9);
        set((state) => ({
          notifications: [
            { id, title, message, time: 'Just now', unread: true, type },
            ...state.notifications,
          ],
        }));
      },

      markNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false })),
        }));
      },
    }),
    {
      name: 'automate-auth-storage',
      skipHydration: true,
    }
  )
);

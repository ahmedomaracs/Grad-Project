'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useLocalDB } from './localDB';

export type UserRole = 'Client' | 'Mechanic' | 'Partner' | 'Merchant' | 'Admin';
export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled' | 'In Progress';
export type OrderStatus = 'Delivered' | 'In Transit' | 'Pending' | 'Processing' | 'Cancelled';
export type MechanicBookingStatus = 'Pending' | 'Confirmed' | 'Checked-In' | 'In-Progress' | 'Ready for Pickup';

export interface MerchantOrder {
  id: string;
  productLabel: string;
  buyerName: string;
  /** userId of the Client who placed the order — used for cross-role notification routing */
  clientUserId: string;
  deliveryType: 'standard' | 'workshop';
  status: 'Processing' | 'Shipped' | 'Delivered';
  totalPrice: number;
}

export interface InventoryAlert {
  id: string;
  itemName: string;
  unitsRemaining: number;
  status: 'Low Stock' | 'Critical';
}
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  status: 'Perfect' | 'Needs Attention' | 'In Service';
  image?: string;
  plate?: string;
  color?: string;
  fuelType?: string;
  // Extended fields for my-garage compatibility
  make?: string;
  plateCode?: string;
  plateNumber?: string;
  images?: string[];
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
  location?: string;
  about?: string;
}

export interface Appointment {
  id: string;
  mechanicId: string;
  mechanicName: string;
  mechanicAvatar: string;
  garageName: string;
  service: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  productName: string;
  brand: string;
  price: number;
  quantity: number;
  status: OrderStatus;
  date: string;
  estimatedDelivery?: string;
  image: string;
  trackingNumber?: string;
}

export interface MechanicBooking {
  id: string;
  customerName: string;
  /** userId of the Client who made this booking — used for cross-role notification routing */
  clientUserId: string;
  vehicle: string;
  serviceType: string;
  time: string;
  status: MechanicBookingStatus;
  partsShipped?: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'booking' | 'purchase' | 'withdrawal' | 'refund';
  title: string;
  amount: number;
  date: string;
  status?: 'completed' | 'pending' | 'failed';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'booking' | 'order' | 'system' | 'wallet' | 'reminder';
  link?: string;
  /** Role-scoped targeting — only the matching role+user sees this notification */
  targetRole: 'Client' | 'Mechanic' | 'Merchant';
  targetUserId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  address: string;
  notificationsEnabled: boolean;
  bio?: string;
  joinedDate?: string;
}

interface AuthStore {
  user: UserProfile | null;
  vehicles: Vehicle[];
  mechanics: Mechanic[];
  appointments: Appointment[];
  orders: Order[];
  transactions: WalletTransaction[];
  notifications: NotificationItem[];
  walletBalance: number;
  isAuthenticated: boolean;
  mechanicBookings: MechanicBooking[];
  merchantOrders: MerchantOrder[];
  inventoryAlerts: InventoryAlert[];
  login: (email: string, name?: string, isNewUser?: boolean) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  toggleFavoriteMechanic: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  cancelAppointment: (id: string) => void;
  addTransaction: (type: WalletTransaction['type'], title: string, amount: number) => void;
  /** Push a notification targeted to a specific role + userId. */
  pushNotification: (targetRole: NotificationItem['targetRole'], targetUserId: string, title: string, message: string, type: NotificationItem['type'], link?: string) => void;
  /** Convenience: push a notification scoped to the currently logged-in user. */
  addNotification: (title: string, message: string, type: NotificationItem['type'], link?: string) => void;
  markNotificationsAsRead: () => void;
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  addOrder: (order: Omit<Order, 'id'>) => void;
  /** Mechanic advances a booking status — auto-notifies the owning Client. */
  updateBookingStatus: (id: string, status: MechanicBookingStatus) => void;
  /** Merchant updates an order status — auto-notifies the owning Client when Shipped. */
  updateOrderStatus: (id: string, status: MerchantOrder['status']) => void;
  /** Client checkout: creates a MerchantOrder and pushes a targeted Merchant alert. */
  checkoutCart: (items: { productLabel: string; merchantId: string; merchantName: string; totalPrice: number; deliveryType: 'standard' | 'workshop' }[], clientUserId: string, clientName: string) => void;
  /** Client booking: appends to mechanicBookings and pushes a targeted Mechanic alert. */
  bookMechanic: (mechanicId: string, mechanicUserId: string, clientUserId: string, clientName: string, vehicle: string, serviceType: string, time: string) => void;
}

const SAMPLE_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    brand: 'Porsche',
    model: '911 Carrera S',
    year: 2022,
    mileage: 14200,
    status: 'Perfect',
    plate: 'POR-911-S',
    color: 'Guards Red',
    fuelType: 'Petrol',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'v2',
    brand: 'Audi',
    model: 'RS e-tron GT',
    year: 2023,
    mileage: 5100,
    status: 'Needs Attention',
    plate: 'AUD-RS-GT',
    color: 'Mythos Black',
    fuelType: 'Electric',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500&auto=format&fit=crop&q=80',
  },
];

const SAMPLE_MECHANICS: Mechanic[] = [
  {
    id: 'm1',
    name: 'Marcus Vance',
    garageName: 'Apex Precision Automotive',
    rating: 4.9,
    reviewsCount: 142,
    specialties: ['Engine Diagnostics', 'Brake Systems', 'Porsche Specialist'],
    distance: '2.4 miles',
    price: '$$$',
    available: true,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    isFavorite: true,
    location: 'Downtown, Amman',
    about: 'Certified Porsche master technician with 15+ years of high-performance diagnostics.',
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
    location: 'Al Abdali, Amman',
    about: 'Pioneer in EV diagnostics and battery management systems.',
  },
  {
    id: 'm3',
    name: 'Dinesh Chawla',
    garageName: 'Classic & Performance Care',
    rating: 4.95,
    reviewsCount: 203,
    specialties: ['Performance Exhausts', 'Suspension Alignment', 'ECU Remapping'],
    distance: '5.8 miles',
    price: '$$$',
    available: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isFavorite: true,
    location: 'Sweifieh, Amman',
    about: 'Performance tuning specialist and ASE master certified technician.',
  },
  {
    id: 'm4',
    name: 'Lena Müller',
    garageName: 'German Auto Experts',
    rating: 4.85,
    reviewsCount: 167,
    specialties: ['BMW', 'Mercedes-Benz', 'Audi Systems'],
    distance: '3.2 miles',
    price: '$$$',
    available: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isFavorite: false,
    location: 'Khalda, Amman',
    about: 'German automotive specialist trained in Stuttgart and Munich.',
  },
];

const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    mechanicId: 'm1',
    mechanicName: 'Marcus Vance',
    mechanicAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    garageName: 'Apex Precision Automotive',
    service: 'Full Engine Diagnostics',
    vehicleId: 'v1',
    vehicleName: 'Porsche 911 Carrera S',
    date: 'May 28, 2026',
    time: '10:00 AM',
    status: 'Upcoming',
    price: 149,
    notes: 'Check brake pad wear and engine oil level',
  },
  {
    id: 'a2',
    mechanicId: 'm3',
    mechanicName: 'Dinesh Chawla',
    mechanicAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    garageName: 'Classic & Performance Care',
    service: 'Suspension Alignment',
    vehicleId: 'v2',
    vehicleName: 'Audi RS e-tron GT',
    date: 'May 14, 2026',
    time: '2:30 PM',
    status: 'Completed',
    price: 199,
  },
];

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'o1',
    productName: 'Premium Ceramic Brake Pads',
    brand: 'Brembo',
    price: 89.99,
    quantity: 1,
    status: 'In Transit',
    date: 'May 19, 2026',
    estimatedDelivery: 'May 23, 2026',
    trackingNumber: 'TRK-2026-88421',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'o2',
    productName: 'High-Flow Engine Oil Filter',
    brand: 'Bosch',
    price: 24.99,
    quantity: 2,
    status: 'Delivered',
    date: 'May 15, 2026',
    trackingNumber: 'TRK-2026-77312',
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'o3',
    productName: 'LED Headlight Kit Pro',
    brand: 'Philips',
    price: 149.99,
    quantity: 1,
    status: 'Processing',
    date: 'May 21, 2026',
    estimatedDelivery: 'May 26, 2026',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=200&auto=format&fit=crop&q=80',
  },
];

const SAMPLE_TRANSACTIONS: WalletTransaction[] = [
  { id: 't1', type: 'purchase', title: 'Brembo Brake Pads', amount: -89.99, date: 'May 19, 2026', status: 'completed' },
  { id: 't2', type: 'deposit', title: 'Top-up via Stripe', amount: 200.00, date: 'May 18, 2026', status: 'completed' },
  { id: 't3', type: 'booking', title: 'Porsche Maintenance — Marcus Vance', amount: -149.00, date: 'May 14, 2026', status: 'completed' },
  { id: 't4', type: 'refund', title: 'Refund — Cancelled Booking', amount: 49.00, date: 'May 10, 2026', status: 'completed' },
  { id: 't5', type: 'deposit', title: 'Welcome Bonus', amount: 50.00, date: 'May 1, 2026', status: 'completed' },
];

// Notifications are now fully event-driven and role-scoped.
// The global static array has been purged — no shared dummy data leaks across roles.
const SAMPLE_NOTIFICATIONS: NotificationItem[] = [];

const SAMPLE_MECHANIC_BOOKINGS: MechanicBooking[] = [
  {
    id: 'mb1',
    customerName: 'Tariq Al-Fayed',
    clientUserId: 'client_tariq',
    vehicle: 'Porsche 911 GT3 RS (2022)',
    serviceType: 'Performance Exhaust Remap',
    time: 'Today, 10:00 AM',
    status: 'Pending',
    partsShipped: true,
  },
  {
    id: 'mb2',
    customerName: 'Sarah Connor',
    clientUserId: 'client_sarah',
    vehicle: 'Audi e-tron GT (2023)',
    serviceType: 'Battery Calibration',
    time: 'Today, 2:30 PM',
    status: 'In-Progress',
  },
  {
    id: 'mb3',
    customerName: 'Ahmad Zaki',
    clientUserId: 'client_ahmad',
    vehicle: 'Mercedes-AMG G63 (2021)',
    serviceType: 'Full Oil Flush',
    time: 'Tomorrow, 9:00 AM',
    status: 'Confirmed',
    partsShipped: true,
  },
  {
    id: 'mb4',
    customerName: 'Leila Hassan',
    clientUserId: 'client_leila',
    vehicle: 'BMW M4 Competition (2024)',
    serviceType: 'Brake Pad Replacement',
    time: 'Today, 8:00 AM',
    status: 'Ready for Pickup',
  },
];

const SAMPLE_MERCHANT_ORDERS: MerchantOrder[] = [
  { id: 'mo1', productLabel: 'Ceramic Brake Pads', buyerName: 'Ahmed Al-Masri', clientUserId: 'client_demo', deliveryType: 'standard', status: 'Processing', totalPrice: 89.99 },
  { id: 'mo2', productLabel: 'LED Headlight Kit Pro', buyerName: 'Tariq Al-Fayed', clientUserId: 'client_tariq', deliveryType: 'workshop', status: 'Shipped', totalPrice: 149.99 },
];

const SAMPLE_INVENTORY_ALERTS: InventoryAlert[] = [
  { id: 'ia1', itemName: 'High-Flow Engine Oil Filter', unitsRemaining: 5, status: 'Low Stock' },
  { id: 'ia2', itemName: 'Premium Spark Plugs Set', unitsRemaining: 1, status: 'Critical' },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      walletBalance: 460.50,
      vehicles: SAMPLE_VEHICLES,
      mechanics: SAMPLE_MECHANICS,
      appointments: SAMPLE_APPOINTMENTS,
      orders: SAMPLE_ORDERS,
      transactions: SAMPLE_TRANSACTIONS,
      notifications: SAMPLE_NOTIFICATIONS,
      mechanicBookings: SAMPLE_MECHANIC_BOOKINGS,
      merchantOrders: SAMPLE_MERCHANT_ORDERS,
      inventoryAlerts: SAMPLE_INVENTORY_ALERTS,

      login: (email: string, name?: string, isNewUser?: boolean) => {
        let resolvedRole: UserRole = 'Client';
        const lowerEmail = email.toLowerCase();
        if (lowerEmail.includes('mechanic') || lowerEmail.startsWith('m1@') || lowerEmail.startsWith('m2@') || lowerEmail.startsWith('m3@') || lowerEmail.startsWith('m4@')) {
          resolvedRole = 'Mechanic';
        } else if (lowerEmail.includes('merchant') || lowerEmail.includes('parts')) {
          resolvedRole = 'Merchant';
        } else if (lowerEmail.includes('admin')) {
          resolvedRole = 'Admin';
        }

        if (isNewUser) {
          resolvedRole = 'Client';
        }

        const id = isNewUser ? 'usr_' + Math.random().toString(36).substr(2, 9) : 'usr_default';
        set((state) => {
          const updates: any = {
            isAuthenticated: true,
            user: {
              id,
              name: name || (resolvedRole === 'Client' ? 'Ahmed Al-Masri' : resolvedRole === 'Mechanic' ? 'Alex Rivera' : 'Turbo Parts Inc.'),
              email,
              phone: '+962 7 9876 5432',
              role: resolvedRole,
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
              address: 'Amman, Jordan',
              notificationsEnabled: true,
              bio: 'Premium automotive enthusiast with a passion for performance and precision.',
              joinedDate: isNewUser ? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'May 2026',
            },
          };
          if (isNewUser) {
            updates.vehicles = [];
            updates.appointments = [];
            updates.orders = [];
            updates.transactions = [];
            updates.notifications = [];
            updates.mechanicBookings = [];
            updates.merchantOrders = [];
            updates.walletBalance = 0;
          }
          return updates;
        });
      },

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        vehicles: [],
        appointments: [],
        orders: [],
        transactions: [],
        notifications: [],
        mechanicBookings: [],
        merchantOrders: []
      }),

      updateProfile: (profile) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        }));
      },

      setVehicles: (vehicles) => {
        set({ vehicles });
      },

      addVehicle: (vehicle) => {
        const id = 'v_' + Math.random().toString(36).substr(2, 9);
        set((state) => ({
          vehicles: [...state.vehicles, { ...vehicle, id }],
        }));
      },

      updateVehicle: (id, updates) => {
        set((state) => ({
          vehicles: state.vehicles.map((v) => v.id === id ? { ...v, ...updates } : v),
        }));
      },

      removeVehicle: (id) => {
        set((state) => ({
          vehicles: state.vehicles.filter((v) => v.id !== id),
        }));
      },

      toggleFavoriteMechanic: (id) => {
        set((state) => ({
          mechanics: state.mechanics.map((m) =>
            m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
          ),
        }));
      },

      addAppointment: (appointment) => {
        const id = 'a_' + Math.random().toString(36).substr(2, 9);
        set((state) => ({
          appointments: [{ ...appointment, id }, ...state.appointments],
        }));
      },

      cancelAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status: 'Cancelled' as AppointmentStatus } : a
          ),
        }));
      },

      addTransaction: (type, title, amount) => {
        const id = 't_' + Math.random().toString(36).substr(2, 9);
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        set((state) => ({
          walletBalance: state.walletBalance + amount,
          transactions: [{ id, type, title, amount, date, status: 'completed' }, ...state.transactions],
        }));
      },

      pushNotification: (targetRole, targetUserId, title, message, type, link) => {
        const id = 'n_' + Math.random().toString(36).substr(2, 9);
        set((state) => ({
          notifications: [
            { id, title, message, time: 'Just now', unread: true, type, link, targetRole, targetUserId },
            ...state.notifications,
          ],
        }));
      },

      addNotification: (title, message, type, link) => {
        const id = 'n_' + Math.random().toString(36).substr(2, 9);
        const state = get();
        const targetRole = (state.user?.role ?? 'Client') as NotificationItem['targetRole'];
        const targetUserId = state.user?.email ?? 'anonymous';
        set((s) => ({
          notifications: [
            { id, title, message, time: 'Just now', unread: true, type, link, targetRole, targetUserId },
            ...s.notifications,
          ],
        }));
      },

      markNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false })),
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => n.id === id ? { ...n, unread: false } : n),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      addOrder: (order) => {
        const id = 'o_' + Math.random().toString(36).substr(2, 9);
        set((state) => ({
          orders: [{ ...order, id }, ...state.orders],
        }));
      },

      updateBookingStatus: (id, status) => {
        const booking = get().mechanicBookings.find((mb) => mb.id === id);
        set((state) => ({
          mechanicBookings: state.mechanicBookings.map((mb) =>
            mb.id === id ? { ...mb, status } : mb
          ),
        }));
        
        // Sync to global registry
        if (booking && booking.clientUserId) {
           useLocalDB.getState().advanceBookingStatus(id, status as any, booking.clientUserId, booking.serviceType);
        }

        // Task C: Mechanic status advance → Client notification
        if (booking && booking.clientUserId) {
          get().pushNotification(
            'Client',
            booking.clientUserId,
            'Appointment Update 🛠️',
            `Your vehicle status is now "${status}" for your ${booking.serviceType} appointment.`,
            'booking',
            '/dashboard'
          );
        }
      },

      updateOrderStatus: (id, status) => {
        const order = get().merchantOrders.find((mo) => mo.id === id);
        set((state) => ({
          merchantOrders: state.merchantOrders.map((mo) =>
            mo.id === id ? { ...mo, status } : mo
          ),
        }));

        // Sync to global registry
        if (order && order.clientUserId) {
          useLocalDB.getState().advanceOrderStatus(id, status as any, order.clientUserId, order.productLabel);
        }

        // Task C: Merchant marks order as Shipped → Client notification
        if (status === 'Shipped' && order && order.clientUserId) {
          get().pushNotification(
            'Client',
            order.clientUserId,
            'Order In Transit 📦',
            `Your ${order.productLabel} is on the way. Hang tight!`,
            'order',
            '/dashboard'
          );
        }
      },

      // Task A: Client checkout → MerchantOrder created + Merchant notification
      checkoutCart: (items, clientUserId, clientName) => {
        const { pushNotification } = get();
        const newOrders: MerchantOrder[] = items.map((item) => {
          
          // Sync to global registry
          const dbOrder = useLocalDB.getState().appendOrder({
            clientUserId,
            clientName,
            merchantId: item.merchantId,
            merchantName: item.merchantName,
            productLabel: item.productLabel,
            totalPrice: item.totalPrice,
            deliveryType: item.deliveryType,
            status: 'Processing'
          });

          // Push alert to the specific Merchant
          pushNotification(
            'Merchant',
            item.merchantId,
            'New Order Received 🛒',
            `New Order #${dbOrder.id} received from ${clientName} for ${item.productLabel}.`,
            'order',
            '/dashboard/merchant'
          );
          return {
            id: dbOrder.id,
            productLabel: item.productLabel,
            buyerName: clientName,
            clientUserId,
            deliveryType: item.deliveryType,
            status: 'Processing' as const,
            totalPrice: item.totalPrice,
          };
        });
        set((state) => ({
          merchantOrders: [...newOrders, ...state.merchantOrders],
        }));
      },

      // Task B: Client booking → MechanicBooking created + Mechanic notification
      bookMechanic: (mechanicId, mechanicUserId, clientUserId, clientName, vehicle, serviceType, time) => {
        // Sync to global registry
        const dbBooking = useLocalDB.getState().appendBooking({
          clientUserId,
          clientName,
          mechanicId,
          mechanicName: mechanicUserId,
          vehicle,
          serviceType,
          scheduledAt: time,
          status: 'Pending'
        });

        const newBooking: MechanicBooking = {
          id: dbBooking.id,
          customerName: clientName,
          clientUserId,
          vehicle,
          serviceType,
          time,
          status: 'Pending',
        };

        set((state) => ({
          mechanicBookings: [newBooking, ...state.mechanicBookings],
        }));
        // Push alert to the specific Mechanic
        get().pushNotification(
          'Mechanic',
          mechanicUserId,
          'New Booking Request 🔧',
          `New pending booking request from ${clientName} for ${serviceType}.`,
          'booking',
          '/dashboard/mechanic'
        );
      },
    }),
    {
      name: 'automate-auth-storage',
      skipHydration: true,
    }
  )
);

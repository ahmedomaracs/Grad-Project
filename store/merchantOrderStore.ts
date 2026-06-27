import { create } from 'zustand';
import { MerchantOrderEntity } from '../types/order';

export const SEEDED_MERCHANT_ORDERS: MerchantOrderEntity[] = [
  {
    id: "ORD-77321",
    createdAt: "2026-06-26T14:30:00Z",
    customerInfo: {
      name: "Sarah Connor",
      phone: "+20 15 5543 9122",
      email: "m2@automate.com"
    },
    deliveryType: "WORKSHOP_ROUTING",
    partnerWorkshopInfo: {
      id: "mech-alex-001",
      name: "Alex's High-Tech Workshop",
      bayLocation: "Maadi, Cairo",
      scheduledInstallationTime: "Today at 2:30 PM"
    },
    items: [
      {
        productId: "prod-brembo-001",
        name: "Brembo Venting Brake Rotor (Front)",
        brand: "Brembo",
        quantity: 1,
        priceEGP: 14500
      }
    ],
    subtotalEGP: 14500,
    deliveryFeeEGP: 0,
    totalAmountEGP: 14500,
    fulfillmentStatus: "PENDING"
  },
  {
    id: "ORD-11924",
    createdAt: "2026-06-25T11:15:00Z",
    customerInfo: {
      name: "Karim Abdelaziz",
      phone: "+20 12 8874 1134",
      email: "karim@domain.com"
    },
    deliveryType: "HOME_DELIVERY",
    shippingAddress: {
      street: "9 El-Tahrir Street",
      city: "Dokki",
      governorate: "Giza"
    },
    items: [
      {
        productId: "prod-ngk-7994",
        name: "NGK Laser Iridium Spark Plugs (Set of 6)",
        brand: "NGK",
        quantity: 1,
        priceEGP: 9347
      }
    ],
    subtotalEGP: 9347,
    deliveryFeeEGP: 150,
    totalAmountEGP: 9497,
    fulfillmentStatus: "DISPATCHED"
  }
];

interface MerchantOrderStoreState {
  orders: MerchantOrderEntity[];
  updateOrderStatus: (orderId: string, newStatus: MerchantOrderEntity['fulfillmentStatus']) => void;
}

export const useMerchantOrderStore = create<MerchantOrderStoreState>((set) => ({
  orders: SEEDED_MERCHANT_ORDERS,
  updateOrderStatus: (orderId, newStatus) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, fulfillmentStatus: newStatus } : order
      ),
    })),
}));

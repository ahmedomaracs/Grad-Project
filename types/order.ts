export interface OrderItemEntity {
  productId: string;
  name: string;
  brand: string;
  quantity: number;
  priceEGP: number;
}

export interface MerchantOrderEntity {
  id: string;                    // e.g., "ORD-99214"
  createdAt: string;             // ISO Timestamp
  customerInfo: {
    name: string;                // e.g., "Sarah Connor"
    phone: string;               // e.g., "+20 15 5543 9122"
    email: string;               // e.g., "m2@automate.com"
  };
  deliveryType: 'HOME_DELIVERY' | 'WORKSHOP_ROUTING';
  shippingAddress?: {
    street: string;
    city: string;
    governorate: string;
  };
  partnerWorkshopInfo?: {
    id: string;
    name: string;                // e.g., "Fixico Performance Center"
    bayLocation: string;         // e.g., "6th of October, Giza"
    scheduledInstallationTime: string; // e.g., "2026-06-30 at 02:30 PM"
  };
  items: OrderItemEntity[];
  subtotalEGP: number;
  deliveryFeeEGP: number;
  totalAmountEGP: number;
  fulfillmentStatus: 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'AT_WORKSHOP';
}

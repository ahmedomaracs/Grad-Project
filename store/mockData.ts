import { GlobalBooking } from './localDB';

export interface MockInvoiceItem {
  id: string;
  name: string;
  priceEGP: number;
}

export interface MockBooking {
  id: string;
  customerName: string;
  vehicleModel: string;
  licensePlate: string;
  timeSlot: string;
  status: 'PENDING' | 'IN_BAY' | 'COMPLETED';
  serviceType: string;
  serviceNotes: string;
  invoice?: {
    parts: MockInvoiceItem[];
    laborTotal: number;
    isPaid: boolean;
  };
  completionDate?: string;
}

// 📅 1. Active Bookings Data (Populates image_228c68.png)
// Strongly mapped to strictly mirror the GlobalBooking schema to prevent hydration issues
export const MOCK_ACTIVE_BOOKINGS: GlobalBooking[] = [
  {
    id: "BK-9042",
    clientUserId: "sarah@example.com",
    clientName: "Sarah Connor",
    mechanicId: "m1@example.com",
    mechanicName: "Mechanic",
    vehicle: "2023 Audi RS e-tron GT (أ ق ج ٥٩٣٢)", // Combined vehicleModel + licensePlate
    serviceType: "Brake Systems & Tuning",
    scheduledAt: "2026-06-25T14:00:00Z", // "02:00 PM"
    status: "In-Progress", // "IN_BAY"
    createdAt: "2026-06-25T10:00:00Z",
    invoice: {
      parts: [],
      laborTotal: 800, // Matches the base fee in image_22f620.png
      isPaid: false
    }
  },
  {
    id: "BK-3118",
    clientUserId: "karim@example.com",
    clientName: "Karim Abdelaziz",
    mechanicId: "m1@example.com",
    mechanicName: "Mechanic",
    vehicle: "2022 BMW M4 Competition (ر د أ ١١٨٢)",
    serviceType: "Engine Diagnostics",
    scheduledAt: "2026-06-25T16:30:00Z", // "04:30 PM"
    status: "Pending", // "PENDING"
    createdAt: "2026-06-25T10:00:00Z",
    invoice: {
      parts: [],
      laborTotal: 500,
      isPaid: false
    }
  }
];

// 📊 2. Historical Completed Data (Populates metrics & table rows in image_22f63a.jpg)
export const MOCK_COMPLETED_BOOKINGS: GlobalBooking[] = [
  {
    id: "BK-1042",
    clientUserId: "ahmed@example.com",
    clientName: "Ahmed Tarek",
    mechanicId: "m1@example.com",
    mechanicName: "Mechanic",
    vehicle: "2021 Mercedes-Benz C200 (م ر أ ٣٤٩)",
    serviceType: "Battery Calibration",
    scheduledAt: "2026-06-24T10:00:00Z",
    status: "Completed",
    createdAt: "2026-06-24T12:00:00Z", // mapped from completionDate
    invoice: {
      parts: [
        { id: "PRT-8821", name: "Professional Bluetooth OBD-II Scanner", price: 14500 } // priceEGP mapped to price
      ],
      laborTotal: 1200,
      isPaid: true
    }
  },
  {
    id: "BK-0984",
    clientUserId: "yasmine@example.com",
    clientName: "Yasmine Sabri",
    mechanicId: "m1@example.com",
    mechanicName: "Mechanic",
    vehicle: "2023 Porsche Macan GTS (ك و ن ٧٧٧٧)",
    serviceType: "Brake Systems",
    scheduledAt: "2026-06-23T11:30:00Z",
    status: "Completed",
    createdAt: "2026-06-23T15:00:00Z",
    invoice: {
      parts: [
        { id: "PRT-0231", name: "Brembo Premium Ceramic Brake Pads Set", price: 8999 },
        { id: "PRT-0232", name: "Brembo Venting Brake Rotor (Front)", price: 14500 }
      ],
      laborTotal: 800,
      isPaid: true
    }
  }
];

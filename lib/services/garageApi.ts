/**
 * garageApi — Vehicle / Garage endpoints
 *
 * ⚠️  NOT YET IMPLEMENTED ON THE BACKEND
 * The production API (https://carautomotive-api-production.up.railway.app) does not
 * expose any /vehicles routes as of the last Swagger check (2026-06).
 *
 * Available backend routes (for reference):
 *   POST   /api/Account/login | register | forgot-password | reset-password | logout | refresh-token | register-admin
 *   POST   /api/Appointments                  POST   /api/Reviews
 *   PUT    /api/Appointments/{id}/status       GET    /api/Reviews/mechanic/{mechanicId}
 *   GET    /api/Appointments/my-appointments
 *   GET    /api/Appointments/{id}
 *   GET|DELETE|POST|PUT /api/Cart/{cartId}…
 *   GET|POST|PUT|DELETE /api/Categories, /api/Products
 *   GET|POST|GET|PUT    /api/Mechanic, /api/Orders
 *   POST   /api/Payments/{orderId}
 *
 * The My Garage page uses Zustand (persisted to localStorage) until these
 * endpoints are available on the server.
 */

import apiClient from './apiClient';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateCode: string;
  plateNumber: string;
  mileage: number;
  images: string[];
  status?: 'Perfect' | 'Needs Attention' | 'In Service';
}

export type VehiclePayload = Omit<Vehicle, 'id'>;

/** These calls will 404 until the backend implements /api/Vehicles. */
export const garageApi = {
  getVehicles: () => apiClient.get<Vehicle[]>('Vehicles'),
  addVehicle: (data: VehiclePayload) => apiClient.post<Vehicle>('Vehicles', data),
  updateVehicle: (id: string, data: Partial<VehiclePayload>) => apiClient.put<Vehicle>(`Vehicles/${id}`, data),
  deleteVehicle: (id: string) => apiClient.delete(`Vehicles/${id}`),
};

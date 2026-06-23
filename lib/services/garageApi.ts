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

export const garageApi = {
  getVehicles: () => apiClient.get<Vehicle[]>('/vehicles'),
  addVehicle: (data: VehiclePayload) => apiClient.post<Vehicle>('/vehicles', data),
  updateVehicle: (id: string, data: Partial<VehiclePayload>) => apiClient.put<Vehicle>(`/vehicles/${id}`, data),
  deleteVehicle: (id: string) => apiClient.delete(`/vehicles/${id}`),
};

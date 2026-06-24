/**
 * mechanicApi — Mechanic endpoints
 *
 * Available backend routes:
 *   POST   /api/Mechanic          — register as a mechanic
 *   GET    /api/Mechanic          — list all mechanics
 *   GET    /api/Mechanic/{id}     — get mechanic by ID
 *   GET    /api/Mechanic/search-nearby — search nearby mechanics
 *   GET    /api/Mechanic/city/{city}   — mechanics in a city
 */

import apiClient from './apiClient';

export interface MechanicDto {
  id: number;
  name: string;
  garageName?: string;
  specialties?: string[];
  rating?: number;
  reviewsCount?: number;
  distance?: string;
  price?: string;
  available?: boolean;
  avatar?: string;
  location?: string;
  about?: string;
  city?: string;
}

export interface RegisterMechanicPayload {
  garageName: string;
  city: string;
  address: string;
  about?: string;
  specialties?: string[];
}

export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export const mechanicApi = {
  /** GET /api/Mechanic — list all mechanics */
  getAll: () => apiClient.get<MechanicDto[]>('Mechanic'),

  /** GET /api/Mechanic/{id} — single mechanic */
  getById: (id: number | string) => apiClient.get<MechanicDto>(`Mechanic/${id}`),

  /** GET /api/Mechanic/search-nearby */
  searchNearby: (params: NearbySearchParams) =>
    apiClient.get<MechanicDto[]>('Mechanic/search-nearby', { params }),

  /** GET /api/Mechanic/city/{city} */
  getByCity: (city: string) => apiClient.get<MechanicDto[]>(`Mechanic/city/${encodeURIComponent(city)}`),

  /** POST /api/Mechanic — register as mechanic (auth required) */
  register: (data: RegisterMechanicPayload) => apiClient.post<MechanicDto>('Mechanic', data),
};

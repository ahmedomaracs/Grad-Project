/**
 * appointmentsApi — Appointments endpoints
 *
 * Available backend routes:
 *   POST   /api/Appointments                        — book an appointment
 *   PUT    /api/Appointments/{id}/status            — update status (mechanic)
 *   GET    /api/Appointments/my-appointments        — client's own appointments
 *   GET    /api/Appointments/mechanic/{mechanicId}  — mechanic's appointments
 *   GET    /api/Appointments/{id}                   — get single appointment
 */

import apiClient from './apiClient';

export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Checked-In'
  | 'In-Progress'
  | 'Ready for Pickup'
  | 'Completed'
  | 'Cancelled';

export interface AppointmentDto {
  id: number;
  mechanicId: number;
  mechanicName?: string;
  clientName?: string;
  vehicleDescription?: string;
  serviceType: string;
  scheduledAt: string;     // ISO date-time
  notes?: string;
  status: AppointmentStatus;
  price?: number;
}

export interface CreateAppointmentPayload {
  mechanicId: number;
  vehicleDescription: string;
  serviceType: string;
  scheduledAt: string;   // ISO date-time string  e.g. "2026-07-01T10:00:00"
  notes?: string;
}

export interface UpdateAppointmentStatusPayload {
  status: AppointmentStatus;
}

export const appointmentsApi = {
  /** POST /api/Appointments — create/book a new appointment */
  create: (data: CreateAppointmentPayload) =>
    apiClient.post<AppointmentDto>('Appointments', data),

  /** GET /api/Appointments/my-appointments — the logged-in client's appointments */
  getMyAppointments: () =>
    apiClient.get<AppointmentDto[]>('Appointments/my-appointments'),

  /** GET /api/Appointments/mechanic/{mechanicId} — all appointments for a mechanic */
  getByMechanic: (mechanicId: number | string) =>
    apiClient.get<AppointmentDto[]>(`Appointments/mechanic/${mechanicId}`),

  /** GET /api/Appointments/{id} — single appointment detail */
  getById: (id: number | string) =>
    apiClient.get<AppointmentDto>(`Appointments/${id}`),

  /** PUT /api/Appointments/{id}/status — advance status (mechanic only) */
  updateStatus: (id: number | string, status: AppointmentStatus) =>
    apiClient.put<AppointmentDto>(`Appointments/${id}/status`, { status }),
};

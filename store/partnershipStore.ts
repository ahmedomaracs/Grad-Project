'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PartnershipRole = 'Mechanic' | 'Merchant' | 'Supplier';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface PartnershipApplication {
  id: string;
  applicantName: string;
  businessName: string;
  email: string;
  phone: string;
  roleApplied: PartnershipRole;
  status: ApplicationStatus;
  timestamp: string;
  roleData: {
    // Mechanic conditional fields
    licenseNumber?: string;
    specialization?: string;
    // Merchant/Supplier conditional fields
    vatNumber?: string;
    inventoryCategory?: string;
    // Rejection details
    rejectionReason?: string;
  };
}

interface PartnershipStore {
  applications: PartnershipApplication[];
  addApplication: (app: Omit<PartnershipApplication, 'id' | 'status' | 'timestamp'>) => void;
  approveApplication: (id: string) => void;
  denyApplication: (id: string, reason: string) => void;
}

export const usePartnershipStore = create<PartnershipStore>()(
  persist(
    (set) => ({
      applications: [
        // Seed some initial unapproved B2B partnership applications for the admin view
        {
          id: 'app-seed-1',
          applicantName: 'Marcus Vance',
          businessName: 'Apex Performance Labs',
          email: 'marcus@apexperformance.com',
          phone: '+1 (555) 019-2834',
          roleApplied: 'Mechanic',
          status: 'pending',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          roleData: {
            licenseNumber: 'LIC-77291-B',
            specialization: 'German Powertrains & EV Tuning',
          },
        },
        {
          id: 'app-seed-2',
          applicantName: 'Elena Rostova',
          businessName: 'EuroSpec Parts Group',
          email: 'elena@eurospecparts.com',
          phone: '+1 (555) 014-9988',
          roleApplied: 'Merchant',
          status: 'pending',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          roleData: {
            vatNumber: 'VAT-DE-9981273',
            inventoryCategory: 'OEM Brake Rotors & Suspension Kits',
          },
        },
      ],
      addApplication: (app) =>
        set((state) => ({
          applications: [
            ...state.applications,
            {
              ...app,
              id: `b2b-${Math.random().toString(36).substr(2, 9)}`,
              status: 'pending',
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      approveApplication: (id) =>
        set((state) => {
          const updatedApplications = state.applications.map((app) => {
            if (app.id === id) {
              return { ...app, status: 'approved' as const };
            }
            return app;
          });
          return { applications: updatedApplications };
        }),
      denyApplication: (id, reason) =>
        set((state) => {
          const updatedApplications = state.applications.map((app) => {
            if (app.id === id) {
              return {
                ...app,
                status: 'rejected' as const,
                roleData: { ...app.roleData, rejectionReason: reason },
              };
            }
            return app;
          });
          return { applications: updatedApplications };
        }),
    }),
    {
      name: 'automate-partnership-applications',
    }
  )
);

/**
 * reviewsApi — Reviews endpoints
 *
 * Available backend routes:
 *   POST   /api/Reviews                        — submit a review for a mechanic
 *   GET    /api/Reviews/mechanic/{mechanicId}  — get all reviews for a mechanic
 */

import apiClient from './apiClient';

export interface ReviewDto {
  id: number;
  clientName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  mechanicId: number;
  rating: number;           // 1–5
  comment?: string;
}

export const reviewsApi = {
  /** POST /api/Reviews — submit a review (authenticated client) */
  create: (data: CreateReviewPayload) =>
    apiClient.post<ReviewDto>('Reviews', data),

  /** GET /api/Reviews/mechanic/{mechanicId} — all reviews for a mechanic */
  getByMechanic: (mechanicId: number | string) =>
    apiClient.get<ReviewDto[]>(`Reviews/mechanic/${mechanicId}`),
};

/**
 * ordersApi — Orders & Cart endpoints
 *
 * Available backend routes:
 *
 * Orders:
 *   POST   /api/Orders              — place a new order
 *   GET    /api/Orders              — client's own orders
 *   GET    /api/Orders/{id}         — single order detail
 *   PUT    /api/Orders/{id}/cancel  — cancel an order
 *
 * Cart:
 *   GET    /api/Cart/{cartId}                              — get cart
 *   DELETE /api/Cart/{cartId}                             — clear cart
 *   POST   /api/Cart/{cartId}/items                       — add item
 *   PUT    /api/Cart/{cartId}/items                       — update item quantity
 *   DELETE /api/Cart/{cartId}/items/{productId}           — remove item
 *
 * Payments:
 *   POST   /api/Payments/{orderId}  — initiate Stripe payment
 *   POST   /api/Payments/webhook    — Stripe webhook (server-side only)
 */

import apiClient from './apiClient';

/* ── Order DTOs ────────────────────────────────────────────────────── */

export type OrderStatus = 1 | 2 | 3 | 4 | 5;

export interface ShippingAddressDto {
  fullName: string;
  phoneNumber: string;
  city: string;
  street: string;
}

export interface OrderItemDto {
  productId: number;
  productName?: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  totalPrice?: number;
}

export interface OrderToReturnDto {
  id: number;
  orderId: string;          // UUID
  totalAmount: number;
  status?: string;
  orderDate: string;
  shippingAddress?: ShippingAddressDto;
  items?: OrderItemDto[];
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddressDto;
  cartId: string;
}

/* ── Cart DTOs ─────────────────────────────────────────────────────── */

export interface CartItemDto {
  productId: number;
  productName?: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

export interface CartDto {
  id: string;
  items: CartItemDto[];
}

export interface AddCartItemPayload {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  productId: number;
  newQuantity: number;
}

/* ── API ───────────────────────────────────────────────────────────── */

export const ordersApi = {
  /** POST /api/Orders — place an order (requires cartId + shipping address) */
  create: (data: CreateOrderPayload) =>
    apiClient.post<OrderToReturnDto>('Orders', data),

  /** GET /api/Orders — the logged-in client's orders */
  getMyOrders: () =>
    apiClient.get<OrderToReturnDto[]>('Orders'),

  /** GET /api/Orders/{id} — single order with full items */
  getById: (id: number | string) =>
    apiClient.get<OrderToReturnDto>(`Orders/${id}`),

  /** PUT /api/Orders/{id}/cancel — cancel a pending order */
  cancel: (id: number | string) =>
    apiClient.put(`Orders/${id}/cancel`),
};

export const cartApi = {
  /** GET /api/Cart/{cartId} */
  get: (cartId: string) =>
    apiClient.get<CartDto>(`Cart/${cartId}`),

  /** DELETE /api/Cart/{cartId} — clear entire cart */
  clear: (cartId: string) =>
    apiClient.delete(`Cart/${cartId}`),

  /** POST /api/Cart/{cartId}/items — add a product to cart */
  addItem: (cartId: string, data: AddCartItemPayload) =>
    apiClient.post<CartDto>(`Cart/${cartId}/items`, data),

  /** PUT /api/Cart/{cartId}/items — update item quantity */
  updateItem: (cartId: string, data: UpdateCartItemPayload) =>
    apiClient.put<CartDto>(`Cart/${cartId}/items`, data),

  /** DELETE /api/Cart/{cartId}/items/{productId} — remove one item */
  removeItem: (cartId: string, productId: number | string) =>
    apiClient.delete(`Cart/${cartId}/items/${productId}`),
};

export const paymentsApi = {
  /** POST /api/Payments/{orderId} — create Stripe checkout session */
  initiatePayment: (orderId: number | string) =>
    apiClient.post<{ checkoutUrl: string }>(`Payments/${orderId}`),
};

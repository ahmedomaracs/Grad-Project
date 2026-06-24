/**
 * productsApi — Products & Categories endpoints
 *
 * Available backend routes:
 *   GET    /api/Products                         — paginated product list
 *   POST   /api/Products                         — create product (merchant)
 *   GET    /api/Products/{id}                    — single product
 *   PUT    /api/Products/{id}                    — update product (merchant)
 *   DELETE /api/Products/{id}                    — delete product (merchant)
 *   POST   /api/Products/{id}/images             — add images to product
 *   DELETE /api/Products/{productId}/images/{imageId} — remove image
 *
 *   GET    /api/Categories                       — list all categories
 *   POST   /api/Categories                       — create category
 *   GET    /api/Categories/{id}                  — single category
 *   PUT    /api/Categories/{id}                  — update category
 *   DELETE /api/Categories/{id}                  — delete category
 */

import apiClient from './apiClient';

/* ── Product DTOs ──────────────────────────────────────────────────── */

export interface ProductDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockCount: number;
  createdDate: string;
  categoryId: number;
  categoryName?: string;
  productImages?: string[];
}

export interface ProductPagination {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: ProductDto[];
}

export interface ProductFilterParams {
  pageIndex?: number;
  pageSize?: number;
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stockCount: number;
  categoryId: number;
  imageUrls?: string[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stockCount?: number;
  categoryId?: number;
  imageUrls?: string[];
}

/* ── Category DTOs ─────────────────────────────────────────────────── */

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

/* ── API ───────────────────────────────────────────────────────────── */

export const productsApi = {
  /** GET /api/Products — paginated list with optional filters */
  getAll: (params?: ProductFilterParams) =>
    apiClient.get<ProductPagination>('Products', { params }),

  /** GET /api/Products/{id} */
  getById: (id: number | string) =>
    apiClient.get<ProductDto>(`Products/${id}`),

  /** POST /api/Products — create (merchant/admin only) */
  create: (data: CreateProductPayload) =>
    apiClient.post<ProductDto>('Products', data),

  /** PUT /api/Products/{id} — update (merchant/admin only) */
  update: (id: number | string, data: UpdateProductPayload) =>
    apiClient.put<ProductDto>(`Products/${id}`, data),

  /** DELETE /api/Products/{id} — remove (merchant/admin only) */
  remove: (id: number | string) =>
    apiClient.delete(`Products/${id}`),

  /** POST /api/Products/{id}/images — add image URLs */
  addImages: (id: number | string, imageUrls: string[]) =>
    apiClient.post(`Products/${id}/images`, { imageUrls }),

  /** DELETE /api/Products/{productId}/images/{imageId} */
  removeImage: (productId: number | string, imageId: number | string) =>
    apiClient.delete(`Products/${productId}/images/${imageId}`),
};

export const categoriesApi = {
  /** GET /api/Categories */
  getAll: () => apiClient.get<CategoryDto[]>('Categories'),

  /** GET /api/Categories/{id} */
  getById: (id: number | string) =>
    apiClient.get<CategoryDto>(`Categories/${id}`),

  /** POST /api/Categories */
  create: (data: CreateCategoryPayload) =>
    apiClient.post<CategoryDto>('Categories', data),

  /** PUT /api/Categories/{id} */
  update: (id: number | string, data: Partial<CreateCategoryPayload>) =>
    apiClient.put<CategoryDto>(`Categories/${id}`, data),

  /** DELETE /api/Categories/{id} */
  remove: (id: number | string) =>
    apiClient.delete(`Categories/${id}`),
};

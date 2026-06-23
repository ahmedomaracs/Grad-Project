export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  badge?: string;
  discount?: string;
  description: string;
  tags: string[];
  characteristics?: {
    category: string;
    technicalSpecs: { label: string; value: string }[];
  };
}

export type Category =
  | 'All'
  | 'Engine'
  | 'Brakes'
  | 'Lighting'
  | 'Accessories'
  | 'Tires';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  category: Category;
  search: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: SortOption;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest';

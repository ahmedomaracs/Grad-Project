import { create } from 'zustand';

interface ShopFilterState {
  searchQuery: string;
  activeCategory: string;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
}

export const useShopFilterStore = create<ShopFilterState>((set) => ({
  searchQuery: '',
  activeCategory: 'All',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (category) => set({ activeCategory: category }),
}));

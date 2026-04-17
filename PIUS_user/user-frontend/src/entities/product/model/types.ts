export interface MarketShort {
  marketId: string;
  marketName: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  img: string;
  available: number;
  createdAt: string;
  market: MarketShort;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ProductListResponse {
  items: Product[];
  pagination: Pagination;
}

export interface ProductFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

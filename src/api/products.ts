import { apiClient } from './client';
import type { Product } from '@/types';

type ProductListParams = {
  category?: string;
  search?: string;
  page?: string;
  limit?: string;
  sort?: string;
};

type ProductListResponse = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
};

export async function getProductsApi(params?: ProductListParams): Promise<ProductListResponse> {
  return apiClient<ProductListResponse>('/products', { params });
}

export async function getProductByIdApi(id: string): Promise<Product> {
  return apiClient<Product>(`/products/${id}`);
}

import { apiClient } from './client';
import type { CartItem } from '@/types';

type AddToCartRequest = {
  productId: string;
  quantity: number;
};

type UpdateCartItemRequest = {
  quantity: number;
};

export async function getCartApi(): Promise<CartItem[]> {
  return apiClient<CartItem[]>('/cart');
}

export async function addToCartApi(data: AddToCartRequest): Promise<CartItem> {
  return apiClient<CartItem>('/cart', { method: 'POST', body: data });
}

export async function updateCartItemApi(productId: string, data: UpdateCartItemRequest): Promise<CartItem> {
  return apiClient<CartItem>(`/cart/${productId}`, { method: 'PUT', body: data });
}

export async function removeCartItemApi(productId: string): Promise<void> {
  return apiClient(`/cart/${productId}`, { method: 'DELETE' });
}

export async function clearCartApi(): Promise<void> {
  return apiClient('/cart', { method: 'DELETE' });
}

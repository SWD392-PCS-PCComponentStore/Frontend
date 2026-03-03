import { apiClient } from './client';

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

type CreateOrderRequest = {
  items: OrderItem[];
  shippingInfo: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city?: string;
    district?: string;
    notes?: string;
  };
  paymentMethod: 'full' | 'installment';
  installmentPlan?: string;
};

type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
};

export async function createOrderApi(data: CreateOrderRequest): Promise<Order> {
  return apiClient<Order>('/orders', { method: 'POST', body: data });
}

export async function getOrdersApi(): Promise<Order[]> {
  return apiClient<Order[]>('/orders');
}

export async function getOrderByIdApi(id: string): Promise<Order> {
  return apiClient<Order>(`/orders/${id}`);
}

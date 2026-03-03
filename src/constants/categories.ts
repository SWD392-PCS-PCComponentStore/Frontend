/**
 * Category display names and mappings
 */

import type { ProductCategory } from '@/types';

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'Tất cả sản phẩm',
  laptop: 'Laptop',
  pc: 'PC Đồng bộ',
  cpu: 'Bộ vi xử lý (CPU)',
  gpu: 'Card đồ họa (GPU)',
  ram: 'RAM',
  storage: 'Ổ cứng',
  motherboard: 'Bo mạch chủ',
  psu: 'Nguồn máy tính',
  case: 'Case máy tính',
};

export const PC_BUILDER_CATEGORIES: ProductCategory[] = [
  'cpu',
  'motherboard',
  'gpu',
  'ram',
  'storage',
  'psu',
  'case',
];

export const PC_BUILDER_LABELS: Record<ProductCategory, string> = {
  cpu: 'Bộ vi xử lý (CPU)',
  gpu: 'Card đồ họa (GPU)',
  ram: 'RAM',
  storage: 'Ổ cứng',
  motherboard: 'Bo mạch chủ',
  psu: 'Nguồn',
  case: 'Case',
  laptop: 'Laptop',
  pc: 'PC Đồng bộ',
};

/**
 * Products Query Module
 * Contains all products-related types, API functions, and React Query hooks
 */

// ==================== TYPES ====================

export interface ProductDto {
  product_id?: string;
  product_name?: string;
  brand?: string;
  price: number;
  quantity_sold: number;
  category?: string;
  expiration_date?: string;
  customer_reviews: number;
  average_rating: number;
  is_featured: boolean;
  image_url?: string;
}

export interface ProductDto2 {
  id?: string;
  name?: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryDto {
  category_id?: string;
  category_name?: string;
  product_count: number;
  total_sales: number;
  icon?: string;
}

export interface CategoryListResponse {
  success: boolean;
  data?: CategoryDto[];
}

export interface ProductCreateResponse {
  success: boolean;
  message?: string;
  data?: ProductDto2;
}

export interface ProductUpdateResponse {
  success: boolean;
  message?: string;
  data?: ProductDto2;
}

export interface ProductDeleteResponse {
  success: boolean;
  message?: string;
}

export interface ProductListResponse {
  success: boolean;
  data?: ProductDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductResponse {
  success: boolean;
  data?: ProductDto2;
}

// ==================== QUERY KEYS ====================

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  top: () => [...productKeys.all, 'top'] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
};

// ==================== QUERY HOOKS ====================

// export const useProduct = (id: string) => {
//   return useQuery({
//     queryKey: productKeys.detail(id),
//     queryFn: () => productsApi.getById(id),
//     enabled: !!id,
//   });
// };

// ==================== MUTATION HOOKS ====================

import { OrderStatus } from '@/types/admin/order.type'

export const ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/api/auth/send-otp',
    CHECK_OTP: '/api/auth/check-otp',
    REFRESH_TOKEN: '/api/auth/refresh',
  },
  USER: {
    ME: '/api/user/me',
    LIST: ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => `/api/user/list?page=${page}&limit=${limit}`,
    CHANGE_ROLE: (userId: string) => `/api/user/${userId}/change-role`,
    CHANGE_PROFILE: '/api/user/profile',
  },
  CATEGORIES: {
    LIST: ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => `/api/categories?page=${page}&limit=${limit}`,
    DELETE: (categoryId: string) => `/api/categories/${categoryId}`,
    GET_BY_ID: (categoryId: string) => `/api/categories/${categoryId}`,
    CREATE: '/api/categories',
    UPDATE_BY_ID: (categoryId: string) => `/api/categories/${categoryId}`,
  },
  PRODUCTS: {
    LIST: ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => `/api/products?page=${page}&limit=${limit}`,
    DELETE: (productId: string) => `/api/products/${productId}`,
    DELETE_IMAGE: (productId: string, imageKey: string) => `/api/products/${productId}/image?imageKey=${imageKey}`,
    GET_BY_ID: (productId: string) => `/api/products/${productId}`,
    CREATE: '/api/products',
    UPDATE_BY_ID: (productId: string) => `/api/products/${productId}`,
  },
  COUPONS: {
    LIST: ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => `/api/coupons?page=${page}&limit=${limit}`,
    GET_BY_CODE: (code: string) => `/api/coupons/${code}`,
    CREATE: '/api/coupons',
    TOGGLE_ACTIVE: (couponId: string) => `/api/coupons/${couponId}/toggle-active`,
  },
  ORDERS: {
    LIST: ({ page = 1, limit = 20, status }: { page?: number; limit?: number; status: OrderStatus }) =>
      `/api/orders?status=${status}&page=${page}&limit=${limit}`,
    CHANGE_STATUS: (orderId: string, status: OrderStatus) => `/api/orders/${orderId}/${status}`,
  },
  REVIEWS: {
    LIST: ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => `/api/reviews?page=${page}&limit=${limit}`,
    CHANGE_VISIBILITY: (reviewId: string) => `/api/reviews/${reviewId}/change-visibility`,
  },
}

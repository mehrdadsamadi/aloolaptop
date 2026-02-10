import { OrderStatus } from '@/types/admin/order.type'
import { TopSellingProductsDto } from '@/actions/statistic.action'
import { IPagination } from '@/types/pagination.type'
import { TopSellingProductsSortBy } from '@/lib/enums/topSellingProductsSortBy.enum'

type PaginationQuery = Partial<IPagination>

export const ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/api/auth/send-otp',
    CHECK_OTP: '/api/auth/check-otp',
    REFRESH_TOKEN: '/api/auth/refresh',
  },
  USER: {
    ME: '/api/user/me',
    LIST: ({ page = 1, limit = 20 }: PaginationQuery) => `/api/user/list?page=${page}&limit=${limit}`,
    CHANGE_ROLE: (userId: string) => `/api/user/${userId}/change-role`,
    CHANGE_PROFILE: '/api/user/profile',
  },
  CATEGORIES: {
    LIST: ({ page = 1, limit = 20 }: PaginationQuery) => `/api/categories?page=${page}&limit=${limit}`,
    DELETE: (categoryId: string) => `/api/categories/${categoryId}`,
    GET_BY_ID: (categoryId: string) => `/api/categories/${categoryId}`,
    CREATE: '/api/categories',
    UPDATE_BY_ID: (categoryId: string) => `/api/categories/${categoryId}`,
  },
  PRODUCTS: {
    LIST: ({ page = 1, limit = 20 }: PaginationQuery) => `/api/products?page=${page}&limit=${limit}`,
    DELETE: (productId: string) => `/api/products/${productId}`,
    DELETE_IMAGE: (productId: string, imageKey: string) => `/api/products/${productId}/image?imageKey=${imageKey}`,
    GET_BY_ID: (productId: string) => `/api/products/${productId}`,
    CREATE: '/api/products',
    UPDATE_BY_ID: (productId: string) => `/api/products/${productId}`,
    LATEST: (limit: number) => `/api/products/latest?limit=${limit}`,
    BIGGEST_DISCOUNTS: (limit: number) => `/api/products/biggest-discounts?limit=${limit}`,
    BEST_SELLERS: ({ limit, days }: { limit: number; days: number }) => `/api/products/best-sellers?limit=${limit}&days=${days}`,
  },
  COUPONS: {
    LIST: ({ page = 1, limit = 20 }: PaginationQuery) => `/api/coupons?page=${page}&limit=${limit}`,
    GET_BY_CODE: (code: string) => `/api/coupons/${code}`,
    CREATE: '/api/coupons',
    TOGGLE_ACTIVE: (couponId: string) => `/api/coupons/${couponId}/toggle-active`,
  },
  ORDERS: {
    LIST: ({ page = 1, limit = 20, status }: { page?: number; limit?: number; status: OrderStatus }) =>
      `/api/orders?status=${status}&page=${page}&limit=${limit}`,
    USER_ORDERS_LIST: ({
      page = 1,
      limit = 20,
      status,
      trackingCode,
    }: {
      page?: number
      limit?: number
      status?: OrderStatus
      trackingCode?: string
    }) =>
      `/api/orders/user?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}${trackingCode ? `&trackingCode=${trackingCode}` : ''}`,
    CHANGE_STATUS: (orderId: string, status: OrderStatus) => `/api/orders/${orderId}/${status}`,
    GET_BY_ID: (orderId: string) => `/api/orders/${orderId}`,
  },
  REVIEWS: {
    LIST: ({ page = 1, limit = 20 }: PaginationQuery) => `/api/reviews?page=${page}&limit=${limit}`,
    CHANGE_VISIBILITY: (reviewId: string) => `/api/reviews/${reviewId}/change-visibility`,
  },
  STATISTICS: {
    USERS: '/api/statistics/users',
    PRODUCTS: '/api/statistics/products',
    ORDERS: '/api/statistics/orders',
    PAYMENTS: '/api/statistics/payments',
    TOP_SELLING_PRODUCTS: ({ limit = 10, sortBy = TopSellingProductsSortBy.REVENUE }: TopSellingProductsDto) =>
      `/api/statistics/top-selling-products?limit=${limit}&sortBy=${sortBy}`,
  },
  CART: {
    GET: '/api/cart',
    ADD: '/api/cart/add',
    UPDATE: '/api/cart/update',
    REMOVE_PRODUCT: (productId: string) => `/api/cart/remove/${productId}`,
    CLEAR: '/api/cart/clear',
    APPLY_COUPON: '/api/cart/apply-coupon',
  },
  ADDRESS: {
    LIST: ({ page = 1, limit = 20 }: PaginationQuery) => `/api/address?page=${page}&limit=${limit}`,
    ADD: '/api/address',
    UPDATE_BY_ID: (id: string) => `/api/address/${id}`,
    GET_BY_ID: (id: string) => `/api/address/${id}`,
    DELETE: (id: string) => `/api/address/${id}`,
    SET_DEFAULT: (id: string) => `/api/address/${id}/set-default`,
  },
  CHECKOUT: {
    START: '/api/checkout/start',
    VERIFY: '/api/checkout/verify',
  },
}

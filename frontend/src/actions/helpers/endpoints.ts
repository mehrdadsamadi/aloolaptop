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
  },
  CATEGORIES: {
    LIST: ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => `/api/categories?page=${page}&limit=${limit}`,
    DELETE: (categoryId: string) => `/api/categories/${categoryId}`,
    GET_BY_ID: (categoryId: string) => `/api/categories/${categoryId}`,
    CREATE: '/api/categories',
    UPDATE_BY_ID: (categoryId: string) => `/api/categories/${categoryId}`,
  },
}

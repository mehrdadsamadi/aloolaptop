'use server'

import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { TopSellingProductsSortBy } from '@/lib/enums/topSellingProductsSortBy.enum'

export type TopSellingProductsDto = { limit?: number; sortBy?: TopSellingProductsSortBy }

export async function getUserStats() {
  const res = await apiFetch(ENDPOINTS.STATISTICS.USERS, { method: 'GET' })

  return res.json()
}

export async function getProductStats() {
  const res = await apiFetch(ENDPOINTS.STATISTICS.PRODUCTS, { method: 'GET' })

  return res.json()
}

export async function getOrderStats() {
  const res = await apiFetch(ENDPOINTS.STATISTICS.ORDERS, { method: 'GET' })

  return res.json()
}

export async function getPaymentStats() {
  const res = await apiFetch(ENDPOINTS.STATISTICS.PAYMENTS, { method: 'GET' })

  return res.json()
}

export async function getTopSellingProducts({ limit, sortBy }: TopSellingProductsDto) {
  const res = await apiFetch(ENDPOINTS.STATISTICS.TOP_SELLING_PRODUCTS({ limit, sortBy }), { method: 'GET' })

  return res.json()
}

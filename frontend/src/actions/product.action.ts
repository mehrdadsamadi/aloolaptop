'use server'

import { IPagination } from '@/types/pagination.type'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { ProductFormValues } from '@/validators/product.validator'

export async function getProductsList(queryParams: string) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.LIST(queryParams), { method: 'GET' })

  return res.json()
}

export async function deleteProduct(productId: string) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.DELETE(productId), { method: 'DELETE' })

  return res.json()
}

export async function deleteProductImage(productId: string, imageKey: string) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.DELETE_IMAGE(productId, imageKey), { method: 'DELETE' })

  return res.json()
}

export async function createProduct(data: ProductFormValues) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.CREATE, { method: 'POST', body: JSON.stringify(data) })

  return res.json()
}

export async function getProductById(productId: string) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.GET_BY_ID(productId), { method: 'GET' })

  return res.json()
}

export async function getProductBySlug(productSlug: string) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.GET_BY_SLUG(productSlug), { method: 'GET' })

  return res.json()
}

export async function updateProduct(productId: string, data: ProductFormValues) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.UPDATE_BY_ID(productId), { method: 'PATCH', body: JSON.stringify(data) })

  return res.json()
}

export async function getLatestProducts(limit: number = 8) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.LATEST(limit), { method: 'GET' })

  return res.json()
}

export async function getBiggestDiscounts(limit: number = 8) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.BIGGEST_DISCOUNTS(limit), { method: 'GET' })

  return res.json()
}

export async function getBestSellers({ limit = 8, days = 30 }: { limit?: number; days?: number }) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.BEST_SELLERS({ limit, days }), { method: 'GET' })

  return res.json()
}

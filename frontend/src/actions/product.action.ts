'use server'

import { IPagination } from '@/types/pagination.type'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { ENDPOINTS } from '@/actions/helpers/endpoints'

export async function getProductsList(pagination: IPagination) {
  const { page = 1, limit = 20 } = pagination

  const res = await apiFetch(ENDPOINTS.PRODUCTS.LIST({ page, limit }), { method: 'GET' })

  return res.json()
}

export async function deleteProduct(productId: string) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.DELETE(productId), { method: 'DELETE' })

  return res.json()
}

export async function createProduct(formData: FormData) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.CREATE, { method: 'POST', body: formData })

  return res.json()
}

export async function getProductById(productId: string) {
  const res = await apiFetch(ENDPOINTS.PRODUCTS.GET_BY_ID(productId), { method: 'GET' })

  return res.json()
}

export async function updateProduct(productId: string, formData: FormData) {
  console.log('formData', formData)
  const res = await apiFetch(ENDPOINTS.PRODUCTS.UPDATE_BY_ID(productId), { method: 'PATCH', body: formData })

  return res.json()
}

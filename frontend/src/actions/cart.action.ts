'use server'

import { apiFetch } from '@/actions/helpers/fetchClient'
import { ENDPOINTS } from '@/actions/helpers/endpoints'

export async function addToCart({ productId, quantity = 1 }: { productId: string; quantity?: number }) {
  const res = await apiFetch(ENDPOINTS.CART.ADD, { method: 'POST', body: JSON.stringify({ productId, quantity }) })

  return res.json()
}

export async function getCart() {
  const res = await apiFetch(ENDPOINTS.CART.GET, { method: 'GET' })

  return res.json()
}

export async function updateCart({ productId, quantity }: { productId: string; quantity: number }) {
  const res = await apiFetch(ENDPOINTS.CART.UPDATE, { method: 'PATCH', body: JSON.stringify({ productId, quantity }) })

  return res.json()
}

export async function removeProductFromCart(productId: string) {
  const res = await apiFetch(ENDPOINTS.CART.REMOVE_PRODUCT(productId), { method: 'DELETE' })

  return res.json()
}

export async function clearCart() {
  const res = await apiFetch(ENDPOINTS.CART.CLEAR, { method: 'DELETE' })

  return res.json()
}

export async function applyCouponToCart(code: string) {
  const res = await apiFetch(ENDPOINTS.CART.APPLY_COUPON, { method: 'POST', body: JSON.stringify({ code }) })

  return res.json()
}

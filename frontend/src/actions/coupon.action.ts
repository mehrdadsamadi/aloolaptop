'use server'

import { IPagination } from '@/types/pagination.type'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { ENDPOINTS } from '@/actions/helpers/endpoints'

export async function getCouponsList(pagination: IPagination) {
  const { page = 1, limit = 20 } = pagination

  const res = await apiFetch(ENDPOINTS.COUPONS.LIST({ page, limit }), { method: 'GET' })

  return res.json()
}

export async function getCouponByCode(code: string) {
  const res = await apiFetch(ENDPOINTS.COUPONS.GET_BY_CODE(code), { method: 'GET' })

  return res.json()
}

export async function createCoupon(formData: FormData) {
  const res = await apiFetch(ENDPOINTS.COUPONS.CREATE, { method: 'POST', body: formData })

  return res.json()
}

export async function toggleActiveCoupon(couponId: string) {
  const res = await apiFetch(ENDPOINTS.COUPONS.TOGGLE_ACTIVE(couponId), { method: 'PATCH' })

  return res.json()
}

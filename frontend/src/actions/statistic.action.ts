'use server'

import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { apiFetch } from '@/actions/helpers/fetchClient'

export async function getUserStats() {
  const res = await apiFetch(ENDPOINTS.STATISTICS.USERS, { method: 'GET' })

  return res.json()
}

export async function getProductStats() {
  const res = await apiFetch(ENDPOINTS.STATISTICS.PRODUCTS, { method: 'GET' })

  return res.json()
}

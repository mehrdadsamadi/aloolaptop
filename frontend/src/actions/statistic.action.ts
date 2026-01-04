'use server'

import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { apiFetch } from '@/actions/helpers/fetchClient'

export async function getUserStats() {
  const res = await apiFetch(ENDPOINTS.STATISTICS.USER, { method: 'GET' })

  return res.json()
}

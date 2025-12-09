'use server'

import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { apiFetch } from '@/actions/helpers/fetchClient'

export async function getMe() {
  const res = await apiFetch(ENDPOINTS.USER.ME, { method: 'GET' })

  return res.json()
}

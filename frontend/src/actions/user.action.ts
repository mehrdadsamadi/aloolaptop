'use server'

import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { IPagination } from '@/types/pagination.type'

export async function getMe() {
  const res = await apiFetch(ENDPOINTS.USER.ME, { method: 'GET' })

  return res.json()
}

export async function getUsersList(pagination: IPagination) {
  const { page = 1, limit = 20 } = pagination

  const res = await apiFetch(ENDPOINTS.USER.LIST({ page, limit }), { method: 'GET' })

  return res.json()
}

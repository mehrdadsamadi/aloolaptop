'use server'

import { IPagination } from '@/types/pagination.type'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { ENDPOINTS } from '@/actions/helpers/endpoints'

export async function getReviewsList(pagination: IPagination) {
  const { page = 1, limit = 20 } = pagination

  const res = await apiFetch(ENDPOINTS.REVIEWS.LIST({ page, limit }), { method: 'GET' })

  return res.json()
}

export async function changeVisibility(reviewId: string) {
  const res = await apiFetch(ENDPOINTS.REVIEWS.CHANGE_VISIBILITY(reviewId), { method: 'PATCH' })

  return res.json()
}

'use server'

import { IPagination } from '@/types/pagination.type'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { ICreateCategoryDto } from '@/types/admin/category.type'

export async function getCategoriesList(pagination: IPagination) {
  const { page = 1, limit = 20 } = pagination

  const res = await apiFetch(ENDPOINTS.CATEGORIES.LIST({ page, limit }), { method: 'GET' })

  return res.json()
}

export async function deleteCategory(categoryId: string) {
  const res = await apiFetch(ENDPOINTS.CATEGORIES.DELETE(categoryId), { method: 'DELETE' })

  return res.json()
}

export async function getCategoryById(categoryId: string) {
  const res = await apiFetch(ENDPOINTS.CATEGORIES.GET_BY_ID(categoryId), { method: 'GET' })

  return res.json()
}

export async function createCategory(categoryData: ICreateCategoryDto) {
  const res = await apiFetch(ENDPOINTS.CATEGORIES.CREATE, { method: 'POST', body: JSON.stringify(categoryData) })

  return res.json()
}

'use server'

import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { IPagination } from '@/types/pagination.type'

export async function getAddressList(pagination: IPagination) {
  const { page = 1, limit = 20 } = pagination

  const res = await apiFetch(ENDPOINTS.ADDRESS.LIST({ page, limit }), { method: 'GET' })

  return res.json()
}

export async function getAddressById(addressId: string) {
  const res = await apiFetch(ENDPOINTS.ADDRESS.GET_BY_ID(addressId), { method: 'GET' })

  return res.json()
}

export async function createAddress(formData: FormData) {
  const res = await apiFetch(ENDPOINTS.ADDRESS.ADD, { method: 'POST', body: formData })

  return res.json()
}

export async function updateAddress(addressId: string, formData: FormData) {
  const res = await apiFetch(ENDPOINTS.ADDRESS.UPDATE_BY_ID(addressId), { method: 'PATCH', body: formData })

  return res.json()
}

export async function deleteAddress(addressId: string) {
  const res = await apiFetch(ENDPOINTS.ADDRESS.DELETE(addressId), { method: 'DELETE' })

  return res.json()
}

export async function setDefaultAddress(addressId: string) {
  const res = await apiFetch(ENDPOINTS.ADDRESS.SET_DEFAULT(addressId), { method: 'PATCH' })

  return res.json()
}

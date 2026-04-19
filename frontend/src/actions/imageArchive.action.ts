'use server'

import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { apiFetch } from '@/actions/helpers/fetchClient'
import { IPagination } from '@/types/pagination.type'
import { ImageArchiveFormValues } from '@/validators/imageArchive.validator'

export async function getImageArchiveList(pagination: IPagination) {
  const { page = 1, limit = 20 } = pagination

  const res = await apiFetch(ENDPOINTS.IMAGES_ARCHIVE.LIST({ page, limit }), { method: 'GET' })

  return res.json()
}

// export async function getImageArchiveById(addressId: string) {
//   const res = await apiFetch(ENDPOINTS.IMAGES_ARCHIVE.GET_BY_ID(addressId), { method: 'GET' })

//   return res.json()
// }

export async function addImageArchive(formData: FormData) {
  const res = await apiFetch(ENDPOINTS.IMAGES_ARCHIVE.ADD, { method: 'POST', body: formData })

  return res.json()
}

export async function deleteImageArchive(id: string) {
  const res = await apiFetch(ENDPOINTS.IMAGES_ARCHIVE.DELETE(id), { method: 'DELETE' })

  return res.json()
}

'use server'

import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { apiFetch } from '@/actions/helpers/fetchClient'

export async function startCheckout(addressId: string) {
  const res = await apiFetch(ENDPOINTS.CHECKOUT.START, { method: 'POST', body: JSON.stringify({ addressId }) })

  return res.json()
}

export async function verifyCheckout(authority: string, status: 'OK' | 'NOK') {
  const res = await apiFetch(ENDPOINTS.CHECKOUT.VERIFY, { method: 'POST', body: JSON.stringify({ authority, status }) })

  return res.json()
}

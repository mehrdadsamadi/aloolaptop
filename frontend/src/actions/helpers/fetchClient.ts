'use server'

import { cookies } from 'next/headers'
import { ENDPOINTS } from '@/actions/helpers/endpoints'

export async function apiFetch(input: string, options: RequestInit = {}, retry = true) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }

  const url = new URL(input, process.env.API_URL)

  const res = await fetch(url, {
    ...options,
    method: options.method || 'GET',
    headers,
    cache: 'no-store',
  })

  // اگر access token منقضی شده
  if (res.status === 401 && retry) {
    const refreshed = await refreshTokens()

    if (!refreshed) {
      return res // کاربر باید دوباره لاگین کند
    }

    // دوباره fetch با توکن جدید
    return apiFetch(input, options, false)
  }

  return res
}

async function refreshTokens() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value

  if (!refreshToken) return false

  const url = new URL(ENDPOINTS.AUTH.REFRESH_TOKEN, process.env.API_URL)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  })

  if (!res.ok) return false

  const data = await res.json()

  // ذخیره توکن جدید
  cookieStore.set('access_token', data.accessToken, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' })
  cookieStore.set('refresh_token', data.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' })

  return true
}

'use server'

import { cookies } from 'next/headers'
import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { redirect } from 'next/navigation'
import { handleSetTokensInCookie } from '@/lib/jwtCoockie'

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
      return redirect('/auth') // کاربر باید دوباره لاگین کند
    }

    // دوباره fetch با توکن جدید
    return apiFetch(input, options, false)
  }

  return res
}

export async function refreshTokens() {
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

  const { accessToken, refreshToken: apiRefreshToken } = data
  // ذخیره توکن جدید
  await handleSetTokensInCookie({ accessToken, refreshToken: apiRefreshToken })

  return true
}

'use server'

import { ENDPOINTS } from '@/actions/helpers/endpoints'
import { handleSetTokensInCookie } from '@/lib/jwtCoockie'

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

type CheckOtpResponse = {
  accessToken: string
  refreshToken: string
}

interface JwtPayload {
  exp: number // UNIX timestamp (seconds)
  iat?: number
  [key: string]: any
}

async function postRequest<T>(endpoint: string, body: any, defaultError = 'خطایی رخ داد'): Promise<ApiResponse<T>> {
  try {
    const url = new URL(endpoint, process.env.API_URL)

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        error: data?.messages?.[0] || defaultError,
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Network error:', error)
    return { success: false, error: 'اتصال به سرور برقرار نشد' }
  }
}

export async function sendOtp(mobile: string) {
  return postRequest(ENDPOINTS.AUTH.SEND_OTP, { mobile }, 'خطا در ارسال کد تایید')
}

export async function checkOtp({ mobile, code }: { mobile: string; code: string }) {
  const res = await postRequest<CheckOtpResponse>(ENDPOINTS.AUTH.CHECK_OTP, { mobile, code }, 'کد تایید اشتباه است')

  if (!res.success) return res

  const { accessToken, refreshToken } = res.data!

  await handleSetTokensInCookie({ accessToken, refreshToken })

  return res
}

import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  exp: number
  iat?: number
  [key: string]: any
}

interface SetJwtCookieOptions {
  name: string
  token: string
  cookieOptions?: any
}

async function setJwtCookie({ name, token, cookieOptions = {} }: SetJwtCookieOptions) {
  const cookieStore = await cookies()

  // Decode token
  const payload = jwtDecode<JwtPayload>(token)

  if (!payload.exp) {
    throw new Error(`JWT for cookie "${name}" has no exp claim.`)
  }

  // Convert exp (seconds) → Date
  const expires = new Date(payload.exp * 1000)

  // Set cookie
  cookieStore.set(name, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    ...cookieOptions,
    expires,
  })
}

export async function handleSetTokensInCookie(tokens: { accessToken: string; refreshToken: string }) {
  await setJwtCookie({ name: 'access_token', token: tokens.accessToken })
  await setJwtCookie({ name: 'refresh_token', token: tokens.refreshToken })
}

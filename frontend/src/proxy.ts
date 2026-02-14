// proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Roles } from '@/lib/enums/roles.enum'
import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from '@/lib/jwtCoockie'
import { refreshTokens } from '@/actions/helpers/fetchClient'

const PUBLIC_ROUTES = ['/auth']
const PRIVATE_ROUTES = ['/admin', '/user']
const CALLBACK_ROUTES = ['/checkout/callback'] // مسیرهای کالبک

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const cookieStore = await cookies()

  if (CALLBACK_ROUTES.some((route) => pathname.startsWith(route))) {
    const urlToken = searchParams.get('token')
    const response = NextResponse.next()

    if (urlToken) {
      response.cookies.set('access_token', urlToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 روز
      })
      return response
    }

    return response
  }

  // مثال ساده: بررسی کوکی "token" برای تشخیص لاگین بودن
  let token = request.cookies.get('access_token')?.value
  if (!token && pathname !== '/auth') {
    const refreshed = await refreshTokens()

    if (!refreshed) return NextResponse.redirect(new URL('/auth', request.url))

    const act = cookieStore.get('access_token')!.value
    request.cookies.set('access_token', act)
  }

  token = request.cookies.get('access_token')?.value
  const isLoggedIn = Boolean(token)

  const payload = token ? jwtDecode<JwtPayload>(token) : null
  const role = payload?.role

  // اگر کاربر خواست لاگ اوت کنه
  if (pathname === '/auth/logout') {
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')

    return NextResponse.redirect(new URL('/', request.url))
  }

  // مسیرهای public (صفحات ورود و ثبت نام)
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isLoggedIn) {
      // اگر کاربر لاگین است — هدایت به صفحه پروفایل
      return NextResponse.redirect(new URL('/user', request.url))
    }
    return NextResponse.next()
  }

  // مسیرهای private (صفحات فقط برای کاربران لاگین شده)
  if (PRIVATE_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      // اگر کاربر لاگین نیست — هدایت به صفحه ورود
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    if (pathname.startsWith('/admin') && role !== Roles.ADMIN) {
      return NextResponse.redirect(new URL('/403', request.url))
    }

    return NextResponse.next()
  }

  // همه مسیرهای دیگر — بدون تغییر
  return NextResponse.next()
}

// فقط مسیرهای حساس را بررسی کن (برای کاهش بار روی proxy)
export const config = {
  matcher: [
    '/auth/:path*', // مسیرهای ورود/ثبت نام
    '/admin/:path*', // صفحات ادمین
    '/user/:path*', // صفحات کاربر
    '/checkout/callback/:path*', // صفحات کالبک
  ],
}

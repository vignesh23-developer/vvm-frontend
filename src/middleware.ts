import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getUserRoles, hasRole, Roles } from './utils/roles/roles'

const TOKEN_COOKIE = 'authToken'
const USER_COOKIE = 'userData'

const AUTH_ROUTES = [
  '/otp-verification',
  '/login',
  '/signup',
  '/forgot-password',
  '/profile-creation',
] as const

const safeJsonParse = <T>(value: string | undefined, fallback: T): T => {
  if (!value) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function redirectHomeRequireAuth(
  request: NextRequest,
  pathname: string,
  search: string,
) {
  const home = new URL('/', request.url)
  home.searchParams.set('requireAuth', '1')
  home.searchParams.set('next', `${pathname}${search}`)

  return NextResponse.redirect(home)
}

/** In-app transitions send RSC/prefetch headers; address bar / refresh / new tab typically do not. */
function isNextSoftNavigation(request: NextRequest): boolean {
  const rsc = request.headers.get('RSC') ?? request.headers.get('rsc')

  return (
    rsc === '1' ||
    request.headers.get('Next-Router-Prefetch') === '1'
  )
}

export function middleware(request: NextRequest) {
  const { pathname, host, protocol, search } = request.nextUrl

  // Force non-www
  if (host.startsWith('www.')) {
    const newHost = host.replace('www.', '')

    return NextResponse.redirect(
      `${protocol}//${newHost}${pathname}${search}`,
      301,
    )
  }

  const rawToken = request.cookies.get(TOKEN_COOKIE)?.value

  // authToken may contain a JSON string or the literal JSON null.
  const token = safeJsonParse<string | null>(
    rawToken,
    rawToken ?? null,
  )
  const hasToken =
    typeof token === 'string' && token.trim().length > 0

  const userRaw = request.cookies.get(USER_COOKIE)?.value

  // Legacy /login URL
  if (!hasToken && pathname === '/login') {
    const nextParam = request.nextUrl.searchParams.get('next')
    const safeNext =
      nextParam && nextParam.startsWith('/') ? nextParam : '/'

    return redirectHomeRequireAuth(request, safeNext, '')
  }

  // Legacy /signup URL
  if (!hasToken && pathname === '/signup') {
    const home = new URL('/', request.url)
    let hasSignupParam = false

    for (const key of [
      'referralCode',
      'googleId',
      'email',
      'next',
    ] as const) {
      const value = request.nextUrl.searchParams.get(key)

      if (value) {
        home.searchParams.set(key, value)

        if (key !== 'next') {
          hasSignupParam = true
        }
      }
    }

    if (!hasSignupParam) {
      home.searchParams.set('openSignup', '1')
    }

    return NextResponse.redirect(home)
  }

  // Prevent authenticated users from accessing auth pages
  if (hasToken && AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number])) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Admin routes require authentication
  if (
    !hasToken &&
    (pathname === '/admin' || pathname.startsWith('/admin/'))
  ) {
    return redirectHomeRequireAuth(request, pathname, search)
  }

  // Services listing: hard navigation requires authentication
  if (
    !hasToken &&
    pathname === '/ads-list' &&
    !isNextSoftNavigation(request)
  ) {
    return redirectHomeRequireAuth(request, pathname, search)
  }

  // Property registration: hard navigation requires authentication
  if (
    !hasToken &&
    (
      pathname === '/properties-registration' ||
      pathname.startsWith('/properties-registration/')
    ) &&
    !isNextSoftNavigation(request)
  ) {
    return redirectHomeRequireAuth(request, pathname, search)
  }

  // Admin-only: restrict Ads create/edit pages
  if (pathname === '/ads' || pathname.startsWith('/ads/edit/')) {
    if (!hasToken) {
      return redirectHomeRequireAuth(request, pathname, search)
    }

    const user = safeJsonParse<Record<string, unknown> | null>(
      userRaw,
      null,
    )
    const userRoles = getUserRoles(user)
    const isAdmin = hasRole(userRoles, [Roles.ADMIN])

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/otp-verification',
    '/login',
    '/signup',
    '/forgot-password',
    '/profile-creation',
    '/ads',
    '/ads/edit/:path*',
    '/admin',
    '/admin/:path*',
    '/ads-list',
    '/properties-registration',
    '/properties-registration/:path*',
  ],
}

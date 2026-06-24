'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useLoginModal } from '@/components/auth/LoginModalProvider'

const SIGNUP_QUERY_KEYS = ['referralCode', 'googleId', 'email'] as const

/**
 * Reads auth-related query params and opens the appropriate modal:
 * - `?referralCode=` / `?googleId=` → signup modal
 * - `?requireAuth=1&next=/path` (from middleware) → login modal
 */
export default function RequireAuthQueryHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, loading } = useAuth()
  const { openLoginModal, openSignupModal } = useLoginModal()

  useEffect(() => {
    if (loading) return

    const referralCode = searchParams.get('referralCode')
    const googleId = searchParams.get('googleId')
    const email = searchParams.get('email')
    const openSignup = searchParams.get('openSignup')
    const nextRaw = searchParams.get('next')
    const safeNext = nextRaw && nextRaw.startsWith('/') ? nextRaw : '/'
    const requireAuth = searchParams.get('requireAuth')

    const hasSignupTrigger = Boolean(referralCode || googleId || openSignup === '1')

    if (hasSignupTrigger && !token) {
      openSignupModal({
        next: safeNext,
        referralCode: referralCode ?? undefined,
        googleId: googleId ?? undefined,
        email: email ?? undefined,
      })
      router.replace('/')
      return
    }

    if (requireAuth !== '1') {
      return
    }

    if (token) {
      router.replace(safeNext)
      return
    }

    openLoginModal({ next: safeNext })
    router.replace('/')
  }, [loading, token, searchParams, router, openLoginModal, openSignupModal])

  return null
}

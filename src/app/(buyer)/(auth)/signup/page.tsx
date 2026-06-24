'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'

/** Fallback client redirect when /signup is hit without middleware (preserves query params). */
export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token, loading } = useAuth()
  const { openSignupModal } = useLoginModal()
  const { globalValue } = useGlobalContext()

  useEffect(() => {
    if (loading) return

    if (token) {
      const nextUrl = searchParams.get('next') || globalValue?.isRedirect || '/'
      router.replace(nextUrl.startsWith('/') ? nextUrl : '/')
      return
    }

    const referralCode = searchParams.get('referralCode')
    const googleId = searchParams.get('googleId')
    const email = searchParams.get('email')
    const nextRaw = searchParams.get('next') || globalValue?.isRedirect
    const safeNext = nextRaw && nextRaw.startsWith('/') ? nextRaw : '/'

    openSignupModal({
      next: safeNext,
      referralCode: referralCode ?? undefined,
      googleId: googleId ?? undefined,
      email: email ?? undefined,
    })
    router.replace('/')
  }, [loading, token, searchParams, globalValue?.isRedirect, router, openSignupModal])

  return null
}

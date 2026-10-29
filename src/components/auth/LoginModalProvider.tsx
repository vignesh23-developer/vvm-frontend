'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { OPEN_LOGIN_MODAL_EVENT, type OpenLoginModalEventDetail } from '@/lib/openLoginModalEvent'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import LoginFormPanel from '@/components/auth/LoginFormPanel'
import SignupFormPanel from '@/components/auth/SignupFormPanel'
import { useForgotPasswordModal } from '@/components/auth/ForgotPasswordModalProvider'
import { useTranslations } from 'next-intl'

export type AuthModalMode = 'login' | 'signup'

export type OpenAuthModalOptions = {
  next?: string
  referralCode?: string
  googleId?: string
  email?: string
}

type LoginModalContextValue = {
  openLoginModal: (opts?: OpenAuthModalOptions) => void
  openSignupModal: (opts?: OpenAuthModalOptions) => void
  closeLoginModal: () => void
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null)

export function useLoginModal(): LoginModalContextValue {
  const ctx = useContext(LoginModalContext)
  if (!ctx) {
    throw new Error('useLoginModal must be used within LoginModalProvider')
  }
  return ctx
}

function normalizeNext(raw?: string): string {
  return raw && raw.trim().startsWith('/') ? raw.trim() : '/'
}

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const t = useTranslations()
  const router = useRouter()
  const { openForgotPasswordModal } = useForgotPasswordModal()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<AuthModalMode>('login')
  const [pendingNext, setPendingNext] = useState<string | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [googleId, setGoogleId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  const resetModalState = useCallback(() => {
    setPendingNext(null)
    setReferralCode(null)
    setGoogleId(null)
    setEmail(null)
    setMode('login')
  }, [])

  const closeLoginModal = useCallback(() => {
    setOpen(false)
    resetModalState()
  }, [resetModalState])

  const applyModalOptions = useCallback((opts?: OpenAuthModalOptions) => {
    setPendingNext(normalizeNext(opts?.next))
    setReferralCode(opts?.referralCode ?? null)
    setGoogleId(opts?.googleId ?? null)
    setEmail(opts?.email ?? null)
  }, [])

  const openLoginModal = useCallback(
    (opts?: OpenAuthModalOptions) => {
      applyModalOptions(opts)
      setMode('login')
      setOpen(true)
    },
    [applyModalOptions],
  )

  const openSignupModal = useCallback(
    (opts?: OpenAuthModalOptions) => {
      applyModalOptions(opts)
      setMode('signup')
      setOpen(true)
    },
    [applyModalOptions],
  )

  const handleAuthSuccess = useCallback(
    (path: string) => {
      closeLoginModal()
      router.push(path)
    },
    [closeLoginModal, router],
  )

  const value = useMemo(
    () => ({ openLoginModal, openSignupModal, closeLoginModal }),
    [openLoginModal, openSignupModal, closeLoginModal],
  )

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenLoginModalEventDetail>).detail
      openLoginModal({ next: detail?.next })
    }

    window.addEventListener(OPEN_LOGIN_MODAL_EVENT, onOpen)

    return () => {
      window.removeEventListener(OPEN_LOGIN_MODAL_EVENT, onOpen)
    }
  }, [openLoginModal])

  const nextForForm = pendingNext ?? '/'

  return (
    <LoginModalContext.Provider value={value}>
      {children}
      <ModalComponent
        open={open}
        title={mode === 'signup' ? t('Auth.signup') : t('Auth.login')}
        onClose={closeLoginModal}
        widthClass="max-w-lg"
        scrollable
        overlayClassName="z-[100]"
        panelClassName="sm:max-h-[min(90dvh,calc(100vh-2rem))]"
        contentClassName="pr-1 -mr-1"
      >
        {mode === 'login' ? (
          <LoginFormPanel
            nextPath={nextForForm}
            referralCodeFromUrl={referralCode}
            showHeader={false}
            onLoginSuccess={handleAuthSuccess}
            onSwitchToSignup={() => setMode('signup')}
            onForgotPasswordClick={() => {
              closeLoginModal()
              openForgotPasswordModal()
            }}
          />
        ) : (
          <SignupFormPanel
            nextPath={nextForForm}
            referralCode={referralCode}
            googleId={googleId}
            email={email}
            showHeader={false}
            onSwitchToLogin={() => setMode('login')}
            onSignupSuccess={handleAuthSuccess}
          />
        )}
      </ModalComponent>
    </LoginModalContext.Provider>
  )
}

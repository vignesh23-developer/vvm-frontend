'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { OPEN_LOGIN_MODAL_EVENT, type OpenLoginModalEventDetail } from '@/lib/openLoginModalEvent'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import LoginFormPanel from '@/components/auth/LoginFormPanel'
import { useForgotPasswordModal } from '@/components/auth/ForgotPasswordModalProvider'
import { useTranslations } from 'next-intl'

export type OpenLoginModalOptions = {
  next?: string
}

type LoginModalContextValue = {
  openLoginModal: (opts?: OpenLoginModalOptions) => void
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

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const t = useTranslations()
  const router = useRouter()
  const { openForgotPasswordModal } = useForgotPasswordModal()
  const [open, setOpen] = useState(false)
  const [pendingNext, setPendingNext] = useState<string | null>(null)

  const closeLoginModal = useCallback(() => {
    setOpen(false)
    setPendingNext(null)
  }, [])

  const openLoginModal = useCallback((opts?: OpenLoginModalOptions) => {
    const raw = opts?.next
    const n = raw && raw.trim().startsWith('/') ? raw.trim() : '/'
    setPendingNext(n)
    setOpen(true)
  }, [])

  const handleLoginSuccess = useCallback(
    (path: string) => {
      closeLoginModal()
      router.push(path)
    },
    [closeLoginModal, router],
  )

  const value = useMemo(() => ({ openLoginModal, closeLoginModal }), [openLoginModal, closeLoginModal])

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenLoginModalEventDetail>).detail
      openLoginModal({ next: detail?.next })
    }
    window.addEventListener(OPEN_LOGIN_MODAL_EVENT, onOpen as EventListener)
    return () => window.removeEventListener(OPEN_LOGIN_MODAL_EVENT, onOpen as EventListener)
  }, [openLoginModal])

  const nextForForm = pendingNext ?? '/'

  return (
    <LoginModalContext.Provider value={value}>
      {children}
      <ModalComponent
        open={open}
        title={t('Auth.login')}
        onClose={closeLoginModal}
        widthClass="max-w-md"
        scrollable
        overlayClassName="z-[100]"
        panelClassName="sm:max-h-[min(90dvh,calc(100vh-2rem))]"
        contentClassName="pr-1 -mr-1"
      >
        <LoginFormPanel
          nextPath={nextForForm}
          showHeader={false}
          onLoginSuccess={handleLoginSuccess}
          onBeforeSignupNavigate={closeLoginModal}
          onForgotPasswordClick={() => {
            closeLoginModal()
            openForgotPasswordModal()
          }}
        />
      </ModalComponent>
    </LoginModalContext.Provider>
  )
}

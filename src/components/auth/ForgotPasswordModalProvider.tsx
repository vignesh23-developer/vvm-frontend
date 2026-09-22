'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import ForgotPasswordFormPanel from '@/components/auth/ForgotPasswordFormPanel'
import { useLoginModal } from '@/components/auth/LoginModalProvider'
import { useTranslations } from 'next-intl'

type ForgotPasswordModalContextValue = {
  open: boolean
  openForgotPasswordModal: () => void
  closeForgotPasswordModal: () => void
}

const ForgotPasswordModalContext = createContext<ForgotPasswordModalContextValue | null>(null)

export function useForgotPasswordModal(): ForgotPasswordModalContextValue {
  const ctx = useContext(ForgotPasswordModalContext)
  if (!ctx) {
    throw new Error('useForgotPasswordModal must be used within ForgotPasswordModalProvider')
  }
  return ctx
}

function ForgotPasswordModalOverlay() {
  const t = useTranslations()
  const { open, closeForgotPasswordModal } = useForgotPasswordModal()
  const { openLoginModal } = useLoginModal()

  const handleBackToLogin = useCallback(() => {
    closeForgotPasswordModal()
    openLoginModal()
  }, [closeForgotPasswordModal, openLoginModal])

  return (
    <ModalComponent
      open={open}
      title={t('Auth.forgot_password')}
      onClose={closeForgotPasswordModal}
      widthClass="max-w-md"
      scrollable
      overlayClassName="z-[100]"
      panelClassName="sm:max-h-[min(90dvh,calc(100vh-2rem))]"
      contentClassName="pr-1 -mr-1"
    >
      <ForgotPasswordFormPanel
        showHeader={false}
        isActive={open}
        onBackToLogin={handleBackToLogin}
        onResetSuccess={() => {
          closeForgotPasswordModal()
          openLoginModal()
        }}
      />
    </ModalComponent>
  )
}

export function ForgotPasswordModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const closeForgotPasswordModal = useCallback(() => {
    setOpen(false)
  }, [])

  const openForgotPasswordModal = useCallback(() => {
    setOpen(true)
  }, [])

  const value = useMemo(
    () => ({ open, openForgotPasswordModal, closeForgotPasswordModal }),
    [open, openForgotPasswordModal, closeForgotPasswordModal],
  )

  return <ForgotPasswordModalContext.Provider value={value}>{children}</ForgotPasswordModalContext.Provider>
}

/** Renders the forgot-password modal; must be mounted inside LoginModalProvider */
export function ForgotPasswordModalOverlayHost() {
  return <ForgotPasswordModalOverlay />
}

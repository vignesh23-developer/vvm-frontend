'use client'

import {
  ReactNode,
  useState,
  useMemo,
  useEffect,
  createContext,
  useContext,
} from 'react'
import { NextIntlClientProvider } from 'next-intl'
import en from '../../../messages/en.json'
import ta from '../../../messages/ta.json'

const messagesMap: Record<string, any> = { en, ta }

type TranslationContextType = {
  locale: 'en' | 'ta'
  setLocale: (locale: 'en' | 'ta') => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
)

export const useTranslationContext = () => {
  const ctx = useContext(TranslationContext)
  if (!ctx)
    throw new Error(
      'useTranslationContext must be used within TranslationProvider',
    )
  return ctx
}

export default function TranslationProvider({
  children,
}: {
  children: ReactNode
}) {
  const [locale, setLocaleState] = useState<'en' | 'ta'>('ta')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const savedLocale = (localStorage.getItem('locale') as 'en' | 'ta') || 'ta'
    setLocaleState(savedLocale)
    setIsClient(true)
  }, [])

  const setLocale = (newLocale: 'en' | 'ta') => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const value = useMemo(() => ({ locale, setLocale }), [locale])

  if (!isClient) {
    // 🧩 Avoid rendering mismatched content
    return null
  }

  return (
    <TranslationContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        timeZone="Asia/Kolkata"
        messages={messagesMap[locale]}
      >
        {children}
      </NextIntlClientProvider>
    </TranslationContext.Provider>
  )
}

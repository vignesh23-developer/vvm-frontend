'use client'

import { ReactNode, useState, useMemo, createContext, useContext } from 'react'
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
  if (!ctx) {
    throw new Error(
      'useTranslationContext must be used within TranslationProvider',
    )
  }
  return ctx
}

export default function TranslationProvider({
  children,
}: {
  children: ReactNode
}) {
  const [locale, setLocale] = useState<'en' | 'ta'>('ta')

  const timeZone = 'Asia/Kolkata'

  const value = useMemo(() => ({ locale, setLocale }), [locale])

  return (
    <TranslationContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        timeZone={timeZone}
        messages={messagesMap[locale]}
      >
        {children}
      </NextIntlClientProvider>
    </TranslationContext.Provider>
  )
}

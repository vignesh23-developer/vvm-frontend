import React from 'react'
import { Globe } from 'lucide-react'
import { useTranslationContext } from '@/hooks/Translation/TranslationProvider'
import { useRouter } from 'next/navigation'

const LanguageSwitch = () => {
  const { locale, setLocale } = useTranslationContext()
  const router = useRouter()

  const handleLanguageChange = (newLang: 'ta' | 'en') => {
    setLocale(newLang)
    router.refresh()
  }

  const languageLabels = {
    en: 'English',
    ta: 'தமிழ்',
  }

  return (
    <div className="relative">
      <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium transition border border-white/20">
        <Globe size={18} />
        <span>{languageLabels[locale]}</span>
      </button>
      <select
        value={locale}
        onChange={e => handleLanguageChange(e.target.value as 'ta' | 'en')}
        className="absolute inset-0 opacity-0 cursor-pointer"
      >
        <option value="en">English</option>
        <option value="ta">தமிழ்</option>
      </select>
    </div>
  )
}

export default LanguageSwitch

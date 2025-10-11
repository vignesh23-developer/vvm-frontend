import React from 'react'
import { Globe } from 'lucide-react'
import { useTranslationContext } from '@/hooks/Translation/TranslationProvider'
import { useRouter } from 'next/navigation'

const LanguageSwitch = () => {
  const { locale, setLocale } = useTranslationContext()
  const router = useRouter()

  const handleLanguageChange = (newLang: 'en' | 'ta') => {
    setLocale(newLang)
    router.refresh()
  }

  console.log(locale, 'locale')
  return (
    <div className="relative">
      <button className="flex items-center gap-2 bg-transparent hover:bg-gray-500 px-3 py-2 rounded-lg text-sm font-medium transition">
        <Globe size={18} />
        <span className="uppercase">{locale}</span>
      </button>
      <select
        value={locale}
        onChange={e => handleLanguageChange(e.target.value as 'en' | 'ta')}
        className="absolute inset-0 opacity-0 cursor-pointer"
      >
        <option value="en" className="text-black">
          EN
        </option>
        <option value="ta" className="text-black">
          TA
        </option>
      </select>
    </div>
  )
}

export default LanguageSwitch

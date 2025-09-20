'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslationContext } from '../../hooks/Translation/TranslationProvider'
import { useTranslations } from 'next-intl'

const navLinks = [
  { label: 'home', href: '/home' },
  { label: 'services', href: '/services' },
  { label: 'about_us', href: '/about' },
  { label: 'help_center', href: '/help-center' },
  { label: 'pricing', href: '/pricing' },
]

export default function Navbar() {
  const t = useTranslations('Auth')
  const tNav = useTranslations('Navbar')
  const [isOpen, setIsOpen] = useState(false)
  const { locale, setLocale } = useTranslationContext()
  const router = useRouter()

  const handleLanguageChange = (newLang: 'en' | 'ta') => {
    setLocale(newLang)
    router.refresh() // Refresh to load new locale messages
  }

  return (
    <nav className="bg-[#3b1804] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <Link href="/home" className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex gap-10">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`relative group hover:text-gray-300 transition-colors ${
              label === 'Home' ? 'font-medium' : ''
            }`}
          >
            {tNav(label)}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
          </Link>
        ))}
      </div>

      {/* Right Side Actions (Language + Login) */}
      <div className="hidden md:flex items-center gap-4">
        {/* Language Switcher */}
        <div className="relative">
          <button className="flex items-center gap-2 bg-[#4b2410] hover:bg-[#5a2b13] px-3 py-2 rounded-lg text-sm font-medium transition">
            <Globe size={18} />
            <span className="uppercase">{locale}</span>
          </button>
          <select
            value={locale}
            onChange={e => handleLanguageChange(e.target.value as 'en' | 'ta')}
            className="absolute text-color-red inset-0 opacity-0 cursor-pointer"
          >
            <option value="en" className="text-black">
              EN
            </option>
            <option value="ta" className="text-black">
              TA
            </option>
          </select>
        </div>

        {/* Login Button */}
        <Link
          href="/login"
          className="flex items-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          {t('login')} <ArrowRight size={18} />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-[#4b2410] transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-[#3b1804] flex flex-col items-center gap-6 px-6 py-6 md:hidden shadow-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 max-h-screen'
            : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-2 hover:text-gray-300 transition-colors"
          >
            {label}
          </Link>
        ))}

        {/* Mobile Language Switcher */}
        <div className="flex items-center gap-2 w-full justify-center">
          <Globe size={20} />
          <select
            value={locale}
            onChange={e => handleLanguageChange(e.target.value as 'en' | 'ta')}
            className="bg-[#3b1804] text-white border border-white rounded-md px-2 py-1 text-sm focus:outline-none"
          >
            <option value="en">EN</option>
            <option value="ta">TA</option>
          </select>
        </div>

        {/* Login Button */}
        <Link
          href="/login"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full justify-center"
        >
          Login <ArrowRight size={18} />
        </Link>
      </div>
    </nav>
  )
}

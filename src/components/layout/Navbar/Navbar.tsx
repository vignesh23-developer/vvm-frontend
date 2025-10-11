'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Menu, X, Globe, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslationContext } from '@/hooks/Translation/TranslationProvider'
import { useTranslations } from 'next-intl'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'

export interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  logoSrc?: string
  navLinks?: NavLink[]
  showLoginButton?: boolean
  showLanguageSelector?: boolean
  bgColor?: string
  user?: {
    name: string
    avatar?: string
  } | null
}

export default function Navbar({
  logoSrc = '/logo.png',
  navLinks = [
    { label: 'home', href: '/home' },
    { label: 'services', href: '/services' },
    { label: 'about_us', href: '/about' },
    { label: 'help_center', href: '/help-center' },
    { label: 'pricing', href: '/pricing' },
  ],
  showLoginButton = true,
  showLanguageSelector = true,
  bgColor = '#3b1804',
  user = null,
}: NavbarProps) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { locale, setLocale } = useTranslationContext()
  const router = useRouter()

  const handleLanguageChange = (newLang: 'en' | 'ta') => {
    setLocale(newLang)
    router.refresh()
  }

  const handleLogout = () => {
    console.log('User logged out')
    router.push('/login')
  }

  return (
    <nav
      className="text-white px-4 sm:px-6 md:px-10 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50 shadow-md transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {/* Logo */}
      <Link href="/home" className="flex items-center flex-shrink-0">
        <Image
          src={logoSrc}
          alt="Logo"
          width={160}
          height={60}
          className="w-[140px] sm:w-[160px] md:w-[180px] object-contain"
          unoptimized
          priority
        />
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex gap-8 xl:gap-10">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="relative group hover:text-gray-300 transition-colors text-sm md:text-base font-medium"
          >
            {t(`Navbar.${label}`)}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
          </Link>
        ))}
      </div>

      {/* Right Side (Desktop) */}
      <div className="hidden md:flex items-center gap-3 sm:gap-4 relative">
        {/* Language Selector */}
        {showLanguageSelector && (
          // <div className="relative">
          //   <button className="flex items-center gap-2 bg-[#4b2410] hover:bg-[#5a2b13] px-3 py-2 rounded-lg text-sm font-medium transition">
          //     <Globe size={18} />
          //     <span className="uppercase">{locale}</span>
          //   </button>
          //   <select
          //     value={locale}
          //     onChange={e =>
          //       handleLanguageChange(e.target.value as 'en' | 'ta')
          //     }
          //     className="absolute inset-0 opacity-0 cursor-pointer"
          //   >
          //     <option value="en" className="text-black">
          //       EN
          //     </option>
          //     <option value="ta" className="text-black">
          //       TA
          //     </option>
          //   </select>
          // </div>
          <LanguageSwitch />
        )}

        {/* Profile / Login */}
        {user ? (
          <div className="relative">
            {/* Profile Avatar */}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 bg-white text-[#3b1804] p-1.5 sm:px-3 sm:py-2 rounded-full hover:bg-gray-200 transition"
            >
              <Image
                src={user.avatar || '/default-avatar.png'}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white text-[#3b1804] rounded-lg shadow-lg w-44 py-2 z-50 flex flex-col">
                <div className="px-4 py-2 border-b border-gray-200">
                  <span className="font-semibold text-sm block truncate">
                    {user.name}
                  </span>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-sm"
                >
                  <User size={16} /> {t('Navbar.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm"
                >
                  <LogOut size={16} /> {t('Navbar.logout')}
                </button>
              </div>
            )}
          </div>
        ) : (
          showLoginButton && (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-white text-[#3b1804] px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm md:text-base"
            >
              {t(`Auth.login`)} <ArrowRight size={18} />
            </Link>
          )
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-[#4b2410] transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown */}
      <div
        style={{ backgroundColor: bgColor }}
        className={`absolute top-full left-0 w-full flex flex-col items-center px-6 py-6 lg:hidden shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0 max-h-[600px]'
            : 'opacity-0 -translate-y-5 max-h-0 overflow-hidden'
        }`}
      >
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-2 text-base font-medium hover:text-gray-300 transition-colors"
          >
            {t(`Navbar.${label}`)}
          </Link>
        ))}

        {showLanguageSelector && (
          <div className="flex items-center gap-2 w-full justify-center mt-4">
            <Globe size={20} />
            <select
              value={locale}
              onChange={e =>
                handleLanguageChange(e.target.value as 'en' | 'ta')
              }
              className="bg-transparent border border-white text-white rounded-md px-2 py-1 text-sm focus:outline-none"
            >
              <option value="en">EN</option>
              <option value="ta">TA</option>
            </select>
          </div>
        )}

        {/* Profile or Login for Mobile */}
        {user ? (
          <div className="flex flex-col items-center gap-3 mt-4 w-full">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition w-full justify-center"
            >
              <User size={18} /> {t('Navbar.profile')}
            </Link>
            <button
              onClick={() => {
                setIsOpen(false)
                handleLogout()
              }}
              className="flex items-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition w-full justify-center"
            >
              <LogOut size={18} /> {t('Navbar.logout')}
            </button>
          </div>
        ) : (
          showLoginButton && (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition w-full justify-center mt-4"
            >
              {t(`Auth.login`)} <ArrowRight size={18} />
            </Link>
          )
        )}
      </div>
    </nav>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Globe, User, LogOut, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslationContext } from '@/hooks/Translation/TranslationProvider'
import { useTranslations } from 'next-intl'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'

export interface NavLink {
  label: string
  href: string
  subMenu?: NavLink[]
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
  const { locale, setLocale } = useTranslationContext()
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

  const handleLanguageChange = (lang: 'en' | 'ta') => {
    setLocale(lang)
    router.refresh()
  }

  const handleLogout = () => {
    console.log('User logged out')
    router.push('/login')
  }

  return (
    <nav
      className="sticky top-0 z-50 shadow-md text-white transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-3 md:py-4">
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <Image
            src={logoSrc}
            alt="Logo"
            width={160}
            height={60}
            className="w-[130px] sm:w-[150px] md:w-[170px] lg:w-[180px] object-contain"
            priority
            unoptimized
          />
        </Link>

        {/* ✅ Desktop Navigation with Submenu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
          {navLinks.map(({ label, href, subMenu }) => (
            <div key={href} className="relative group">
              <Link
                href={href}
                className="relative text-sm md:text-base font-medium hover:text-gray-300 transition"
              >
                {t(`Navbar.${label}`)}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* ✅ Show submenu on hover */}
              {subMenu && subMenu.length > 0 && (
                <div className="absolute left-0 top-full mt-2 bg-white text-[#3b1804] rounded-lg shadow-lg w-56 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-50">
                  {subMenu.map(sub => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                      {t(`Navbar.subMenus.${sub.label}`)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4 relative">
          {showLanguageSelector && <LanguageSwitch />}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-white text-[#3b1804] p-1.5 rounded-full hover:bg-gray-200 transition"
              >
                <Image
                  src={user.avatar || '/default-avatar.png'}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 bg-white text-[#3b1804] rounded-lg shadow-lg w-44 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <span className="font-semibold text-sm truncate block">
                      {user.name}
                    </span>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm transition"
                  >
                    <User size={16} /> {t('Navbar.profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition"
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
                className="flex items-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm md:text-base"
              >
                {t('Auth.login')} <ArrowRight size={18} />
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-[#4b2410] transition"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile / Tablet Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen
            ? 'max-h-[500px] opacity-100 translate-y-0'
            : 'max-h-0 opacity-0 -translate-y-3'
        }`}
      >
        <div
          style={{ backgroundColor: bgColor }}
          className="flex flex-col items-center px-6 py-6 shadow-md text-center"
        >
          {navLinks.map(({ label, href, subMenu }) => (
            <div key={href} className="w-full">
              <button
                onClick={() =>
                  subMenu
                    ? setOpenSubMenu(openSubMenu === label ? null : label)
                    : setIsMenuOpen(false)
                }
                className="py-2 w-full text-base font-medium flex justify-between items-center hover:text-gray-300 transition"
              >
                <span>{t(`Navbar.${label}`)}</span>
                {subMenu && (
                  <span className="text-sm">
                    {openSubMenu === label ? '▲' : '▼'}
                  </span>
                )}
              </button>

              {/* ✅ Expandable submenu */}
              {subMenu && openSubMenu === label && (
                <div className="flex flex-col ml-4">
                  {subMenu.map(sub => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="py-1 text-sm text-gray-200 hover:text-white transition"
                    >
                      {t(`Navbar.${sub.label}`)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Language Selector */}
          {showLanguageSelector && (
            <div className="flex items-center gap-2 mt-4">
              <Globe size={18} />
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

          {/* Auth Buttons */}
          {user ? (
            <div className="flex flex-col gap-3 mt-4 w-full">
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                <User size={18} /> {t('Navbar.profile')}
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  handleLogout()
                }}
                className="flex items-center justify-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                <LogOut size={18} /> {t('Navbar.logout')}
              </button>
            </div>
          ) : (
            showLoginButton && (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition mt-4"
              >
                {t('Auth.login')} <ArrowRight size={18} />
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}

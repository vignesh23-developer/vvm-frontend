'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Menu,
  X,
  Globe,
  User,
  LogOut,
  ArrowRight,
  Building,
  ChevronUp,
  ChevronDown,
  Shield,
  Home,
  Building2,
  Grip,
  Megaphone,
  CreditCard,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslationContext } from '@/hooks/Translation/TranslationProvider'
import { useTranslations } from 'next-intl'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import { getLocalStorageItem, removeLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import Button from '@/components/ui/CustomComponent/Button/Button'

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
    email?: string
  } | null
}

interface userData {
  firstName: string
  lastName: string
  email: string
}

export default function Navbar({
  logoSrc = '/logo.png',
  navLinks = [
    { label: 'home', href: '/' },
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
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)
  const [userValue, setUserValue] = useState<any | null>(null)
  // track independently-open sections (desktop & mobile)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const gripRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const toggleSection = (key: string) =>
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  useEffect(() => {
    const authToken = getLocalStorageItem('authToken')
    const userData = getLocalStorageItem('userData') as userData

    if (authToken && userData) {
      setUserValue({
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
      })
    }
  }, [])

  // Close grip and profile dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function onDocumentClick(e: MouseEvent | TouchEvent) {
      const target = e.target as Node
      if (gripRef.current && !gripRef.current.contains(target)) {
        setIsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false)
      }
    }

    function onFocusIn(e: FocusEvent) {
      const target = e.target as Node
      // if focus moved outside grip/menu, close it
      if (gripRef.current && !gripRef.current.contains(target)) {
        setIsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false)
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', onDocumentClick)
    document.addEventListener('touchstart', onDocumentClick)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('mousedown', onDocumentClick)
      document.removeEventListener('touchstart', onDocumentClick)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('keydown', onKey)
    }
  }, [gripRef, profileRef])

  // Lock body scroll when any menu/dropdown is open; allow the dropdown itself to scroll
  // useEffect(() => {
  //   if (typeof document === 'undefined') return

  //   const originalOverflow = document.body.style.overflow
  //   const anyOpen = isMenuOpen || isOpen || isProfileOpen || openSections.size > 0

  //   // hide scroll when any overlay is open
  //   if (anyOpen) {
  //     document.body.style.overflow = 'hidden'
  //   } else {
  //     document.body.style.overflow = originalOverflow
  //   }

  //   // cleanup (always restore original)
  //   return () => {
  //     document.body.style.overflow = originalOverflow
  //   }
  // }, [isMenuOpen, isOpen, isProfileOpen, openSections])

  // no debug logs in production code

  const handleLanguageChange = (lang: 'ta' | 'en') => {
    setLocale(lang)
    router.refresh()
  }

  const handleLogout = () => {
    // Clear auth token and redirect to login
    removeLocalStorageItem('authToken')
    removeLocalStorageItem('userData')
    router.push('/login')
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) router.push(value)
  }

  return (
    <nav className="sticky top-0 z-50 shadow-md text-white transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
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
              <Link href={href} className="relative text-sm md:text-base font-medium hover:text-gray-300 transition">
                {t(`Navbar.${label}`)}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* ✅ Show submenu on hover */}
              {subMenu && subMenu.length > 0 && (
                <div className="absolute left-0 top-full mt-2 bg-white text-[#3b1804] rounded-lg shadow-lg w-56 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-50">
                  {subMenu.map(sub => (
                    <Link key={sub.href} href={sub.href} className="block px-4 py-2 text-sm hover:bg-gray-100 transition">
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

          <div className="relative grip-menu" ref={gripRef}>
            {/* Grip Icon */}
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className="cursor-pointer p-2 hover:bg-gray-400 rounded-md transition focus:outline-none focus:ring-2 focus:ring-primary-300"
              title={'common:site_menu'}
              aria-label={'common:site_menu'}
            >
              <Grip />
            </button>

            {/* Main Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 bg-white text-[#3b1804] rounded-lg shadow-lg w-70 py-2 z-50 max-h-[70vh] overflow-y-auto">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm transition">
                  <Home size={16} /> {t('Navbar.Dashboard')}
                </Link>

                {[
                  {
                    key: 'masters',
                    title: t('Navbar.masters'),
                    icon: <Shield size={16} className="text-[#3b1804]" />,
                    links: [
                      ['/admin/dashboard/feature-group', t('Navbar.subMenus.feature group')],
                      ['/admin/dashboard/feature-category', t('Navbar.subMenus.feature categories')],
                      ['/admin/dashboard/property-category', t('Navbar.subMenus.property categories')],
                      ['/admin/dashboard/ads-category', t('Navbar.subMenus.ads categories')],
                      ['/admin/dashboard/promo-code', t('Navbar.subMenus.promo code')],
                      ['/admin/dashboard/referral-management', t('Navbar.subMenus.referral management')],
                    ],
                  },
                  {
                    key: 'properties',
                    title: t('Navbar.properties'),
                    icon: <Building size={16} className="text-[#3b1804]" />,
                    links: [
                      ['/admin/dashboard', t('Navbar.subMenus.properties management')],
                      ['/admin/dashboard/properties', t('Navbar.subMenus.properties pending approval')],
                      ['/admin/dashboard/favourite-properties', t('Navbar.subMenus.favourite properties')],
                      ['/admin/dashboard/reported-properties', t('Navbar.subMenus.reported properties')],
                      ['/admin/dashboard/property-enquiry', t('Navbar.subMenus.view enquiries')],
                      ['/admin/dashboard/saved-searches', t('Navbar.subMenus.saved searches')],
                      ['/admin/dashboard/recently-viewed', t('Navbar.subMenus.recently viewed properties')],
                      ['/admin/dashboard/contact-requests', t('Navbar.subMenus.contact requests')],
                    ],
                  },
                  {
                    key: 'ads',
                    title: t('Navbar.ads'),
                    icon: <Megaphone size={16} className="text-[#3b1804]" />,
                    links: [
                      ['/ads/list', t('Navbar.subMenus.ads management')],
                      ['/admin/dashboard/ads-pending-approval', t('Navbar.subMenus.ads pending approval')],
                      ['/admin/dashboard/recent-ads', t('Navbar.subMenus.view recent ads')],
                      ['/admin/dashboard/favourite-ads', t('Navbar.subMenus.favourite ads')],
                      ['/admin/dashboard/reported-ads', t('Navbar.subMenus.reported ads')],
                      ['/admin/dashboard/ads-enquiries', t('Navbar.subMenus.view enquiries')],
                    ],
                  },
                  {
                    key: 'subscription',
                    title: t('Navbar.subscription'),
                    icon: <CreditCard size={16} className="text-[#3b1804]" />,
                    links: [
                      ['/admin/dashboard/subscription-master', t('Navbar.subMenus.subscription master')],
                      ['/admin/dashboard/my-subscription', t('Navbar.subMenus.my subscription')],
                      ['/admin/dashboard/user-subscription', t('Navbar.subMenus.user subscription')],
                    ],
                  },
                  {
                    key: 'payments',
                    title: t('Navbar.payments'),
                    icon: <CreditCard size={16} className="text-[#3b1804]" />,
                    links: [
                      ['/admin/dashboard/view-transactions', t('Navbar.subMenus.view transactions')],
                      ['/admin/dashboard/payment-reports', t('Navbar.subMenus.payment reports / revenue summary')],
                      ['/admin/dashboard/refund-management', t('Navbar.subMenus.refund management')],
                      ['/admin/dashboard/promo-usage-reports', t('Navbar.subMenus.promo usage reports')],
                    ],
                  },
                ].map(section => (
                  <div key={section.key} className="border-t border-gray-100 mt-2 pt-2">
                    <Button
                      onClick={() => toggleSection(section.key)}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-[#3b1804] hover:bg-gray-100 rounded-md transition"
                    >
                      <span className="flex items-center gap-2">
                        {section.icon}
                        {section.title}
                      </span>
                      {openSections.has(section.key) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>

                    {openSections.has(section.key) && (
                      <div className="flex flex-col pl-8 mt-1">
                        {section.links.map(([href, label]) => (
                          <Link key={String(href)} href={String(href)} className="py-1 hover:bg-gray-100 rounded-md text-sm transition">
                            {label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {userValue ? (
            <div className="relative" ref={profileRef}>
              <Button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-white text-[#3b1804] p-1 rounded-full hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
                aria-label={t('Navbar.profile')}
              >
                <Image src={userValue?.image ?? '/avatar.png'} alt={userValue?.firstName ?? 'Avatar'} width={32} height={32} className="rounded-lg" />
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 bg-white text-[#3b1804] rounded-lg shadow-lg w-44 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <span className="font-semibold text-sm truncate block">
                      {userValue?.firstName} {userValue?.lastName}
                    </span>
                  </div>
                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm transition">
                    <User size={16} /> {t('Navbar.profile')}
                  </Link>
                  <Button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition">
                    <LogOut size={16} /> {t('Navbar.logout')}
                  </Button>
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
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-[#4b2410] transition"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile / Tablet Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[80vh] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-3'
        }`}
        style={{ overflow: isMenuOpen ? 'auto' : 'hidden' }}
      >
        <div
          style={{ backgroundColor: bgColor }}
          className="flex flex-col items-center px-5 py-5 shadow-lg text-center rounded-b-2xl bg-opacity-95 backdrop-blur-md"
        >
          {/* Navigation Links */}
          {navLinks.map(({ label, href, subMenu }) => (
            <div key={href} className="w-full border-b border-white/20 last:border-0">
              <Button
                onClick={() => (subMenu ? setOpenSubMenu(openSubMenu === label ? null : label) : setIsMenuOpen(false))}
                className="py-3 w-full text-base font-medium flex justify-between items-center text-white hover:text-gray-300 transition-all"
              >
                <span>{t(`Navbar.${label}`)}</span>
                {subMenu && <span className="text-sm transform transition-transform duration-200">{openSubMenu === label ? '▲' : '▼'}</span>}
              </Button>

              {/* Submenu */}
              {subMenu && openSubMenu === label && (
                <div className="flex flex-col ml-3 mb-2">
                  {subMenu.map(sub => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="py-2 text-sm text-gray-200 hover:text-white transition"
                    >
                      {t(`Navbar.subMenus.${sub.label}`)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Language Selector */}
          {showLanguageSelector && (
            <div className="flex items-center gap-2 mt-4 text-white">
              <Globe size={18} />
              <select
                value={locale}
                onChange={e => handleLanguageChange(e.target.value as 'en' | 'ta')}
                className="bg-transparent border border-white/40 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:border-white"
              >
                <option value="en">EN</option>
                <option value="ta">TA</option>
              </select>
            </div>
          )}

          {/* Mobile Grip / Main Dropdown */}
          <div className="w-full mt-4">
            {/* Toggle Button */}
            <Button
              onClick={() => setIsOpen(prev => !prev)}
              className="w-full flex justify-between items-center py-3 px-4 bg-white/10 rounded-lg hover:bg-white/20 text-white text-sm font-medium transition"
            >
              {t('Navbar.masters')}
              <span className="text-sm">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
            </Button>

            {/* Dropdown Links */}
            {isOpen && (
              <div className="flex flex-col w-full bg-white text-[#3b1804] rounded-lg mt-1 shadow-md overflow-hidden">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm">
                  <Home size={16} /> {t('Navbar.home')}
                </Link>

                <Link href="/properties" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm">
                  <Building2 size={16} /> {t('Navbar.seller')}
                </Link>

                <div className="flex items-center gap-2 px-4 py-2">
                  <Shield size={16} />
                  <select
                    onChange={handleSelect}
                    defaultValue=""
                    className="w-full bg-transparent text-[#3b1804] focus:outline-none cursor-pointer text-sm"
                  >
                    <option value="" disabled>
                      {t('Navbar.masters')}
                    </option>
                    <option value="/admin/dashboard/property-category">{t('Navbar.subMenus.property categories')}</option>
                    <option value="/admin/dashboard/feature-category">{t('Navbar.subMenus.feature categories')}</option>
                    <option value="/admin/dashboard/feature-group">{t('Navbar.subMenus.feature group')}</option>
                    <option value="/admin/dashboard/feature-group">{t('Navbar.subMenus.properties')}</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {userValue ? (
            <div className="relative mt-4">
              {/* Avatar Button */}
              <Button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-white text-[#3b1804] p-1 rounded-full hover:bg-gray-200 transition"
              >
                <Image src={'/avatar.png'} alt="Avatar" width={30} height={30} className="rounded-full" />
              </Button>

              {/* Overlay for mobile (when open) */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 bg-black/30 z-40 sm:hidden" onClick={() => setIsProfileOpen(false)}></div>

                  {/* Dropdown Menu */}
                  <div
                    className={`
            absolute right-0 mt-2 bg-white text-[#3b1804] rounded-xl shadow-lg w-44 py-2 z-50
            sm:right-0 sm:mt-2
            max-sm:fixed max-sm:top-20 max-sm:right-4 max-sm:left-4 max-sm:w-auto 
            max-sm:rounded-2xl max-sm:shadow-2xl max-sm:z-50
          `}
                    style={{ maxHeight: '60vh', overflowY: 'auto' }}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 text-center">
                      <span className="font-semibold text-sm truncate block">
                        {userValue?.firstName} {userValue?.lastName}
                      </span>
                    </div>

                    {/* Menu Links */}
                    <div className="flex flex-col">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-sm transition"
                      >
                        <User size={16} /> {t('Navbar.profile')}
                      </Link>
                      <Button
                        onClick={() => {
                          setIsProfileOpen(false)
                          handleLogout()
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 text-sm transition"
                      >
                        <LogOut size={16} /> {t('Navbar.logout')}
                      </Button>
                    </div>
                  </div>
                </>
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
      </div>
    </nav>
  )
}

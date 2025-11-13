'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Menu,
  X,
  Globe,
  LogOut,
  ArrowRight,
  Building,
  ChevronUp,
  ChevronDown,
  Shield,
  Home,
  Wrench,
  Info,
  HelpCircle,
  Tag,
  CircleUserRound,
  Grip,
  Megaphone,
  CreditCard,
  CircleSmall,
  Building2,
  User,
  Crown,
  BadgeIndianRupee,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslationContext } from '@/hooks/Translation/TranslationProvider'
import { useTranslations } from 'next-intl'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import { getLocalStorageItem, removeLocalStorageItem } from '@/utils/local_storage/local_storage_handler'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { label } from 'framer-motion/client'

export interface NavLink {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number }>
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
  id: string
  firstName: string
  lastName: string
  email: string
}

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  subMenu?: { label: string; href: string; icon?: ReactNode }[]
}

const DEFAULT_LINKS = [
  { label: 'home', href: '/', icon: Home },
  { label: 'services', href: '/services', icon: Wrench },
  { label: 'about_us', href: '/about', icon: Info },
  { label: 'help_center', href: '/help-center', icon: HelpCircle },
  { label: 'pricing', href: '/pricing', icon: Tag },
]

const DASHBOARD_SECTIONS: NavItem[] = [
  {
    label: 'masters',
    href: '/admin/dashboard/masters',
    icon: <Shield size={16} />,
    subMenu: [
      { label: 'feature group', href: '/admin/dashboard/feature-group' },
      { label: 'feature categories', href: '/admin/dashboard/feature-category' },
      { label: 'property categories', href: '/admin/dashboard/property-category' },
      { label: 'ads categories', href: '/admin/dashboard/ads-category' },
      { label: 'promo code', href: '/admin/dashboard/promo-code' },
      { label: 'referral management', href: '/admin/dashboard/referral-management' },
    ],
  },
  {
    label: 'properties',
    href: '/properties',
    icon: <Building size={16} />,
    subMenu: [
      { label: 'properties management', href: '/properties' },
      { label: 'properties pending approval', href: '/admin/dashboard/properties' },
      { label: 'favourite properties', href: '/admin/dashboard/favourite-properties' },
      { label: 'reported properties', href: '/admin/dashboard/property-reports' },
      { label: 'view enquiries', href: '/admin/dashboard/property-enquiry' },
      { label: 'saved searches', href: '/admin/dashboard/saved-searches' },
      { label: 'recently viewed properties', href: '/admin/dashboard/recently-viewed' },
      { label: 'contact requests', href: '/admin/dashboard/contact-requests' },
    ],
  },
  {
    label: 'ads',
    href: '/ads/list',
    icon: <Megaphone size={16} />,
    subMenu: [
      { label: 'ads management', href: '/ads/list' },
      { label: 'ads pending approval', href: '/admin/dashboard/ads-pending-approval' },
      { label: 'view recent ads', href: '/admin/dashboard/recent-ads' },
      { label: 'favourite ads', href: '/admin/dashboard/favourite-ads' },
      { label: 'reported ads', href: '/admin/dashboard/reported-ads' },
      { label: 'view enquiries', href: '/admin/dashboard/ads-enquiries' },
    ],
  },
  {
    label: 'subscription',
    href: '/admin/dashboard/subscription-master',
    icon: <CreditCard size={16} />,
    subMenu: [
      { label: 'subscription master', href: '/admin/dashboard/subscription-master' },
      { label: 'my subscription', href: '/admin/dashboard/my-subscription' },
      { label: 'user subscription', href: '/admin/dashboard/user-subscription' },
    ],
  },
  {
    label: 'payments',
    href: '/admin/dashboard/view-transactions',
    icon: <CreditCard size={16} />,
    subMenu: [
      { label: 'view transactions', href: '/admin/dashboard/view-transactions' },
      { label: 'payment reports / revenue summary', href: '/admin/dashboard/payment-reports' },
      { label: 'refund management', href: '/admin/dashboard/refund-management' },
      { label: 'promo usage reports', href: '/admin/dashboard/promo-usage-reports' },
    ],
  },
]

const PROFILE_SECTIONS = (userId: string, companyId: string): NavItem[] => [
  {
    label: 'profile',
    href: '/profile/settings',
    icon: <CircleUserRound size={16} />,
    subMenu: [
      { label: 'profile', href: `/profile/${userId}`, icon: <User size={16} /> },
      { label: 'company profile', href: `/company-profile/${companyId}`, icon: <Building2 size={16} /> },
      { label: 'view subscriptions', href: '/view-subscriptions', icon: <Crown size={16} /> },
      { label: 'view transactions', href: '/admin/dashboard/view-transactions', icon: <BadgeIndianRupee size={16} /> },
      { label: 'logout', href: '/logout', icon: <LogOut size={16} /> },
    ],
  },
]

export default function Navbar({
  logoSrc = '/logo.png',
  navLinks = DEFAULT_LINKS,
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
        id: userData?.id,
        firstName: userData?.firstName ? userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1) : '',
        lastName: userData?.lastName ? userData.lastName.charAt(0).toUpperCase() + userData.lastName.slice(1) : '',
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

  return (
    <nav className="sticky top-0 z-50 shadow-md text-white transition-colors duration-300" style={{ backgroundColor: bgColor }}>
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
          {navLinks?.map((links: any) => (
            <div key={links.href} className="relative group">
              <Link href={links.href} className="relative text-sm md:text-base font-medium hover:text-gray-300 transition">
                {t(`Navbar.${links.label}`)}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4 relative">
          {showLanguageSelector && <LanguageSwitch />}

          {userValue ? (
            <>
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
                    <Link href="/home" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm transition">
                      <Home size={16} /> {t('Navbar.Dashboard')}
                    </Link>

                    {DASHBOARD_SECTIONS?.map((section: NavItem) => (
                      <div key={section.label} className="border-t border-gray-100 mt-2 pt-2">
                        <Button
                          onClick={() => toggleSection(section.label)}
                          className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-[#3b1804] hover:bg-gray-100 rounded-md transition"
                        >
                          <span className="flex items-center gap-2">
                            {section.icon}
                            {t(`Navbar.${section.label}`)}
                          </span>
                          {openSections.has(section.label) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>

                        {openSections.has(section.label) && (
                          <div className="flex flex-col pl-8 mt-1">
                            {section.subMenu?.map((links: any) => (
                              <Link
                                key={String(links.href)}
                                href={String(links.href)}
                                className="flex items-center gap-2 px-4 py-1 hover:bg-gray-100 rounded-md text-sm transition"
                              >
                                <span className="text-gray-400">
                                  <CircleSmall size={12} />
                                </span>
                                {t(`Navbar.subMenus.${links.label}`)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <Button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-[#3b1804] p-1 hover:transition focus:outline-none focus:ring-2 focus:ring-primary-300"
                  aria-label={t('Navbar.profile')}
                >
                  {/* <Image
                    src={userValue?.image ?? '/avatar.png'}
                    alt={userValue?.firstName ?? 'Avatar'}
                    width={32}
                    height={32}
                    className="rounded-lg"
                  /> */}
                  <User size={24} color="white" />
                </Button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-[#3b1804] rounded-lg shadow-lg w-44 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <span className="font-semibold text-sm truncate block">
                        {userValue?.firstName} {userValue?.lastName}
                      </span>
                    </div>
                    <Link href={`/profile/${userValue?.id}`} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm transition">
                      <User size={16} /> {t('Navbar.profile')}
                    </Link>
                    <Link
                      href={`/company-profile/${userValue?.companyId}`}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm transition"
                    >
                      <Building2 size={16} /> {t('Navbar.company profile')}
                    </Link>
                    <Link href="/view-subscriptions" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm transition">
                      <Crown size={16} /> {t('Navbar.view subscriptions')}
                    </Link>
                    <Link href="/view-transactions" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm transition">
                      <BadgeIndianRupee size={16} /> {t('Navbar.view transactions')}
                    </Link>
                    <Button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition"
                    >
                      <LogOut size={16} /> {t('Navbar.logout')}
                    </Button>
                  </div>
                )}
              </div>
            </>
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
          {/* Home Link */}
          {navLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 w-full py-2 text-white hover:text-gray-300 text-base font-medium"
            >
              <Icon size={18} /> {t(`Navbar.${label}`)}
            </Link>
          ))}

          {/* Dynamically generated collapsible sections */}
          {userValue &&
            DASHBOARD_SECTIONS.map((section: NavItem) => (
              <div key={section.label} className="w-full mt-2 border-t border-white/20 pt-2">
                <Button
                  onClick={() => toggleSection(section.label)}
                  className="flex justify-between items-center w-full text-left text-white font-medium py-2 px-2 rounded-lg hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    {section.icon}
                    {t(`Navbar.${section.label}`)}
                  </span>
                  {openSections.has(section.label) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>

                {openSections.has(section.label) && (
                  <div className="flex flex-col pl-4 space-y-1">
                    {section.subMenu?.map((sub: any) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-1 text-sm text-gray-200 hover:text-white transition no-underline"
                      >
                        <span className="text-gray-400">{sub.icon ? sub.icon : <CircleSmall size={12} />}</span>
                        {t(`Navbar.subMenus.${sub.label}`)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

          {/* Profile / Login Section */}
          {userValue
            ? PROFILE_SECTIONS(userValue.id, userValue.companyId).map(section => (
                <div key={section.label} className="w-full mt-2 border-t border-white/20 pt-2">
                  <Button
                    onClick={() => toggleSection(section.label)}
                    className="flex justify-between items-center w-full text-left text-white font-medium py-2 px-2 rounded-lg hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      {section.icon}
                      {t(`Navbar.${section.label}`)}
                    </span>
                    {openSections.has(section.label) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>

                  {/* Header */}
                  {openSections.has(section.label) && (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200 text-center">
                        <span className="font-semibold text-sm block truncate">
                          {userValue?.firstName} {userValue?.lastName}
                        </span>
                      </div>

                      <div className="flex flex-col pl-4 space-y-1">
                        {section.subMenu?.map((sub: any) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-1 text-sm text-gray-200 hover:text-white transition no-underline"
                          >
                            <span className="text-gray-400">{sub.icon ? sub.icon : <CircleSmall size={12} />}</span>
                            {t(`Navbar.subMenus.${sub.label}`)}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))
            : showLoginButton && (
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm md:text-base mt-4"
                >
                  {t('Auth.login')}
                  <ArrowRight size={18} />{' '}
                </Link>
              )}

          {/* Keep your language selector & profile/login below unchanged */}
          {showLanguageSelector && (
            <div className="flex items-center gap-2 mt-4 text-white">
              <Globe size={18} />
              <select
                value={locale}
                onChange={e => handleLanguageChange(e.target.value as 'en' | 'ta')}
                className="bg-transparent border border-white/40 text-white rounded-md px-2 py-1 text-sm focus:outline-none focus:border-white"
              >
                <option className="text-black" value="en">
                  EN
                </option>
                <option className="text-black" value="ta">
                  TA
                </option>
              </select>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

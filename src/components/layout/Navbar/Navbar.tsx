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
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslationContext } from '@/hooks/Translation/TranslationProvider'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'
import LanguageSwitch from '@/components/ui/CustomComponent/languageSwitch/languageSwitch'
import formatName from '@/utils/converter/formatName'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { Roles, getUserRoles, hasRole, type UserRole } from '@/utils/roles/roles'

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

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  roles?: UserRole[]
  subMenu?: { label: string; href: string; icon?: ReactNode; roles?: UserRole[] }[]
}

const DEFAULT_LINKS = [
  { label: 'home', href: '/', icon: Home },
  { label: 'ads', href: '/ads-list', icon: Megaphone },
  { label: 'agents', href: '/agents-list', icon: CircleUserRound },
  // { label: 'services', href: '/services', icon: Wrench },
  { label: 'about_us', href: '/about', icon: Info },
  { label: 'help_center', href: '/help-center', icon: HelpCircle },
  { label: 'pricing', href: '/pricing', icon: Tag },
]

const DASHBOARD_SECTIONS: NavItem[] = [
  {
    label: 'masters',
    roles: [Roles.ADMIN],
    href: '/admin/dashboard/masters',
    icon: <Shield size={16} />,
    subMenu: [
      { label: 'feature group', href: '/admin/dashboard/feature-group' },
      { label: 'feature categories', href: '/admin/dashboard/feature-category' },
      { label: 'property categories', href: '/admin/dashboard/property-category' },
      { label: 'ads categories', href: '/admin/dashboard/ads-category' },
      // { label: 'promo code', href: '/admin/dashboard/promo-code' },
      // { label: 'referral management', href: '/admin/dashboard/referral-management' },
    ],
  },
  {
    label: 'properties',
    roles: [Roles.ADMIN, Roles.AGENT, Roles.BUYER],
    href: '/properties',
    icon: <Building size={16} />,
    subMenu: [
      { label: 'properties management', href: '/properties/list', roles: [Roles.ADMIN, Roles.AGENT] },
      { label: 'register your properties', href: '/properties-registration', roles: [Roles.BUYER] },
      { label: 'properties pending approval', href: '/admin/dashboard/properties-pending-approval', roles: [Roles.ADMIN] },
      { label: 'favourite properties', href: '/admin/dashboard/property-favorite', roles: [Roles.BUYER, Roles.AGENT, Roles.ADMIN] },
      { label: 'reported properties', href: '/admin/dashboard/property-reports', roles: [Roles.ADMIN, Roles.AGENT] },
      { label: 'view enquiries', href: '/admin/dashboard/property-enquiry', roles: [Roles.ADMIN, Roles.AGENT] },
      // { label: 'saved searches', href: '/admin/dashboard/saved-searches' },
      // { label: 'recently viewed properties', href: '/admin/dashboard/recently-viewed' },
      // { label: 'contact requests', href: '/admin/dashboard/contact-requests' },
    ],
  },
  {
    label: 'ads',
    roles: [Roles.ADMIN, Roles.AGENT, Roles.BUYER],
    href: '/ads/list',
    icon: <Megaphone size={16} />,
    subMenu: [
      { label: 'ads management', href: '/ads/list', roles: [Roles.ADMIN, Roles.AGENT] },
      { label: 'ads pending approval', href: '/admin/dashboard/ads-pending-approval', roles: [Roles.ADMIN] },
      // { label: 'view recent ads', href: '/admin/dashboard/recent-ads' },
      { label: 'favourite ads', href: '/admin/dashboard/favourite-ads', roles: [Roles.ADMIN, Roles.AGENT, Roles.BUYER] },
      { label: 'reported ads', href: '/admin/dashboard/ads-reports', roles: [Roles.ADMIN, Roles.AGENT] },
      { label: 'view enquiries', href: '/admin/dashboard/ads-enquiry', roles: [Roles.ADMIN, Roles.AGENT] },
    ],
  },
  {
    label: 'subscription',
    roles: [Roles.ADMIN],
    href: '/admin/dashboard/subscription-master',
    icon: <CreditCard size={16} />,
    subMenu: [
      { label: 'subscription master', href: '/admin/dashboard/subscription-master' },
      // { label: 'my subscription', href: '/admin/dashboard/my-subscription' },
      { label: 'user subscription', href: '/admin/dashboard/user-subscription' },
    ],
  },
  {
    label: 'payments',
    roles: [Roles.ADMIN],
    href: '/admin/dashboard/view-transactions',
    icon: <CreditCard size={16} />,
    subMenu: [
      { label: 'view transactions', href: '/admin/dashboard/view-transactions' },
      { label: 'payment reports / revenue summary', href: '/admin/dashboard/payment-reports' },
      // { label: 'refund management', href: '/admin/dashboard/refund-management' },
      // { label: 'promo usage reports', href: '/admin/dashboard/promo-usage-reports' },
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
      { label: 'company profile', href: companyId ? `/company-profile/${companyId}` : '/company-profile', icon: <Building2 size={16} /> },
      { label: 'view subscriptions', href: '/view-subscriptions', icon: <Crown size={16} /> },
      { label: 'view transactions', href: '/admin/dashboard/view-transactions', icon: <BadgeIndianRupee size={16} /> },
      { label: 'feedback', href: '/feedback', icon: <Info size={16} /> },
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
}: NavbarProps) {
  const t = useTranslations()
  const { logout, user, token } = useAuth()
  const { reset } = useGlobalContext()
  console.log('user in Navbar component:', user)
  const { locale, setLocale } = useTranslationContext()
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [visibleNavItems, setVisibleNavItems] = useState<typeof navLinks>(navLinks)
  const [overflowNavItems, setOverflowNavItems] = useState<typeof navLinks>([])
  const [companyProfileId, setCompanyProfileId] = useState<any | null>(null)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const gripRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const moreMenuRef = useRef<HTMLDivElement | null>(null)
  const navContainerRef = useRef<HTMLDivElement | null>(null)
  const navItemsRefs = useRef<(HTMLDivElement | null)[]>([])
  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const toggleSection = (key: string) =>
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const userRoles = getUserRoles(user)
  const visibleDashboardSections = DASHBOARD_SECTIONS.map(section => {
    const filteredSubMenu =
      section.subMenu?.filter(sub => {
        if (!sub.roles) return true
        return hasRole(userRoles, sub.roles)
      }) ?? []

    return {
      ...section,
      subMenu: filteredSubMenu,
    }
  }).filter(section => {
    const hasSectionAccess = !section.roles || hasRole(userRoles, section.roles)
    const hasVisibleChildren = section.subMenu ? section.subMenu.length > 0 : true
    return hasSectionAccess && hasVisibleChildren
  })

  console.log('userRoles in Navbar before filtering sections:', userRoles)

  useEffect(() => {
    if (!token || !user) return
    console.log('Fetching user details in Navbar useEffect:', user)
    const fetchData = async () => {
      const companyProfiles = await getMethod(appEndpoints.getCompanyProfilesByUserID(user.id))
      const companyProfilesData = Array.isArray(companyProfiles?.data) ? (companyProfiles.data as any[]) : []
      setCompanyProfileId(companyProfilesData?.length > 0 ? companyProfilesData[0].id : '')
    }

    fetchData()
  }, [token, user])

  console.log('userValue in Navbar useEffect:', user, companyProfileId)

  // Calculate visible nav items based on available space
  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!navContainerRef.current || !navLinks || navLinks.length === 0) {
        // Initialize with all items visible, will recalculate after render
        setVisibleNavItems(navLinks)
        setOverflowNavItems([])
        return
      }

      // Wait for next frame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (!navContainerRef.current) return

        const container = navContainerRef.current
        const containerRect = container.getBoundingClientRect()
        const containerWidth = containerRect.width

        // Get logo width
        const logoElement = container.querySelector('a[href="/"]')
        const logoWidth = logoElement ? logoElement.getBoundingClientRect().width + 32 : 200

        // Get right section width (language, grip, profile)
        const rightSectionWidth = rightSectionRef.current ? rightSectionRef.current.getBoundingClientRect().width + 32 : 200

        const availableWidth = containerWidth - logoWidth - rightSectionWidth - 64 // padding
        const moreButtonWidth = 90 // Width for "More" button with icon and text
        const gapWidth = 16 // Gap between items

        let totalWidth = 0
        const visible: typeof navLinks = []
        const overflow: typeof navLinks = []

        // Measure all items
        navItemsRefs.current.forEach((itemRef, index) => {
          if (!itemRef || index >= navLinks.length) return

          const itemRect = itemRef.getBoundingClientRect()
          const itemWidth = itemRect.width + gapWidth

          // Check if item fits (account for "More" button if we already have overflow)
          const needsMoreButton = overflow.length > 0 || (totalWidth + itemWidth + moreButtonWidth > availableWidth && index < navLinks.length - 1)
          const wouldFit = totalWidth + itemWidth + (needsMoreButton ? moreButtonWidth : 0) <= availableWidth

          if (wouldFit) {
            visible.push(navLinks[index])
            totalWidth += itemWidth
          } else {
            overflow.push(navLinks[index])
          }
        })

        // If we have overflow but no visible items, show at least one
        if (visible.length === 0 && navLinks.length > 0) {
          visible.push(navLinks[0])
          overflow.shift()
        }

        // For Tamil language, force only 3 items visible, rest in "More"
        if (locale === 'ta' && navLinks.length > 3) {
          const tamilVisible = navLinks.slice(0, 3)
          const tamilOverflow = navLinks.slice(3)
          setVisibleNavItems(tamilVisible)
          setOverflowNavItems(tamilOverflow)
        } else {
          setVisibleNavItems(visible)
          setOverflowNavItems(overflow)
        }
      })
    }

    // Initial calculation
    const timeoutId = setTimeout(calculateVisibleItems, 100)

    // Calculate on resize
    window.addEventListener('resize', calculateVisibleItems)
    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleItems()
    })

    if (navContainerRef.current) {
      resizeObserver.observe(navContainerRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', calculateVisibleItems)
      resizeObserver.disconnect()
    }
  }, [navLinks, locale]) // Recalculate when language changes

  // Close grip, profile, and more menu dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function onDocumentClick(e: MouseEvent | TouchEvent) {
      const target = e.target as Node
      if (gripRef.current && !gripRef.current.contains(target)) {
        setIsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setIsMoreMenuOpen(false)
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
      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setIsMoreMenuOpen(false)
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setIsProfileOpen(false)
        setIsMoreMenuOpen(false)
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
  }, [gripRef, profileRef, moreMenuRef])

  const handleLanguageChange = (lang: 'ta' | 'en') => {
    setLocale(lang)
    router.refresh()
  }

  const handleLogout = () => {
    // Clear auth token and redirect to login
    logout()
    reset()
    router.push('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-md text-white transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <div ref={navContainerRef} className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
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
        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 flex-1 min-w-0 justify-center">
          {/* Render visible items */}
          {visibleNavItems?.map((links: any) => (
            <div key={links.href} className="relative group flex-shrink-0">
              <Link href={links.href} className="relative text-sm md:text-base font-medium hover:text-gray-300 transition whitespace-nowrap px-1">
                {t(`Navbar.${links.label}`)}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          ))}

          {/* Hidden container for measuring all items */}
          <div className="absolute opacity-0 pointer-events-none -z-10 flex items-center gap-4">
            {navLinks?.map((links: any, index: number) => (
              <div
                key={`measure-${links.href}`}
                ref={el => {
                  navItemsRefs.current[index] = el
                }}
                className="relative group flex-shrink-0"
              >
                <div className="relative text-sm md:text-base font-medium whitespace-nowrap px-1">{t(`Navbar.${links.label}`)}</div>
              </div>
            ))}
          </div>

          {/* More Menu Button */}
          {overflowNavItems && overflowNavItems.length > 0 && (
            <div className="relative flex-shrink-0" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(prev => !prev)}
                className="relative flex items-center gap-1 text-sm md:text-base font-medium hover:text-gray-300 transition whitespace-nowrap px-2 py-1 rounded-md hover:bg-white/10"
                aria-label="More menu"
              >
                <MoreHorizontal size={18} />
                <span>{t('Navbar.more') || 'More'}</span>
                {isMoreMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {/* More Menu Dropdown */}
              {isMoreMenuOpen && (
                <div className="absolute right-0 mt-2 bg-gradient-to-br from-white to-yellow-50 text-[#2a1407] rounded-lg shadow-lg border border-yellow-200 py-2 z-50 min-w-[180px]">
                  {overflowNavItems.map((links: any) => (
                    <Link
                      key={links.href}
                      href={links.href}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 text-sm transition whitespace-nowrap"
                    >
                      {links.icon && <links.icon size={16} className="text-yellow-600" />}
                      {t(`Navbar.${links.label}`)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Right Section */}
        <div ref={rightSectionRef} className="hidden md:flex items-center gap-4 relative">
          {showLanguageSelector && <LanguageSwitch />}

          {user ? (
            <>
              <div className="relative grip-menu" ref={gripRef}>
                {/* Grip Icon */}
                <button
                  onClick={() => setIsOpen(prev => !prev)}
                  className="cursor-pointer p-2 hover:bg-gray-400 rounded-md transition focus:outline-none focus:ring-2 focus:ring-primary-300"
                  title="dashboard_menu"
                  aria-label={'common:dashboard_menu'}
                >
                  <Grip />
                </button>

                {/* Main Dropdown */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 bg-gradient-to-br from-white to-yellow-50 text-[#2a1407] rounded-lg shadow-lg border border-yellow-200 w-70 py-2 z-50 max-h-[70vh] overflow-y-auto">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 text-sm transition">
                      <Home size={16} /> {t('Navbar.Dashboard')}
                    </Link>

                    {visibleDashboardSections.map((section: NavItem) => (
                      <div key={section.label} className="border-t border-yellow-200 mt-2 pt-2">
                        <Button
                          onClick={() => toggleSection(section.label)}
                          className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-[#2a1407] hover:bg-yellow-50 rounded-md transition"
                        >
                          <span className="flex items-center gap-2">
                            {section.icon}
                            {t(`Navbar.${section.label}`)}
                          </span>
                          {openSections.has(section.label) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>

                        {openSections.has(section.label) && (
                          <div className="flex flex-col pl-8 mt-1">
                            {section.subMenu?.map((links: any) => {
                              const onlyAccessVerifiedUser = links?.href === '/properties-registration'
                              if (onlyAccessVerifiedUser && !user?.isVerified) {
                                return (
                                  <Link
                                    key={String(links.href)}
                                    href={'/kyc-pending'}
                                    className="flex items-center gap-2 px-4 py-1 hover:bg-yellow-50 rounded-md text-sm transition"
                                  >
                                    <span className="text-yellow-600">
                                      <ChevronRight size={16} />
                                    </span>
                                    {t(`Navbar.subMenus.${links.label}`)}
                                  </Link>
                                )
                              }
                              return (
                                <Link
                                  key={String(links.href)}
                                  href={String(links.href)}
                                  className="flex items-center gap-2 px-4 py-1 hover:bg-yellow-50 rounded-md text-sm transition"
                                >
                                  <span className="text-yellow-600">
                                    <ChevronRight size={16} />
                                  </span>
                                  {t(`Navbar.subMenus.${links.label}`)}
                                </Link>
                              )
                            })}
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
                  <div className="absolute right-0 mt-2 bg-gradient-to-br from-white to-yellow-50 text-[#2a1407] rounded-lg shadow-lg border border-yellow-200 w-44 py-2 z-50">
                    <div className="px-4 py-2 border-b border-yellow-200">
                      <span className="font-semibold text-sm truncate block text-[#2a1407]">
                        {formatName(user?.firstName)} {formatName(user?.lastName)}
                      </span>
                    </div>
                    <Link href={`/profile/${user?.id}`} className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 text-sm transition">
                      <User size={16} /> {t('Navbar.profile')}
                    </Link>

                    <Link
                      href={!user?.isVerified ? '/kyc-pending' : !!companyProfileId ? `/company-profile/${companyProfileId}` : `/company-profile`}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 text-sm transition"
                    >
                      <Building2 size={16} /> {t('Navbar.company profile')}
                    </Link>
                    <Link href="/view-subscriptions" className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 text-sm transition">
                      <Crown size={16} /> {t('Navbar.view subscriptions')}
                    </Link>
                    <Link href="/view-transactions" className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 text-sm transition">
                      <BadgeIndianRupee size={16} /> {t('Navbar.view transactions')}
                    </Link>
                    <Link href="/feedback" className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 text-sm transition">
                      <Info size={16} /> {t('Navbar.feedback')}
                    </Link>
                    <Button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-yellow-50 text-sm transition"
                    >
                      <LogOut size={16} /> {t('Navbar.logout')}
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            showLoginButton && (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2a1407] border border-yellow-300 px-5 py-2.5 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition shadow-md hover:shadow-lg text-sm md:text-base"
                >
                  {t('Auth.login')}
                </Link>
              </div>
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
          {user && (
            <>
              <Link href="/admin/dashboard" className="flex items-center gap-2 w-full py-2 text-white hover:text-gray-300 text-base font-medium">
                <Home size={16} /> {t('Navbar.Dashboard')}
              </Link>

              {visibleDashboardSections.map((section: NavItem) => (
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
                      {section.subMenu?.map((sub: any) => {
                        const onlyAccessVerifiedUser = sub?.href === '/properties-registration'
                        if (onlyAccessVerifiedUser && !user?.isVerified) {
                          return (
                            <Link
                              key={String(sub.href)}
                              href={'/kyc-pending'}
                              className="flex items-center gap-2 px-4 py-1 hover:bg-yellow-50 rounded-md text-sm transition"
                            >
                              <span className="text-yellow-600">
                                <ChevronRight size={16} />
                              </span>
                              {t(`Navbar.subMenus.${sub.label}`)}
                            </Link>
                          )
                        }
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-1 text-sm text-gray-200 hover:text-white transition no-underline"
                          >
                            <span className="text-gray-500">{sub.icon ? sub.icon : <ChevronRight size={16} />}</span>
                            {t(`Navbar.subMenus.${sub.label}`)}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Profile / Login Section */}
          {user
            ? PROFILE_SECTIONS(user.id, companyProfileId).map(section => (
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
                          {formatName(user?.firstName)} {formatName(user?.lastName)}
                        </span>
                      </div>

                      <div className="flex flex-col pl-4 space-y-1">
                        {section.subMenu?.map((sub: any) => {
                          if (sub.label === 'logout') {
                            return (
                              <Button
                                key="mobile-logout"
                                onClick={() => {
                                  setIsMenuOpen(false)
                                  handleLogout()
                                }}
                                className="flex items-center gap-2 w-full px-4 py-1 text-sm text-gray-200 hover:text-white transition"
                              >
                                <span className="text-gray-400">{sub.icon ? sub.icon : <CircleSmall size={12} />}</span>
                                {t(`Navbar.subMenus.${sub.label}`)}
                              </Button>
                            )
                          }

                          const requiresAuth =
                            typeof sub?.href === 'string' && (sub.href === '/company-profile' || sub.href.startsWith('/company-profile/'))
                          const isVerifiedUser = Boolean(requiresAuth && token && user?.isVerified)
                          const targetHref = requiresAuth && !isVerifiedUser ? '/kyc-pending' : sub.href

                          return (
                            <Link
                              key={String(sub.href)}
                              href={targetHref}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-1 text-sm text-gray-200 hover:text-white transition no-underline"
                            >
                              <span className="text-gray-400">{sub.icon ? sub.icon : <CircleSmall size={12} />}</span>
                              {t(`Navbar.subMenus.${sub.label}`)}
                            </Link>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              ))
            : showLoginButton && (
                <div className="flex flex-col gap-2 mt-4">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2a1407] px-5 py-2.5 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition shadow-md text-sm"
                  >
                    {t('Auth.login')}
                  </Link>
                </div>
              )}

          {/* Keep your language selector & profile/login below unchanged */}
          {showLanguageSelector && <LanguageSwitch />}
        </div>
      </div>
    </nav>
  )
}

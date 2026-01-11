'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  LogOut,
  Bell,
  Plus,
  Globe,
  ChevronDown,
  Check,
  LayoutDashboard,
  Clock,
  AlertTriangle,
  MessageSquare,
  CreditCard,
  Wallet,
  UserCog,
  Building2,
  Megaphone,
  Search,
  Shield,
  Users,
  FileText,
  Settings,
  Heart,
  Home,
  ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslationContext } from '@/hooks/Translation/TranslationProvider'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'
import formatName from '@/utils/converter/formatName'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'
import { Roles, getUserRoles, hasRole } from '@/utils/roles/roles'
import NotificationPopup from '@/components/Notification/NotificationPopup'
import { useBadges } from '@/components/Notification/hooks/useBadges'

// ============================================
// TYPES & CONSTANTS
// ============================================

interface NavbarProps {
  logoSrc?: string
  showLoginButton?: boolean
  showLanguageSelector?: boolean
}

const NAV_LINKS = [
  { label: 'home', href: '/' },
  { label: 'properties', href: '/properties-list' },
  { label: 'agents', href: '/agents-list' },
  { label: 'services', href: '/ads-list' },
  { label: 'pricing', href: '/pricing' },
  { label: 'about_us', href: '/about' },
]

// ============================================
// MAIN NAVBAR COMPONENT
// ============================================

export default function Navbar({
  logoSrc = '/logo.png',
  showLoginButton = true,
  showLanguageSelector = true,
}: NavbarProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const { logout, user, token } = useAuth()
  const { reset } = useGlobalContext()
  const { locale, setLocale } = useTranslationContext()
  const router = useRouter()

  // Badge counts
  const {
    notifications: notificationCount,
    favorites: favoritesCount,
    newEnquiries: newEnquiriesCount,
    walletBalance,
    totalPendingActions,
    moderation,
  } = useBadges({ enableSSE: false })

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [activeAdminTab, setActiveAdminTab] = useState('overview')
  const [companyProfileId, setCompanyProfileId] = useState<string>('')

  // Refs
  const langRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // User roles
  const userRoles = getUserRoles(user)
  const isAdmin = hasRole(userRoles, [Roles.ADMIN])
  const isAgent = hasRole(userRoles, [Roles.AGENT])
  const isBuyer = hasRole(userRoles, [Roles.BUYER]) && !isAgent && !isAdmin

  // Check if nav link is active
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Fetch company profile
  useEffect(() => {
    if (!token || !user) return
    const fetchData = async () => {
      const companyProfiles = await getMethod(appEndpoints.getCompanyProfilesByUserID(user.id))
      const companyProfilesData = Array.isArray(companyProfiles?.data) ? (companyProfiles.data as any[]) : []
      setCompanyProfileId(companyProfilesData?.length > 0 ? companyProfilesData[0].id : '')
    }
    fetchData()
  }, [token, user])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (lang: 'ta' | 'en') => {
    setLocale(lang)
    setIsLangOpen(false)
    router.refresh()
  }

  const handleLogout = () => {
    logout()
    reset()
    setIsProfileOpen(false)
    setIsMobileMenuOpen(false)
    router.push('/login')
  }

  const closeMenu = () => setIsProfileOpen(false)

  // Get user initials
  const getUserInitials = () => {
    const first = user?.firstName?.[0]?.toUpperCase() || ''
    const last = user?.lastName?.[0]?.toUpperCase() || ''
    return first + last || 'U'
  }

  // Role display
  const getRoleDisplay = () => {
    if (isAdmin) return { label: 'Super Admin', color: 'text-purple-600', bg: 'bg-purple-50' }
    if (isAgent) return { label: 'Agent', color: 'text-yellow-700', bg: 'bg-yellow-50' }
    return { label: 'Buyer', color: 'text-green-600', bg: 'bg-green-50' }
  }
  const roleDisplay = getRoleDisplay()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#2a1407] shadow-xl">
        {/* Top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src={logoSrc}
                alt="VaazhgaValamudan"
                width={180}
                height={60}
                className="w-[140px] sm:w-[160px] md:w-[180px] object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = isActiveLink(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 font-medium text-sm transition-colors ${isActive ? 'text-yellow-400' : 'text-white/90 hover:text-yellow-400'
                      }`}
                  >
                    {t(`Navbar.${link.label}`)}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-yellow-400 transition-all duration-300 ${isActive ? 'w-4/5' : 'w-0'}`} />
                  </Link>
                )
              })}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2">

              {/* Language Selector */}
              {showLanguageSelector && (
                <div ref={langRef} className="relative hidden md:block">
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-white/70 hover:text-yellow-400 hover:bg-white/10 rounded-lg text-sm transition-all cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{locale === 'ta' ? 'தமிழ்' : 'EN'}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isLangOpen && (
                    <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${locale === 'en' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span>🇬🇧</span> English
                        {locale === 'en' && <Check className="w-3.5 h-3.5 ml-auto text-yellow-500" />}
                      </button>
                      <button
                        onClick={() => handleLanguageChange('ta')}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${locale === 'ta' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span>🇮🇳</span> தமிழ்
                        {locale === 'ta' && <Check className="w-3.5 h-3.5 ml-auto text-yellow-500" />}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Post Property */}
              <Link
                href="/properties-registration"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2a1407] font-bold text-sm rounded-lg hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span className="hidden md:inline">Post Property</span>
              </Link>

              {user ? (
                <>
                  {/* AGENT: Wallet */}
                  {isAgent && (
                    <Link
                      href="/view-transactions"
                      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
                    >
                      <span className="text-green-400 font-bold text-sm">₹</span>
                      <span className="text-sm font-medium">{walletBalance.toLocaleString('en-IN')}</span>
                    </Link>
                  )}

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative p-2 text-white/70 hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                    >
                      <Bell className="w-5 h-5" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                      )}
                    </button>
                    <NotificationPopup isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                  </div>

                  {/* PROFILE DROPDOWN */}
                  <div ref={profileRef} className="relative hidden sm:block">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`flex items-center gap-2 p-1.5 rounded-lg transition-all cursor-pointer ${isProfileOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user?.profilePicture ? (
                          <Image src={user.profilePicture} alt="Profile" width={32} height={32} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-[#2a1407] font-bold text-xs">{getUserInitials()}</span>
                        )}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-white text-sm font-medium leading-tight truncate max-w-[80px]">
                          {formatName(user?.firstName)}
                        </p>
                        <p className={`text-[10px] ${isAdmin ? 'text-purple-300' : isAgent ? 'text-yellow-400/80' : 'text-green-400/80'}`}>
                          {roleDisplay.label}
                        </p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/50 hidden md:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* DROPDOWN MENU */}
                    {isProfileOpen && (
                      <div className={`absolute top-full right-0 mt-2 ${isAdmin ? 'w-[400px]' : 'w-64'} bg-gradient-to-br from-[#fdf5eb] via-[#fef9f0] to-[#fdf5eb] rounded-xl shadow-2xl border border-[#e8d5c4] overflow-hidden z-50`}>

                        {/* Header */}
                        <div className="p-4 border-b border-[#e8d5c4]/60">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-xl bg-[#f4e1c2] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[#cfae78]/40">
                              {user?.profilePicture ? (
                                <Image src={user.profilePicture} alt="Profile" width={48} height={48} className="object-cover w-full h-full" />
                              ) : (
                                <span className="text-[#2b1b12] font-bold text-lg">{getUserInitials()}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#2b1b12] text-sm">{formatName(user?.firstName)} {formatName(user?.lastName)}</p>
                              <p className="text-xs text-[#5c4533] truncate">{user?.email}</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 bg-[#f4e1c2] border border-[#cfae78]/40 ${roleDisplay.color} text-[10px] font-medium rounded-full`}>
                                {roleDisplay.label}
                              </span>
                            </div>
                          </div>

                          {/* Quick Stats for Admin/Agent */}
                          {isAdmin && (
                            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#e8d5c4]/60">
                              <QuickStat value={moderation?.pendingProperties ?? 0} label="Pending" />
                              <QuickStat value={(moderation?.reportedProperties ?? 0) + (moderation?.reportedAds ?? 0)} label="Reported" />
                              <QuickStat value={moderation?.kycRequests ?? 0} label="KYC" />
                              <QuickStat value={totalPendingActions} label="Total" />
                            </div>
                          )}

                          {isAgent && !isAdmin && (
                            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#e8d5c4]/60">
                              <QuickStat value={newEnquiriesCount} label="New Enquiries" />
                              <QuickStat value={`₹${walletBalance.toLocaleString('en-IN')}`} label="Wallet" />
                            </div>
                          )}
                        </div>

                        {/* Admin Tabs */}
                        {isAdmin && (
                          <div className="flex border-b border-[#e8d5c4]/60 bg-[#f7e8d9]/50">
                            {['overview', 'manage', 'reports', 'settings'].map((tab) => (
                              <button
                                key={tab}
                                onClick={() => setActiveAdminTab(tab)}
                                className={`flex-1 px-2 py-2 text-[11px] font-medium capitalize transition-all cursor-pointer ${activeAdminTab === tab
                                    ? 'bg-[#fdf5eb] text-[#2b1b12] border-b-2 border-[#b8864b]'
                                    : 'text-[#5c4533] hover:text-[#2b1b12]'
                                  }`}
                              >
                                {tab}
                                {tab === 'manage' && totalPendingActions > 0 && (
                                  <span className="ml-1 w-1.5 h-1.5 bg-orange-500 rounded-full inline-block" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Menu Content */}
                        <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#cfae78]/50 scrollbar-track-transparent hover:scrollbar-thumb-[#b8864b]/60">

                          {/* BUYER MENU - Single line items */}
                          {isBuyer && (
                            <div className="py-2">
                              <MenuItem href="/admin/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" onClick={closeMenu} />
                              <MenuItem href="/admin/dashboard/property-favorite" icon={<Heart className="w-4 h-4" />} label="My Favorites" badge={favoritesCount} onClick={closeMenu} />
                              <MenuItem href="/admin/dashboard/saved-searches" icon={<Search className="w-4 h-4" />} label="Saved Searches" onClick={closeMenu} />
                              <MenuItem href="/admin/dashboard/property-enquiry" icon={<MessageSquare className="w-4 h-4" />} label="My Enquiries" onClick={closeMenu} />
                              <MenuItem href={`/profile/${user?.id}`} icon={<UserCog className="w-4 h-4" />} label="Profile & Settings" onClick={closeMenu} />
                            </div>
                          )}

                          {/* AGENT MENU */}
                          {isAgent && !isAdmin && (
                            <div className="py-2">
                              <MenuItem href="/admin/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" onClick={closeMenu} />

                              <MenuSection label="My Properties" />
                              <MenuItem href="/properties/list" icon={<Building2 className="w-4 h-4" />} label="All Properties" onClick={closeMenu} />
                              <MenuItem href="/admin/dashboard/properties-pending-approval" icon={<Clock className="w-4 h-4" />} label="Pending" onClick={closeMenu} />
                              <MenuItem href="/admin/dashboard/property-reports" icon={<AlertTriangle className="w-4 h-4" />} label="Reported" onClick={closeMenu} />

                              <MenuSection label="My Ads" />
                              <MenuItem href="/ads/list" icon={<Megaphone className="w-4 h-4" />} label="All Ads" onClick={closeMenu} />
                              <MenuItem href="/admin/dashboard/ads-reports" icon={<AlertTriangle className="w-4 h-4" />} label="Reported Ads" onClick={closeMenu} />

                              <MenuSection label="Account" />
                              <MenuItem href="/admin/dashboard/property-enquiry" icon={<MessageSquare className="w-4 h-4" />} label="Enquiries" badge={newEnquiriesCount} onClick={closeMenu} />
                              <MenuItem href="/view-subscriptions" icon={<CreditCard className="w-4 h-4" />} label="Subscription" onClick={closeMenu} />
                              <MenuItem href="/view-transactions" icon={<Wallet className="w-4 h-4" />} label="Wallet" onClick={closeMenu} />
                              <MenuItem href={`/profile/${user?.id}`} icon={<UserCog className="w-4 h-4" />} label="Profile & KYC" onClick={closeMenu} />
                            </div>
                          )}

                          {/* ADMIN MENU */}
                          {isAdmin && (
                            <>
                              {activeAdminTab === 'overview' && (
                                <div className="p-2 grid grid-cols-2 gap-2">
                                  <QuickCard href="/admin/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" onClick={closeMenu} />
                                  <QuickCard href="/admin/dashboard/properties-pending-approval" icon={<Clock className="w-4 h-4" />} label="Pending" badge={(moderation?.pendingProperties ?? 0) + (moderation?.pendingAds ?? 0)} onClick={closeMenu} />
                                  <QuickCard href="/admin/dashboard/kyc-requests" icon={<Shield className="w-4 h-4" />} label="KYC Requests" badge={moderation?.kycRequests} onClick={closeMenu} />
                                  <QuickCard href="/admin/dashboard/property-reports" icon={<AlertTriangle className="w-4 h-4" />} label="Reported" badge={(moderation?.reportedProperties ?? 0) + (moderation?.reportedAds ?? 0)} onClick={closeMenu} />
                                </div>
                              )}

                              {activeAdminTab === 'manage' && (
                                <div className="py-2">
                                  <MenuSection label="Masters" />
                                  <div className="grid grid-cols-2 gap-1 px-2 mb-2">
                                    <MiniLink href="/admin/dashboard/feature-group" label="Feature Groups" onClick={closeMenu} />
                                    <MiniLink href="/admin/dashboard/feature-category" label="Feature Categories" onClick={closeMenu} />
                                    <MiniLink href="/admin/dashboard/property-category" label="Property Categories" onClick={closeMenu} />
                                    <MiniLink href="/admin/dashboard/ads-category" label="Ads Categories" onClick={closeMenu} />
                                  </div>

                                  <MenuSection label="Properties & Ads" />
                                  <MenuItem href="/properties/list" label="All Properties" onClick={closeMenu} />
                                  <MenuItem href="/admin/dashboard/properties-pending-approval" label="Pending Properties" badge={moderation?.pendingProperties} badgeColor="orange" onClick={closeMenu} />
                                  <MenuItem href="/admin/dashboard/property-reports" label="Reported Properties" badge={moderation?.reportedProperties} badgeColor="red" onClick={closeMenu} />
                                  <MenuItem href="/ads/list" label="All Ads" onClick={closeMenu} />
                                  <MenuItem href="/admin/dashboard/ads-pending-approval" label="Pending Ads" badge={moderation?.pendingAds} badgeColor="orange" onClick={closeMenu} />
                                  <MenuItem href="/admin/dashboard/ads-reports" label="Reported Ads" badge={moderation?.reportedAds} badgeColor="red" onClick={closeMenu} />

                                  <MenuSection label="Users" />
                                  <MenuItem href="/admin/dashboard/users" label="All Users" onClick={closeMenu} />
                                  <MenuItem href="/admin/dashboard/kyc-requests" label="KYC Requests" badge={moderation?.kycRequests} badgeColor="yellow" onClick={closeMenu} />
                                </div>
                              )}

                              {activeAdminTab === 'reports' && (
                                <div className="py-2">
                                  <MenuSection label="Subscriptions & Payments" />
                                  <MenuItem href="/admin/dashboard/subscription-master" icon={<CreditCard className="w-4 h-4" />} label="Subscription Plans" onClick={closeMenu} />
                                  <MenuItem href="/admin/dashboard/user-subscription" icon={<Users className="w-4 h-4" />} label="User Subscriptions" onClick={closeMenu} />
                                  <MenuItem href="/admin/dashboard/view-transactions" icon={<FileText className="w-4 h-4" />} label="All Transactions" onClick={closeMenu} />
                                  <MenuItem href="/admin/dashboard/payment-reports" icon={<FileText className="w-4 h-4" />} label="Revenue Reports" onClick={closeMenu} />
                                </div>
                              )}

                              {activeAdminTab === 'settings' && (
                                <div className="py-2">
                                  <MenuItem href={`/profile/${user?.id}`} icon={<UserCog className="w-4 h-4" />} label="My Profile" onClick={closeMenu} />
                                  <MenuItem href={companyProfileId ? `/company-profile/${companyProfileId}` : '/company-profile'} icon={<Building2 className="w-4 h-4" />} label="Company Profile" onClick={closeMenu} />
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Become Agent CTA for Buyers */}
                        {isBuyer && (
                          <div className="p-3 border-t border-[#e8d5c4]/60 bg-[#f7e8d9]/30">
                            <Link
                              href="/properties-registration"
                              onClick={closeMenu}
                              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2b1b12] font-bold text-xs rounded-lg hover:shadow-md transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              Post Property & Become Agent
                            </Link>
                            <p className="text-[10px] text-center text-[#7a4a1d]/70 mt-1.5">List your first property to unlock agent features!</p>
                          </div>
                        )}

                        {/* Logout - Always visible at bottom */}
                        <div className="p-2 border-t border-[#e8d5c4]/60 bg-[#fdf5eb]">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50/50 rounded-lg text-xs font-medium transition-all cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* PUBLIC */
                showLoginButton && (
                  <>
                    <Link href="/login" className="px-3 py-2 text-white font-medium text-sm hover:text-yellow-400 transition-colors">
                      {t('Auth.login')}
                    </Link>
                    <Link href="/register" className="px-4 py-2 bg-white/10 text-white font-semibold text-sm rounded-lg hover:bg-white hover:text-[#2a1407] transition-all">
                      Register
                    </Link>
                  </>
                )
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-yellow-400 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* MOBILE MENU */}
      <div className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 bg-[#2a1407] flex items-center justify-between">
          <span className="text-white font-semibold">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Language */}
        <div className="p-3 border-b flex items-center justify-between">
          <span className="text-gray-500 text-xs">Language</span>
          <div className="flex gap-1">
            <button onClick={() => handleLanguageChange('en')} className={`px-3 py-1 text-xs font-medium rounded ${locale === 'en' ? 'bg-yellow-400 text-[#2a1407]' : 'bg-gray-100 text-gray-600'}`}>EN</button>
            <button onClick={() => handleLanguageChange('ta')} className={`px-3 py-1 text-xs font-medium rounded ${locale === 'ta' ? 'bg-yellow-400 text-[#2a1407]' : 'bg-gray-100 text-gray-600'}`}>தமிழ்</button>
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {NAV_LINKS.map((link) => {
            const isActive = isActiveLink(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-yellow-50 text-yellow-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {t(`Navbar.${link.label}`)}
              </Link>
            )
          })}
          {user && (
            <>
              <div className="border-t my-2" />
              <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium">
                <LayoutDashboard className="w-4 h-4 text-gray-400" /> Dashboard
              </Link>
              <Link href={`/profile/${user?.id}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium">
                <UserCog className="w-4 h-4 text-gray-400" /> Profile
              </Link>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-white">
          {user ? (
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <>
              <Link href="/properties-registration" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-yellow-400 text-[#2a1407] font-bold rounded-lg text-sm mb-2">
                <Plus className="w-4 h-4" /> Post Property
              </Link>
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 px-3 py-2 text-center text-[#2a1407] text-sm font-medium border border-[#2a1407] rounded-lg">Login</Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 px-3 py-2 text-center bg-[#2a1407] text-white text-sm font-medium rounded-lg">Register</Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />

      {/* Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(207, 174, 120, 0.5);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(184, 134, 75, 0.6);
        }
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(207, 174, 120, 0.5) transparent;
        }
      `}</style>
    </>
  )
}

// ============================================
// COMPACT HELPER COMPONENTS
// ============================================

const QuickStat = ({ value, label }: { value: number | string; label: string }) => (
  <div className="text-center">
    <p className="text-sm font-bold text-[#2b1b12]">{value}</p>
    <p className="text-[10px] text-[#7a4a1d]">{label}</p>
  </div>
)

const MenuSection = ({ label }: { label: string }) => (
  <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-[#7a4a1d] uppercase tracking-wide">{label}</p>
)

const MenuItem = ({ href, icon, label, badge, badgeColor = 'green', onClick }: {
  href: string;
  icon?: React.ReactNode;
  label: string;
  badge?: number;
  badgeColor?: string;
  onClick?: () => void
}) => {
  const colors: Record<string, string> = {
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    yellow: 'text-[#b8864b]',
  }
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-2 text-xs text-[#4b3727] hover:bg-[#f4e1c2]/50 transition-colors cursor-pointer"
    >
      <span className="flex items-center gap-2">
        {icon && <span className="text-[#7a4a1d]">{icon}</span>}
        {label}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className={`text-xs font-bold ${colors[badgeColor]}`}>{badge}</span>
      )}
    </Link>
  )
}

const QuickCard = ({ href, icon, label, badge, onClick }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-2 p-3 bg-[#f4e1c2]/40 hover:bg-[#f4e1c2]/70 border border-[#cfae78]/30 rounded-lg transition-colors cursor-pointer"
  >
    <span className="text-[#7a4a1d]">{icon}</span>
    <div className="flex-1">
      <p className="text-xs font-medium text-[#2b1b12]">{label}</p>
      {badge !== undefined && badge > 0 && (
        <p className="text-[10px] text-[#b8864b] font-medium">{badge} items</p>
      )}
    </div>
  </Link>
)

const MiniLink = ({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) => (
  <Link
    href={href}
    onClick={onClick}
    className="px-2 py-1.5 text-[11px] text-[#5c4533] hover:text-[#2b1b12] hover:bg-[#f4e1c2]/50 rounded transition-colors cursor-pointer"
  >
    {label}
  </Link>
)
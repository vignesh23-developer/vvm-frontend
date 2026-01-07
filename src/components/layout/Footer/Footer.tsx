'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MapPin, Phone, Mail, Send, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import FooterColumn from './FooterColumn'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'

const aboutLinks = [
  { label: 'our_story', href: '/our-story' },
  { label: 'our_team', href: '/team' },
  { label: 'careers', href: '/careers' },
  { label: 'resources', href: '/resources' },
  { label: 'agents', href: '/agents' },
  { label: 'services_providers', href: '/services-provider' },
]

const supportLinks = [
  { label: 'faq', href: '/faq' },
  { label: 'contact_us', href: '/contact-us' },
  { label: 'help_center', href: '/help-center' },
  { label: 'refund_policy', href: '/refund-policy' },
  { label: 'terms_and_conditions', href: '/terms' },
  { label: 'privacy_policy', href: '/privacy-policy' },
]

const exploreLinks = [
  { label: 'properties', href: '/properties-list' },
  { label: 'pricing', href: '/pricing' },
  { label: 'post_property', href: '/properties-registration' },
  // { label: 'property_videos', href: '/property-videos' },
  { label: 'blog', href: '/blog' },
]

const socialLinks = [
  { label: 'instagram', titleName: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/vaazhga._.valamudan?igsh=MXA1OGp5cnY5ZHR6YQ==' },
  { label: 'facebook', titleName: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/share/1Cp5XJwHHC/' },
  { label: 'twitter_(𝕏)', titleName: 'Twitter', icon: Twitter, href: 'https://x.com/VaazhgaValam?t=Iu-WpKa3cvAT-h3BHUBdYg&s=09' },
  { label: 'linked_in', titleName: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/vaazhga-valamudan-tn' },
  { label: 'youtube', titleName: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@VaazhgaValamudan-TN' },
  { label: 'telegram', titleName: 'Telegram', icon: Send, href: 'https://t.me/boost/vaazhgavalamudanvvdrs' },
  { label: 'whatsapp', titleName: 'WhatsApp', icon: Phone, href: 'https://whatsapp.com/channel/0029VbCK0k41HsppK1avNo01' },
]

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    try {
      const response = await postMethod(appEndpoints.createNewsletter, { email })

      if (response.error) {
        // Check if it's an "already subscribed" error
        if (response.message?.toLowerCase().includes('already subscribed') || response.status === '409') {
          toast.error('Already subscribed')
        } else {
          toast.error(response.message || 'Failed to subscribe to newsletter')
        }
        return
      }

      toast.success('Subscribed to newsletter')
      setEmail('')
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error('An error occurred. Please try again.')
    }
  }

  const quickLinks: Array<{ label: string; href: string }> = [
    { label: 'Resale House for Sale in Madurai', href: '/resale-house-for-sale-in-madurai' },
    { label: 'Commercial Office Space for Rent in Madurai', href: '/commercial-office-space-for-rent-in-madurai' },
    { label: 'Fully Furnished Office Space for Rent in Madurai', href: '/fully-furnished-office-space-for-rent-in-madurai' },
    { label: 'Best Property Listing Sites in Tirunelveli', href: '/best-property-listing-sites-in-tirunelveli' },
    { label: 'Best Commercial Property for Sale in Coimbatore', href: '/best-commercial-property-for-sale-in-coimbatore' },
  ]

  const quickLinksItemHeightPx = 40
  const quickLinksCycleHeightPx = quickLinks.length * quickLinksItemHeightPx

  const rollingQuickLinks = useMemo(() => {
    if (quickLinks.length === 0) return []
    // Duplicate the list so the scroll loop is seamless.
    return [...quickLinks, ...quickLinks]
  }, [quickLinks])

  return (
    <footer className="bg-gradient-to-br from-[#2a1407] to-[#1a0a04] text-white px-4 sm:px-6 lg:px-10 py-12 font-sans border-t border-yellow-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-12">
          {/* Column 1: Brand, Description & Social */}
          <div className="lg:col-span-1 sm:col-span-2">
            <Link href={'/'} className="inline-flex items-center mb-5" aria-label="Vaazhga Valamudan Home">
              <Image
                src={`/footer_logo_new_${locale}.png`}
                alt="Vaazhga Valamudan Logo"
                width={220}
                height={110}
                quality={100}
                className="w-[180px] sm:w-[200px] h-auto object-contain drop-shadow-lg brightness-110 contrast-125"
              />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              {t('Footer.desc') || "Tamil Nadu's trusted platform for buying, selling, and renting properties with verified listings."}
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map(({ label, icon: Icon, href, titleName }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`Footer.${label}`)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-yellow-500 hover:border-yellow-500 group"
                  title={titleName}
                >
                  <Icon size={16} className="text-gray-300 group-hover:text-[#2a1407] transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: About */}
          <div>
            <FooterColumn title={t('Footer.Headers.about') || 'About'} links={aboutLinks} />
          </div>

          {/* Column 3: Support */}
          <div>
            <FooterColumn title={t('Footer.Headers.support') || 'Support'} links={supportLinks} />
          </div>

          {/* Column 4: Explore */}
          <div>
            <FooterColumn title={t('Footer.Headers.explore') || 'Explore'} links={exploreLinks} />
          </div>

          {/* Column 5: Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-yellow-500">{t('Footer.Headers.contact') || 'Contact Us'}</h3>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <MapPin size={16} className="text-yellow-400" />
                </div>
                <p className="text-sm text-gray-300 leading-snug group-hover:text-white transition-colors">
                  Trichy & Chennai,
                  <br />
                  Tamil Nadu
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <Phone size={16} className="text-yellow-400" />
                </div>
                <a href="tel:+918680089800" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
                  +91 86800 89800
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <Mail size={16} className="text-yellow-400" />
                </div>
                <a href="mailto:admin@vaazhgavalamudan.com" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors break-words">
                  admin@vaazhgavalamudan.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-900/40 to-transparent mb-10" />

        {/* Bottom Section: Newsletter & App */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mb-10">
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-yellow-500">{t('Footer.Headers.detailed_newsletter') || 'Detailed Newsletter'}</h3>
            <p className="text-sm text-gray-400 mb-5 max-w-sm">{t('Footer.Headers.newsletter_desc')}</p>
            <form onSubmit={handleNewsletterSubmit} className="relative max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('AppPromo.placeholder')}
                className="w-full pl-5 pr-14 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-[#2a1407] hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg"
                aria-label="Subscribe"
              >
                <Send size={18} className="-ml-0.5" />
              </button>
            </form>
          </div>

          {/* Quick Links (Auto Rolling) */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-lg mb-2 text-yellow-500">{t('Footer.Headers.quick_links') || 'Quick Links'}</h3>

            <div className="w-full max-w-md px-4 py-4">
              <div className="h-20 overflow-hidden relative">
                <div
                  className="footer-quicklinks-ticker will-change-transform"
                  style={{
                    ['--quickLinksShift' as any]: `${quickLinksCycleHeightPx}px`,
                    animationDuration: `${Math.max(10, quickLinks.length * 3)}s`,
                  }}
                >
                  {rollingQuickLinks.map((link, idx) => (
                    <div key={`${link.href}-${idx}`} className="h-10 flex items-center">
                      <Link
                        href={link.href}
                        className="flex items-start gap-2 text-sm font-semibold text-gray-200 hover:text-white hover:underline underline-offset-4 transition-colors"
                      >
                        <ArrowRight size={16} className="mt-[2px] flex-shrink-0 text-gray-200" />

                        <span className="leading-snug">{link.label}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* App Download */}
          <div className="lg:text-right flex flex-col items-start lg:items-end">
            <h3 className="font-semibold text-lg mb-2 text-yellow-500">{t('Footer.Headers.download_our_app') || 'Download Our App'}</h3>
            <p className="text-sm text-gray-400 mb-5">{t('Footer.Headers.app_desc')}</p>
            <div className="flex flex-wrap gap-4 justify-start lg:justify-end">
              <Link href="#" className="hover:-translate-y-1 transition-transform duration-300">
                <Image
                  src="/googleplay.png"
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                  className="h-10 w-auto opacity-90 hover:opacity-100"
                />
              </Link>
              <Link href="#" className="hover:-translate-y-1 transition-transform duration-300">
                <Image
                  src="/appstore.png"
                  alt="Download on the App Store"
                  width={135}
                  height={40}
                  className="h-10 w-auto opacity-90 hover:opacity-100"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom: Copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-2 md:gap-3 text-sm text-gray-500 text-center">
          <p className="leading-relaxed text-gray-300">© {new Date().getFullYear()} Vaazhga Valamudan. All Rights Reserved.</p>
        </div>
      </div>
      <style jsx>{`
        .footer-quicklinks-ticker {
          animation-name: footerQuickLinksTicker;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .footer-quicklinks-ticker:hover {
          animation-play-state: paused;
        }
        @keyframes footerQuickLinksTicker {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(-1 * var(--quickLinksShift)));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-quicklinks-ticker {
            animation: none !important;
          }
        }
      `}</style>
    </footer>
  )
}

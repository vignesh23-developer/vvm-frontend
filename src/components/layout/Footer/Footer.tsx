'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail, Send } from 'lucide-react'
import FooterColumn from './FooterColumn'
import Button from '@/components/ui/CustomComponent/Button/Button'

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
  { label: 'instagram', icon: Instagram, href: 'https://www.instagram.com/vaazhga._.valamudan?igsh=MXA1OGp5cnY5ZHR6YQ==' },
  { label: 'facebook', icon: Facebook, href: 'https://www.facebook.com/share/1Cp5XJwHHC/' },
  { label: 'twitter_(𝕏)', icon: Twitter, href: 'https://x.com/VaazhgaValam?t=Iu-WpKa3cvAT-h3BHUBdYg&s=09' },
  { label: 'linked_in', icon: Linkedin, href: 'https://www.linkedin.com/in/vaazhga-valamudan-tn' },
  { label: 'telegram', icon: Send, href: 'https://t.me/boost/vaazhgavalamudanvvdrs' },
]

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <footer className="bg-gradient-to-br from-[#2a1407] to-[#1a0a04] text-white px-4 sm:px-6 lg:px-10 py-12 font-sans border-t border-yellow-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-12">
          {/* Column 1: Brand, Description & Social */}
          <div className="lg:col-span-1 sm:col-span-2">
            <Link href={'/'} className="inline-flex items-center mb-5" aria-label="Vaazhga Valamudan Home">
              <Image
                src={`/footer_logo_new.${locale}.PNG`}
                alt="Vaazhga Valamudan Logo"
                width={220}
                height={110}
                quality={100}
                className="w-[180px] sm:w-[200px] h-auto object-contain drop-shadow-lg brightness-110 contrast-125"
              />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Tamil Nadu's trusted platform for buying, selling, and renting properties with verified listings.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-yellow-500 border border-white/10 hover:border-yellow-500 flex items-center justify-center transition-all duration-300 group"
                  aria-label={t(`Footer.${label}`)}
                >
                  <Icon size={18} className="text-gray-300 group-hover:text-[#2a1407] transition-colors" />
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
            <FooterColumn title="Explore" links={exploreLinks} />
          </div>

          {/* Column 5: Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-yellow-500">Contact Us</h3>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-10">
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-yellow-500">Detailed Newsletter</h3>
            <p className="text-sm text-gray-400 mb-5 max-w-sm">
              Subscribe to get the latest property updates and market insights directly to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
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

          {/* App Download */}
          <div className="lg:text-right flex flex-col items-start lg:items-end">
            <h3 className="font-semibold text-lg mb-2 text-yellow-500">Download Our App</h3>
            <p className="text-sm text-gray-400 mb-5">Experience the best real estate platform on mobile.</p>
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
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-2 md:gap-3 text-xm text-gray-500 text-center">
          <p className="leading-relaxed text-gray-300">
            © {new Date().getFullYear()} Vaazhga Valamudan - Bhuvaneswari Koothachi. All Rights Reserved.
          </p>

          <span className="hidden md:inline-block text-gray-600">•</span>

          <p className="leading-relaxed">
            <span className="text-gray-400">Designed by </span>
            <Link
              href="https://www.bizdevinfotech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500/80 hover:text-yellow-400 transition-colors"
            >
              Bizdev Information Technology
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

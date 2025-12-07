'use client'

import { useTranslations } from 'next-intl'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import FooterColumn from './FooterColumn'

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
  { label: 'refund_policy', href: '/refund-policy' },
  { label: 'terms_and_conditions', href: '/terms' },
  { label: 'privacy_policy', href: '/privacy-policy' },
]

const socialLinks = [
  { label: 'instagram', icon: Instagram, href: 'https://www.instagram.com/vaazhga._.valamudan?igsh=MXA1OGp5cnY5ZHR6YQ==' },
  { label: 'facebook', icon: Facebook, href: 'https://www.facebook.com/share/1Cp5XJwHHC/' },
  { label: 'twitter_(𝕏)', icon: Twitter, href: 'https://x.com/VaazhgaValam?t=Iu-WpKa3cvAT-h3BHUBdYg&s=09' },
  { label: 'linked_in', icon: Linkedin, href: 'https://www.linkedin.com/in/vaazhga-valamudan-tn' },
]

export default function Footer() {
  const t = useTranslations()
  return (
    <footer className="bg-[#2a1407] text-white px-10 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left - Logo */}
        <div>
          <Link href={'/'}>
            <Image
              src="/footer_logo.png"
              alt="Logo"
              width={200}
              height={100}
              className="w-[200px] h-auto object-contain hover:scale-105 transition"
            />
          </Link>
        </div>

        {/* Right - Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* About */}
          <FooterColumn title={t('Footer.Headers.about')} links={aboutLinks} />

          {/* Support */}
          <FooterColumn title={t('Footer.Headers.support')} links={supportLinks} />

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('Footer.Headers.our_services')}</h3>
            <ul className="space-y-3 text-gray-300">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon size={18} />
                  <Link href={href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {t(`Footer.${label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-center text-sm text-white mt-8 col-span-full">
          Designed by{' '}
          <Link
            href="https://www.bizdevinfotech.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="Bizdev Information Technology"
            className="text-[#D4AF37] hover:underline"
          >
            Bizdev Information Technology
          </Link>{' '}
          | &copy; {new Date().getFullYear()}{' '}
          <Link href="/" title="Vaazhga Valamudan" className="text-[#D4AF37] hover:underline">
            Vaazhga Valamudan - Bhuvaneswari Koothachi
          </Link>
          , All rights reserved.
        </p>
      </div>
    </footer>
  )
}

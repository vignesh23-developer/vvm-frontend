'use client'

import { useTranslations } from 'next-intl'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import FooterColumn from './FooterColumn'

const aboutLinks = [
  { label: 'our_story', href: '/about' },
  { label: 'careers', href: '/careers' },
  { label: 'our_team', href: '/team' },
  { label: 'resources', href: '/resources' },
]

const supportLinks = [
  { label: 'faq', href: '/faq' },
  { label: 'contact_us', href: '/contact' },
  { label: 'help_center', href: '/help' },
  { label: 'terms_of_service', href: '/terms' },
]

const socialLinks = [
  { label: 'instagram', icon: Instagram, href: '#' },
  { label: 'facebook', icon: Facebook, href: '#' },
  { label: 'twitter_(𝕏)', icon: Twitter, href: '#' },
]

export default function Footer() {
  const t = useTranslations()
  return (
    <footer className="bg-[#2a1407] text-white px-10 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left - Logo */}
        <div>
          <Link href={'/home'}>
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
          <FooterColumn
            title={t('Footer.Headers.support')}
            links={supportLinks}
          />

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t('Footer.Headers.our_services')}
            </h3>
            <ul className="space-y-3 text-gray-300">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon size={18} />
                  <Link href={href} className="hover:text-white">
                    {t(`Footer.${label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

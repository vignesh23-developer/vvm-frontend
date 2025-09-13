'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import FooterColumn from './FooterColumn'

const aboutLinks = [
  { label: 'Our Story', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Our Team', href: '/team' },
  { label: 'Resources', href: '/resources' },
]

const supportLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Help Center', href: '/help' },
  { label: 'Terms of Service', href: '/terms' },
]

const socialLinks = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'Twitter (𝕏)', icon: Twitter, href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-[#2a1407] text-white px-10 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left - Logo */}
        <div>
          <img
            src="/footer_logo.png"
            alt="Logo"
            className="w-[200px] h-auto object-contain"
          />
        </div>

        {/* Right - Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* About */}
          <FooterColumn title="About" links={aboutLinks} />

          {/* Support */}
          <FooterColumn title="Support" links={supportLinks} />

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Our Social</h3>
            <ul className="space-y-3 text-gray-300">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon size={18} />
                  <Link href={href} className="hover:text-white">
                    {label}
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

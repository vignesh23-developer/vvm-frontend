'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Help Center', href: '/help' },
  { label: 'Pricing', href: '/pricing' },
]

export default function Navbar() {
  return (
    <nav className="bg-[#3b1804] text-white px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <img src="/logo.png" alt="Logo" className="h-12 w-auto" />

      {/* Navigation Links */}
      <div className="flex gap-10">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`relative group hover:text-gray-300 transition-colors ${
              label === 'Home' ? 'font-medium' : ''
            }`}
          >
            {label}
            {label === 'Home' && (
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
            )}
          </Link>
        ))}
      </div>

      {/* Login Button */}
      <Link
        href="/login"
        className="flex items-center gap-2 bg-white text-[#3b1804] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
      >
        Login <ArrowRight size={18} />
      </Link>
    </nav>
  )
}

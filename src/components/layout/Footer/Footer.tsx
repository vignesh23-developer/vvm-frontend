'use client'

import { useTranslations } from 'next-intl'
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
]

export default function Footer() {
  const t = useTranslations()
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">

          {/* Column 1: Brand, Description & Social */}
          <div className="lg:col-span-1 sm:col-span-2">
            <Link href={'/'} className="inline-block mb-5">
              <Image
                src="/footer_logo_new.PNG"
                alt="Vaazhga Valamudan Logo"
                width={180}
                height={90}
                className="w-[160px] h-auto object-contain hover:brightness-110 transition duration-300"
              />
            </Link>
<<<<<<< HEAD
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Tamil Nadu's trusted platform for buying, selling, and renting properties with verified listings.
            </p>

            {/* Social Media Icons - Moved here */}
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

          {/* Column 5: Contact Info - Dedicated Column */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-yellow-500">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <MapPin size={16} className="text-yellow-400" />
                </div>
                <div className="pt-1">
                  <p className="text-sm text-gray-300 leading-snug group-hover:text-white transition-colors">
                    Trichy & Chennai,<br />Tamil Nadu
                  </p>
=======
            <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-md">
              Vaazhga Valamudan is Tamil Nadu's trusted platform for buying, selling, and renting properties with verified listings and professional
              support.
            </p>

            {/* Contact Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={18} className="text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white mb-1">Office</p>
                  <p>Trichy & Chennai</p>
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <Phone size={16} className="text-yellow-400" />
                </div>
                <a href="tel:+918680089800" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
                  +91 86800 89800
                </a>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <Mail size={16} className="text-yellow-400" />
                </div>
                <a href="mailto:Admin@vaazhgavalamudan.com" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors break-all">
                  Admin@vaazhgavalamudan.com
                </a>
              </div>
            </div>
          </div>
<<<<<<< HEAD
=======

          {/* About Column */}
          <div>
            <FooterColumn title={t('Footer.Headers.about') || 'About'} links={aboutLinks} />
          </div>

          {/* Support Column */}
          <div>
            <FooterColumn title={t('Footer.Headers.support') || 'Support'} links={supportLinks} />
          </div>

          {/* Explore Column */}
          <div>
            <FooterColumn title={t('Footer.Headers.explore') || 'Explore'} links={exploreLinks} />
          </div>
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-900/40 to-transparent mb-10" />

        {/* Bottom Section: Newsletter & App */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-10">

          {/* Newsletter */}
          <div>
<<<<<<< HEAD
            <h3 className="font-semibold text-lg mb-2">Detailed Newsletter</h3>
            <p className="text-sm text-gray-400 mb-5 max-w-sm">
              Subscribe to get the latest property updates and market insights directly to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-5 pr-14 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all"
=======
            <h3 className="font-semibold text-lg mb-3">Subscribe for Updates</h3>
            <p className="text-sm text-gray-300 mb-4">Get property alerts, offers & market insights. No spam.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-yellow-900/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
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
<<<<<<< HEAD
          <div className="lg:text-right flex flex-col items-start lg:items-end">
            <h3 className="font-semibold text-lg mb-2">Download Our App</h3>
            <p className="text-sm text-gray-400 mb-5">
              Experience the best real estate platform on mobile.
            </p>
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
=======
          <div>
            <h3 className="font-semibold text-lg mb-3">Download Our App</h3>
            <p className="text-sm text-gray-300 mb-4">Get property alerts, save favorites, and chat with agents on the go.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="#" className="hover:scale-105 transition">
                <Image src="/googleplay.png" alt="Get it on Google Play" width={140} height={42} className="cursor-pointer" />
              </Link>
              <Link href="#" className="hover:scale-105 transition">
                <Image src="/appstore.png" alt="Download on the App Store" width={140} height={42} className="cursor-pointer" />
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
              </Link>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Footer Bottom: Copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Vaazhga Valamudan. All Rights Reserved.
          </p>
          <p>
            Designed by{' '}
            <Link
              href="https://www.bizdevinfotech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500/80 hover:text-yellow-400 transition-colors"
            >
              Bizdev Information Technology
            </Link>
          </p>
=======
        {/* Social Media & Copyright */}
        <div className="pt-8 border-t border-yellow-900/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-center md:text-left">Follow Us</h3>
              <div className="flex gap-4 justify-center md:justify-start">
                {socialLinks.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-yellow-500 flex items-center justify-center transition hover:scale-110"
                    aria-label={t(`Footer.${label}`)}
                  >
                    <Icon size={20} className="text-white" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-300">© {new Date().getFullYear()} Vaazhga Valamudan. All Rights Reserved.</p>
              <p className="text-xs text-gray-400 mt-1">
                Designed by{' '}
                <Link href="https://www.bizdevinfotech.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                  Bizdev Information Technology
                </Link>
              </p>
            </div>
          </div>
>>>>>>> c6cbc4e3d9f2fcc41d5f42588f6110f22844d23d
        </div>
      </div>
    </footer>
  )
}

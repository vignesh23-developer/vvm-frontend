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
  { label: 'post_property', href: '/post-property' },
  { label: 'property_videos', href: '/property-videos' },
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
    <footer className="bg-gradient-to-br from-[#2a1407] to-[#1a0a04] text-white px-4 sm:px-6 lg:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-10">
          {/* Left - Logo & Brand Description */}
          <div className="lg:col-span-2">
            <Link href={'/'} className="inline-block mb-4">
              <Image
                src="/footer_logo.png"
                alt="Vaazhga Valamudan Logo"
                width={200}
                height={100}
                className="w-[200px] h-auto object-contain hover:scale-105 transition"
              />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-md">
              Vaazhga Valamudan is Tamil Nadu's trusted platform for buying, selling, and renting properties with verified listings and professional support.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={18} className="text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white mb-1">Office</p>
                  <p>Trichy & Chennai</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={18} className="text-yellow-400 flex-shrink-0" />
                <a href="tel:+918680089800" className="hover:text-yellow-400 transition">
                  +91 86800 89800
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={18} className="text-yellow-400 flex-shrink-0" />
                <a href="mailto:Admin@vaazhgavalamudan.com" className="hover:text-yellow-400 transition">
                  Admin@vaazhgavalamudan.com
                </a>
              </div>
            </div>
          </div>

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
            <FooterColumn title="Explore" links={exploreLinks} />
          </div>
        </div>

        {/* Newsletter & App Download Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 pt-8 border-t border-yellow-900/30">
          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Subscribe for Updates</h3>
            <p className="text-sm text-gray-300 mb-4">
              Get property alerts, offers & market insights. No spam.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-yellow-900/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
              <Button
                type="submit"
                className="px-6 py-2.5 bg-yellow-500 text-[#2a1407] rounded-lg font-semibold hover:bg-yellow-400 transition shadow-lg"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>

          {/* App Download */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Download Our App</h3>
            <p className="text-sm text-gray-300 mb-4">
              Get property alerts, save favorites, and chat with agents on the go.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#" className="hover:scale-105 transition">
                <Image
                  src="/googleplay.png"
                  alt="Get it on Google Play"
                  width={140}
                  height={42}
                  className="cursor-pointer"
                />
              </Link>
              <Link href="#" className="hover:scale-105 transition">
                <Image
                  src="/appstore.png"
                  alt="Download on the App Store"
                  width={140}
                  height={42}
                  className="cursor-pointer"
                />
              </Link>
            </div>
          </div>
        </div>

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
              <p className="text-sm text-gray-300">
                © {new Date().getFullYear()} Vaazhga Valamudan. All Rights Reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Designed by{' '}
                <Link
                  href="https://www.bizdevinfotech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:underline"
                >
                  Bizdev Information Technology
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

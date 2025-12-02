import React from 'react'
import { useTranslations } from 'next-intl'
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'
import MapView from '@/components/ui/map/MapView'

const socialLinks = [
  { label: 'instagram', icon: Instagram, href: 'https://www.instagram.com/vaazhga._.valamudan?igsh=MXA1OGp5cnY5ZHR6YQ==' },
  { label: 'facebook', icon: Facebook, href: 'https://www.facebook.com/share/1Cp5XJwHHC/' },
  { label: 'twitter_(𝕏)', icon: Twitter, href: 'https://x.com/VaazhgaValam?t=Iu-WpKa3cvAT-h3BHUBdYg&s=09' },
  { label: 'linked_in', icon: Linkedin, href: 'https://www.linkedin.com/in/vaazhga-valamudan-tn' },
]

export default function ContactUs() {
  const t = useTranslations()
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-16 sm:py-24 lg:py-32">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 shadow-2xl rounded-3xl overflow-hidden">
          {/* --- Column 1: Contact Details (Dark Background) --- */}
          <div className="px-6 py-12 bg-gray-900 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <header className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Contact Us</h2>
              <p className="text-4xl font-extrabold text-white">Ready to get started?</p>
              <p className="text-lg text-gray-400">
                We're available via phone, email, or a visit to our studio. We look forward to connecting with you.
              </p>
            </header>

            <dl className="mt-10 space-y-8">
              {/* Email Detail */}
              <div>
                <dt className="text-base font-semibold text-gray-300">Email</dt>
                <dd className="mt-1 text-2xl font-bold text-white">
                  <a href="mailto:admin@vaazhgavalamudan.com" className="hover:text-indigo-400 transition">
                    admin@vaazhgavalamudan.com
                  </a>
                </dd>
              </div>

              {/* Phone Detail */}
              <div>
                <dt className="text-base font-semibold text-gray-300">Phone</dt>
                <dd className="mt-1 text-2xl font-bold text-white">
                  <a href="tel:+918680089800" className="hover:text-indigo-400 transition">
                    +91 86800 89800
                  </a>
                </dd>
                <p className="text-sm text-gray-400 mt-1">Available Mon–Fri, 9am–6pm IST</p>
              </div>

              {/* Social Media Links (New Addition) */}
              <div className="pt-6">
                <dt className="text-base font-semibold text-gray-300">Follow Us</dt>
                <dd className="mt-2 flex space-x-2">
                  <div>
                    <ul className="space-y-3 text-gray-300">
                      {socialLinks.map(({ label, icon: Icon, href }) => (
                        <li key={label} className="flex items-center gap-2">
                          <Icon size={18} />
                          <Link href={href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </dd>
              </div>
            </dl>
          </div>

          {/* --- Column 2: Location/Map (Light Background) --- */}
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 bg-white">
            <h2 className="text-2xl font-bold text-gray-900">Visit Our Studio</h2>
            <div className="mt-6 space-y-4">
              <p className="text-sm font-semibold text-gray-700">Address Details</p>
              <address className="text-base text-gray-600 not-italic">
                Vaazhga Valamudan Digital Realty Solutions, <br />
                No D-54/1, TS No. 106, SP ARCADE, 9A Cross West Extension, <br />
                Thillai Nagar, Tiruchirappalli - 620018.
              </address>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8">
              <div className="h-96 w-full rounded-xl bg-gray-100 flex items-center justify-center text-base text-gray-400 border border-gray-200 shadow-inner">
                <div className="h-100 w-full overflow-hidden rounded-2xl">
                  <MapView center={{ lat: 10.8239, lng: 78.6912 }} zoom={12} markers={[{ lat: 10.8239, lng: 78.6912 }]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

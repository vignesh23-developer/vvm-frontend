import React from 'react'
import Link from 'next/link'
import MapView from '@/components/ui/map/MapView'
import { Instagram, Facebook, Twitter, Linkedin, Send, Mail, Phone, MapPin, Clock4, ArrowUpRight, Youtube } from 'lucide-react'
import { generateLocalBusinessSchema } from '@/lib/jsonld'
import Script from 'next/script'
import { generateStaticPageMetadata } from '@/lib/seo'

export const metadata = generateStaticPageMetadata(
  'Contact Us',
  'Get in touch with Vaazhga Valamudan for real estate inquiries in Tamil Nadu.',
  '/contact-us'
)

const socialLinks = [
  { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/vaazhga._.valamudan?igsh=MXA1OGp5cnY5ZHR6YQ==' },
  { label: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/share/1Cp5XJwHHC/' },
  { label: 'Twitter (𝕏)', icon: Twitter, href: 'https://x.com/VaazhgaValam?t=Iu-WpKa3cvAT-h3BHUBdYg&s=09' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/vaazhga-valamudan-tn' },
  { label: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@VaazhgaValamudan-TN' },
  { label: 'Telegram', icon: Send, href: 'https://t.me/boost/vaazhgavalamudanvvdrs' },
  { label: 'WhatsApp', icon: Phone, href: 'https://whatsapp.com/channel/0029VbCK0k41HsppK1avNo01' },
]

const contactMethods = [
  {
    label: 'Email',
    value: 'admin@vaazhgavalamudan.com',
    href: 'mailto:admin@vaazhgavalamudan.com',
    helper: 'Responses within 24 hours',
    icon: Mail,
  },
  {
    label: 'Phone',
    value: '+91 86800 89800',
    href: 'tel:+918680089800',
    helper: 'Mon – Fri · 9am – 6pm IST',
    icon: Phone,
  },
  {
    label: 'Studio',
    value: 'Thillai Nagar, Tiruchirappalli',
    href: 'https://maps.app.goo.gl/ikrW6JjRpGYCK9t67',
    helper: 'See directions on Google Maps',
    icon: MapPin,
  },
]

const highlightMetrics = [
  { label: 'Cities Served', value: '30+', detail: 'Across Tamil Nadu' },
  { label: 'Successful Closures', value: '1.2K+', detail: 'Residential & commercial' },
  { label: 'Average Response', value: '< 12h', detail: 'Dedicated concierge team' },
]

const officeHours = [
  { label: 'Weekdays', value: '09:00 – 18:00 IST' },
  { label: 'Weekends', value: 'By appointment' },
]

export default function ContactUs() {
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0501] via-[#120a05] to-[#1d1007]">
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,193,7,0.2),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[70vw] -translate-x-1/2 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent)] opacity-40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 text-stone-100 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-300">Let's talk</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Vaazhga Valamudan: Real Estate Solutions for Modern Tamil Nadu
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-300 sm:text-lg">
            Whether you are strategizing your next project or looking for a dedicated partner, our team is ready with data-backed insights, curated
            listings, and on-ground expertise.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {highlightMetrics.map(metric => (
            <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center backdrop-blur-lg">
              <p className="text-3xl font-semibold text-white">{metric.value}</p>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">{metric.label}</p>
              <p className="mt-2 text-xs text-stone-200">{metric.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent)] p-8 shadow-2xl ring-1 ring-white/5">
            <header className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-amber-200">
                <Clock4 size={14} /> Always human
              </p>
              <h2 className="text-3xl font-semibold text-white">Talk to our concierge team</h2>
              <p className="text-sm text-stone-300">
                We go beyond call-center scripts. Reach us directly and expect thoughtful assistance from people who understand the landscape.
              </p>
            </header>

            <div className="mt-8 space-y-5">
              {contactMethods.map(({ label, value, helper, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-4 transition hover:border-amber-300/60 hover:bg-white/10"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-200">
                      <Icon size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-300">{label}</p>
                      <p className="text-lg font-semibold text-white">{value}</p>
                      <p className="text-xs text-stone-400">{helper}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="hidden text-stone-400 sm:block" size={20} />
                </a>
              ))}
            </div>

            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-stone-300">Follow our journey</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-stone-100 transition hover:border-amber-400/70 hover:bg-white/10"
                  >
                    <Icon size={16} /> {label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white p-2 text-stone-900 shadow-2xl">
            <div className="h-full rounded-[28px] bg-gradient-to-b from-white via-white to-stone-50 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Visit us</p>
              <h2 className="mt-3 text-3xl font-semibold text-stone-900">Vaazhga Valamudan Studio</h2>
              <p className="mt-2 text-sm text-stone-600">
                Vaazhga Valamudan Digital Realty Solutions,
                <br /> No D-54/1, TS No. 106, SP Arcade, 9A Cross West Extension,
                <br /> Thillai Nagar, Tiruchirappalli – 620018.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {officeHours.map(item => (
                  <div key={item.label} className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{item.label}</p>
                    <p className="text-base font-semibold text-stone-900">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 h-80 w-full rounded-[26px] border border-stone-200 bg-stone-100 shadow-inner">
                <MapView center={{ lat: 10.8214566, lng: 78.6811822 }} zoom={25} markers={[{ lat: 10.8214566, lng: 78.6811822 }]} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

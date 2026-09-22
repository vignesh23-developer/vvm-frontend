'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useRouter } from 'next/navigation'
import { useLoginModal } from '@/components/auth/LoginModalProvider'

interface FooterColumnProps {
  title: string
  links: { label: string; href: string }[]
}

const footerLinkClass =
  'block w-full text-left text-sm text-gray-300 hover:text-white transition-colors bg-transparent border-0 p-0 cursor-pointer font-normal'

export default function FooterColumn({ title, links }: FooterColumnProps) {
  const t = useTranslations()
  const { token } = useAuth()
  const router = useRouter()
  const { openLoginModal } = useLoginModal()

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 text-yellow-500">{title}</h3>
      <ul className="space-y-2 text-left">
        {links.map(({ label, href }) => {
          const requiresAuth = href === '/properties-registration'
          const labelText = t(`Footer.${label}`)

          if (requiresAuth && token) {
            return (
              <li key={label}>
                <button type="button" onClick={() => router.push(href)} className={footerLinkClass}>
                  {labelText}
                </button>
              </li>
            )
          }

          if (requiresAuth && !token) {
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => openLoginModal({ next: href })}
                  className={footerLinkClass}
                  title="Login required"
                >
                  {labelText}
                </button>
              </li>
            )
          }

          return (
            <li key={label}>
              <Link href={href} className={footerLinkClass}>
                {labelText}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

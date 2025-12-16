'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { useKycStatus } from '@/components/kyc/hooks/useKycStatus'

interface FooterColumnProps {
  title: string
  links: { label: string; href: string }[]
}

export default function FooterColumn({ title, links }: FooterColumnProps) {
  const t = useTranslations()
  const { user, token } = useAuth()
  const router = useRouter()
  // KYC Verification Hook
  // const { kycStatus, loading: isKycLoading, error: kycError, refetch } = useKycStatus()

  // console.log('FooterColumn links:', links)
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <ul className="space-y-2 text-gray-300">
        {links.map(({ label, href }) => {
          const requiresAuth = href === '/properties-registration'
          const disabled = requiresAuth && !token
          if (href === '/properties-registration' && requiresAuth && token) {
            // If the user is logged in but not verified, disable the link
            return (
              <li key={label}>
                <Button
                  type="button"
                  onClick={() => router.push('/properties-registration')}
                  className="hover:text-white"
                  title={`${!token ? 'Login required' : 'Post Your Property'}`}
                >
                  {t(`Footer.${label}`)}
                </Button>
              </li>
            )
          }
          return (
            <li key={label}>
              {disabled ? (
                <Button
                  type="button"
                  onClick={() => router.push(`/login?next=${encodeURIComponent(href)}`)}
                  className="hover:text-white"
                  title="Login required"
                >
                  {t(`Footer.${label}`)}
                </Button>
              ) : (
                <Link href={href} className="hover:text-white">
                  {t(`Footer.${label}`)}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  const t = useTranslations()
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <ul className="space-y-2 text-gray-300">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link href={href} className="hover:text-white">
              {t(`Footer.${label}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

'use client'

import React, { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import MarkdownRenderer from '@/components/ui/MarkdownTextFormat/MarkdownRenderer'

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
}

const PrivacyPolicy = () => {
  const t = useTranslations()
  const title = t('privacyPolicy.title')
  // const effective = t('privacyPolicy.effectiveDate')
  const content = t('privacyPolicy.content')
  const onthispage = t('privacyPolicy.on_this_page')

  const toc = useMemo(() => {
    if (!content) return [] as { id: string; text: string; level: number }[]
    const lines = content.split('\n')
    const items: { id: string; text: string; level: number }[] = []
    const ids: Record<string, number> = {}
    const headingRegex = /^(#{1,3})\s+(.+)$/
    for (const line of lines) {
      const m = line.match(headingRegex)
      if (m) {
        const level = m[1].length
        const text = m[2].replace(/`/g, '').trim()
        const base = slugify(text) || `heading-${items.length + 1}`
        let id = base
        if (ids[base]) {
          ids[base] += 1
          id = `${base}-${ids[base]}`
        } else {
          ids[base] = 1
        }
        items.push({ id, text, level })
      }
    }
    return items
  }, [content])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
            {/* {effective && <p className="text-sm text-gray-500 mt-1">Effective date: {effective}</p>} */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          <main className="md:col-span-3 prose max-w-none">
            <MarkdownRenderer content={content} />
          </main>

          <aside className="md:col-span-1 hidden md:block">
            <div className="sticky top-24 border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-semibold mb-3">{t('Terms.on_this_page') || 'On this page'}</h3>
              <nav>
                <ul className="space-y-2 text-sm">
                  {toc.map(item => (
                    <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                      <a
                        href={`#${item.id}`}
                        className="text-gray-700 hover:text-gray-900"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault()
                          const el = document.getElementById(item.id)
                          if (!el) return
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          el.setAttribute('tabindex', '-1')
                          ;(el as HTMLElement).focus()
                          if (history && history.replaceState) history.replaceState(null, '', `#${item.id}`)
                        }}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

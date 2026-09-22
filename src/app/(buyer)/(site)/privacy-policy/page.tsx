'use client'

import React, { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import MarkdownRenderer from '@/components/ui/MarkdownTextFormat/MarkdownRenderer'
import OnThisStaticPages from '@/components/common/OnThisStaticPages'

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
  const tocLabel = t('privacyPolicy.title') || t('Footer.on_this_page') || 'On this page'

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
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 min-h-screen">
      <div className="bg-gradient-to-br from-white to-yellow-50/20 rounded-lg shadow-sm border border-yellow-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2a1407]">{title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          <main className="md:col-span-3 prose max-w-none">
            <MarkdownRenderer content={content} />
          </main>

          <OnThisStaticPages tocLabel={tocLabel} toc={toc} />
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

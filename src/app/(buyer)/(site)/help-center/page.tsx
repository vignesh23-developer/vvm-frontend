'use client'

import React, { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import MarkdownRenderer from '@/components/ui/MarkdownTextFormat/MarkdownRenderer'

const HelpCenter = () => {
  const t = useTranslations()
  const title = t('helpCenter.title')
  const content = t('helpCenter.content')

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
        </div>
      </div>
    </div>
  )
}

export default HelpCenter

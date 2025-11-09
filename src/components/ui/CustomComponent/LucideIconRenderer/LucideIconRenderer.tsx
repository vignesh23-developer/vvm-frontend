'use client'

import { useEffect, useState } from 'react'
import { SimpleIconLoader } from '@/components/ui/Formik/FormikIconPickerField/SimpleIconLoader'
import type { LucideIconName } from '@/components/ui/Formik/FormikIconPickerField/LucideIconName'

interface LucideIconRendererProps {
  iconName?: LucideIconName
  className?: string
  size?: number
  color?: string
}

/**
 * A reusable component to dynamically render any Lucide icon.
 */
export default function LucideIconRenderer({ iconName, className = '', size = 20, color = 'text-gray-700' }: LucideIconRendererProps) {
  const [icons, setIcons] = useState<{ name: string; component: React.ComponentType<any> }[]>([])

  useEffect(() => {
    const loadIcons = async () => {
      const loader = SimpleIconLoader.getInstance()
      const result = await loader.loadIcons()
      if (result.isLoaded) {
        setIcons(result.icons)
      } else {
        console.error('LucideIconRenderer: Failed to load icons:', result.error)
      }
    }

    loadIcons()
  }, [])

  if (!iconName) return null

  const info = icons.find(icon => icon.name === iconName)
  const IconComp = info?.component

  if (!IconComp) return null

  return <IconComp className={`${color} ${className}`} style={{ width: size, height: size }} aria-hidden />
}

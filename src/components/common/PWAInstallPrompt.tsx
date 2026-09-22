'use client'

import { useState, useEffect } from 'react'
import { Download, Smartphone, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallButton() {
  const t = useTranslations()
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    setInstallPrompt(null)
  }

  // Already installed
  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">{t('AppPromo.installed') || 'Installed ✓'}</span>
      </div>
    )
  }

  // iOS - Show instructions
  if (isIOS) {
    return (
      <button
        onClick={() => alert(t('AppPromo.iosStep1') + '\n' + t('AppPromo.iosStep2') + '\n' + t('AppPromo.iosStep3'))}
        className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
      >
        <Smartphone className="w-5 h-5" />
        <span className="font-medium">{t('AppPromo.download') || 'Download Now'}</span>
      </button>
    )
  }

  // Android/Desktop - Direct install
  if (installPrompt) {
    return (
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-[#2a1407] rounded-lg hover:bg-yellow-400 transition-colors"
      >
        <Download className="w-5 h-5" />
        <span className="font-medium">{t('AppPromo.download') || 'Download Now'}</span>
      </button>
    )
  }

  // Fallback
  return (
    <button
      onClick={() => alert(t('AppPromo.openInChrome') || 'Open in Chrome or Edge to install')}
      className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-[#2a1407] rounded-lg hover:bg-yellow-400 transition-colors"
    >
      <Download className="w-5 h-5" />
      <span className="font-medium">{t('AppPromo.download') || 'Download Now'}</span>
    </button>
  )
}

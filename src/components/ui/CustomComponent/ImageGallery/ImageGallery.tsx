'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../Button/Button'

interface ImageViewerProps {
  images?: string[] | null
}

const DEFAULT_IMAGE = '/villa.png'

export default function ImageViewer({ images = [] }: ImageViewerProps) {
  const [selected, setSelected] = useState<number | null>(null)

  // ✅ Validate images or use fallback
  const validImages = useMemo(() => {
    const valid = images?.filter(img => typeof img === 'string' && img.trim()) ?? []
    return valid.length ? valid : [DEFAULT_IMAGE]
  }, [images])

  const total = validImages.length
  const isDefaultOnly = total === 1 && validImages[0] === DEFAULT_IMAGE

  // ✅ Keyboard navigation
  useEffect(() => {
    if (selected === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') setSelected(i => (i! + 1) % total)
      if (e.key === 'ArrowLeft') setSelected(i => (i! - 1 + total) % total)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, total])

  const handleNav = (dir: 'next' | 'prev') => setSelected(i => (i === null ? 0 : (i + (dir === 'next' ? 1 : -1) + total) % total))

  return (
    <>
      {/* 🖼 Thumbnail Layout */}
      {isDefaultOnly ? (
        // ✅ Show only single full-width image for default fallback
        <Thumbnail src={DEFAULT_IMAGE} className="w-full" />
      ) : (
        <div className="flex gap-2">
          <Thumbnail src={validImages[0]} onClick={() => setSelected(0)} className="w-[70%]" />

          {validImages[1] && (
            <div className="relative w-[30%]" onClick={() => setSelected(1)}>
              <Thumbnail src={validImages[1]} />
              {total > 2 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-semibold rounded-xl">
                  +{total - 1} Photos
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 🖼 Fullscreen Modal */}
      {selected !== null && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 p-4" onClick={() => setSelected(null)}>
          <style jsx global>{`
            body {
              overflow: hidden;
            }
          `}</style>

          {/* Close */}
          <Button
            className="absolute top-5 right-5 text-white hover:text-gray-300"
            onClick={e => {
              e.stopPropagation()
              setSelected(null)
            }}
          >
            <X size={32} />
          </Button>

          {/* Navigation */}
          {total > 1 && (
            <>
              <NavButton direction="prev" onClick={e => (e.stopPropagation(), handleNav('prev'))} />
              <NavButton direction="next" onClick={e => (e.stopPropagation(), handleNav('next'))} />
            </>
          )}

          {/* Full Image */}
          <div className="relative flex w-full max-w-6xl justify-center" onClick={e => e.stopPropagation()}>
            <Image
              src={validImages[selected]}
              alt={`Image ${selected + 1}`}
              width={1600}
              height={900}
              priority
              className="max-h-[90vh] w-auto object-contain rounded-lg select-none"
            />
          </div>

          {/* Counter */}
          <p className="mt-4 text-sm text-gray-300 select-none">
            {selected + 1} / {total}
          </p>
        </div>
      )}
    </>
  )
}

/* 🔹 Thumbnail */
const Thumbnail = ({ src, className = '', onClick }: { src: string; className?: string; onClick?: () => void }) => (
  <div className={`relative cursor-pointer overflow-hidden rounded-xl ${className}`} onClick={onClick}>
    <Image src={src} alt="Thumbnail" width={800} height={450} className="h-48 w-full object-cover rounded-xl transition-transform hover:scale-105" />
  </div>
)

/* 🔹 Navigation Button */
const NavButton = ({ direction, onClick }: { direction: 'next' | 'prev'; onClick: (e: React.MouseEvent) => void }) => (
  <Button
    className={`absolute ${direction === 'prev' ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition`}
    onClick={onClick}
  >
    {direction === 'prev' ? <ChevronLeft size={40} /> : <ChevronRight size={40} />}
  </Button>
)

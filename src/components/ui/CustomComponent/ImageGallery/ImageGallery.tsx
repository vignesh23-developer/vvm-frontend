'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../Button/Button'

interface ImageViewerProps {
  images: string[]
}

export default function ImageViewer({ images }: ImageViewerProps) {
  const [selected, setSelected] = useState<number | null>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selected === null) return
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') setSelected(prev => (prev! + 1) % images.length)
      if (e.key === 'ArrowLeft') setSelected(prev => (prev! - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, images.length])

  return (
    <>
      {/* ✅ Thumbnail layout (main + small preview) */}
      <div className="flex gap-2">
        {/* Main large image */}
        <div className="relative w-[70%] cursor-pointer overflow-hidden rounded-xl" onClick={() => setSelected(0)}>
          <Image
            src={images[0]}
            alt="Main Image"
            width={800}
            height={450}
            className="h-48 w-full object-cover rounded-xl transition-transform hover:scale-105"
          />
        </div>

        {/* Right side image with overlay */}
        {images[1] && (
          <div className="relative w-[30%] cursor-pointer overflow-hidden rounded-xl" onClick={() => setSelected(1)}>
            <Image
              src={images[1]}
              alt="Preview Image"
              width={400}
              height={300}
              className="h-48 w-full object-cover rounded-xl transition-transform hover:scale-105"
            />

            {images.length > 2 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold text-lg rounded-xl">
                +{images.length - 1} Photos
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🖼️ Fullscreen Viewer Modal */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 p-4"
          onClick={() => setSelected(null)} // Allow click outside to close
        >
          {/* Prevent scroll in background */}
          <style jsx global>{`
            body {
              overflow: hidden;
            }
          `}</style>

          {/* Close Button */}
          <Button
            className="absolute top-5 right-5 text-white hover:text-gray-300 transition"
            onClick={e => {
              e.stopPropagation()
              setSelected(null)
            }}
            aria-label="Close Image Viewer"
          >
            <X size={32} />
          </Button>

          {/* Previous Button */}
          {images.length > 1 && (
            <Button
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition"
              onClick={e => {
                e.stopPropagation()
                setSelected(prev => (prev! - 1 + images.length) % images.length)
              }}
              aria-label="Previous Image"
            >
              <ChevronLeft size={40} />
            </Button>
          )}

          {/* Fullscreen Image */}
          <div
            className="relative flex w-full max-w-6xl justify-center"
            onClick={e => e.stopPropagation()} // prevent closing when clicking image
          >
            <Image
              src={images[selected]}
              alt={`Full Image ${selected + 1}`}
              width={1600}
              height={900}
              priority
              className="max-h-[90vh] w-auto object-contain rounded-lg select-none"
            />
          </div>

          {/* Image Counter */}
          <p className="mt-4 text-sm text-gray-300 select-none">
            {selected + 1} / {images.length}
          </p>

          {/* Next Button */}
          {images.length > 1 && (
            <Button
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition"
              onClick={e => {
                e.stopPropagation()
                setSelected(prev => (prev! + 1) % images.length)
              }}
              aria-label="Next Image"
            >
              <ChevronRight size={40} />
            </Button>
          )}
        </div>
      )}
    </>
  )
}

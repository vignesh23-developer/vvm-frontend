'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Share2, Heart } from 'lucide-react'
import { formatPrice } from '@/utils/converter/formatPrice'
import { AdsListDto } from '@/app/(buyer)/(site)/ads-list/(dto)/AdsListDto'

interface AdsCardProps {
  ad: AdsListDto
  onPrimaryAction?: () => void
  onFavorite?: (id: string, e: React.MouseEvent) => void
  onShare?: (id: string, e: React.MouseEvent) => void
  primaryActionLabel?: string
}

export default function AdsCard({ ad, onPrimaryAction, onFavorite, onShare }: AdsCardProps) {
  const getImageUrl = (ad: AdsListDto) => {
    const primaryMedia = ad.media?.find(item => item?.is_primary && item.url)
    const firstMedia = ad.media?.find(item => item?.url)
    const primaryImage = ad.images?.find(item => item?.is_primary && item.url)
    const firstImage = ad.images?.find(item => item?.url)

    return primaryMedia?.url || primaryImage?.url || firstMedia?.url || firstImage?.url || '/villa.png'
  }

  const resolvePriceLabel = (ad: AdsListDto) => {
    if (ad.price === undefined || ad.price === null || ad.price === '') return 'Price on request'

    const numericPrice = typeof ad.price === 'string' ? Number(ad.price) : ad.price
    if (!Number.isNaN(Number(numericPrice))) {
      return `₹${formatPrice(Math.abs(Number(numericPrice)))}`
    }

    return ad.price?.toString() ?? 'Price on request'
  }

  const locationLabel = [ad.district, ad.city].filter(Boolean).join(', ') || 'Location not available'
  const finalPrice = resolvePriceLabel(ad)
  const imageUrl = getImageUrl(ad)

  // Handlers to prevent bubbling if clicking specific actions
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (ad.id && onFavorite) onFavorite(ad.id, e)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (ad.id && onShare) onShare(ad.id, e)
  }

  return (
    <div
      onClick={onPrimaryAction}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full"
    >
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <Image src={imageUrl} alt={ad.title || 'Ad Image'} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />

        {/* Badges/Overlays could go here if needed (e.g. Featured) */}
        {ad.is_boosted && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-yellow-400/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#2a1407] shadow-sm">
            Boosted
          </span>
        )}

        {/* Action Buttons (floating) */}
        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={handleShareClick}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm hover:bg-white hover:text-yellow-600"
            title="Share"
          >
            <Share2 size={14} />
          </button>

          <button
            onClick={handleFavoriteClick}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm hover:bg-white hover:text-red-500"
            title={ad.is_user_favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Heart size={14} className={ad.is_user_favorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-1 text-base font-bold text-[#2a1407]" title={ad.title}>
          {ad.title || 'Untitled Ad'}
        </h3>

        <p className="mb-4 flex items-center gap-1 text-sm text-gray-500 line-clamp-1" title={locationLabel}>
          <MapPin size={14} className="flex-shrink-0 text-yellow-600" />
          {locationLabel}
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-xs uppercase text-gray-400 font-medium">Price</p>
            <p className="text-lg font-bold text-[#2a1407]">{finalPrice}</p>
          </div>

          {ad.is_negotiable && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-medium">Negotiable</p>
              <p className="text-sm font-semibold text-gray-700">Yes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

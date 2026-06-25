'use client'

import { type ReactNode } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { hasRole, Roles, getUserRoles } from '@/utils/roles/roles'
import { motion, type Variants } from 'framer-motion'
import { Heart, Share, Ruler, MapPin, Shapes } from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'
import {
  isLayoutPropertyDisplay,
  resolvePropertyPriceLabel,
  resolvePropertySizeLabel,
  type PropertyDisplaySource,
} from '@/utils/property/resolvePropertyDisplay'

/* ------------------------------ Motion Variants ------------------------------ */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { y: -5, transition: { duration: 0.2 } },
}

/* ------------------------------ Helper Function ------------------------------ */
const t = (translator: ((k: string) => string) | undefined, key: string, fallback: string) =>
  typeof translator === 'function' ? translator(key) : fallback

/* ------------------------------ Types ------------------------------ */
export interface MediaItem {
  id: string
  url: string
  thumbnail_url?: string
  is_primary?: boolean
  [key: string]: any
}

export interface propertyCategory {
  id: string
  name: string
  description?: string
  [key: string]: any
}

interface PropertiesCardProps {
  id: string
  title: string
  description: string
  property_category?: propertyCategory
  price: string
  layout_price_min?: string | number
  layout_price_max?: string | number
  layout_area_min_sqft?: string | number
  layout_area_max_sqft?: string | number
  layout_area_unit?: string | null
  layout_total_sqft?: string | number
  property_size?: string | number
  property_size_unit?: string
  property_category_name?: string
  status: string
  project_status?: string
  listing_type?: string
  address_line: string
  district: string
  city: string
  state: string
  postal_code: string
  approval_status: string
  favorite_count: number
  media?: MediaItem[]
  images?: MediaItem[]
  videos?: MediaItem[]
  agent?: string
  operatingSince?: string
  subtitle?: string
  language?: (key: string) => string
  pricePerSqft?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  onThirdAction?: () => void
  handleFavorite?: (propertyId: string) => void
  handleShare?: () => void
  isUserFavorited?: boolean
  primaryActionLabel?: string
  secondaryActionLabel?: string
  thirdActionLabel?: string
  primaryActionDisabled?: boolean
  secondaryActionDisabled?: boolean
  thirdActionDisabled?: boolean
  propertyPreviewMode?: boolean
  isVerified?: boolean
}

/* ------------------------------ Main Component ------------------------------ */
export default function PropertyCard(props: PropertiesCardProps) {
  const { user } = useAuth()
  const userRoles = getUserRoles(user)
  const onlyAdmin = hasRole(userRoles, [Roles.ADMIN])

  const {
    id,
    title,
    // description,
    listing_type,
    media,
    layout_price_min,
    layout_price_max,
    layout_area_min_sqft,
    layout_area_max_sqft,
    layout_area_unit,
    layout_total_sqft,
    property_size,
    property_size_unit,
    property_category_name,
    address_line,
    district,
    city,
    state,
    price,
    approval_status,
    favorite_count,
    isUserFavorited = false,
    handleFavorite,
    handleShare,
    onPrimaryAction,
    propertyPreviewMode = false,
    isVerified,
    property_category,
  } = props

  const getMediaUrls = () => {
    const fallbackImage = '/villa.png'

    const toUrl = (item: any): string | null => {
      if (!item) return null
      if (typeof item === 'string') return item
      return item.url ?? item.thumbnail_url ?? item.thumbnailUrl ?? item.image_url ?? item.imageUrl ?? null
    }

    const isVideo = (url: string | null, item?: any) => {
      if (!url) return false
      const lower = url.toLowerCase()
      const byExt = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/.test(lower)
      const byMime = typeof item?.mime_type === 'string' ? item.mime_type.startsWith('video/') : false
      const byType = typeof item?.type === 'string' ? item.type.toLowerCase() === 'video' : false
      const byMediaType = typeof item?.media_type === 'string' ? item.media_type.toLowerCase() === 'video' : false
      return byExt || byMime || byType || byMediaType
    }

    const mediaFallback = Array.isArray(media) ? media : []
    const imagesInput = Array.isArray((props as any).images) ? (props as any).images : mediaFallback
    const videosInput = Array.isArray((props as any).videos) ? (props as any).videos : mediaFallback

    const normalize = (arr: any[]) =>
      (Array.isArray(arr) ? arr : [])
        .map(item => ({
          item,
          url: toUrl(item),
          isPrimary: Boolean(item?.is_primary ?? item?.isPrimary),
        }))
        .filter(x => Boolean(x.url)) as Array<{ item: any; url: string; isPrimary: boolean }>

    const normalizedImages = normalize(imagesInput).filter(x => !isVideo(x.url, x.item))
    const normalizedVideos = normalize(videosInput).filter(x => isVideo(x.url, x.item))

    const pickPrimaryOrFirst = (arr: Array<{ url: string; isPrimary: boolean }>) => {
      return arr.find(x => x.isPrimary)?.url ?? arr[0]?.url ?? null
    }

    return {
      image: pickPrimaryOrFirst(normalizedImages) ?? fallbackImage,
      video: pickPrimaryOrFirst(normalizedVideos),
    }
  }

  const mediaUrls = getMediaUrls()
  const imageUrl = mediaUrls.image

  const displaySource: PropertyDisplaySource = {
    price,
    property_size,
    property_size_unit,
    layout_price_min,
    layout_price_max,
    layout_area_min_sqft,
    layout_area_max_sqft,
    layout_area_unit,
    layout_total_sqft,
    property_category_name,
    property_category,
  }

  const isLayout = isLayoutPropertyDisplay(displaySource)
  const priceLabel = resolvePropertyPriceLabel(displaySource)
  const sizeLabel = resolvePropertySizeLabel(displaySource)

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer h-full focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
      onClick={onPrimaryAction}
    >
      {/* 1. Image Section */}
      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-gray-100">
        <Image src={imageUrl} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />

        {/* Gradients for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 z-10">
          <div className="flex flex-wrap items-start gap-2">
            {property_category && (
              <span className="px-2.5 py-1 rounded-full bg-white/90 text-[#2a1407] border border-white/70 text-[11px] font-semibold shadow-sm backdrop-blur flex items-center gap-1">
                {property_category.name}
              </span>
            )}
          </div>

          {/* Approval Status Badge (if needed) */}
          {propertyPreviewMode ? (
            <span className="px-3 py-1 rounded-full bg-yellow-400 text-[#2a1407] text-xs font-bold shadow-sm backdrop-blur-md">Reviewing</span>
          ) : (
            <div /> // Spacer
          )}

          {/* Verified Badge */}
          {(isVerified || approval_status === 'APPROVED') && (
            <span className="px-2.5 py-1 rounded-full bg-white/90 text-[#2a1407] border border-white/70 text-[11px] font-semibold shadow-sm backdrop-blur">
              Verified
            </span>
          )}
        </div>

        {/* Favorite & Share Buttons (Overlay) */}
        {(typeof handleFavorite === 'function' || typeof handleShare === 'function') && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            {typeof handleFavorite === 'function' && (
              <div
                className="bg-white/95 backdrop-blur p-2 rounded-full shadow-sm hover:bg-white transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <FavoriteButton
                  propertyId={id}
                  isUserFavorited={isUserFavorited}
                  onToggleFavorite={handleFavorite}
                  size={18}
                  favoriteCount={favorite_count}
                />
              </div>
            )}
            {typeof handleShare === 'function' && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  handleShare?.()
                }}
                className="bg-white/95 backdrop-blur p-2 rounded-full shadow-sm hover:bg-white transition-colors text-gray-700 hover:text-blue-600"
              >
                <Share size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="space-y-2">
          <h3 className="text-[15px] sm:text-base font-extrabold text-gray-900 line-clamp-1 group-hover:text-[#2a1407] transition-colors">
            {title}
          </h3>
          <div className="flex items-start gap-1.5 text-gray-500">
            <MapPin size={16} className="mt-0.5 flex-shrink-0 text-yellow-600" />
            <p className="text-sm line-clamp-1 leading-relaxed">
              {district}
              {district && city && ', '}
              {city}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 text-yellow-900 border border-yellow-100 px-3 py-1">
            <Shapes size={14} className="shrink-0 text-yellow-700" />
            <span className="text-[11px] font-semibold">{listing_type || 'Listing'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 text-gray-700 border border-gray-100 px-3 py-1">
            <Ruler size={14} className="shrink-0 text-gray-600" />
            <span className="text-[11px] font-semibold">{sizeLabel}</span>
          </span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                {isLayout ? 'Price range' : 'Price'}
              </div>
              <div className="mt-1 text-base sm:text-lg font-extrabold text-[#2a1407] truncate" title={priceLabel}>
                {priceLabel}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Size</div>
              <div className="mt-1 text-sm font-bold text-gray-700">{sizeLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

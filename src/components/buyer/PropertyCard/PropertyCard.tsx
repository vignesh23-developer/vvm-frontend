'use client'

import { type ReactNode } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { hasRole, Roles, getUserRoles } from '@/utils/roles/roles'
import { motion, type Variants } from 'framer-motion'
import { Heart, Share, Ruler, MapPin, Shapes } from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'
import { formatPrice } from '@/utils/converter/formatPrice'

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
  property_size?: string | number
  property_size_unit?: string
  status: string
  listing_type?: string
  address_line: string
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
  property_category_name?: string
  language?: (key: string) => string
  pricePerSqft?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  onThirdAction?: () => void
  handleFavorite: (propertyId: string) => void
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
    property_size,
    property_size_unit,
    address_line,
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer h-full"
      onClick={onPrimaryAction}
    >
      {/* 1. Image Section */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <Image src={imageUrl} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />

        {/* Gradients for text visibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          {property_category && (
            <span className="px-3 py-1 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7] text-xs font-bold shadow-sm flex items-center gap-1">
              {property_category.name}
            </span>
          )}

          {/* Approval Status Badge (if needed) */}
          {propertyPreviewMode ? (
            <span className="px-3 py-1 rounded-full bg-yellow-400 text-[#2a1407] text-xs font-bold shadow-sm backdrop-blur-md">Reviewing</span>
          ) : (
            <div /> // Spacer
          )}

          {/* Verified Badge */}
          {(isVerified || approval_status === 'APPROVED') && (
            <span className="px-3 py-1 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7] text-xs font-bold shadow-sm flex items-center gap-1">
              Verified
            </span>
          )}
        </div>

        {/* Favorite & Share Buttons (Overlay) */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
          <div
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
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
          <button
            onClick={e => {
              e.stopPropagation()
              handleShare?.()
            }}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors text-gray-700 hover:text-blue-600"
          >
            <Share size={18} />
          </button>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-yellow-700 transition-colors">{title}</h3>
          <div className="flex items-start gap-1.5 text-gray-500">
            <MapPin size={16} className="mt-0.5 flex-shrink-0 text-yellow-600" />
            <p className="text-sm line-clamp-2 leading-relaxed">{address_line}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-auto" />

        {/* 3. Listing Section */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1">
            <Shapes size={14} className="shrink-0 text-yellow-600" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-700">{listing_type || 'N/A'}</span>
          </div>
        </div>
        {/* 4. Footer Section (Price & Size) */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Price</span>
            <span className="text-lg sm:text-xl font-bold text-[#2a1407]">₹ {formatPrice(Number(price))}</span>
          </div>
          {/* Size */}
          <div className="flex flex-col items-end">
            <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              <Ruler size={14} className="shrink-0" />
              Property Size
            </span>

            <div className="flex items-center gap-1">
              <span className="text-lg sm:text-xl font-bold text-gray-700">{property_size || '--'}</span>
              <span className="text-xs text-gray-500 font-medium translate-y-1">{property_size_unit || 'sqft'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

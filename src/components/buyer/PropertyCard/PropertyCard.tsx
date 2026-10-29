'use client'

import { memo, useMemo, type MouseEvent } from 'react'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import {
  Share,
  Ruler,
  MapPin,
  Shapes,
  Tag,
} from 'lucide-react'

import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { hasRole, Roles, getUserRoles } from '@/utils/roles/roles'
import {
  isLayoutPropertyDisplay,
  resolvePropertyPriceLabel,
  resolvePropertySizeLabel,
  type PropertyDisplaySource,
} from '@/utils/property/resolvePropertyDisplay'

import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface MediaItem {
  id: string
  url?: string
  thumbnail_url?: string
  thumbnailUrl?: string
  image_url?: string
  imageUrl?: string
  is_primary?: boolean
  isPrimary?: boolean
  mime_type?: string
  type?: string
  media_type?: string
}

export interface propertyCategory {
  id: string
  name: string
  description?: string
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
  offer?: string | null
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

interface NormalizedMedia {
  item: MediaItem
  url: string
  isPrimary: boolean
}

/* -------------------------------------------------------------------------- */
/* Constants and Helpers                                                      */
/* -------------------------------------------------------------------------- */

const FALLBACK_IMAGE = '/villa.png'

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
    },
  },
}

const VIDEO_EXTENSION_REGEX = /\.(mp4|webm|ogg|mov|m4v)(?:\?.*)?$/i

function getMediaUrl(item: MediaItem | string): string | null {
  if (typeof item === 'string') {
    return item.trim() || null
  }

  return (
    item.url ??
    item.thumbnail_url ??
    item.thumbnailUrl ??
    item.image_url ??
    item.imageUrl ??
    null
  )
}

function isVideoMedia(item: MediaItem, url: string): boolean {
  return (
    VIDEO_EXTENSION_REGEX.test(url) ||
    item.mime_type?.toLowerCase().startsWith('video/') === true ||
    item.type?.toLowerCase() === 'video' ||
    item.media_type?.toLowerCase() === 'video'
  )
}

function normalizeMedia(
  items: Array<MediaItem | string>,
): NormalizedMedia[] {
  return items.reduce<NormalizedMedia[]>((result, item) => {
    if (!item) return result

    const url = getMediaUrl(item)

    if (!url) return result

    const normalizedItem: MediaItem =
      typeof item === 'string'
        ? { id: url, url }
        : item

    result.push({
      item: normalizedItem,
      url,
      isPrimary: Boolean(
        normalizedItem.is_primary ?? normalizedItem.isPrimary,
      ),
    })

    return result
  }, [])
}

function pickPrimaryMedia(
  items: NormalizedMedia[],
): string | null {
  return (
    items.find((item) => item.isPrimary)?.url ??
    items[0]?.url ??
    null
  )
}

function getPropertyMedia(
  images?: MediaItem[],
  videos?: MediaItem[],
  media?: MediaItem[],
) {
  const fallbackMedia = media ?? []
  const imageInput = images ?? fallbackMedia
  const videoInput = videos ?? fallbackMedia

  const normalizedImages = normalizeMedia(imageInput).filter(
    ({ item, url }) => !isVideoMedia(item, url),
  )

  const normalizedVideos = normalizeMedia(videoInput).filter(
    ({ item, url }) => isVideoMedia(item, url),
  )

  return {
    image: pickPrimaryMedia(normalizedImages) ?? FALLBACK_IMAGE,
    video: pickPrimaryMedia(normalizedVideos),
  }
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

function PropertyCardComponent(props: PropertiesCardProps) {
  const { user } = useAuth()

  
  const {
    id,
    title,
    listing_type,
    media,
    images,
    videos,
    layout_price_min,
    layout_price_max,
    layout_area_min_sqft,
    layout_area_max_sqft,
    layout_area_unit,
    layout_total_sqft,
    property_size,
    property_size_unit,
    property_category_name,
    district,
    city,
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
    offer,
  } = props

  // Retained for compatibility with the existing role-based logic.
  // Add an explicit role-dependent UI condition if admin-only UI is required.
  const userRoles = getUserRoles(user)
  const onlyAdmin = hasRole(userRoles, [Roles.ADMIN])

  const offerText = typeof offer === 'string' ? offer.trim() : ''
  const hasOffer = offerText.length > 0

  const { image: imageUrl } = useMemo(
    () => getPropertyMedia(images, videos, media),
    [images, videos, media],
  )

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

  const stopCardClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  const handleShareClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    handleShare?.()
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
      onClick={onPrimaryAction}
    >
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100 sm:h-60">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Image Gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-3 right-3 top-3 z-10 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-start gap-2">
            {property_category && (
              <span className="flex items-center gap-1 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#2a1407] shadow-sm backdrop-blur">
                {property_category.name}
              </span>
            )}
          </div>

          {propertyPreviewMode && (
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-[#2a1407] shadow-sm backdrop-blur-md">
              Reviewing
            </span>
          )}

          {(isVerified || approval_status === 'APPROVED') && (
            <span className="rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#2a1407] shadow-sm backdrop-blur">
              Verified
            </span>
          )}
        </div>

        {/* Offer Badge */}
        {hasOffer && (
          <div
            className="absolute bottom-3 left-3 z-10 max-w-[160px] rounded-full border border-yellow-300 bg-yellow-400 px-2.5 py-1.5 text-[#2a1407] shadow-md sm:max-w-[200px]"
            onClick={stopCardClick}
            title={offerText}
          >
            <div className="flex items-center gap-1">
              <Tag size={13} className="shrink-0" />
              <span className="truncate text-[11px] font-bold">
                {offerText}
              </span>
            </div>
          </div>
        )}

        {/* Favorite and Share Actions */}
        {(handleFavorite || handleShare) && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
            {handleFavorite && (
              <div
                className="rounded-full bg-white/95 p-2 shadow-sm backdrop-blur transition-colors hover:bg-white"
                onClick={stopCardClick}
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

            {handleShare && (
              <button
                type="button"
                onClick={handleShareClick}
                aria-label={`Share ${title}`}
                className="rounded-full bg-white/95 p-2 text-gray-700 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-blue-600"
              >
                <Share size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-1 text-[15px] font-extrabold text-gray-900 transition-colors group-hover:text-[#2a1407] sm:text-base">
            {title}
          </h3>

          <div className="flex items-start gap-1.5 text-gray-500">
            <MapPin
              size={16}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-yellow-600"
            />

            <p className="line-clamp-1 text-sm leading-relaxed">
              {district}
              {district && city ? ', ' : ''}
              {city}
            </p>
          </div>
        </div>

        {/* Property Information */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-100 bg-yellow-50 px-3 py-1 text-yellow-900">
            <Shapes
              size={14}
              aria-hidden="true"
              className="shrink-0 text-yellow-700"
            />
            <span className="text-[11px] font-semibold">
              {listing_type || 'Listing'}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-gray-700">
            <Ruler
              size={14}
              aria-hidden="true"
              className="shrink-0 text-gray-600"
            />
            <span className="text-[11px] font-semibold">
              {sizeLabel}
            </span>
          </span>
        </div>

        {/* Price and Size */}
        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {isLayout ? 'Price range' : 'Price'}
              </div>

              <div
                className="mt-1 truncate text-base font-extrabold text-[#2a1407] sm:text-lg"
                title={priceLabel}
              >
                {priceLabel}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Size
              </div>

              <div className="mt-1 text-sm font-bold text-gray-700">
                {sizeLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const PropertyCard = memo(PropertyCardComponent)

PropertyCard.displayName = 'PropertyCard'

export default PropertyCard



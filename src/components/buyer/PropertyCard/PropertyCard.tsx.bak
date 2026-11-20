
'use client'

import { memo, useMemo, useState, useEffect, type MouseEvent } from 'react'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import {
  Share2,
  Ruler,
  MapPin,
  Shapes,
  Tag,
  BadgeCheck,
  Heart,
  ArrowUpRight,
} from 'lucide-react'


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
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const getFallbackImage = (propertyType?: string): string => {
  const type = propertyType?.trim().toLowerCase()

  switch (type) {
    case 'house':
      return '/villa.png'

    case 'land':
    case 'commercial land':
      return '/land.png'

    case 'plot':
      return '/plot.png'

    case 'layout':
      return '/layout.png'

    case 'agri land':
    case 'agricultural land':
      return '/Agri_land.png'
     default:
      return '/villa.png'
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  hover: {
    y: -4,
    transition: { duration: 0.2 },
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
      typeof item === 'string' ? { id: url, url } : item

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

function pickPrimaryMedia(items: NormalizedMedia[]): string | null {
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
  propertyType?: string,
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
    image:
      pickPrimaryMedia(normalizedImages) ??
      getFallbackImage(propertyType),
    video: pickPrimaryMedia(normalizedVideos),
  }
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

function PropertyCardComponent(props: PropertiesCardProps) {
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
  
  const { image: imageUrl } = useMemo(
    () =>
      getPropertyMedia(
        images,
        videos,
        media,
        property_category_name || property_category?.name,
      ),
    [images, videos, media, property_category_name, property_category?.name],
  )

  const [displayImage, setDisplayImage] = useState(imageUrl)

  useEffect(() => {
    setDisplayImage(imageUrl)
  }, [imageUrl])

  const fallbackImage = getFallbackImage(
    property_category_name || property_category?.name,
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

  const offerText = typeof offer === 'string' ? offer.trim() : ''
  const hasOffer = offerText.length > 0
  const verified = isVerified || approval_status === 'APPROVED'

  const location = [district, city].filter(Boolean).join(', ')

  const stopCardClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  const handleShareClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    handleShare?.()
  }


  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
     onClick={onPrimaryAction}
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#eee8df] bg-white shadow-[0_2px_12px_rgba(42,20,7,0.05)] transition-all duration-300 hover:border-[#e7d6b7] hover:shadow-[0_12px_30px_rgba(42,20,7,0.12)]"
    >
      {/* Property Image */}
      <div className="relative h-56 w-full overflow-hidden bg-[#f5f3ef] sm:h-60">
        <Image
          src={displayImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => {
            if (displayImage !== fallbackImage) {
              setDisplayImage(fallbackImage)
            }
          }}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />

        {/* Top Badges */}
        <div className="absolute left-3 right-3 top-3 z-10 flex items-start justify-between">
          {propertyPreviewMode ? (
            <span className="rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-[#321b0d] shadow-sm">
              Reviewing
            </span>
          ) : (
            <span />
          )}

          {verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-emerald-700 shadow-sm backdrop-blur">
              <BadgeCheck size={14} />
              Verified
            </span>
          )}
        </div>

        {/* Offer Badge */}
        {hasOffer && (
        <div
            onClick={stopCardClick}
            title={offerText}
            className="absolute bottom-3 left-3 z-10 flex max-w-[65%] items-center gap-1.5 rounded-full bg-[#f9c900] px-3 py-2 text-[11px] font-bold text-[#291707] shadow-md"
          >
            <Tag size={13} className="shrink-0" />
            <span className="truncate">{offerText}</span>
          </div>
        )}

        {/* Favorite & Share */}
        {(handleFavorite || handleShare) && (
          <div className="absolute bottom-3 right-2.5 z-10 flex items-center gap-2">
            {handleFavorite && (
              <div

                onClick={stopCardClick}
                 className="rounded-xl shadow-lg transition-transform hover:scale-100"
              >
                <FavoriteButton
                  propertyId={id}
                  isUserFavorited={isUserFavorited}
                  onToggleFavorite={handleFavorite}
                  size={15}
                  favoriteCount={favorite_count}
                />
              </div>
            )}

            {handleShare && (
              <button
                type="button"
                onClick={handleShareClick}
                aria-label={`Share ${title}`}
                className="rounded-xl bg-white p-2.5 shadow-lg transition-transform hover:scale-105"
              >
                <Share2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Property Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">

        {/* Title & Location */}
        <div className="mb-4">
          <h3 className="line-clamp-1 text-[16px] font-extrabold tracking-tight text-[#291707] transition-colors group-hover:text-[#966000] sm:text-[17px]">
            {title}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin
              size={15}
              className="shrink-0 text-[#bd8300]"
            />
            <p className="line-clamp-1">
              {location || 'Location unavailable'}
            </p>
          </div>
        </div>

        {/* Property Tags: Sale → Size → Category */}
        <div className="mb-4 flex flex-wrap items-center gap-2">

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#f2e4b8] bg-[#fffaf0] px-3 py-1.5 text-[11px] font-bold text-[#8a5b00]">
            <Shapes size={13} />
            {listing_type || 'Listing'}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-600">
            <Ruler size={13} />
            {sizeLabel}
          </span>

          {property_category && (
            <span className="inline-flex items-center rounded-lg border border-[#eee5d9] bg-[#faf8f5] px-3 py-1.5 text-[11px] font-semibold text-[#62452d]">
              {property_category.name}
            </span>
          )}
        </div>

        {/* Price Details */}
        <div className="mt-auto border-t border-gray-100 pt-4">
          <div className="flex items-end justify-between gap-3">

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                {isLayout ? 'Price Range' : 'Property Price'}
              </p>

              <p
                title={priceLabel}
                className="mt-1 truncate text-lg font-extrabold tracking-tight text-[#291707] sm:text-xl"
              >
                {priceLabel}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                Total Area
              </p>

              <p className="mt-1 text-sm font-bold text-gray-700">
                {sizeLabel}
              </p>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs font-medium text-gray-400">
              Vaazhga Valamudan
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#956000] transition-all group-hover:gap-2">
              Explore Property
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )

}

const PropertyCard = memo(PropertyCardComponent)

PropertyCard.displayName = 'PropertyCard'

export default PropertyCard
  
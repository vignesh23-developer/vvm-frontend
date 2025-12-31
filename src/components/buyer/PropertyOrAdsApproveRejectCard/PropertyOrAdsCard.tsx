'use client'

import { type ReactNode } from 'react'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { hasRole, Roles, getUserRoles } from '@/utils/roles/roles'
import { motion, type Variants } from 'framer-motion'
import { Heart, Share, Ruler, Building2, Home, ChevronDown, BadgeIndianRupee, LandPlot, MapPin, Eye } from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'
import { formatPrice } from '@/utils/converter/formatPrice'

/* ------------------------------ Motion Variants ------------------------------ */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { scale: 1.02 },
}

const imageHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
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

interface PropertiesCardProps {
  id: string
  title: string
  description: string
  price: string
  property_size?: string | number
  property_size_unit?: string
  status: string
  listing_type?: string
  address_line: string
  district?: string
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
  category_name?: string
  property_category_name?: string
  language?: (key: string) => string
  pricePerSqft?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  onThirdAction?: () => void
  handleFavorite: (propertyId: string) => void
  handleShare?: () => void
  isUserFavorited?: boolean
  isPropertyOrAds?: 'property' | 'ads'
  primaryActionLabel?: string
  secondaryActionLabel?: string
  thirdActionLabel?: string
  primaryActionDisabled?: boolean
  secondaryActionDisabled?: boolean
  thirdActionDisabled?: boolean
  propertyPreviewMode?: boolean
}

/* ------------------------------ Main Component ------------------------------ */
export default function PropertyOrAdsApproveRejectCard(props: PropertiesCardProps) {
  const { user } = useAuth()
  const userRoles = getUserRoles(user)
  const onlyAdmin = hasRole(userRoles, [Roles.ADMIN])

  const {
    id,
    title,
    subtitle,
    description,
    media,
    images,
    videos,
    property_size,
    property_size_unit,
    status,
    // transaction,
    address_line,
    listing_type,
    price,
    district,
    approval_status,
    favorite_count,
    isUserFavorited = false,
    isPropertyOrAds,
    agent = 'N/A',
    operatingSince = 'N/A',
    category_name = 'N/A',
    property_category_name = 'N/A',
    handleFavorite,
    handleShare,
    language,
    primaryActionLabel,
    secondaryActionLabel,
    thirdActionLabel,
    onPrimaryAction,
    onSecondaryAction,
    onThirdAction,
    primaryActionDisabled = false,
    secondaryActionDisabled = false,
    thirdActionDisabled = false,
    propertyPreviewMode = false,
  } = props

  const labels = {
    agent: t(language, 'PropertiesListCard.agent', 'Agent'),
    since: t(language, 'PropertiesListCard.operating_since', 'Operating since'),
    status: t(language, 'PropertiesListCard.status', 'Status'),
    property_size_unit: t(language, 'PropertiesListCard.property_size', 'Property size'),
    price: t(language, 'PropertiesListCard.price', 'Price'),
    listing_type: t(language, 'PropertiesListCard.listing_type', 'Listing type'),
    district: t(language, 'PropertiesListCard.district', 'District'),
  }

  const buttons = {
    primary: primaryActionLabel ?? t(language, 'PropertiesListCard.contact_agent', 'Contact agent'),
    secondary: secondaryActionLabel ?? t(language, 'PropertiesListCard.get_phone_number', 'Get phone number'),
    third: thirdActionLabel ?? t(language, 'PropertiesListCard.check_affordability', 'Check affordability'),
  }

  // Find primary image or fall back to first image
  // const getImageUrl = () => {
  //   // Use images prop if available, otherwise fall back to media prop
  //   const imageArray = (props as any).images || media || []
  //   if (imageArray.length === 0) return '/villa.png'

  //   // Find primary image or fall back to first image
  //   const primary = imageArray.find((img: any) => img.is_primary)
  //   if (primary?.url) return primary.url
  //   if (imageArray[0]?.url) return imageArray[0].url
  //   return '/villa.png'
  // }

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
    const imagesInput = Array.isArray(images) ? images : mediaFallback
    const videosInput = Array.isArray(videos) ? videos : mediaFallback

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

  const imageUrl = getMediaUrls()

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-white/95 shadow-md ring-1 ring-gray-100 hover:shadow-xl hover:ring-yellow-200 lg:flex-row transition-shadow duration-300"
    >
      {/* Left: Image + Agent */}
      <div className="flex-1">
        <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row">
          <ImageSection imageUrl={imageUrl} title={title} agent={agent} operatingSince={operatingSince} labels={labels} />
          <InfoSection
            id={id}
            title={title}
            property_category_name={property_category_name}
            category_name={category_name}
            subtitle={subtitle}
            description={description}
            status={status}
            address_line={address_line}
            property_size={property_size}
            price={price}
            district={district}
            property_size_unit={property_size_unit}
            labels={labels}
            listing_type={listing_type}
            handleFavorite={handleFavorite}
            handleShare={handleShare}
            isUserFavorited={isUserFavorited}
            isPropertyOrAds={isPropertyOrAds}
            favorite_count={favorite_count}
          />
        </div>
      </div>

      {/* Right: Price / CTAs */}
      <ActionSection
        price={formatPrice(Number(price))}
        approval_status={approval_status}
        property_size={property_size}
        property_size_unit={property_size_unit}
        buttons={buttons}
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
        onThirdAction={onThirdAction}
        primaryDisabled={primaryActionDisabled}
        secondaryDisabled={secondaryActionDisabled}
        thirdDisabled={thirdActionDisabled}
        propertyPreviewMode={propertyPreviewMode}
        onlyAdmin={onlyAdmin}
      />
    </motion.div>
  )
}

/* ------------------------------ Subcomponents ------------------------------ */
const ImageSection = ({
  imageUrl,
  title,
  agent,
  operatingSince,
  labels,
}: {
  imageUrl: string | { image: string; video: string | null }
  title: string
  agent: string
  operatingSince: string
  labels: any
}) => (
  <motion.div
    className="flex flex-col items-start overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm sm:w-auto"
    variants={imageHover}
    initial="rest"
    whileHover="hover"
  >
    {typeof imageUrl === 'string' || !imageUrl.video ? (
      <Image
        src={typeof imageUrl === 'string' ? imageUrl : imageUrl.image}
        alt={title}
        width={260}
        height={180}
        className="h-60 w-full object-cover sm:w-[260px]"
      />
    ) : (
      <video src={imageUrl.video} autoPlay muted loop className="h-60 w-full object-cover sm:w-[260px]" />
    )}
    {/* <div className="w-full px-3 py-2">
      <p className="text-sm font-semibold text-gray-900">
        {labels.agent}: {agent}
      </p>
      <p className="text-xs text-gray-500">
        {labels.since}: {operatingSince}
      </p>
    </div> */}
  </motion.div>
)

const InfoSection = ({
  id,
  title,
  property_category_name,
  category_name,
  subtitle,
  description,
  status,
  transaction,
  address_line,
  price,
  district,
  property_size,
  property_size_unit,
  labels,
  listing_type,
  handleFavorite,
  handleShare,
  isUserFavorited,
  isPropertyOrAds,
  favorite_count,
}: any) => (
  <div className="flex flex-1 flex-col justify-between">
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {(property_category_name || category_name || subtitle) && (
          <p className="text-xs sm:text-sm font-medium text-yellow-700">
            {isPropertyOrAds === 'ads' ? category_name : property_category_name || subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <FavoriteButton
          propertyId={id}
          isUserFavorited={isUserFavorited}
          onToggleFavorite={handleFavorite}
          size={22}
          favoriteCount={favorite_count}
        />

        <button
          type="button"
          onClick={handleShare}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:border-blue-300 hover:text-blue-500 transition-colors"
        >
          <Share size={18} />
        </button>
      </div>
    </div>

    <div className="mt-3 flex w-full flex-col divide-y divide-gray-200 rounded-xl bg-gray-50 text-sm sm:flex-row sm:divide-y-0 sm:divide-x">
      {isPropertyOrAds === 'ads' ? (
        <>
          <PropertyTag icon={<Building2 size={18} />} label={labels.status} value={status} />

          <PropertyTag icon={<BadgeIndianRupee size={18} />} label={labels.price} value={formatPrice(price) ?? 'N/A'} />

          <PropertyTag icon={<LandPlot size={18} />} label={labels.district} value={district ?? 'N/A'} />
        </>
      ) : (
        <>
          <PropertyTag icon={<Building2 size={18} />} label={labels.status} value={status} />

          <PropertyTag
            icon={<Ruler size={18} />}
            label={labels.property_size_unit}
            value={property_size ? property_size.toString() : 'N/A'}
            suffix={property_size_unit ? <span className="text-gray-500">sqft</span> : null}
          />

          <PropertyTag icon={<Home size={18} />} label={labels.listing_type} value={listing_type} />
        </>
      )}
    </div>

    <p className="mt-3 flex items-center text-xs sm:text-sm text-gray-700">
      <MapPin size={24} color="#d41111" className="mr-1.5 flex-shrink-0" />
      <span className="line-clamp-2">{address_line}</span>
    </p>

    <p className="mt-2 line-clamp-3 text-xs sm:text-sm text-gray-600">{description}</p>
  </div>
)

const ActionSection = ({
  price,
  approval_status,
  property_size,
  property_size_unit,
  buttons,
  onPrimaryAction,
  onSecondaryAction,
  onThirdAction,
  primaryDisabled,
  secondaryDisabled,
  thirdDisabled,
  propertyPreviewMode,
  onlyAdmin,
}: any) => (
  <div className="flex w-full flex-col justify-between bg-gradient-to-b from-[#1F130B] via-[#1A120B] to-[#111111] px-4 py-4 sm:px-5 sm:py-6 lg:w-[250px]">
    <div className="text-left lg:text-right space-y-1">
      <p className="text-[10px] uppercase tracking-[0.16em] text-yellow-400/90 font-semibold">
        {approval_status === 'APPROVED' ? 'Featured Listing' : approval_status.replace(/_/g, ' ')}
      </p>
      <h3 className="text-xl font-bold text-white">{'₹ ' + (price ? String(price) : '0')}</h3>
      <p className="text-xs sm:text-sm text-gray-300">{`${property_size || '--'} ${property_size_unit || ''}`}</p>
    </div>
    {propertyPreviewMode ? (
      <div className="mt-2 mb-24 text-sm text-gray-500">This property is under review.</div>
    ) : approval_status === 'UNDER_REVIEW' && onlyAdmin ? (
      <div className="mt-4 flex w-full flex-col gap-3">
        {buttons.primary && <ActionButton label={buttons.primary} variant="primary" onClick={onPrimaryAction} disabled={primaryDisabled} />}
        {buttons.secondary && <ActionButton label={buttons.secondary} variant="secondary" onClick={onSecondaryAction} disabled={secondaryDisabled} />}
        {buttons.third && <ActionButton label={buttons.third} variant="third" onClick={onThirdAction} disabled={thirdDisabled} />}
      </div>
    ) : approval_status === 'APPROVED' ? (
      <div className="mt-4 flex w-full flex-col mb-15 gap-3">
        {buttons.primary && <ActionButton label={buttons.primary} variant="primary" onClick={onPrimaryAction} disabled={primaryDisabled} />}
      </div>
    ) : (
      <div className="mb-20 text-center text-sm font-medium italic text-gray-500">
        This property is {approval_status.replace(/_/g, ' ').toLowerCase()}.
      </div>
    )}
  </div>
)

const ActionButton = ({
  label,
  variant,
  onClick,
  disabled,
}: {
  label: string
  variant: 'primary' | 'secondary' | 'third'
  onClick?: () => void
  disabled?: boolean
}) => (
  <motion.div whileHover={{ y: -3 }}>
    <Button
      type="button"
      onClick={disabled ? () => { } : onClick ?? (() => { })}
      disabled={disabled}
      className={`w-full rounded-full py-2 font-medium transition ${disabled
          ? 'border border-gray-200 bg-gray-100 text-gray-400'
          : variant === 'primary'
            ? 'bg-black text-white hover:bg-gray-800'
            : 'border bg-white hover:bg-gray-200'
        }`}
    >
      {label}
    </Button>
  </motion.div>
)

const PropertyTag = ({ icon, label, value, suffix }: { icon: ReactNode; label: string; value?: string; suffix?: ReactNode }) => (
  <div className="flex flex-1 items-center gap-2 px-4 py-3">
    {icon}
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</div>
      <div className="flex items-center gap-1 text-[14px] font-bold text-gray-900">
        {value}
        {suffix}
      </div>
    </div>
  </div>
)

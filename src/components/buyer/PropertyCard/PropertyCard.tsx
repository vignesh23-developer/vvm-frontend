'use client'

import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Heart, Share, Ruler, Building2, Home, ChevronDown, MapPin, Eye } from 'lucide-react'
import Link from 'next/link'
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
  city: string
  state: string
  postal_code: string
  approval_status: string
  favorite_count: number
  media?: MediaItem[]
  images?: MediaItem[]
  agent?: string
  operatingSince?: string
  subtitle?: string
  language?: (key: string) => string
  pricePerSqft?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  onThirdAction?: () => void
  handleFavorite: (propertyId: string) => void
  handleShare: (propertyId: string) => void
  isUserFavorited?: boolean
  primaryActionLabel?: string
  secondaryActionLabel?: string
  thirdActionLabel?: string
  primaryActionDisabled?: boolean
  secondaryActionDisabled?: boolean
  thirdActionDisabled?: boolean
  propertyPreviewMode?: boolean
}

/* ------------------------------ Main Component ------------------------------ */
export default function PropertyCard(props: PropertiesCardProps) {
  const {
    id,
    title,
    subtitle,
    description,
    media,
    property_size,
    property_size_unit,
    status,
    // transaction,
    address_line,
    listing_type,
    price,
    approval_status,
    favorite_count,
    isUserFavorited = false,
    agent = 'N/A',
    operatingSince = 'N/A',
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
    listing_type: t(language, 'PropertiesListCard.listing_type', 'Listing type'),
  }

  const buttons = {
    primary: primaryActionLabel ?? t(language, 'PropertiesListCard.contact_agent', 'Contact agent'),
    secondary: secondaryActionLabel ?? t(language, 'PropertiesListCard.get_phone_number', 'Get phone number'),
    third: thirdActionLabel ?? t(language, 'PropertiesListCard.check_affordability', 'Check affordability'),
  }

  // Find primary image or fall back to first image
  const getImageUrl = () => {
    // Use images prop if available, otherwise fall back to media prop
    const imageArray = (props as any).images || media || []
    if (imageArray.length === 0) return '/villa.png'

    // Find primary image or fall back to first image
    const primary = imageArray.find((img: any) => img.is_primary)
    if (primary?.url) return primary.url
    if (imageArray[0]?.url) return imageArray[0].url
    return '/villa.png'
  }

  const imageUrl = getImageUrl()

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg lg:flex-row"
    >
      <div className="flex-1">
        <div className="flex flex-col gap-4 p-3 lg:flex-row">
          <ImageSection imageUrl={imageUrl} title={title} agent={agent} operatingSince={operatingSince} labels={labels} />
          <InfoSection
            id={id}
            title={title}
            subtitle={subtitle}
            description={description}
            status={status}
            address_line={address_line}
            property_size={property_size}
            property_size_unit={property_size_unit}
            labels={labels}
            listing_type={listing_type}
            handleFavorite={handleFavorite}
            handleShare={handleShare}
            isUserFavorited={isUserFavorited}
            favorite_count={favorite_count}
          />
        </div>
      </div>

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
  imageUrl: string
  title: string
  agent: string
  operatingSince: string
  labels: any
}) => (
  <motion.div className="flex flex-col items-start overflow-hidden rounded-md sm:w-auto" variants={imageHover} initial="rest" whileHover="hover">
    <Image
      src={imageUrl}
      alt={title}
      width={250}
      height={150}
      className="h-40 w-full rounded-md object-cover transition-transform duration-500 sm:w-[250px]"
    />
    <p className="ml-1 mt-2 text-sm text-gray-700 sm:ml-2">
      {labels.agent}: {agent}
      <br />
      <span className="text-xs text-gray-500">
        {labels.since}: {operatingSince}
      </span>
    </p>
  </motion.div>
)

const InfoSection = ({
  id,
  title,
  subtitle,
  description,
  status,
  transaction,
  address_line,
  property_size,
  property_size_unit,
  labels,
  listing_type,
  handleFavorite,
  handleShare,
  isUserFavorited,
  favorite_count,
}: any) => (
  <div className="flex flex-1 flex-col justify-between">
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-[#747474] font-medium underline">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 text-gray-600">
        <FavoriteButton
          propertyId={id}
          isUserFavorited={isUserFavorited}
          onToggleFavorite={handleFavorite}
          size={25}
          favoriteCount={favorite_count}
        />

        <button onClick={() => handleShare(id)} className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
          <Share size={18} />
        </button>
      </div>
    </div>

    <div className="mt-3 flex w-full flex-col divide-y divide-gray-200 rounded-md bg-[#F5F5F5] text-sm sm:flex-row sm:divide-y-0 sm:divide-x">
      <PropertyTag icon={<Building2 size={18} />} label={labels.status} value={status} />
      <PropertyTag
        icon={<Ruler size={18} />}
        label={labels.property_size_unit}
        value={property_size ? property_size.toString() : 'N/A'}
        suffix={property_size_unit ? <span className="text-gray-500">sqft</span> : null}
      />
      <PropertyTag icon={<Home size={18} />} label={labels.listing_type} value={listing_type} />
    </div>

    <p className="mt-3 flex items-center text-sm text-gray-600">
      <MapPin size={30} color="#d41111" className="mr-1.5" />
      {address_line}
    </p>

    <p className="mt-1 line-clamp-3 text-sm text-gray-500">{description}</p>
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
}: any) => (
  <div className="flex w-full flex-col justify-between bg-[#ECECEC] p-4 lg:w-[240px]">
    <div className="text-left lg:text-right">
      <h3 className="text-xl font-bold">{'₹ ' + price}</h3>
      <p className="text-sm text-gray-500">{`${property_size} ${property_size_unit}`}</p>
    </div>
    {propertyPreviewMode ? (
      <div className="mt-2 mb-24 text-sm text-gray-500">This property is under review.</div>
    ) : approval_status === 'UNDER_REVIEW' ? (
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
      onClick={disabled ? () => {} : onClick ?? (() => {})}
      disabled={disabled}
      className={`w-full rounded-full py-2 font-medium transition ${
        disabled
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

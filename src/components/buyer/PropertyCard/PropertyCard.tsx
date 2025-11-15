'use client'

import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Heart, Share, Ruler, Building2, Home, ChevronDown, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/CustomComponent/Button/Button'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'

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
export interface PropertiesCardProps {
  id: string
  title: string
  description: string
  price: string
  property_size?: string | number
  property_size_unit?: string
  status: string
  listing_type?: string
  // transaction: string
  address_line: string
  city: string
  state: string
  postal_code: string
  approval_status: string
  favorite_count: number
  media: any[]
  agent?: string
  operatingSince?: string
  subtitle?: string
  language?: (key: string) => string
  pricePerSqft?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  handleFavorite: (propertyId: string) => void
  handleShare: (propertyId: string) => void
  isFavorited?: boolean
  primaryActionLabel?: string
  secondaryActionLabel?: string
  tertiaryActionText?: string
  primaryActionDisabled?: boolean
  secondaryActionDisabled?: boolean
  propertyReview?: boolean
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
    isFavorited = false,
    agent = 'N/A',
    operatingSince = 'N/A',
    handleFavorite,
    handleShare,
    language,
    primaryActionLabel,
    secondaryActionLabel,
    tertiaryActionText,
    onPrimaryAction,
    onSecondaryAction,
    primaryActionDisabled = false,
    secondaryActionDisabled = false,
    propertyReview = false,
  } = props

  const labels = {
    agent: t(language, 'PropertiesListCard.agent', 'Agent'),
    since: t(language, 'PropertiesListCard.operating_since', 'Operating since'),
    area: t(language, 'PropertiesListCard.property_size', 'Property Size'),
    status: t(language, 'PropertiesListCard.status', 'Status'),
    listing_type: t(language, 'PropertiesListCard.listing_type', 'Listing Type'),
    // transaction: t(language, 'PropertiesListCard.transaction', 'Transaction'),
  }

  const buttons = {
    primary: primaryActionLabel ?? t(language, 'PropertiesListCard.contact_agent', 'Contact agent'),
    secondary: secondaryActionLabel ?? t(language, 'PropertiesListCard.get_phone_number', 'Get phone number'),
    tertiary: tertiaryActionText ?? t(language, 'PropertiesListCard.check_affordability', 'Check affordability'),
  }

  const imageUrl = media?.[0]?.url || '/villa.png'

  function formatPrice(value: number) {
    if (!value || value === 0) return '0'

    // Crore
    if (value >= 10000000) {
      const crore = value / 10000000
      return `${crore} Crore`
    }

    // Lakh
    if (value >= 100000) {
      const lakh = value / 100000
      return `${lakh} Lakh`
    }

    return value.toString()
  }

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
            isFavorited={isFavorited}
            favorite_count={favorite_count}
          />
        </div>
      </div>

      <ActionSection
        price={formatPrice(Number(price))}
        approval_status={approval_status}
        property_size={property_size}
        property_size_unit={property_size_unit}
        propertyReview={propertyReview}
        buttons={buttons}
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
        primaryDisabled={primaryActionDisabled}
        secondaryDisabled={secondaryActionDisabled}
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
  isFavorited,
  favorite_count,
}: any) => (
  <div className="flex flex-1 flex-col justify-between">
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-[#747474] font-medium underline">{subtitle}</p>
      </div>

      <div className="flex shrink-0 gap-3 text-gray-500">
        <FavoriteButton propertyId={id} isFavorited={isFavorited} onToggleFavorite={handleFavorite} size={25} favoriteCount={favorite_count} />
        <Button onClick={() => handleShare(id)} className="p-0">
          <Share size={18} />
        </Button>
      </div>
    </div>

    <div className="mt-3 flex w-full flex-col divide-y divide-gray-200 rounded-md bg-[#F5F5F5] text-sm sm:flex-row sm:divide-y-0 sm:divide-x">
      <PropertyTag icon={<Building2 size={18} />} label={labels.status} value={status} />
      <PropertyTag icon={<Ruler size={18} />} label={labels.area} value={`${property_size}${property_size_unit}`} />
      <PropertyTag icon={<Home size={18} />} label={labels.listing_type} value={listing_type} />
      {/* <PropertyTag icon={<Home size={18} />} label={labels.transaction} suffix={<ChevronDown size={16} />} /> */}
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
  propertyReview,
  buttons,
  onPrimaryAction,
  onSecondaryAction,
  primaryDisabled,
  secondaryDisabled,
}: any) => (
  <div className="flex w-full flex-col justify-between bg-[#ECECEC] p-4 lg:w-[240px]">
    <div className="text-left lg:text-right">
      <h3 className="text-xl font-bold">{'₹ ' + price}</h3>
      <p className="text-sm text-gray-500">{`${property_size}${property_size_unit}`}</p>
    </div>

    {propertyReview ? (
      <div className="mt-2 mb-24 text-sm text-gray-500">This property is under review.</div>
    ) : approval_status === 'UNDER_REVIEW' ? (
      <div className="mt-4 flex w-full flex-col gap-3">
        {buttons.primary && <ActionButton label={buttons.primary} variant="primary" onClick={onPrimaryAction} disabled={primaryDisabled} />}
        {buttons.secondary && <ActionButton label={buttons.secondary} variant="secondary" onClick={onSecondaryAction} disabled={secondaryDisabled} />}
        {buttons.tertiary && <p className="mt-2 text-center text-xs text-gray-500">{buttons.tertiary}</p>}
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
  variant: 'primary' | 'secondary'
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

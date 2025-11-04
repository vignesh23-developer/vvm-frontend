'use client'

import { type ReactNode } from 'react'
import { Heart, Share, Ruler, Building2, Home, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  hover: { scale: 1.02, transition: { duration: 0.3 } },
}

const imageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
}

const iconHover: Variants = {
  hover: { scale: 1.2, color: '#f59e0b', transition: { duration: 0.2 } },
}

const translate = (translator: PropertiesCardProps['language'], key: string, fallback: string) =>
  typeof translator === 'function' ? translator(key) : fallback

export interface PropertiesCardProps {
  id: string
  title: string
  description: string
  property_category_id: string
  price: string
  price_unit: 'total' | 'per_sqft' | 'monthly' | string
  property_size: string | number
  property_size_unit: string
  listing_type: 'SALE' | 'RENT' | string
  status: 'AVAILABLE' | 'SOLD' | 'RENTED' | string
  door_number: string
  street_name: string
  address_line: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  latitude: string
  longitude: string
  owner_id: string
  agent_id: string
  approval_status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | string
  is_published: boolean
  is_verified: boolean
  is_premium: boolean
  is_featured: boolean
  is_active: boolean
  slug: string | null
  meta_description: string | null
  meta_keywords: string | null
  view_count: number
  favorite_count: number
  contact_count: number
  created_at: string
  updated_at: string
  published_at: string | null
  approved_at: string | null
  media: any[]

  // Additional props (from UI usage)
  subtitle?: string
  area?: string
  transaction?: string
  facing?: string
  agent?: string
  operatingSince?: string
  pricePerSqft?: string
  language?: (key: string) => string
  primaryActionLabel?: string
  secondaryActionLabel?: string
  tertiaryActionText?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  primaryActionDisabled?: boolean
  secondaryActionDisabled?: boolean
}

export default function PropertyCard({
  id,
  title,
  subtitle,
  area,
  status,
  transaction,
  facing,
  description,
  approval_status,
  property_size,
  property_size_unit,
  agent,
  media,
  operatingSince,
  price,
  pricePerSqft,
  language,
  primaryActionLabel,
  secondaryActionLabel,
  tertiaryActionText,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionDisabled = false,
  secondaryActionDisabled = false,
}: PropertiesCardProps) {
  const agentLabel = translate(language, 'PropertiesListCard.agent', 'Agent')
  const operatingSinceLabel = translate(language, 'PropertiesListCard.operating_since', 'Operating Since')
  const carpetAreaLabel = translate(language, 'PropertiesListCard.carpet_area', 'Carpet Area')
  const statusLabel = translate(language, 'PropertiesListCard.status', 'Status')
  const transactionLabel = translate(language, 'PropertiesListCard.transaction', 'Transaction')

  const buttonLabels = {
    primary: primaryActionLabel ?? translate(language, 'PropertiesListCard.contact_agent', 'Contact Agent'),
    secondary: secondaryActionLabel ?? translate(language, 'PropertiesListCard.get_phone_number', 'Get Phone Number'),
    tertiary: tertiaryActionText ?? translate(language, 'PropertiesListCard.check_affordability', 'Check Affordability'),
  }

  const displayValues = {
    subtitle: subtitle ?? '',
    agent: agent ?? 'N/A',
    media: media ?? [],
    operatingSince: operatingSince ?? 'N/A',
    area: area ?? 'N/A',
    status: status ?? 'N/A',
    transaction: transaction ?? 'N/A',
    facing: facing ?? 'N/A',
    description: description ?? translate(language, 'PropertiesListCard.no_description', 'No details provided.'),
    price: price ?? translate(language, 'PropertiesListCard.price_unavailable', 'Price on request'),
    pricePerSqft: pricePerSqft ?? '',
    approval_status: approval_status ?? 'N/A',
    property_size: property_size ?? 'N/A',
    property_size_unit: property_size_unit ?? '',
  }
  console.log('PropertyCard render - approval_status:', media)
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-lg lg:flex-row"
    >
      <Link href={`/propertyDetails/${id}`} className="flex-1">
        <div className="flex flex-col gap-4 p-3 lg:flex-row">
          <motion.div
            className="flex w-full flex-col items-start overflow-hidden rounded-md sm:w-auto"
            variants={imageVariants}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.div className="overflow-hidden rounded-md">
              <motion.div variants={imageVariants}>
                <Image
                  src={displayValues.media && displayValues.media.length > 0 ? displayValues.media[0].url : '/villa.png'}
                  alt={title ?? 'Property image'}
                  width={250}
                  height={150}
                  className="h-40 w-full rounded-md object-cover transition-transform duration-500 sm:w-[250px]"
                />
              </motion.div>
            </motion.div>

            <motion.p
              className="ml-1 mt-2 text-sm text-gray-700 sm:ml-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {agentLabel}: {displayValues.agent}
              <br />
              <span className="text-xs text-gray-500">
                {operatingSinceLabel}: {displayValues.operatingSince}
              </span>
            </motion.p>
          </motion.div>

          <div className="flex w-full flex-1 flex-col justify-between">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <motion.h2 className="text-lg font-semibold" whileHover={{ color: '#111827' }}>
                  {title}
                </motion.h2>
                <p className="text-[#747474] font-medium underline">{displayValues.subtitle}</p>
              </div>

              <div className="flex shrink-0 gap-3 text-gray-500">
                <motion.div variants={iconHover} whileHover="hover">
                  <Heart size={18} />
                </motion.div>
                <motion.div variants={iconHover} whileHover="hover">
                  <Share size={18} />
                </motion.div>
              </div>
            </div>

            <motion.div
              className="mt-3 flex w-full flex-col divide-y divide-gray-200 rounded-md bg-[#F5F5F5] text-sm sm:flex-row sm:divide-y-0 sm:divide-x"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PropertyTag
                icon={<Ruler size={18} className="text-gray-600" />}
                label={carpetAreaLabel}
                value={displayValues.property_size + displayValues.property_size_unit}
              />
              <PropertyTag icon={<Building2 size={18} className="text-gray-600" />} label={statusLabel} value={displayValues.status} />
              <PropertyTag
                icon={<Home size={18} className="text-gray-600" />}
                label={transactionLabel}
                value={displayValues.transaction}
                suffix={<ChevronDown size={16} className="text-gray-500" />}
              />
            </motion.div>

            <motion.p
              className="mt-3 text-sm text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-green-600">●</span> {displayValues.facing}
            </motion.p>
            <p className="mt-1 line-clamp-3 text-sm text-gray-500">{displayValues.description}</p>
          </div>
        </div>
      </Link>

      <div className="flex w-full flex-col justify-between bg-[#ECECEC] p-4 lg:w-[240px]">
        <motion.div className="text-left lg:text-right" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-xl font-bold">{'₹ ' + displayValues?.price}</h3>
          <p className="text-sm text-gray-500">{displayValues?.property_size + displayValues?.property_size_unit}</p>
        </motion.div>
        {displayValues?.approval_status === 'UNDER_REVIEW' ? (
          <div className="mt-4 flex w-full flex-col gap-3">
            {buttonLabels?.primary && (
              <ActionButton label={buttonLabels.primary} variant="primary" onClick={onPrimaryAction} disabled={primaryActionDisabled} />
            )}

            {buttonLabels?.secondary && (
              <ActionButton label={buttonLabels.secondary} variant="secondary" onClick={onSecondaryAction} disabled={secondaryActionDisabled} />
            )}

            {buttonLabels?.tertiary && (
              <motion.p
                className="mt-2 text-center text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {buttonLabels.tertiary}
              </motion.p>
            )}
          </div>
        ) : (
          <div className="mb-20 flex justify-center text-center text-sm font-medium italic text-gray-500">
            This property is {displayValues?.approval_status?.replace(/_/g, ' ').toLowerCase()}.
          </div>
        )}
      </div>
    </motion.div>
  )
}

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
  <motion.button
    type="button"
    whileHover={{ y: -3 }}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`w-full cursor-pointer rounded-full py-2 font-medium transition ${
      disabled
        ? 'border border-gray-200 bg-gray-100 text-gray-400'
        : variant === 'primary'
        ? 'bg-black text-white hover:bg-gray-800'
        : 'border bg-white hover:bg-gray-200'
    }`}
  >
    {label}
  </motion.button>
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

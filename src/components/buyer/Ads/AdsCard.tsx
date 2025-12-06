'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { MapPin, Phone, Mail, Share2, BadgeCheck, CalendarDays, Tag } from 'lucide-react'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { formatPrice } from '@/utils/converter/formatPrice'
import { AdsListDto } from '@/app/(buyer)/(site)/ads-list/(dto)/AdsListDto'

interface AdsCardProps {
  ad: AdsListDto
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  primaryActionDisabled?: boolean
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { scale: 1.015 },
}

const imageHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
}

const statusChipMap: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-800',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-700',
  REJECTED: 'bg-red-100 text-red-700',
}

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
    return formatPrice(Math.abs(Number(numericPrice)))
  }

  return ad.price?.toString() ?? 'Price on request'
}

const formatLocation = (ad: AdsListDto) => {
  const parts = [ad.address_line, ad.city, ad.state].filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
  return parts.length > 0 ? parts.join(', ') : 'Location on request'
}

const formatDateLabel = (dateString?: string | null) => {
  if (!dateString) return '—'
  const parsed = new Date(dateString)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const InfoTag = ({ icon, label, value }: { icon: ReactNode; label: string; value?: string | null }) => (
  <div className="flex flex-1 items-center gap-2 px-4 py-3">
    {icon}
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{value || '—'}</p>
    </div>
  </div>
)

export default function AdsCard({
  ad,
  onPrimaryAction,
  onFavorite,
  onShare,
  primaryActionLabel = 'View Details',
  primaryActionDisabled = false,
}: AdsCardProps) {
  const priceLabel = resolvePriceLabel(ad)
  const locationLabel = formatLocation(ad)
  const approvalStatus = ad.approval_status || 'UNDER_REVIEW'
  const approvalStyle = statusChipMap[approvalStatus] ?? 'bg-gray-100 text-gray-700'
  const statusLabel = approvalStatus.replace(/_/g, ' ')
  const campaignWindow = ad.created_at || ad.updated_at ? `${formatDateLabel(ad.created_at)} - ${formatDateLabel(ad.updated_at)}` : 'Schedule TBC'
  const tags = ad.tags?.slice(0, 3).join(', ')
  const metrics = [
    { label: 'Views', value: ad.view_count ?? 0 },
    { label: 'Enquiries', value: ad.contact_count ?? ad.contact_count ?? 0 },
    { label: 'Favorites', value: ad.favorite_count ?? 0 },
  ]

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-white/95 shadow-md ring-1 ring-gray-100 hover:shadow-xl hover:ring-yellow-200 lg:flex-row transition-shadow duration-300"
    >
      <div className="flex-1">
        <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row">
          <motion.div
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm"
            variants={imageHover}
            initial="rest"
            whileHover="hover"
          >
            <Image
              src={getImageUrl(ad)}
              alt={ad.title || 'Ads card image'}
              width={260}
              height={200}
              className="h-44 w-full object-cover sm:w-[260px]"
            />
            {ad.is_boosted && (
              <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-yellow-500/95 px-3 py-1 text-xs font-semibold text-[#2a1407] shadow">
                <BadgeCheck size={14} /> Boosted
              </span>
            )}
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <FavoriteButton
                propertyId={ad.id || ''}
                isUserFavorited={!!ad.is_user_favorite}
                onToggleFavorite={() => ad.id && onFavorite?.(ad.id)}
                favoriteCount={ad.favorite_count ?? 0}
                size={22}
              />
              <button
                type="button"
                onClick={() => ad.id && onShare?.(ad.id)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm hover:border-yellow-400"
                aria-label="Share ad"
              >
                <Share2 size={16} />
              </button>
            </div>
            <div className="w-full px-3 py-2">
              <p className="text-sm font-semibold text-gray-900">{ad.title || 'Sponsored Brand'}</p>
              <p className="text-xs text-gray-500">Campaign lead • {ad.contact_name || 'Not shared'}</p>
            </div>
          </motion.div>

          <div className="flex flex-1 flex-col justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-900">{ad.title}</h2>
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">{ad.address_line || 'Property ads'}</p>
              </div>
              <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${approvalStyle}`}>
                {statusLabel}
              </span>
            </div>

            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{ad.description || 'No description provided.'}</p>

            <div className="mt-3 flex w-full flex-col divide-y divide-gray-200 rounded-xl bg-gray-50 text-sm sm:flex-row sm:divide-y-0 sm:divide-x">
              <InfoTag icon={<MapPin size={18} className="text-yellow-700" />} label="Location" value={locationLabel} />
              <InfoTag icon={<CalendarDays size={18} className="text-yellow-700" />} label="Campaign" value={campaignWindow} />
              <InfoTag icon={<Tag size={16} className="text-yellow-700" />} label="Status" value={ad.status || '—'} />
            </div>

            <div className="mt-3 grid gap-3 rounded-2xl border border-gray-100 bg-white/70 p-4 sm:grid-cols-3">
              {metrics.map(metric => (
                <div key={metric.label} className="flex flex-col border-l border-gray-100 pl-4 first:border-0 first:pl-0">
                  <span className="text-xs uppercase tracking-wide text-gray-500">{metric.label}</span>
                  <span className="text-lg font-bold text-[#2a1407]">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-between bg-gradient-to-b from-[#1F130B] via-[#1A120B] to-[#111111] px-4 py-4 sm:px-5 sm:py-6 lg:w-[250px]">
        <div className="space-y-1 text-left lg:text-right">
          <p className="text-[10px] uppercase tracking-[0.16em] text-yellow-400/90 font-semibold">{statusLabel}</p>
          <h3 className="text-xl font-bold text-white">{priceLabel}</h3>
          {ad.budget_min && ad.budget_max && (
            <p className="text-xs text-gray-300">{`${formatPrice(ad.budget_min)} - ${formatPrice(ad.budget_max)}`}</p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm text-gray-200">
          {ad.contact_name && (
            <span className="flex items-center gap-2">
              <BadgeCheck size={16} /> {ad.contact_name}
            </span>
          )}
          {ad.contact_phone && (
            <span className="flex items-center gap-2">
              <Phone size={16} /> {ad.contact_phone}
            </span>
          )}
          {ad.contact_email && (
            <span className="flex items-center gap-2">
              <Mail size={16} /> {ad.contact_email}
            </span>
          )}
        </div>

        {primaryActionLabel && (
          <Button
            type="button"
            onClick={primaryActionDisabled ? undefined : onPrimaryAction}
            disabled={primaryActionDisabled}
            className="mt-4 rounded-full bg-white/95 px-6 py-2 text-sm font-semibold text-[#1f140d] shadow-lg hover:bg-white"
          >
            {primaryActionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

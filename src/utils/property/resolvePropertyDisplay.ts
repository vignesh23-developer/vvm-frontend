import { formatNumber, formatPrice } from '@/utils/converter/formatPrice'
import { isLayoutCategory } from '@/utils/property/isLayoutCategory'

export type PropertyDisplaySource = {
  price?: string | number | null
  property_size?: string | number | null
  property_size_unit?: string | null
  layout_price_min?: string | number | null
  layout_price_max?: string | number | null
  layout_area_min_sqft?: string | number | null
  layout_area_max_sqft?: string | number | null
  layout_area_unit?: string | null
  layout_total_sqft?: string | number | null
  property_category_name?: string | null
  property_category?: { name?: string } | null
}

function getCategoryName(source: PropertyDisplaySource): string | undefined {
  return source.property_category_name || source.property_category?.name || undefined
}

function parseNum(value: string | number | null | undefined): number | undefined {
  if (value === null || value === undefined || value === '') return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

export function isLayoutPropertyDisplay(source: PropertyDisplaySource): boolean {
  return isLayoutCategory(getCategoryName(source))
}

export function resolvePropertyPriceLabel(source: PropertyDisplaySource): string {
  const isLayout = isLayoutPropertyDisplay(source)

  if (isLayout) {
    const minN = parseNum(source.layout_price_min)
    const maxN = parseNum(source.layout_price_max)
    if (minN !== undefined || maxN !== undefined) {
      const left = minN !== undefined ? `₹ ${formatPrice(Math.abs(minN))}` : '—'
      const right = maxN !== undefined ? `₹ ${formatPrice(Math.abs(maxN))}` : '—'
      return `${left} - ${right}`
    }
  }

  const priceN = parseNum(source.price)
  if (priceN !== undefined) return `₹ ${formatPrice(Math.abs(priceN))}`
  if (source.price) return `₹ ${source.price}`
  return 'Price on request'
}

export function resolvePropertySizeLabel(source: PropertyDisplaySource): string {
  const isLayout = isLayoutPropertyDisplay(source)
  const unit = (source.layout_area_unit || source.property_size_unit || 'sqft').toString().trim() || 'sqft'

  if (isLayout) {
    const minN = parseNum(source.layout_area_min_sqft)
    const maxN = parseNum(source.layout_area_max_sqft)
    if (minN !== undefined || maxN !== undefined) {
      const left = minN !== undefined ? formatNumber(minN) : '—'
      const right = maxN !== undefined ? formatNumber(maxN) : '—'
      return `${left} - ${right} ${unit}`
    }

    const totalN = parseNum(source.layout_total_sqft)
    if (totalN !== undefined && totalN > 0) {
      return `${formatNumber(totalN)} sqft`
    }
  }

  if (source.property_size === null || source.property_size === undefined || source.property_size === '') {
    return '-- sqft'
  }

  const sizeN = parseNum(source.property_size)
  if (sizeN !== undefined) return `${formatNumber(sizeN)} ${unit}`
  return `${String(source.property_size)} ${unit}`
}

import { Check, X } from 'lucide-react'

interface FeatureValueProps {
  value: string | boolean
}

/**
 * Display feature value with appropriate icon or text
 */
export function FeatureValue({ value }: FeatureValueProps) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="text-green-600 w-5 h-5 mx-auto" />
    ) : (
      <X className="text-red-500 w-5 h-5 mx-auto" />
    )
  }
  return <span className="block text-center">{value}</span>
}


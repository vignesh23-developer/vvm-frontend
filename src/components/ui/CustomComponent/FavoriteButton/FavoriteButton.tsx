'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Button from '@/components/ui/CustomComponent/Button/Button'

interface FavoriteButtonProps {
  propertyId: string
  isFavorited?: boolean
  onToggleFavorite: (propertyId: string) => void
  size?: number
  favoriteCount?: number
}

const iconHover = { hover: { scale: 1.15, transition: { duration: 0.2 } } }

export default function FavoriteButton({ propertyId, isFavorited = false, onToggleFavorite, size = 18, favoriteCount = 0 }: FavoriteButtonProps) {
  const hasFavorites = isFavorited || favoriteCount > 0

  return (
    <motion.div variants={iconHover} whileHover="hover" className="relative inline-block">
      <Button
        type="button"
        onClick={() => onToggleFavorite(propertyId)}
        className="relative flex items-center justify-center rounded-full p-1 transition hover:bg-gray-100"
      >
        <Heart
          size={size}
          className={`transition-colors duration-200 ${hasFavorites ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-red-400'}`}
        />

        {favoriteCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow-sm">
            {favoriteCount}
          </span>
        )}
      </Button>
    </motion.div>
  )
}

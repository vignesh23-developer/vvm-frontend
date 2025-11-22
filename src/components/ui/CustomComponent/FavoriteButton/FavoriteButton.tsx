'use client'

import Button from '@/components/ui/CustomComponent/Button/Button'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  propertyId: string
  isUserFavorited?: boolean
  onToggleFavorite: (propertyId: string) => void
  size?: number
  favoriteCount?: number
}

export function FavoriteButton({ propertyId, isUserFavorited = false, onToggleFavorite, size = 18, favoriteCount = 0 }: FavoriteButtonProps) {
  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
      <Button
        type="button"
        aria-pressed={isUserFavorited}
        onClick={() => onToggleFavorite(propertyId)}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition
         shadow-sm border 
         ${isUserFavorited ? 'border-rose-500 bg-rose-100 text-rose-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}
         `}
      >
        <motion.span
          animate={{
            scale: isUserFavorited ? 1.15 : 1,
            rotate: isUserFavorited ? 8 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 14 }}
        >
          <Heart size={size} className={isUserFavorited ? 'text-rose-600 fill-rose-600' : 'text-rose-600'} />
        </motion.span>

        <span className="font-semibold text-sm">{favoriteCount}</span>
      </Button>
    </motion.div>
  )
}

export default FavoriteButton

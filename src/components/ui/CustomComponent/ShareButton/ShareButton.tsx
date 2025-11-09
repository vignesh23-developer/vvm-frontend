'use client'

import { motion } from 'framer-motion'
import { Share } from 'lucide-react'
import Button from '@/components/ui/CustomComponent/Button/Button'

interface ShareButtonProps {
  propertyId: string
  onShare: (propertyId: string) => void
  size?: number
}

const iconHover = {
  hover: { scale: 1.2, color: '#f59e0b', transition: { duration: 0.2 } },
}

export default function ShareButton({ propertyId, onShare, size = 18 }: ShareButtonProps) {
  return (
    <motion.div variants={iconHover} whileHover="hover">
      <Button type="button" onClick={() => onShare(propertyId)} className="p-0">
        <Share size={size} className="text-gray-600" />
      </Button>
    </motion.div>
  )
}

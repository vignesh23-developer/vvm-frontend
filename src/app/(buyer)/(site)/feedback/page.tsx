'use client'

import { motion } from 'framer-motion'
import { Variants } from 'framer-motion'
import { WebsiteReview } from '@/components/Reviews'

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const FeedbackPage = () => {
  return (
    <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
      <WebsiteReview />
    </motion.div>
  )
}

export default FeedbackPage

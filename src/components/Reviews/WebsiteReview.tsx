'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ReviewInput } from './ReviewInput'
import { ReviewList } from './ReviewList'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
/**
 * Main component that combines ReviewInput and ReviewList
 * This is the primary component to use for displaying reviews on the website
 * Can be used anywhere without any props
 */
export function WebsiteReview() {
    const [refreshKey, setRefreshKey] = useState(0);

    const { user: userData } = useAuth();

    const handleReviewCreated = () => {
        // Trigger refresh of the review list
        setRefreshKey((prev) => prev + 1)
    }

    if (!userData) {
        return <></>
    }

    return (
        <div className="space-y-8 relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gray-50">
            {/* Review Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ReviewInput onReviewCreated={handleReviewCreated} />
            </motion.div>

            {/* Review List Section */}
            <motion.div
                key={refreshKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <ReviewList pageSize={6} />
            </motion.div>
        </div>
    )
}


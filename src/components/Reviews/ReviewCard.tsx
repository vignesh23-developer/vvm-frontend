'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { Review } from './types'
import { formatReviewDate, getUserDisplayName } from './utils/reviewUtils'
import { EditReviewModal } from './EditReviewModal'
import { useDeleteReview } from './hooks/useDeleteReview'

interface ReviewCardProps {
  review: Review
  currentUserId?: string | null
  onUpdateComplete?: () => void
}

/**
 * Individual review card component
 */
export function ReviewCard({ review, currentUserId, onUpdateComplete }: ReviewCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { deleteReview, loading: deleting, error } = useDeleteReview()
  const isOwner = currentUserId && review.user_id === currentUserId

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    const success = await deleteReview(review.id)
    if (success) {
      toast.success('Review deleted successfully')
      setShowDeleteConfirm(false)
      onUpdateComplete?.()
    } else if (error) {
      toast.error(error)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-gray-800">{getUserDisplayName(review)}</h4>
              {review.user_email && (
                <span className="text-sm text-gray-500">({review.user_email})</span>
              )}
            </div>
            <div className="flex items-center gap-1 mb-2">{renderStars(review.rating)}</div>
            <p className="text-sm text-gray-500">{formatReviewDate(review.created_at)}</p>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                aria-label="Edit review"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                aria-label="Delete review"
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-700 mb-4">{review.comment}</p>

        {review.helpful_count > 0 && (
          <div className="text-sm text-gray-500">
            {review.helpful_count} {review.helpful_count === 1 ? 'person' : 'people'} found this helpful
          </div>
        )}

        {showDeleteConfirm && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800 mb-2">Are you sure you want to delete this review?</p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {showEditModal && (
        <EditReviewModal
          review={review}
          onClose={() => setShowEditModal(false)}
          onUpdateComplete={() => {
            setShowEditModal(false)
            onUpdateComplete?.()
          }}
        />
      )}
    </>
  )
}


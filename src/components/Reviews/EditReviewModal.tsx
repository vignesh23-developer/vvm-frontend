'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { Review } from './types'
import { useUpdateReview } from './hooks/useUpdateReview'

interface EditReviewModalProps {
  review: Review
  onClose: () => void
  onUpdateComplete?: () => void
}

/**
 * Modal for editing review
 */
export function EditReviewModal({ review, onClose, onUpdateComplete }: EditReviewModalProps) {
  const [comment, setComment] = useState(review.comment)
  const [rating, setRating] = useState(review.rating)
  const { updateReview, loading, error } = useUpdateReview()

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5')
      return
    }

    const updated = await updateReview(review.id, {
      comment: comment.trim(),
      rating,
    })

    if (updated) {
      toast.success('Review updated successfully')
      onUpdateComplete?.()
    }
  }

  const renderStars = (currentRating: number, interactive: boolean = true) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isFilled = starValue <= currentRating

      return (
        <button
          key={i}
          type="button"
          onClick={() => interactive && setRating(starValue)}
          className={`transition-colors ${
            interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          }`}
          disabled={!interactive || loading}
        >
          <Star
            className={`w-6 h-6 ${
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      )
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Edit Review</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center gap-2">{renderStars(rating)}</div>
              <p className="text-xs text-gray-500 mt-1">Click stars to change rating</p>
            </div>

            <div className="mb-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Write your review..."
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}


'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCreateReview } from './hooks/useCreateReview'

interface ReviewInputProps {
  onReviewCreated?: () => void
}

/**
 * Component for posting reviews
 */
export function ReviewInput({ onReviewCreated }: ReviewInputProps) {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const { createReview, loading, error } = useCreateReview()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating')
      return
    }

    const review = await createReview({
      comment: comment.trim(),
      rating,
    })

    if (review) {
      toast.success('Review posted successfully!')
      setComment('')
      setRating(0)
      setHoveredRating(0)
      onReviewCreated?.()
    } else if (error) {
      toast.error(error)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isFilled = starValue <= (hoveredRating || rating)

      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="transition-transform hover:scale-110"
          disabled={loading}
        >
          <Star
            className={`w-8 h-8 ${
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-2xl mx-auto"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <div className="flex items-center gap-2">{renderStars()}</div>
          {rating > 0 && (
            <p className="text-xs text-gray-500 mt-1">You selected {rating} {rating === 1 ? 'star' : 'stars'}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Share your experience..."
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-[#3b1804] text-white rounded-lg hover:bg-[#641717] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || rating === 0 || !comment.trim()}
        >
          <Send className="w-4 h-4" />
          {loading ? 'Posting...' : 'Post Review'}
        </button>
      </form>
    </motion.div>
  )
}


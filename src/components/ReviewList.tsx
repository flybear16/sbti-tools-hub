'use client'

import { useEffect, useState } from 'react'
import type { Review } from '@/lib/types'

interface ReviewListProps {
  toolId: string
  initialScore?: number
  initialReviewCount?: number
}

export default function ReviewList({ toolId, initialScore = 0, initialReviewCount = 0 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/reviews?toolId=${toolId}`)
      .then(r => r.json())
      .then(data => {
        if (data.reviews) setReviews(data.reviews)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [toolId])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  if (!reviews.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-4xl mb-2">💬</div>
        <p className="text-sm">还没有人评价，成为第一个评价者吧！</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* 汇总 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl font-black text-orange-500">★ {initialScore.toFixed(1)}</span>
        <span className="text-sm text-gray-400">/ 5.0</span>
        <span className="text-sm text-gray-400">· {initialReviewCount} 人评价</span>
      </div>

      {/* 列表 */}
      {reviews.map(review => (
        <div key={review.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className={s <= review.score ? 'text-orange-400' : 'text-gray-300'}>★</span>
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

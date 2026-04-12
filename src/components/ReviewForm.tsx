'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ReviewFormProps {
  toolId: string
  toolName: string
}

export default function ReviewForm({ toolId, toolName }: ReviewFormProps) {
  const router = useRouter()
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      setError('请输入你的评价')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, score, comment: comment.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? '提交失败')
      setSuccess(true)
      setComment('')
      setScore(5)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="font-bold text-green-700 dark:text-green-300 mb-1">评价已提交！</h3>
        <p className="text-sm text-green-600 dark:text-green-400">感谢你的反馈，帮助更多人找到合适的测评</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-green-600 dark:text-green-400 hover:underline"
        >
          再写一条评价
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-4">✍️ 评价「{toolName}」</h3>

      {/* 星级 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-2">评分</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setScore(s)}
              className={`text-3xl transition-transform hover:scale-110 ${
                s <= score ? 'opacity-100' : 'opacity-30'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* 评价内容 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-2">
          你的评价 <span className="text-gray-400">（必填，200字以内）</span>
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value.slice(0, 200))}
          placeholder="这个测评怎么样？题目有没有意思？结果准不准？"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:border-orange-500 focus:outline-none resize-none"
        />
        <div className="text-right text-xs text-gray-400 mt-1">{comment.length}/200</div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
      >
        {loading ? '提交中...' : '🚀 提交评价'}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        评价仅限提交你对测评本身的感受，不当言论将被删除
      </p>
    </form>
  )
}

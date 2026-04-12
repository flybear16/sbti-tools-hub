// 测评工具
export interface Tool {
  id: string
  name: string
  slug: string
  icon: string
  coverImage: string
  description: string
  longDescription?: string
  tags: string[]
  category: 'sbti' | 'mbti' | 'fun-personality' | 'career' | 'relationship'
  questionCount: number
  duration: number // 分钟
  audience: string[]
  url: string
  isSBTI: boolean
  isHidden: boolean
  score: number // 1-5
  reviewCount: number
  viewCount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

// 用户评价
export interface Review {
  id: string
  toolId: string
  score: number
  comment: string
  createdAt: string
}

// 分类
export type Category = {
  id: string
  label: string
  value: Tool['category']
}

export const CATEGORIES: Category[] = [
  { id: 'all', label: '全部', value: 'sbti' as const },
  { id: 'sbti', label: '🔥 SBTI', value: 'sbti' as const },
  { id: 'mbti', label: '💬 MBTI复刻', value: 'mbti' as const },
  { id: 'fun', label: '🎭 趣味人格', value: 'fun-personality' as const },
  { id: 'career', label: '💼 职业测评', value: 'career' as const },
  { id: 'relationship', label: '❤️ 情感测评', value: 'relationship' as const },
]

export type SortType = 'latest' | 'popular' | 'rating'

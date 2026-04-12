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
  score: number // 1-5，平均分
  reviewCount: number
  viewCount: number
  clickCount: number  // 新增：跳转点击数
  status: 'pending' | 'approved' | 'rejected'
  isAvailable: boolean  // 新增：链接是否可用
  lastCheckedAt: string | null  // 新增：最近检测时间
  createdAt: string
  updatedAt: string
}

// 用户评价
export interface Review {
  id: string
  toolId: string
  score: number
  comment: string
  createdAt: string
}

// 点评汇总（用于详情页展示）
export interface ReviewSummary {
  toolId: string
  averageScore: number
  totalCount: number
  recentComments: string[]
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

export type SortType = 'popular' | 'latest' | 'rating'

// SEO 攻略文章
export interface Article {
  slug: string
  toolSlug: string
  title: string
  content: string
  metaDescription: string
  createdAt: string
}

// 死链检测结果
export interface LinkCheckResult {
  toolId: string
  url: string
  isAvailable: boolean
  checkedAt: string
}

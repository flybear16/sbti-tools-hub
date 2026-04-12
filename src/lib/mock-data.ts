import type { Tool } from './types'

export const MOCK_TOOLS: Tool[] = [
  {
    id: '1',
    name: 'SBTI 官方原版',
    slug: 'sbti-official',
    icon: '🧠',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    description: 'SBTI官方出品，权威测评入口，完整版题目+详细报告',
    longDescription: 'SBTI（Stimulated Behavioral Type Indicator）是2026年现象级娱乐测评，通过AI算法分析你的行为模式，揭示隐藏人格。官方版本题目最完整，报告最详细。',
    tags: ['官方', '完整版', '中文'],
    category: 'sbti',
    questionCount: 48,
    duration: 8,
    audience: ['学生', '职场人', '所有人'],
    url: 'https://example.com/sbti-official',
    isSBTI: true,
    isHidden: false,
    score: 4.8,
    reviewCount: 12890,
    viewCount: 98600,
    clickCount: 0,
    status: 'approved',
    isAvailable: true,
    lastCheckedAt: null,
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01',
  },
  {
    id: '2',
    name: 'SBTI 快速版',
    slug: 'sbti-quick',
    icon: '⚡',
    coverImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    description: '精简版SBTI，12道题3分钟速测，随时随地测',
    tags: ['快速', '免费', '中文'],
    category: 'sbti',
    questionCount: 12,
    duration: 3,
    audience: ['学生', '上班族'],
    url: 'https://example.com/sbti-quick',
    isSBTI: true,
    isHidden: false,
    score: 4.5,
    reviewCount: 8932,
    viewCount: 67300,
    clickCount: 0,
    status: 'approved',
    isAvailable: true,
    lastCheckedAt: null,
    createdAt: '2026-04-03',
    updatedAt: '2026-04-03',
  },
  {
    id: '3',
    name: 'SBTI 隐藏人格版',
    slug: 'sbti-hidden',
    icon: '🌙',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    description: '深度挖掘隐藏人格，测完惊呼「原来我是这种人」',
    tags: ['隐藏人格', '深度分析', '爆红款'],
    category: 'sbti',
    questionCount: 64,
    duration: 12,
    audience: ['好奇心重', '深度用户'],
    url: 'https://example.com/sbti-hidden',
    isSBTI: true,
    isHidden: true,
    score: 4.9,
    reviewCount: 23400,
    viewCount: 156000,
    clickCount: 0,
    status: 'approved',
    isAvailable: true,
    lastCheckedAt: null,
    createdAt: '2026-04-05',
    updatedAt: '2026-04-05',
  },
  {
    id: '4',
    name: 'MBTI 重燃版',
    slug: 'mbti-reborn',
    icon: '✨',
    coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    description: 'MBTI经典复刻，全新视觉+AI增强分析',
    tags: ['MBTI', '经典', '视觉精美'],
    category: 'mbti',
    questionCount: 60,
    duration: 10,
    audience: ['所有人'],
    url: 'https://example.com/mbti-reborn',
    isSBTI: false,
    isHidden: false,
    score: 4.6,
    reviewCount: 5600,
    viewCount: 34500,
    clickCount: 0,
    status: 'approved',
    isAvailable: true,
    lastCheckedAt: null,
    createdAt: '2026-04-06',
    updatedAt: '2026-04-06',
  },
  {
    id: '5',
    name: '16型人格趣味版',
    slug: '16types-fun',
    icon: '🎮',
    coverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    description: '游戏化测评体验，边玩边测，结果超准',
    tags: ['趣味', '游戏化', '年轻'],
    category: 'fun-personality',
    questionCount: 40,
    duration: 7,
    audience: ['Z世代', '学生'],
    url: 'https://example.com/16types-fun',
    isSBTI: false,
    isHidden: false,
    score: 4.4,
    reviewCount: 3200,
    viewCount: 21800,
    clickCount: 0,
    status: 'approved',
    isAvailable: true,
    lastCheckedAt: null,
    createdAt: '2026-04-07',
    updatedAt: '2026-04-07',
  },
  {
    id: '6',
    name: '职业性格解码',
    slug: 'career-decoder',
    icon: '💼',
    coverImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    description: '基于大五人格理论，精准定位适合你的职业方向',
    tags: ['职业', '大五人格', '职场'],
    category: 'career',
    questionCount: 50,
    duration: 9,
    audience: ['求职者', '转行者'],
    url: 'https://example.com/career-decoder',
    isSBTI: false,
    isHidden: false,
    score: 4.3,
    reviewCount: 1890,
    viewCount: 12300,
    clickCount: 0,
    status: 'approved',
    isAvailable: true,
    lastCheckedAt: null,
    createdAt: '2026-04-08',
    updatedAt: '2026-04-08',
  },
  {
    id: '7',
    name: '情感匹配度测试',
    slug: 'love-matcher',
    icon: '💕',
    coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    description: '测测你和TA的匹配度，情侣/暗恋都适用',
    tags: ['情感', '情侣', '趣味'],
    category: 'relationship',
    questionCount: 30,
    duration: 5,
    audience: ['情侣', '暗恋中', '单身'],
    url: 'https://example.com/love-matcher',
    isSBTI: false,
    isHidden: false,
    score: 4.2,
    reviewCount: 4500,
    viewCount: 28900,
    clickCount: 0,
    status: 'approved',
    isAvailable: true,
    lastCheckedAt: null,
    createdAt: '2026-04-09',
    updatedAt: '2026-04-09',
  },
  {
    id: '8',
    name: 'SBTI 英文国际版',
    slug: 'sbti-en',
    icon: '🌍',
    coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    description: '英文原版，原汁原味，适合想练英语的你',
    tags: ['英文', '国际版'],
    category: 'sbti',
    questionCount: 48,
    duration: 8,
    audience: ['英语学习者', '海外华人'],
    url: 'https://example.com/sbti-en',
    isSBTI: true,
    isHidden: false,
    score: 4.1,
    reviewCount: 980,
    viewCount: 5600,
    clickCount: 0,
    status: 'approved',
    isAvailable: true,
    lastCheckedAt: null,
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10',
  },
]

// 获取所有测评
export function getTools(): Tool[] {
  return MOCK_TOOLS.filter(t => t.status === 'approved')
}

// 按分类筛选
export function getToolsByCategory(category: string): Tool[] {
  if (category === 'all') return getTools()
  return getTools().filter(t => t.category === category)
}

// 按slug获取
export function getToolBySlug(slug: string): Tool | undefined {
  return MOCK_TOOLS.find(t => t.slug === slug)
}

// 搜索
export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase()
  return getTools().filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  )
}

// 排序
export function sortTools(tools: Tool[], sort: string): Tool[] {
  switch (sort) {
    case 'popular':
      return [...tools].sort((a, b) => b.viewCount - a.viewCount)
    case 'rating':
      return [...tools].sort((a, b) => b.score - a.score)
    case 'latest':
    default:
      return [...tools].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
}

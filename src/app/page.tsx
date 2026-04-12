import { getHotTools, getLatestTools, getTopRatedTools, getTools } from '@/lib/db'
import { MOCK_TOOLS } from '@/lib/mock-data'
import HomePageClient from '@/components/HomePageClient'

export const metadata = {
  title: 'SBTI 测评工具导航 | 一站找到所有版本',
  description: '收录全网SBTI测评工具，包括官方版、快速版、隐藏人格版等，提供分类筛选、用户评分和直达测试入口。',
}

export default async function HomePage() {
  let hotTools: any[] = []
  let latestTools: any[] = []
  let topRatedTools: any[] = []
  let allTools: any[] = []

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      ;[hotTools, latestTools, topRatedTools, allTools] = await Promise.all([
        getHotTools(8),
        getLatestTools(4),
        getTopRatedTools(4),
        getTools(),
      ])
    }
  } catch (e) {
    console.warn('Supabase not available, using mock data')
  }

  // Fallback to mock data
  if (!allTools.length) {
    const mock = MOCK_TOOLS.filter(t => t.status === 'approved')
    const sorted = [...mock].sort((a, b) => b.viewCount - a.viewCount)
    hotTools = sorted.slice(0, 8)
    latestTools = [...mock].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4)
    topRatedTools = [...mock].sort((a, b) => b.score - a.score).slice(0, 4)
    allTools = mock
  }

  // 序列化日期字段
  const serialize = (tools: any[]) =>
    tools.map(t => ({
      ...t,
      createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
    }))

  return (
    <HomePageClient
      hotTools={serialize(hotTools)}
      latestTools={serialize(latestTools)}
      topRatedTools={serialize(topRatedTools)}
      allTools={serialize(allTools)}
    />
  )
}

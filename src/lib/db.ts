/**
 * 数据访问层
 * 支持两种模式：
 * 1. Supabase 模式（生产）：真实数据库
 * 2. Mock 模式（开发/未配置时）：本地 mock-data
 */

import { supabaseAdmin, isSupabaseConfigured } from './supabase'
import { MOCK_TOOLS, getTools as mockGetTools, getToolBySlug as mockGetBySlug, sortTools as mockSortTools } from './mock-data'
import type { Tool, Review, ReviewSummary, SortType } from './types'

// ============================================================
// 工具类（tools）
// ============================================================

/** 获取所有已批准的测评 */
export async function getTools(): Promise<Tool[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_TOOLS.filter(t => t.status === 'approved')
  }
  const { data, error } = await supabaseAdmin!
    .from('tools')
    .select('*')
    .eq('status', 'approved')
    .order('click_count', { ascending: false })
  if (error) throw error
  return data.map(mapToolFromDb)
}

/** 按 slug 获取单个测评 */
export async function getToolBySlug(slug: string): Promise<Tool | null> {
  if (!isSupabaseConfigured()) {
    return mockGetBySlug(slug) ?? null
  }
  const { data, error } = await supabaseAdmin!
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()
  if (error) return null
  return mapToolFromDb(data)
}

/** 按分类筛选 */
export async function getToolsByCategory(category: string): Promise<Tool[]> {
  if (category === 'all') return getTools()
  const all = await getTools()
  return all.filter(t => t.category === category)
}

/** 搜索测评 */
export async function searchTools(query: string): Promise<Tool[]> {
  const q = query.toLowerCase()
  const all = await getTools()
  return all.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  )
}

/** 排序 */
export async function sortTools(tools: Tool[], sort: SortType): Promise<Tool[]> {
  if (!isSupabaseConfigured()) {
    return mockSortTools(tools, sort)
  }
  const sorted = [...tools]
  switch (sort) {
    case 'popular':
      return sorted.sort((a, b) => b.viewCount - a.viewCount)
    case 'rating':
      return sorted.sort((a, b) => b.score - a.score)
    case 'latest':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
}

/** 获取热榜（按点击/浏览综合排序） */
export async function getHotTools(limit = 8): Promise<Tool[]> {
  const all = await getTools()
  return [...all]
    .sort((a, b) => (b.viewCount + b.clickCount * 3) - (a.viewCount + a.clickCount * 3))
    .slice(0, limit)
}

/** 获取最新收录 */
export async function getLatestTools(limit = 4): Promise<Tool[]> {
  const all = await getTools()
  return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
}

/** 获取高分推荐 */
export async function getTopRatedTools(limit = 4): Promise<Tool[]> {
  const all = await getTools()
  return [...all].sort((a, b) => b.score - a.score).slice(0, limit)
}

/** 获取所有待检测的工具（用于死链检测） */
export async function getAllToolsForCheck(): Promise<Tool[]> {
  if (!isSupabaseConfigured()) return MOCK_TOOLS
  const { data } = await supabaseAdmin!.from('tools').select('id, url, slug').neq('status', 'rejected')
  return (data ?? []).map(mapToolFromDb)
}

// ============================================================
// 评价类（reviews）
// ============================================================

/** 获取某工具的评价列表 */
export async function getReviewsByToolId(toolId: string, limit = 20): Promise<Review[]> {
  if (!isSupabaseConfigured()) return []
  const { data, error } = await supabaseAdmin!
    .from('reviews')
    .select('*')
    .eq('tool_id', toolId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data.map(mapReviewFromDb)
}

/** 获取评价汇总 */
export async function getReviewSummary(toolId: string): Promise<ReviewSummary | null> {
  if (!isSupabaseConfigured()) return null
  const { data, error } = await supabaseAdmin!
    .from('reviews')
    .select('score, comment')
    .eq('tool_id', toolId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error || !data?.length) return null
  const avg = data.reduce((s, r) => s + r.score, 0) / data.length
  return {
    toolId,
    averageScore: Math.round(avg * 10) / 10,
    totalCount: data.length,
    recentComments: data.slice(0, 5).map(r => r.comment),
  }
}

/** 提交评价 */
export async function submitReview(toolId: string, score: number, comment: string, ipHash?: string): Promise<Review> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }
  const { data, error } = await supabaseAdmin!
    .from('reviews')
    .insert({ tool_id: toolId, score, comment, ip_hash: ipHash ?? null })
    .select()
    .single()
  if (error) throw error
  return mapReviewFromDb(data)
}

// ============================================================
// 点击日志（tool_clicks）
// ============================================================

/** 记录测评跳转点击 */
export async function logToolClick(toolId: string, referer?: string, ipHash?: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  await supabaseAdmin!.from('tool_clicks').insert({
    tool_id: toolId,
    referer: referer ?? null,
    ip_hash: ipHash ?? null,
  })
}

// ============================================================
// 死链检测（link_checks）
// ============================================================

/** 记录检测结果 */
export async function recordLinkCheck(
  toolId: string,
  url: string,
  isAvailable: boolean,
  statusCode?: number,
  errorMsg?: string
): Promise<void> {
  if (!isSupabaseConfigured()) return
  await supabaseAdmin!.from('link_checks').insert({
    tool_id: toolId,
    url,
    is_available: isAvailable,
    status_code: statusCode ?? null,
    error_msg: errorMsg ?? null,
  })
}

// ============================================================
// DB → TS 类型映射
// ============================================================

function mapToolFromDb(row: any): Tool {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon ?? '🧠',
    coverImage: row.cover_image,
    description: row.description,
    longDescription: row.long_description ?? undefined,
    tags: row.tags ?? [],
    category: row.category,
    questionCount: row.question_count ?? 0,
    duration: row.duration ?? 5,
    audience: row.audience ?? [],
    url: row.url,
    isSBTI: row.is_sbti ?? false,
    isHidden: row.is_hidden ?? false,
    score: parseFloat(row.score) || 0,
    reviewCount: row.review_count ?? 0,
    viewCount: row.view_count ?? 0,
    clickCount: row.click_count ?? 0,
    status: row.status,
    isAvailable: row.is_available ?? true,
    lastCheckedAt: row.last_checked_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapReviewFromDb(row: any): Review {
  return {
    id: row.id,
    toolId: row.tool_id,
    score: row.score,
    comment: row.comment,
    createdAt: row.created_at,
  }
}

/**
 * 数据访问层 - MVP 简化版
 * 纯 Mock 数据，无数据库依赖
 */

import { MOCK_TOOLS, getTools as mockGetTools, getToolBySlug as mockGetBySlug, sortTools as mockSortTools } from './mock-data'
import type { Tool, SortType } from './types'

// ============================================================
// 工具类（tools）
// ============================================================

/** 获取所有已批准的测评 */
export async function getTools(): Promise<Tool[]> {
  return MOCK_TOOLS.filter(t => t.status === 'approved')
}

/** 按 slug 获取单个测评 */
export async function getToolBySlug(slug: string): Promise<Tool | null> {
  return mockGetBySlug(slug) ?? null
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
  return mockSortTools(tools, sort)
}

/** 获取热榜（按浏览数排序） */
export async function getHotTools(limit = 8): Promise<Tool[]> {
  const all = await getTools()
  return [...all]
    .sort((a, b) => b.viewCount - a.viewCount)
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

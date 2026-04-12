'use client'

import { useState, useMemo } from 'react'
import ToolCard from '@/components/ToolCard'
import { CATEGORIES, type SortType, type Tool } from '@/lib/types'
import Link from 'next/link'

interface HomePageClientProps {
  hotTools: Tool[]
  latestTools: Tool[]
  topRatedTools: Tool[]
  allTools: Tool[]
}

export default function HomePageClient({ hotTools, latestTools, topRatedTools, allTools }: HomePageClientProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState<SortType>('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'hot' | 'latest' | 'rating'>('hot')

  const filteredTools = useMemo(() => {
    let result = allTools
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      )
    }
    // 客户端排序
    const sorted = [...result]
    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => (b.viewCount + b.clickCount * 3) - (a.viewCount + a.clickCount * 3))
      case 'rating':
        return sorted.sort((a, b) => b.score - a.score)
      case 'latest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }, [activeCategory, sortBy, searchQuery, allTools])

  const tabTools = useMemo(() => {
    switch (activeTab) {
      case 'hot': return hotTools
      case 'latest': return latestTools
      case 'rating': return topRatedTools
    }
  }, [activeTab, hotTools, latestTools, topRatedTools])

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-600/5 dark:to-amber-600/5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 text-sm font-bold rounded-full">
            🔥 2026年现象级测评热潮
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            SBTI 测评工具导航
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            一站找到所有版本的SBTI测评 · 官方版/复刻版/隐藏人格版全覆盖
          </p>

          {/* 搜索框 */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="搜索测评名称或标签..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-12 text-lg rounded-2xl border-2 border-orange-200 dark:border-orange-800 bg-white dark:bg-gray-800 shadow-lg focus:border-orange-500 focus:outline-none transition-colors"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>
      </section>

      {/* 快捷入口：热榜/最新/高分 Tab */}
      {tabTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Tab 栏 */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {([
                { key: 'hot', label: '🔥 本周热榜', icon: '🔥' },
                { key: 'latest', label: '🆕 最新收录', icon: '🆕' },
                { key: 'rating', label: '⭐ 高分推荐', icon: '⭐' },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${
                    activeTab === tab.key
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/50 dark:bg-orange-900/10'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 内容 */}
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tabTools.slice(0, 8).map((tool, idx) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors"
                  >
                    {/* 排名 */}
                    <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-black ${
                      idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                      idx === 1 ? 'bg-gray-300 text-gray-700' :
                      idx === 2 ? 'bg-orange-300 text-orange-900' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-2xl">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate group-hover:text-orange-500 transition-colors">{tool.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span>★ {tool.score.toFixed(1)}</span>
                        <span>·</span>
                        <span>{tool.duration}分钟</span>
                        {!tool.isAvailable && (
                          <>
                            <span>·</span>
                            <span className="text-red-400">⚠️不可用</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 测评列表 */}
      <section id="tools" className="max-w-7xl mx-auto px-4 pb-20">
        {/* 筛选栏 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* 分类Tab */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === 'all' ? 'all' : cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === (cat.id === 'all' ? 'all' : cat.value)
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 排序 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">排序：</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortType)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="popular">🔥 最多使用</option>
              <option value="latest">🆕 最新收录</option>
              <option value="rating">⭐ 评分最高</option>
            </select>
          </div>
        </div>

        {/* 列表 */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">没有找到相关测评</h3>
            <p className="text-gray-500">换个关键词试试，或者浏览全部测评</p>
          </div>
        )}
      </section>

      {/* 底部 */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-2">© 2026 SBTI Tools Hub · 测评导航站</p>
          <p>收录仅供参考，内容版权归各测评平台所有 · 仅供娱乐</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-orange-500 transition-colors">关于我们</a>
            <a href="#" className="hover:text-orange-500 transition-colors">投稿入口</a>
            <a href="#" className="hover:text-orange-500 transition-colors">免责声明</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

'use client'

import { useState, useMemo } from 'react'
import ToolCard from '@/components/ToolCard'
import { CATEGORIES, type SortType } from '@/lib/types'
import { getTools, sortTools } from '@/lib/mock-data'

export default function HomePageClient() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState<SortType>('popular')
  const [searchQuery, setSearchQuery] = useState('')

  const tools = useMemo(() => {
    let result = getTools()
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }
    return sortTools(result, sortBy)
  }, [activeCategory, sortBy, searchQuery])

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

          {/* 快捷入口 */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a href="#tools" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-sm font-medium hover:shadow-md transition-shadow">
              🔥 本周热榜
            </a>
            <a href="#tools" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-sm font-medium hover:shadow-md transition-shadow">
              🆕 最新收录
            </a>
            <a href="#tools" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-sm font-medium hover:shadow-md transition-shadow">
              ⭐ 高分推荐
            </a>
            <a href="#tools" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-sm font-medium hover:shadow-md transition-shadow">
              🌙 隐藏人格
            </a>
          </div>
        </div>
      </section>

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
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map(tool => (
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

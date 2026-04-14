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
    <main className="min-h-screen" style={{ background: 'var(--parchment)' }}>
      {/* ==========================================
          Hero Section - Editorial Layout
          ========================================== */}
      <section 
        className="relative py-24 px-4"
        style={{ 
          background: 'linear-gradient(180deg, var(--ivory) 0%, var(--parchment) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-block mb-6 px-4 py-1.5 rounded-full text-sm font-medium"
            style={{ 
              background: 'var(--warm-sand)',
              color: 'var(--charcoal-warm)',
              boxShadow: '0px 0px 0px 1px var(--border-warm)'
            }}
          >
            <span className="mr-1">🔥</span> 2026年现象级测评热潮
          </div>
          
          {/* Serif Headline - Claude style */}
          <h1 
            className="text-5xl md:text-6xl mb-6 tracking-tight"
            style={{ 
              fontFamily: 'var(--font-serif)',
              fontWeight: 500,
              lineHeight: 1.1,
              color: 'var(--near-black)'
            }}
          >
            SBTI 测评工具导航
          </h1>
          
          <p 
            className="text-xl mb-10 max-w-2xl mx-auto"
            style={{ 
              color: 'var(--olive-gray)',
              lineHeight: 1.6
            }}
          >
            一站找到所有版本的SBTI测评 · 官方版/复刻版/隐藏人格版全覆盖
          </p>

          {/* Search Box - Claude style */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="搜索测评名称或标签..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-12 text-lg rounded-2xl border-2 transition-all"
              style={{ 
                borderColor: 'var(--border-cream)',
                background: 'var(--ivory)',
                color: 'var(--near-black)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--terracotta)'
                e.target.style.boxShadow = '0px 0px 0px 2px var(--terracotta)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-cream)'
                e.target.style.boxShadow = 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
              }}
            />
            <span 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xl"
              style={{ color: 'var(--stone-gray)' }}
            >
              🔍
            </span>
          </div>
        </div>
      </section>

      {/* ==========================================
          Quick Access Tabs - Hot/Latest/Rating
          ========================================== */}
      {tabTools.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ 
              background: 'var(--ivory)',
              border: '1px solid var(--border-cream)',
              boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
            }}
          >
            {/* Tab Bar */}
            <div 
              className="flex"
              style={{ borderBottom: '1px solid var(--border-cream)' }}
            >
              {([
                { key: 'hot', label: '🔥 本周热榜' },
                { key: 'latest', label: '🆕 最新收录' },
                { key: 'rating', label: '⭐ 高分推荐' },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 py-4 text-sm font-medium transition-all"
                  style={{
                    background: activeTab === tab.key ? 'var(--warm-sand)' : 'transparent',
                    color: activeTab === tab.key ? 'var(--terracotta)' : 'var(--olive-gray)',
                    borderBottom: activeTab === tab.key ? '2px solid var(--terracotta)' : '2px solid transparent'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {tabTools.slice(0, 8).map((tool, idx) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="group relative flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{
                      background: 'var(--ivory)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--warm-sand)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--ivory)'
                    }}
                  >
                    {/* Ranking Badge */}
                    <span 
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        background: idx === 0 ? '#fbbf24' : idx === 1 ? '#9ca3af' : idx === 2 ? '#fb923c' : 'var(--warm-sand)',
                        color: idx === 0 ? '#78350f' : idx === 1 ? '#374151' : idx === 2 ? '#9a3412' : 'var(--charcoal-warm)'
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-2xl">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div 
                        className="font-bold text-sm truncate transition-colors"
                        style={{ color: 'var(--near-black)' }}
                      >
                        {tool.name}
                      </div>
                      <div 
                        className="text-xs flex items-center gap-2"
                        style={{ color: 'var(--stone-gray)' }}
                      >
                        <span>★ {tool.score.toFixed(1)}</span>
                        <span>·</span>
                        <span>{tool.duration}分钟</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          Main Tools Grid
          ========================================== */}
      <section id="tools" className="max-w-6xl mx-auto px-4 pb-24">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === 'all' ? 'all' : cat.value)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeCategory === (cat.id === 'all' ? 'all' : cat.value) 
                    ? 'var(--terracotta)' 
                    : 'var(--ivory)',
                  color: activeCategory === (cat.id === 'all' ? 'all' : cat.value) 
                    ? 'var(--ivory)' 
                    : 'var(--charcoal-warm)',
                  boxShadow: activeCategory === (cat.id === 'all' ? 'all' : cat.value)
                    ? '0px 0px 0px 1px var(--terracotta)'
                    : '0px 0px 0px 1px var(--border-warm)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span 
              className="text-sm"
              style={{ color: 'var(--stone-gray)' }}
            >
              排序：
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortType)}
              className="px-4 py-2 rounded-xl text-sm focus:outline-none transition-all"
              style={{
                border: '1px solid var(--border-warm)',
                background: 'var(--ivory)',
                color: 'var(--charcoal-warm)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--terracotta)'
                e.target.style.boxShadow = '0px 0px 0px 2px var(--terracotta)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-warm)'
                e.target.style.boxShadow = 'none'
              }}
            >
              <option value="popular">🔥 最多使用</option>
              <option value="latest">🆕 最新收录</option>
              <option value="rating">⭐ 评分最高</option>
            </select>
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--near-black)' }}
            >
              没有找到相关测评
            </h3>
            <p style={{ color: 'var(--olive-gray)' }}>
              换个关键词试试，或者浏览全部测评
            </p>
          </div>
        )}
      </section>

      {/* ==========================================
          Footer - Warm & Minimal
          ========================================== */}
      <footer 
        className="py-10 mt-10"
        style={{ 
          borderTop: '1px solid var(--border-warm)',
          background: 'var(--ivory)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p 
            className="mb-2"
            style={{ color: 'var(--stone-gray)' }}
          >
            © 2026 SBTI Tools Hub · 测评导航站
          </p>
          <p 
            className="text-sm mb-4"
            style={{ color: 'var(--stone-gray)' }}
          >
            收录仅供参考，内容版权归各测评平台所有 · 仅供娱乐
          </p>
          <div className="flex justify-center gap-6">
            {['关于我们', '投稿入口', '免责声明'].map(link => (
              <a
                key={link}
                href="#"
                className="text-sm transition-colors"
                style={{ color: 'var(--olive-gray)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--terracotta)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--olive-gray)'
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}

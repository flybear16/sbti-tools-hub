'use client'

import Link from 'next/link'
import type { Tool } from '@/lib/types'

interface Props {
  tool: Tool
}

export default function ToolCard({ tool }: Props) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group block">
      <div 
        className="rounded-2xl overflow-hidden border transition-all duration-300 h-full card-hover"
        style={{ 
          background: 'var(--ivory)',
          borderColor: 'var(--border-cream)',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
        }}
      >
        {/* 封面图 */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={tool.coverImage}
            alt={tool.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {tool.isSBTI && (
              <span 
                className="px-2 py-1 text-white text-xs font-bold rounded-full"
                style={{ background: 'var(--terracotta)' }}
              >
                🔥 SBTI
              </span>
            )}
            {tool.isHidden && (
              <span 
                className="px-2 py-1 text-white text-xs font-bold rounded-full"
                style={{ background: '#6b21a8' }}
              >
                🌙 隐藏人格
              </span>
            )}
            <span 
              className="px-2 py-1 text-white text-xs rounded-full"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            >
              🆕 NEW
            </span>
          </div>
          <div 
            className="absolute top-3 right-3 text-3xl"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            {tool.icon}
          </div>
        </div>

        {/* 内容 */}
        <div className="p-4">
          <h3 
            className="font-bold text-lg mb-1 transition-colors"
            style={{ 
              fontFamily: 'var(--font-serif)',
              fontWeight: 500,
              color: 'var(--near-black)'
            }}
          >
            {tool.name}
          </h3>
          <p 
            className="text-sm mb-3 line-clamp-2"
            style={{ 
              color: 'var(--olive-gray)',
              lineHeight: 1.6
            }}
          >
            {tool.description}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {tool.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full"
                style={{ 
                  background: 'var(--warm-sand)',
                  color: 'var(--charcoal-warm)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 底栏 */}
          <div 
            className="flex items-center justify-between text-sm"
            style={{ color: 'var(--stone-gray)' }}
          >
            <div className="flex items-center gap-3">
              <span>📝 {tool.questionCount}题</span>
              <span>⏱️ {tool.duration}分钟</span>
            </div>
            <div className="flex items-center gap-1">
              <span style={{ color: '#fbbf24' }}>★</span>
              <span 
                className="font-bold"
                style={{ color: 'var(--near-black)' }}
              >
                {tool.score.toFixed(1)}
              </span>
              <span className="text-xs">({tool.reviewCount})</span>
            </div>
          </div>

          {/* 主按钮 - Claude Style CTA */}
          <div className="mt-4">
            <span 
              className="block w-full py-2.5 text-center text-white font-bold rounded-xl text-sm transition-all btn-primary"
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 500
              }}
            >
              立即测试 →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

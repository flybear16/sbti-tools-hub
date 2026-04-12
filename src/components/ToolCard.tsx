'use client'

import Link from 'next/link'
import type { Tool } from '@/lib/types'

interface Props {
  tool: Tool
}

export default function ToolCard({ tool }: Props) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full">
        {/* 封面图 */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={tool.coverImage}
            alt={tool.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {tool.isSBTI && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                🔥 SBTI
              </span>
            )}
            {tool.isHidden && (
              <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                🌙 隐藏人格
              </span>
            )}
            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
              🆕 NEW
            </span>
          </div>
          <div className="absolute top-3 right-3 text-3xl">{tool.icon}</div>
        </div>

        {/* 内容 */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 group-hover:text-orange-500 transition-colors">
            {tool.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {tool.description}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {tool.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 底栏 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-gray-400">
              <span>📝 {tool.questionCount}题</span>
              <span>⏱️ {tool.duration}分钟</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-bold text-gray-800 dark:text-white">{tool.score.toFixed(1)}</span>
              <span className="text-gray-400 text-xs">({tool.reviewCount})</span>
            </div>
          </div>

          {/* 主按钮 */}
          <div className="mt-3">
            <span className="block w-full py-2 text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl group-hover:from-orange-600 group-hover:to-amber-600 transition-all text-sm">
              立即测试 →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

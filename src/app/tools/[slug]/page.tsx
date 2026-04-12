import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getToolBySlug, getTools } from '@/lib/mock-data'
import ToolCard from '@/components/ToolCard'

interface Props {
  params: { slug: string }
}

// 生成所有工具的静态路径
export async function generateStaticParams() {
  return getTools().map(tool => ({ slug: tool.slug }))
}

// SEO metadata
export async function generateMetadata({ params }: Props) {
  const tool = getToolBySlug(params.slug)
  if (!tool) return {}
  return {
    title: `${tool.name} - SBTI测评工具导航`,
    description: tool.description,
  }
}

export default function ToolDetailPage({ params }: Props) {
  const tool = getToolBySlug(params.slug)
  if (!tool) notFound()

  // 相关推荐（同分类，排除自己）
  const related = getTools()
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 顶部导航 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
            ← 返回首页
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">测评详情</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主信息 */}
          <div className="lg:col-span-2">
            {/* 封面 */}
            <div className="relative rounded-2xl overflow-hidden h-64 mb-6">
              <img
                src={tool.coverImage}
                alt={tool.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{tool.icon}</span>
                  <div>
                    <h1 className="text-2xl font-black text-white">{tool.name}</h1>
                    <div className="flex gap-2 mt-1">
                      {tool.isSBTI && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                          🔥 SBTI
                        </span>
                      )}
                      {tool.isHidden && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded-full">
                          🌙 隐藏人格
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 描述 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="font-bold text-lg mb-3">📝 测评简介</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {tool.longDescription || tool.description}
              </p>
            </div>

            {/* 详细参数 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="font-bold text-lg mb-4">📊 测评信息</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl mb-1">📝</div>
                  <div className="text-2xl font-black text-orange-500">{tool.questionCount}</div>
                  <div className="text-xs text-gray-500 mt-1">题目数量</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-2xl font-black text-orange-500">{tool.duration}</div>
                  <div className="text-xs text-gray-500 mt-1">预估分钟</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl mb-1">★</div>
                  <div className="text-2xl font-black text-orange-500">{tool.score.toFixed(1)}</div>
                  <div className="text-xs text-gray-500 mt-1">用户评分</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="text-2xl mb-1">👤</div>
                  <div className="text-2xl font-black text-orange-500">{tool.reviewCount >= 1000 ? `${(tool.reviewCount / 1000).toFixed(1)}k` : tool.reviewCount}</div>
                  <div className="text-xs text-gray-500 mt-1">评价人数</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">适合人群：</span>
                {tool.audience.map(a => (
                  <span key={a} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 text-sm rounded-full">
                    {a}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">标签：</span>
                {tool.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 广告位占位 */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 mb-6">
              <span className="text-gray-400">📢 广告位（Google AdSense / 百度联盟）</span>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* 主CTA */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-6">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-xl"
              >
                🚀 立即开始测试
              </a>
              <p className="text-center text-xs text-gray-400 mt-3">
                跳转到 {tool.name} 官方页面
              </p>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">评分</span>
                  <span className="font-bold">★ {tool.score.toFixed(1)} / 5.0</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">使用人次</span>
                  <span className="font-bold">👁 {tool.viewCount >= 1000 ? `${(tool.viewCount / 1000).toFixed(1)}k` : tool.viewCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">收录时间</span>
                  <span className="font-bold">{tool.createdAt}</span>
                </div>
              </div>
            </div>

            {/* 相关测评 */}
            {related.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4">🔥 相关测评</h3>
                <div className="space-y-3">
                  {related.map(t => (
                    <Link key={t.id} href={`/tools/${t.slug}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <span className="text-2xl">{t.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{t.name}</div>
                        <div className="text-xs text-gray-400">★ {t.score.toFixed(1)} · {t.duration}分钟</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部相关测评卡片 */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-black mb-6">更多{tool.category === 'sbti' ? 'SBTI' : '同类'}测评</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部 */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 mt-10">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 SBTI Tools Hub · 测评导航站 · 仅供娱乐</p>
        </div>
      </footer>
    </main>
  )
}

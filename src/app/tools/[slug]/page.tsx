import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getToolBySlug, getTools } from '@/lib/db'
import ToolCard from '@/components/ToolCard'
import ToolCTA from '@/components/ToolCTA'

interface Props {
  params: Promise<{ slug: string }>
}

// 生成所有工具的静态路径
export async function generateStaticParams() {
  const tools = await getTools()
  return tools.map(tool => ({ slug: tool.slug }))
}

// SEO metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) return {}
  return {
    title: `${tool.name} - SBTI测评工具导航`,
    description: tool.description,
  }
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params
  const tool = await getToolBySlug(slug)
  if (!tool) notFound()

  // 相关推荐（同分类，排除自己）
  const related = (await getTools())
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3)

  return (
    <main className="min-h-screen" style={{ background: 'var(--parchment)' }}>
      {/* 顶部导航 */}
      <div 
        className="border-b"
        style={{ 
          background: 'var(--ivory)',
          borderColor: 'var(--border-warm)'
        }}
      >
        <div 
          className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4"
          style={{ color: 'var(--stone-gray)' }}
        >
          <Link 
            href="/" 
            className="font-medium flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: 'var(--terracotta)' }}
          >
            ← 返回首页
          </Link>
          <span style={{ color: 'var(--border-warm)' }}>|</span>
          <span className="text-sm">测评详情</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主信息 */}
          <div className="lg:col-span-2">
            {/* 封面 */}
            <div 
              className="relative rounded-2xl overflow-hidden mb-6"
              style={{ height: '280px' }}
            >
              <img
                src={tool.coverImage}
                alt={tool.name}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0" 
                style={{ 
                  background: 'linear-gradient(to top, rgba(20,20,19,0.7) 0%, transparent 60%)'
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{tool.icon}</span>
                  <div>
                    <h1 
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-serif)', fontWeight: 500 }}
                    >
                      {tool.name}
                    </h1>
                    <div className="flex gap-2 mt-1">
                      {tool.isSBTI && (
                        <span 
                          className="px-2 py-0.5 text-white text-xs font-bold rounded-full"
                          style={{ background: 'var(--terracotta)' }}
                        >
                          🔥 SBTI
                        </span>
                      )}
                      {tool.isHidden && (
                        <span 
                          className="px-2 py-0.5 text-white text-xs font-bold rounded-full"
                          style={{ background: '#6b21a8' }}
                        >
                          🌙 隐藏人格
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 描述 */}
            <div 
              className="rounded-2xl p-6 mb-6"
              style={{ 
                background: 'var(--ivory)',
                border: '1px solid var(--border-cream)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
              }}
            >
              <h2 
                className="font-bold text-lg mb-3"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--near-black)' }}
              >
                📝 测评简介
              </h2>
              <p 
                className="leading-relaxed"
                style={{ color: 'var(--olive-gray)', lineHeight: 1.7 }}
              >
                {tool.longDescription || tool.description}
              </p>
            </div>

            {/* 详细参数 */}
            <div 
              className="rounded-2xl p-6 mb-6"
              style={{ 
                background: 'var(--ivory)',
                border: '1px solid var(--border-cream)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
              }}
            >
              <h2 
                className="font-bold text-lg mb-4"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--near-black)' }}
              >
                📊 测评信息
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '📝', value: tool.questionCount, label: '题目数量' },
                  { icon: '⏱️', value: tool.duration, label: '预估分钟' },
                  { icon: '★', value: tool.score.toFixed(1), label: '用户评分' },
                  { icon: '👤', value: tool.reviewCount >= 1000 ? `${(tool.reviewCount / 1000).toFixed(1)}k` : tool.reviewCount, label: '评价人数' },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="text-center p-4 rounded-xl"
                    style={{ background: 'var(--warm-sand)' }}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: 'var(--terracotta)' }}
                    >
                      {item.value}
                    </div>
                    <div 
                      className="text-xs mt-1"
                      style={{ color: 'var(--stone-gray)' }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm" style={{ color: 'var(--stone-gray)' }}>适合人群：</span>
                {tool.audience.map(a => (
                  <span 
                    key={a} 
                    className="px-3 py-1 text-sm rounded-full"
                    style={{ 
                      background: 'var(--warm-sand)',
                      color: 'var(--charcoal-warm)'
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm" style={{ color: 'var(--stone-gray)' }}>标签：</span>
                {tool.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 text-sm rounded-full"
                    style={{ 
                      background: 'var(--ivory)',
                      border: '1px solid var(--border-warm)',
                      color: 'var(--olive-gray)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 广告位占位 */}
            <div 
              className="rounded-2xl p-6 text-center mb-6"
              style={{ 
                border: '2px dashed var(--border-warm)',
                background: 'var(--warm-sand)'
              }}
            >
              <span style={{ color: 'var(--stone-gray)' }}>📢 广告位（Google AdSense / 百度联盟）</span>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* 主CTA */}
            <div 
              className="rounded-2xl p-6 sticky top-6"
              style={{ 
                background: 'var(--ivory)',
                border: '1px solid var(--border-cream)',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
              }}
            >
              <ToolCTA url={tool.url} isAvailable={tool.isAvailable} />
              <p 
                className="text-center text-xs mt-3"
                style={{ color: 'var(--stone-gray)' }}
              >
                跳转到 {tool.name} 官方页面
              </p>

              <div 
                className="mt-6 pt-6"
                style={{ borderTop: '1px solid var(--border-warm)' }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--stone-gray)' }}>评分</span>
                  <span className="font-bold" style={{ color: 'var(--near-black)' }}>
                    ★ {tool.score.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--stone-gray)' }}>使用人次</span>
                  <span className="font-bold" style={{ color: 'var(--near-black)' }}>
                    👁 {tool.viewCount >= 1000 ? `${(tool.viewCount / 1000).toFixed(1)}k` : tool.viewCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--stone-gray)' }}>收录时间</span>
                  <span className="font-bold" style={{ color: 'var(--near-black)' }}>
                    {tool.createdAt}
                  </span>
                </div>
              </div>
            </div>

            {/* 相关测评 */}
            {related.length > 0 && (
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  background: 'var(--ivory)',
                  border: '1px solid var(--border-cream)',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
                }}
              >
                <h3 
                  className="font-bold mb-4"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--near-black)' }}
                >
                  🔥 相关测评
                </h3>
                <div className="space-y-3">
                  {related.map(t => (
                    <RelatedToolItem key={t.id} tool={t} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部相关测评卡片 */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 
              className="text-xl mb-6"
              style={{ 
                fontFamily: 'var(--font-serif)', 
                fontWeight: 500,
                color: 'var(--near-black)'
              }}
            >
              更多{tool.category === 'sbti' ? 'SBTI' : '同类'}测评
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部 */}
      <footer 
        className="py-8 mt-10"
        style={{ 
          borderTop: '1px solid var(--border-warm)',
          background: 'var(--ivory)'
        }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p style={{ color: 'var(--stone-gray)' }}>
            © 2026 SBTI Tools Hub · 测评导航站 · 仅供娱乐
          </p>
        </div>
      </footer>
    </main>
  )
}

// 分离出需要交互的组件
function RelatedToolItem({ tool }: { tool: { id: string, name: string, slug: string, icon: string, score: number, duration: number } }) {
  return (
    <Link 
      href={`/tools/${tool.slug}`} 
      className="flex items-center gap-3 p-2 rounded-xl transition-colors related-item"
      style={{ background: 'var(--ivory)' }}
    >
      <span className="text-2xl">{tool.icon}</span>
      <div className="flex-1 min-w-0">
        <div 
          className="font-medium text-sm truncate"
          style={{ color: 'var(--near-black)' }}
        >
          {tool.name}
        </div>
        <div 
          className="text-xs"
          style={{ color: 'var(--stone-gray)' }}
        >
          ★ {tool.score.toFixed(1)} · {tool.duration}分钟
        </div>
      </div>
    </Link>
  )
}

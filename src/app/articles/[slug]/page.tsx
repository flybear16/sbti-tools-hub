import { getTools } from '@/lib/db'
import { MOCK_TOOLS } from '@/lib/mock-data'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'

interface Props {
  params: Promise<{ slug: string }>
}

// 获取所有文章 slug
export async function generateStaticParams() {
  const tools = await getTools().catch(() => MOCK_TOOLS)
  return tools.map(tool => ({ slug: tool.slug }))
}

// SEO metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tools = await getTools().catch(() => MOCK_TOOLS)
  const tool = tools.find(t => t.slug === slug)
  if (!tool) return {}

  return {
    title: `【完整攻略】${tool.name}怎么测？值得做吗？ - SBTI测评导航`,
    description: `全面了解${tool.name}：测评流程、题目示例、结果解读。用户评分${tool.score}/5.0，约${tool.questionCount}题/${tool.duration}分钟。`,
    openGraph: {
      title: `【完整攻略】${tool.name}怎么测？`,
      description: tool.description,
      images: [tool.coverImage],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const tools = await getTools().catch(() => MOCK_TOOLS)
  const tool = tools.find(t => t.slug === slug)
  if (!tool) notFound()

  // 读取 markdown 文章
  const articlePath = path.join(process.cwd(), 'src', 'app', 'articles', slug, 'page.md')
  let articleContent = ''
  try {
    articleContent = fs.readFileSync(articlePath, 'utf-8')
  } catch {
    articleContent = `# ${tool.name} 攻略\n\n正在生成中，请稍后再来...`
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 顶部导航 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium">
            ← 返回首页
          </Link>
          <span className="text-gray-300">|</span>
          <Link href={`/tools/${slug}`} className="text-orange-500 hover:text-orange-600 font-medium">
            ← 测评详情
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">攻略正文</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* 文章头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/tools/${slug}`}
              className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 text-sm font-bold rounded-full hover:bg-orange-200 transition-colors"
            >
              {tool.icon} {tool.name}
            </Link>
            {tool.isSBTI && (
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                🔥 SBTI
              </span>
            )}
            {tool.isHidden && (
              <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                🌙 隐藏人格
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>📝 {tool.questionCount} 题</span>
            <span>⏱️ 约 {tool.duration} 分钟</span>
            <span>★ {tool.score.toFixed(1)} / 5.0</span>
          </div>

          <Link
            href={`/tools/${slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
          >
            🚀 立即开始测试
          </Link>
        </div>

        {/* 文章正文（简化渲染，保留标题层级） */}
        <article className="prose prose-orange dark:prose-invert max-w-none">
          <MarkdownRenderer content={articleContent} />
        </article>

        {/* 底部 CTA */}
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-center">
          <h3 className="text-xl font-black mb-2">觉得这篇攻略有用吗？</h3>
          <p className="text-gray-500 mb-4">现在就去试试 {tool.name}，看看你会得到什么结果</p>
          <Link
            href={`/tools/${slug}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
          >
            🚀 立即开始测试 {tool.name}
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 SBTI Tools Hub · 测评导航站 · 仅供娱乐</p>
        </div>
      </footer>
    </main>
  )
}

// 简单 Markdown 渲染器（支持 h1-h3, p, ul, ol, blockquote, code, strong, em）
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // frontmatter 跳过
    if (line.startsWith('---')) {
      i++
      continue
    }

    // 标题
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-3xl font-black mt-8 mb-4">{renderInline(line.slice(2))}</h1>)
      i++; continue
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-2xl font-bold mt-8 mb-3 border-b pb-2">{renderInline(line.slice(3))}</h2>)
      i++; continue
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-xl font-bold mt-6 mb-2">{renderInline(line.slice(4))}</h3>)
      i++; continue
    }

    // 引用
    if (line.startsWith('> ')) {
      elements.push(<blockquote key={key++} className="border-l-4 border-orange-400 pl-4 py-2 my-4 bg-orange-50 dark:bg-orange-900/10 text-gray-700 dark:text-gray-300 italic">{renderInline(line.slice(2))}</blockquote>)
      i++; continue
    }

    // 无序列表
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      elements.push(<ul key={key++} className="list-disc list-inside my-4 space-y-2">{items.map((item, idx) => <li key={idx}>{renderInline(item)}</li>)}</ul>)
      continue
    }

    // 有序列表
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(<ol key={key++} className="list-decimal list-inside my-4 space-y-2">{items.map((item, idx) => <li key={idx}>{renderInline(item)}</li>)}</ol>)
      continue
    }

    // 表格（简单处理）
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().includes('|')) {
        tableLines.push(lines[i].trim())
        i++
      }
      elements.push(<TableRenderer key={key++} lines={tableLines} />)
      continue
    }

    // 分隔线
    if (line === '---' || line === '***') {
      elements.push(<hr key={key++} className="my-8 border-gray-300 dark:border-gray-600" />)
      i++; continue
    }

    // 空行
    if (!line) {
      i++; continue
    }

    // 普通段落
    elements.push(<p key={key++} className="my-4 leading-relaxed text-gray-700 dark:text-gray-200">{renderInline(line)}</p>)
    i++
  }

  return <>{elements}</>
}

// 内联渲染：粗体、斜体、代码、行内链接
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining) {
    // 行内代码
    const codeMatch = remaining.match(/`([^`]+)`/)
    // 粗体
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
    // 斜体
    const emMatch = remaining.match(/\*([^*]+)\*/)
    // 链接 [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)

    // 找最早出现的
    const matches = [
      codeMatch && { type: 'code', index: codeMatch.index!, length: codeMatch[0].length, content: codeMatch[1] },
      boldMatch && { type: 'bold', index: boldMatch.index!, length: boldMatch[0].length, content: boldMatch[1] },
      emMatch && { type: 'em', index: emMatch.index!, length: emMatch[0].length, content: emMatch[1] },
      linkMatch && { type: 'link', index: linkMatch.index!, length: linkMatch[0].length, content: linkMatch[1], url: linkMatch[2] },
    ].filter(Boolean).sort((a, b) => a!.index - b!.index) as Array<{type:string,index:number,length:number,content:string,url?:string}>

    if (!matches.length) {
      parts.push(remaining)
      break
    }

    const first = matches[0]
    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index))
    }

    if (first.type === 'code') {
      parts.push(<code key={key++} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-orange-600 dark:text-orange-300 rounded text-sm font-mono">{first.content}</code>)
    } else if (first.type === 'bold') {
      parts.push(<strong key={key++} className="font-bold">{first.content}</strong>)
    } else if (first.type === 'em') {
      parts.push(<em key={key++}>{first.content}</em>)
    } else if (first.type === 'link') {
      const isExternal = first.url?.startsWith('http')
      parts.push(
        <a key={key++} href={first.url} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} className="text-orange-500 hover:underline">
          {first.content}
        </a>
      )
    }

    remaining = remaining.slice(first.index + first.length)
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}

// 简单表格渲染器
function TableRenderer({ lines }: { lines: string[] }) {
  if (lines.length < 2) return null
  const rows = lines.map(l => l.split('|').filter(c => c.trim()).map(c => c.trim()))
  const [header, ...body] = rows
  if (!header || header.length < 2) return null

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-orange-100 dark:bg-orange-900/30">
            {header.map((cell, i) => <th key={i} className="px-4 py-3 text-left text-sm font-bold text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">{renderInline(cell)}</th>)}
          </tr>
        </thead>
        <tbody>
          {body.filter(row => !row.every(c => c === '------' || c === '------')).map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
              {row.map((cell, ci) => <td key={ci} className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700">{renderInline(cell)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

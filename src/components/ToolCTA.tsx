'use client'

interface Props {
  url: string
  isAvailable: boolean
}

export default function ToolCTA({ url, isAvailable }: Props) {
  if (!isAvailable) {
    return (
      <>
        <div 
          className="mb-3 p-3 text-sm text-center rounded-xl"
          style={{ 
            background: 'var(--warm-sand)',
            color: '#b53333'
          }}
        >
          ⚠️ 该测评链接暂时不可用，我们正在修复中
        </div>
        <button
          disabled
          className="w-full py-4 text-center font-bold text-lg rounded-xl cursor-not-allowed"
          style={{ 
            background: 'var(--warm-sand)',
            color: 'var(--stone-gray)'
          }}
        >
          ⏳ 链接维护中
        </button>
      </>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full py-4 text-center text-white font-bold text-lg rounded-xl transition-all"
      style={{
        background: 'var(--terracotta)',
        boxShadow: '0px 0px 0px 1px var(--terracotta)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--coral-accent)'
        e.currentTarget.style.boxShadow = '0px 0px 0px 1px var(--coral-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--terracotta)'
        e.currentTarget.style.boxShadow = '0px 0px 0px 1px var(--terracotta)'
      }}
    >
      🚀 立即开始测试
    </a>
  )
}

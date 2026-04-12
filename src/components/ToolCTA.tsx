'use client'

import Link from 'next/link'

interface Props {
  url: string
  toolId: string
  toolName: string
  isAvailable: boolean
}

export default function ToolCTA({ url, toolId, toolName, isAvailable }: Props) {
  const handleClick = () => {
    fetch('/api/clicks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId, referer: window.location.href }),
    }).catch(() => {})
  }

  if (!isAvailable) {
    return (
      <>
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-xl text-center">
          ⚠️ 该测评链接暂时不可用，我们正在修复中
        </div>
        <button
          disabled
          className="w-full py-4 text-center bg-gray-300 dark:bg-gray-600 text-gray-500 font-black text-lg rounded-xl cursor-not-allowed"
        >
          ⏳ 链接维护中
        </button>
      </>
    )
  }

  return (
    <>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block w-full py-4 text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-xl"
      >
        🚀 立即开始测试
      </Link>
    </>
  )
}

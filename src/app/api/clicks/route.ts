import { NextRequest, NextResponse } from 'next/server'
import { logToolClick } from '@/lib/db'

// POST /api/clicks
export async function POST(request: NextRequest) {
  try {
    const { toolId, referer } = await request.json()
    if (!toolId) {
      return NextResponse.json({ error: 'toolId required' }, { status: 400 })
    }
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const ipHash = Buffer.from(ip).toString('base64').slice(0, 32)
    await logToolClick(toolId, referer, ipHash)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

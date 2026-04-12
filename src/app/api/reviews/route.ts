import { NextRequest, NextResponse } from 'next/server'
import { submitReview, getReviewsByToolId } from '@/lib/db'

// GET /api/reviews?toolId=xxx
export async function GET(request: NextRequest) {
  const toolId = request.nextUrl.searchParams.get('toolId')
  if (!toolId) {
    return NextResponse.json({ error: 'toolId required' }, { status: 400 })
  }
  try {
    const reviews = await getReviewsByToolId(toolId)
    return NextResponse.json({ reviews })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolId, score, comment } = body

    if (!toolId || !score || !comment) {
      return NextResponse.json({ error: 'toolId, score, comment required' }, { status: 400 })
    }
    if (score < 1 || score > 5) {
      return NextResponse.json({ error: 'score must be 1-5' }, { status: 400 })
    }
    if (comment.length > 200) {
      return NextResponse.json({ error: 'comment too long (max 200 chars)' }, { status: 400 })
    }

    // 简单反作弊：基于 IP hash（实际应结合 User-Agent）
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const ipHash = Buffer.from(ip).toString('base64').slice(0, 32)

    const review = await submitReview(toolId, score, comment, ipHash)
    return NextResponse.json({ review }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

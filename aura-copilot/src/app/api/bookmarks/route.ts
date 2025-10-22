import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type SaveBody = { address?: string; title?: string; payload?: any }

export async function GET() {
  const rows = await prisma.bookmark.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  let body: SaveBody | null = null
  try {
    body = (await req.json()) as SaveBody
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 })
  }

  const address = (body?.address || '').toLowerCase()
  const title = (body?.title || '').trim()
  const payload = body?.payload

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'address must be a 0x…40 hex string' }, { status: 400 })
  }
  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }
  if (payload == null) {
    return NextResponse.json({ error: 'payload is required' }, { status: 400 })
  }

  const saved = await prisma.bookmark.create({ data: { address, title, payload } })
  return NextResponse.json(saved)
}


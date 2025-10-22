// src/app/api/resolve/route.ts
import { NextResponse } from 'next/server'
import { resolveEnsOrAddress } from '@/lib/eth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const input = (searchParams.get('input') || '').trim().toLowerCase()
  if (!input) return NextResponse.json({ error: 'Missing input' }, { status: 400 })

  try {
    const resolved = await resolveEnsOrAddress(input)
    if (!resolved) {
      return NextResponse.json({ error: 'Not a valid 0x address or resolvable ENS' }, { status: 400 })
    }
    return NextResponse.json({ address: resolved })
  } catch (e) {
    console.error('ENS resolve error', e)
    return NextResponse.json({ error: 'Resolution failed' }, { status: 500 })
  }
}


// src/app/api/aura/balances/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getBalances } from '@/lib/aura'
import { prisma } from '@/lib/db'
import { CACHE_TTL_MS } from '@/lib/constants'
const isHex = (s:string)=> /^0x[a-fA-F0-9]{40}$/.test(s)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = (searchParams.get('address') || '').toLowerCase()
  if (!isHex(address)) return NextResponse.json({ error: 'Invalid address (use 0x… or ENS in UI)' }, { status: 400 })

  const cached = await prisma.cacheEntry.findFirst({
    where: { address, kind: 'balances' },
    orderBy: { createdAt: 'desc' },
  })
  if (cached && Date.now() - new Date(cached.createdAt).getTime() < CACHE_TTL_MS) {
    return NextResponse.json(cached.payload)
  }

  const data = await getBalances(address)
  await prisma.cacheEntry.create({ data: { address, kind: 'balances', payload: data } })
  return NextResponse.json(data)
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const HAS_DB = !!process.env.DATABASE_URL;

export async function GET() {
  if (!HAS_DB) return NextResponse.json({ items: [] }, { status: 200 });
  try {
    const items = await prisma.bookmark.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ items }, { status: 200 });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!HAS_DB) return NextResponse.json({ ok: true }, { status: 200 });
  try {
    const body = await req.json();
    const { title, payload, address } = body || {};
    if (!title || !payload) return NextResponse.json({ ok: false }, { status: 400 });
    await prisma.bookmark.create({ data: { title, address: address || null, payload } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}


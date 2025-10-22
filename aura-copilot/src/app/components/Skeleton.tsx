'use client'

export function CardSkeleton() {
  return (
    <div className="border rounded p-4 animate-pulse bg-white/50">
      <div className="h-4 w-1/3 bg-slate-200 mb-3" />
      <div className="space-y-2">
        <div className="h-3 w-5/6 bg-slate-200" />
        <div className="h-3 w-3/4 bg-slate-200" />
        <div className="h-3 w-2/3 bg-slate-200" />
      </div>
      <div className="h-8 w-32 bg-slate-200 mt-4 rounded" />
    </div>
  )
}

export function GridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function SectionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-48 bg-slate-200 rounded" />
      <GridSkeleton />
    </div>
  )
}


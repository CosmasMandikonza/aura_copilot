'use client'

import { useState } from 'react'

export default function DemoMenu({
  onPick,
}: {
  onPick: (value: string) => void
}) {
  const demos = [
    {
      label: 'vitalik.eth',
      value: 'vitalik.eth',
      icon: '✨',
    },
    {
      label: '0x0000…0000',
      value: '0x0000000000000000000000000000000000000000',
      icon: '🧪',
    },
  ]

  const [pasting, setPasting] = useState(false)

  async function pasteFromClipboard() {
    try {
      setPasting(true)
      const text = await navigator.clipboard.readText()
      if (text) onPick(text.trim())
    } catch {
      // no-op: permissions or empty clipboard
    } finally {
      setPasting(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-purple-200/80">Try a demo:</span>

      {demos.map((d) => (
        <button
          key={d.label}
          type="button"
          onClick={() => onPick(d.value)}
          className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/90 transition-all hover:border-white/25 hover:bg-white/20 hover:shadow-[0_0_0_4px_rgba(168,85,247,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
        >
          <span className="mr-1">{d.icon}</span>
          {d.label}
        </button>
      ))}

      <span className="mx-1 h-4 w-px bg-white/10" />

      <button
        type="button"
        onClick={pasteFromClipboard}
        className="rounded-full border border-white/15 bg-slate-900/40 px-3 py-1.5 text-sm text-purple-200 transition-colors hover:bg-slate-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
      >
        {pasting ? 'Pasting…' : 'Paste from clipboard'}
      </button>
    </div>
  )
}

'use client'

import { useState } from 'react'
import DemoMenu from './DemoMenu'

function isHexAddress(s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(s || '')
}

export default function AddressForm({
  onAnalyze,
}: {
  onAnalyze: (address: string) => void
}) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)

    const input = value.trim()
    if (!input) {
      setError('Enter a wallet address or ENS')
      return
    }

    setLoading(true)
    try {
      if (isHexAddress(input)) {
        onAnalyze(input)
        return
      }
      const res = await fetch(`/api/resolve?input=${encodeURIComponent(input)}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Could not resolve input' }))
        setError(data.error || 'Could not resolve input')
        return
      }
      const data = await res.json()
      onAnalyze(data.address)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative mx-auto max-w-5xl pt-8 md:pt-14">
      {/* soft gradient orbs */}
      <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-blue-600/30 blur-3xl" />

      {/* Hero copy */}
      <div className="mb-8 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          Discover <span className="gradient-text">hidden DeFi opportunities</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-purple-200 md:mt-4 md:text-xl">
          Paste a wallet or ENS. We’ll analyze positions, flag risks, and surface
          airdrops & stacked-yield plays—in seconds.
        </p>
      </div>

      {/* Big input bar */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="group relative">
          {/* glow ring */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 blur transition-opacity duration-300 group-hover:opacity-60" />

          <div className="relative flex items-stretch gap-3 rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            <div className="pointer-events-none flex items-center pl-3">
              <span className="text-2xl">🔮</span>
            </div>

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter wallet address or ENS (e.g., vitalik.eth)"
              className="flex-1 rounded-2xl bg-transparent px-2 py-4 text-lg text-slate-100 placeholder-slate-400 outline-none md:px-3 md:text-xl"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="whitespace-nowrap rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:px-8 md:text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing…
                </span>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </div>

        {/* helper/error + demo links */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            <DemoMenu onPick={(s) => setValue(s)} />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              ⚠️ {error}
            </div>
          )}
        </div>
      </form>

      {/* tiny feature teasers for credibility */}
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ['🤖', 'AI Analysis', 'Personalized portfolio reasoning'],
          ['🛡️', 'Security Scan', 'Heuristic risk checks & warnings'],
          ['⚡', 'Actionable', 'Direct links to execute on platforms'],
        ].map(([icon, title, desc]) => (
          <div
            key={title}
            className="glassmorphism rounded-2xl p-4 text-center transition-transform hover:scale-[1.01]"
          >
            <div className="mb-1 text-2xl">{icon}</div>
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="text-xs text-purple-200">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}




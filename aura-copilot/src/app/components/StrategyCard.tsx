'use client'

import { analyzeSecurityRisk } from '@/lib/security'
import { generateExecutionLink } from '@/lib/execution'

export default function StrategyCard({
  item,
  onSave,
  address,
}: {
  item: any
  onSave?: (title: string, payload: any) => void
  address?: string
}) {
  const risk = (item?.risk || '').toLowerCase()
  const security = analyzeSecurityRisk(item)
  const execLink = address ? generateExecutionLink(item, address) : null

  const riskBadge = (() => {
    const m: Record<string, string> = {
      low: 'bg-emerald-500/20 text-emerald-300',
      moderate: 'bg-yellow-500/20 text-yellow-300',
      medium: 'bg-yellow-500/20 text-yellow-300',
      high: 'bg-rose-500/20 text-rose-300',
      opportunistic: 'bg-orange-500/20 text-orange-300',
    }
    return m[risk] || 'bg-slate-500/20 text-slate-300'
  })()

  const secBadge =
    security.level === 'safe'
      ? 'bg-emerald-500/20 text-emerald-300'
      : security.level === 'caution'
      ? 'bg-yellow-500/20 text-yellow-300'
      : 'bg-rose-500/20 text-rose-300'

  return (
    <div className="glassmorphism rounded-lg p-4 space-y-3 strategy-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">
            {item?.name || 'Strategy'}
          </h4>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {item?.score != null && (
              <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-slate-200">
                Score: {item.score}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-xs ${riskBadge}`}>{item?.risk}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${secBadge}`}>
              🛡️ Security: {security.score}/100
            </span>
          </div>
        </div>

        {execLink && (
          <a
            href={execLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            ⚡ Execute
          </a>
        )}
      </div>

      {/* Profit line (optional) */}
      {item?.profit12m != null && (
        <div className="text-xs text-slate-300">
          12-mo Profit (on $5k): ${item.profit12m}
        </div>
      )}

      {/* Actions list */}
      <ul className="list-disc ml-5 text-sm space-y-2">
        {item?.actions?.map((a: any, idx: number) => (
          <li key={idx} className="space-y-1">
            {a.tokens ? (
              <div className="font-medium text-slate-100">
                Tokens:{' '}
                {Array.isArray(a.tokens) ? a.tokens.join(', ') : a.tokens}
              </div>
            ) : null}
            {a.description && (
              <div className="text-slate-200">{a.description}</div>
            )}
            {a.platforms?.length ? (
              <div className="text-slate-300">
                Platforms:{' '}
                {a.platforms.map((p: any) => (
                  <a
                    key={p.url || p.name}
                    href={p.url}
                    target="_blank"
                    className="underline mr-2"
                  >
                    {p.name}
                  </a>
                ))}
              </div>
            ) : null}
            {a.networks?.length ? (
              <div className="text-slate-300">
                Networks: {a.networks.join(', ')}
              </div>
            ) : null}
            {a.operations?.length ? (
              <div className="text-slate-300">
                Operations: {a.operations.join(', ')}
              </div>
            ) : null}
            {a.apy ? <div className="text-slate-300">APY: {a.apy}</div> : null}
          </li>
        ))}
      </ul>

      {/* Security warnings */}
      {security.warnings.length > 0 && (
        <details className="text-xs text-orange-300 cursor-pointer">
          <summary>⚠️ {security.warnings.length} security warnings</summary>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            {security.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </details>
      )}

      {/* Save button (optional) */}
      {onSave && (
        <div className="pt-1">
          <button
            onClick={() => onSave(item?.name || 'Strategy', item)}
            className="px-3 py-1.5 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            Save to watchlist
          </button>
        </div>
      )}
    </div>
  )
}



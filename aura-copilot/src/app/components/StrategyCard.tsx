'use client'

import { analyzeSecurityRisk } from '@/lib/security'
import { generateExecutionLink } from '@/lib/execution'
import React from 'react'

export default function StrategyCard({
  item,
  address,
  onSave,
}: {
  item: any
  address?: string
  onSave?: (title: string, payload: any) => void
}) {
  const risk = String(item?.risk || '').toLowerCase()
  const security = analyzeSecurityRisk(item)
  const execLink = address ? generateExecutionLink(item, address) : null

  const riskBadge =
    risk === 'low'
      ? 'bg-green-500/15 text-green-300'
      : risk === 'moderate' || risk === 'medium'
      ? 'bg-yellow-500/15 text-yellow-300'
      : 'bg-red-500/15 text-red-300'

  const securityBadge =
    security.level === 'safe'
      ? 'bg-green-500/15 text-green-300'
      : security.level === 'caution'
      ? 'bg-yellow-500/15 text-yellow-300'
      : 'bg-red-500/15 text-red-300'

  return (
    <div className="strategy-card glassmorphism rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-white">{item?.name || 'Strategy'}</h4>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-full ${riskBadge}`}>{risk || 'unknown'}</span>
            {typeof item?.score === 'number' && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300">
                {Math.round(item.score * 100)}/100
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full ${securityBadge}`}>🛡 {security.score}/100</span>
          </div>
        </div>

        {execLink && (
          <a
            href={execLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            ⚡ Execute →
          </a>
        )}
      </div>

      {/* Meta */}
      {item?.profit12m != null && (
        <div className="text-xs text-slate-300">
          12-mo Profit (on $5k): <span className="font-medium text-white">${item.profit12m}</span>
        </div>
      )}

      {/* Actions */}
      <ul className="list-disc ml-5 text-sm space-y-2">
        {(item?.actions || []).map((a: any, idx: number) => (
          <li key={idx} className="space-y-1">
            {a.tokens ? (
              <div className="font-medium text-white">
                Tokens:{' '}
                <span className="text-slate-300">
                  {Array.isArray(a.tokens) ? a.tokens.join(', ') : a.tokens}
                </span>
              </div>
            ) : null}

            {a.description && <div className="text-slate-200">{a.description}</div>}

            {a.platforms?.length ? (
              <div className="text-slate-300">
                Platforms:{' '}
                {a.platforms.map((p: any, i: number) => (
                  <a
                    key={`${p.url}-${i}`}
                    href={p.url}
                    target="_blank"
                    className="underline mr-2 hover:text-white"
                  >
                    {p.name}
                  </a>
                ))}
              </div>
            ) : null}

            {a.networks?.length ? (
              <div className="text-slate-300">Networks: {a.networks.join(', ')}</div>
            ) : null}

            {a.operations?.length ? (
              <div className="text-slate-300">Operations: {a.operations.join(', ')}</div>
            ) : null}

            {a.apy ? <div className="text-slate-300">APY: {a.apy}</div> : null}
          </li>
        ))}
      </ul>

      {/* Security details */}
      {security.warnings.length > 0 && (
        <details className="text-xs text-orange-300 cursor-pointer">
          <summary>⚠ {security.warnings.length} security warning(s)</summary>
          <ul className="list-disc ml-5 mt-1 space-y-1">
            {security.warnings.map((w, i) => (
              <li key={i} className="text-orange-200">
                {w}
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Save button (optional) */}
      {onSave && (
        <button
          onClick={() => onSave(item?.name || 'Strategy', item)}
          className="px-3 py-1.5 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
        >
          Save to watchlist
        </button>
      )}
    </div>
  )
}

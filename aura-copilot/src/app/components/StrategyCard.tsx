'use client'

import Badge from './Badge'
import { analyzeSecurityRisk } from '@/lib/security'
import { generateExecutionLink } from '@/lib/execution'

export default function StrategyCard({
  item,
  onSave,
  address,
}: {
  item: any,
  onSave: (title: string, payload: any) => void,
  address?: string
}) {
  const risk = (item?.risk || '').toLowerCase();
  const tone = risk === 'low' ? 'success' : risk === 'medium' ? 'warn' : 'danger';

  const security = analyzeSecurityRisk(item);
  const execLink = address ? generateExecutionLink(item, address) : null;

  return (
    <div className="border rounded p-4 space-y-2 strategy-card">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold">{item?.name || 'Strategy'}</h4>
        <div className="flex items-center gap-2">
          <Badge tone={tone}>{risk || 'unknown'}</Badge>

          <span
            className={
              security.level === 'safe'
                ? 'px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700'
                : security.level === 'caution'
                ? 'px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700'
                : 'px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700'
            }
          >
            🛡️ {security.score}/100
          </span>
        </div>
      </div>

      {/* body */}
      <ul className="list-disc ml-5 text-sm">
        {(item?.actions || []).map((a: any, idx: number) => (
          <li key={idx}>
            {a.tokens ? (
              <div className="font-medium">
                Tokens: {Array.isArray(a.tokens) ? a.tokens.join(', ') : a.tokens}
              </div>
            ) : null}
            {a.description && <div>{a.description}</div>}

            {Array.isArray(a.platforms) && a.platforms.length > 0 ? (
              <div className="text-slate-600">
                Platforms:{' '}
                {a.platforms.map((p: { name: string; url: string }, i: number) => (
                  <a key={i} href={p.url} target="_blank" className="underline mr-2">
                    {p.name}
                  </a>
                ))}
              </div>
            ) : null}

            {Array.isArray(a.networks) && a.networks.length > 0 && (
              <div className="text-slate-600">Networks: {a.networks.join(', ')}</div>
            )}
            {Array.isArray(a.operations) && a.operations.length > 0 && (
              <div className="text-slate-600">Operations: {a.operations.join(', ')}</div>
            )}
            {a.apy ? <div className="text-slate-600">APY: {a.apy}</div> : null}
          </li>
        ))}
      </ul>

      {/* security warnings */}
      {security.warnings.length > 0 && (
        <details className="text-xs text-orange-600 cursor-pointer">
          <summary>⚠️ {security.warnings.length} security warning(s)</summary>
          <ul className="list-disc ml-4 mt-1">
            {security.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
          </ul>
        </details>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(item?.name || 'Strategy', item)}
          className="px-3 py-1.5 rounded bg-slate-900 text-white text-sm"
        >
          Save to watchlist
        </button>

        {execLink && (
          <a
            href={execLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:opacity-90"
          >
            ⚡ Execute →
          </a>
        )}
      </div>
    </div>
  );
}



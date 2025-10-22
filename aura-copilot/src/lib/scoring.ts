// src/lib/scoring.ts
import type { StrategyItem } from './types'

// crude APY extractor: supports "8-20%+", "2.4-2.7%", "N/A"
export function parseApy(apy?: string): number | null {
  if (!apy) return null
  const s = apy.toLowerCase().replace('%', '').replace('+', '').trim()
  const range = s.split('-').map(x => parseFloat(x))
  const nums = range.filter(n => !isNaN(n))
  if (!nums.length) return null
  // optimistic-median
  nums.sort((a,b)=>a-b)
  return nums[Math.floor(nums.length/2)]
}

export function riskWeight(risk?: string): number {
  const r = (risk || '').toLowerCase()
  if (r === 'low') return 1.0
  if (r === 'medium') return 0.65
  if (r === 'high') return 0.35
  return 0.5
}

export function timeToValueWeight(item: StrategyItem): number {
  // airdrops/claims or single-click actions get boosted; LP / yield farming penalized
  const t = JSON.stringify(item).toLowerCase()
  if (t.includes('claim')) return 1.0
  if (t.includes('airdrop')) return 0.95
  if (t.includes('staking')) return 0.9
  if (t.includes('lending')) return 0.85
  if (t.includes('liquidity')) return 0.7
  return 0.8
}

export function opportunityScore(item: StrategyItem): number {
  const apy = parseApy(item.actions?.[0]?.apy)
  const apyNorm = apy ? Math.min(apy / 30, 1) : 0.3 // cap at ~30% for normalization
  const risk = riskWeight(item.risk)
  const ttv = timeToValueWeight(item)

  // explainable, weighted product (can be tuned)
  const score = (0.5 * apyNorm + 0.3 * ttv + 0.2 * risk)
  return Math.round(score * 100) / 100
}

export function twelveMonthProfit(usdNotional: number, apyStr?: string): number | null {
  const apy = parseApy(apyStr)
  if (apy == null) return null
  return Math.round((usdNotional * (apy / 100)) * 100) / 100
}

import { AIRDROP_KEYWORDS, DOUBLEDIP_KEYWORDS } from './constants'
import { AuraStrategiesResponse, StrategyItem } from './types'

function textBlob(item: StrategyItem): string {
  const parts = [
    item.name, item.risk,
    ...item.actions.map(a => [
      a.description,
      (a.tokens || []).toString(),
      (a.platforms || []).map(p => p.name).join(' '),
      (a.networks || []).join(' '),
      (a.operations || []).join(' '),
      a.apy ?? ''
    ].join(' ')),
  ]
  return parts.join(' ').toLowerCase()
}

export function splitStrategies(data: AuraStrategiesResponse) {
  const all: StrategyItem[] = data.strategies.flatMap(s => s.response || [])

  const airdrop: StrategyItem[] = []
  const doubledip: StrategyItem[] = []
  const other: StrategyItem[] = []

  for (const s of all) {
    const t = textBlob(s)
    const isAirdrop = AIRDROP_KEYWORDS.some(k => t.includes(k))
    const isDouble  = DOUBLEDIP_KEYWORDS.some(k => t.includes(k))
    if (isAirdrop) airdrop.push(s)
    else if (isDouble) doubledip.push(s)
    else other.push(s)
  }

  const rank = (arr: StrategyItem[]) =>
    arr.slice().sort((a, b) => {
      const order = { low: 0, medium: 1, high: 2 } as Record<string, number>
      return (order[a.risk] ?? 9) - (order[b.risk] ?? 9)
    })

  return {
    airdrop: rank(airdrop),
    doubledip: rank(doubledip),
    other: rank(other),
  }
}

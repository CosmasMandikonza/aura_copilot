export type NetworkInfo = {
  name: string
  chainId: string
  platformId: string
  explorerUrl: string
  iconUrls: string[]
}

export type TokenBalance = {
  address: string
  symbol: string
  network: string
  balance: number
  balanceUSD: number
}

export type Portfolio = {
  network: NetworkInfo
  tokens: TokenBalance[]
}

export type StrategyAction = {
  tokens?: string | string[]
  description: string
  platforms?: { name: string; url: string }[]
  networks?: string[]
  operations?: string[]
  apy?: string
}

export type StrategyItem = {
  name: string
  risk: 'low' | 'medium' | 'high' | string
  actions: StrategyAction[]
}

export type AuraStrategiesResponse = {
  address: string
  portfolio: Portfolio[]
  strategies: {
    llm: { provider: string; model: string }
    response: StrategyItem[]
    responseTime?: number
    error?: string | null
  }[]
  cached: boolean
  version: string
}

export type AuraBalancesResponse = {
  address: string
  portfolio: Portfolio[]
  cached: boolean
  version: string
}

import 'server-only'
import { z } from 'zod'
import { AuraBalancesResponse, AuraStrategiesResponse } from './types'

const base = process.env.AURA_API_BASE!
const key  = process.env.AURA_API_KEY || ''

const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

async function fetchJson<T>(url: string) {
  const res = await fetch(url, {
    headers: key ? { 'x-api-key': key } : {},
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`AURA fetch failed: ${res.status} ${txt}`)
  }
  return res.json() as Promise<T>
}

export async function getBalances(address: string) {
  addressSchema.parse(address)
  const url = `${base}/portfolio/balances?address=${address}`
  return fetchJson<AuraBalancesResponse>(url)
}

export async function getStrategies(address: string) {
  addressSchema.parse(address)
  const url = `${base}/portfolio/strategies?address=${address}`
  return fetchJson<AuraStrategiesResponse>(url)
}

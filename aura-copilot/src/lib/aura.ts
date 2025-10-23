// src/lib/aura.ts
const BASE = process.env.AURA_API_BASE || 'https://aura.adex.network/api';
const API_KEY = process.env.AURA_API_KEY || ''; // optional

type FetchOk<T> = { ok: true; status: number; data: T };
type FetchErr    = { ok: false; status: number; data: any };
type FetchResp<T> = FetchOk<T> | FetchErr;

async function fetchJson<T>(path: string, params: Record<string, string | number>) : Promise<FetchResp<T>> {
  const url = new URL(path, BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  if (API_KEY) url.searchParams.set('apiKey', API_KEY); // only if you set a key

  const res = await fetch(url.toString(), { cache: 'no-store' });
  const data = await res.json().catch(() => null);
  if (!res.ok) return { ok: false, status: res.status, data };
  return { ok: true, status: res.status, data };
}

export interface AuraBalancesResponse {
  address?: string;
  portfolio?: Array<{
    network?: { name?: string; chainId?: string };
    tokens?: Array<{ balanceUSD?: number }>;
  }>;
  cached?: boolean;
  version?: string;
}

export interface AuraStrategiesResponse {
  address?: string;
  portfolio?: unknown;
  strategies?: any[];
  cached?: boolean;
  version?: string;
}

export function getBalances(address: string) {
  return fetchJson<AuraBalancesResponse>('/portfolio/balances', { address });
}

export function getStrategies(address: string) {
  return fetchJson<AuraStrategiesResponse>('/portfolio/strategies', { address });
}


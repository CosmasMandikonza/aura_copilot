// src/lib/eth.ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

// RPC; fall back orderly
const RPCS = [
  process.env.ETH_RPC_MAINNET,
  'https://ethereum.publicnode.com',
  'https://cloudflare-eth.com',
].filter(Boolean) as string[]

let clientIdx = 0
function makeClient(idx: number) {
  return createPublicClient({ chain: mainnet, transport: http(RPCS[idx]) })
}
let eth = makeClient(clientIdx)

const ensCache = new Map<string, string>() // ens -> 0x...

async function tryResolve(name: string): Promise<string | null> {
  // viem publicClient has getEnsAddress on mainnet
  // @ts-ignore
  const addr = await eth.getEnsAddress({ name })
  return addr ? addr.toLowerCase() : null
}

export async function resolveEnsOrAddress(input: string): Promise<string | null> {
  const s = input.trim().toLowerCase()

  if (/^0x[a-fA-F0-9]{40}$/.test(s)) return s

  if (s.includes('.')) {
    if (ensCache.has(s)) return ensCache.get(s)!
    // try across RPCs in case a gateway is flaky
    for (let tries = 0; tries < RPCS.length; tries++) {
      try {
        const addr = await tryResolve(s)
        if (addr) {
          ensCache.set(s, addr)
          return addr
        }
      } catch {
        // rotate client and try next
        clientIdx = (clientIdx + 1) % RPCS.length
        eth = makeClient(clientIdx)
      }
    }
    return null
  }

  return null
}

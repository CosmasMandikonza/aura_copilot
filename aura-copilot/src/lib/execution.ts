// src/lib/execution.ts

export function generateExecutionLink(strategy: any, userAddress: string): string | null {
  const act = strategy?.actions?.[0];
  const platform = act?.platforms?.[0];
  if (!platform?.name) return null;

  const name = (platform.name as string).toLowerCase();
  const url = (platform.url as string) || '';

  // Known dapp deep-link formats
  if (name.includes('uniswap')) {
    // Fallback to add-liquidity screen; token selection must be manual here
    return 'https://app.uniswap.org/#/pool?utm_source=aura_copilot';
  }
  if (name.includes('aave')) {
    return 'https://app.aave.com/?marketName=proto_mainnet_v3';
  }
  if (name.includes('compound')) {
    return 'https://app.compound.finance/';
  }
  if (name.includes('lido')) {
    return 'https://stake.lido.fi/';
  }
  if (name.includes('rocket pool')) {
    return 'https://stake.rocketpool.net/';
  }
  if (name.includes('stakewise')) {
    return 'https://app.stakewise.io/stake';
  }
  if (name.includes('pancakeswap')) {
    return 'https://pancakeswap.finance/liquidity';
  }
  if (name.includes('balancer')) {
    return 'https://app.balancer.fi/#/ethereum/pools';
  }
  if (name.includes('merkl')) {
    return 'https://app.merkl.xyz/';
  }

  // default: return platform home with an address hint if it looks supported
  try {
    const u = new URL(url);
    u.searchParams.set('address', userAddress);
    return u.toString();
  } catch {
    return url || null;
  }
}



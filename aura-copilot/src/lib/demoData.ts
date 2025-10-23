// src/lib/demoData.ts
export const demoStrategies = {
  address: '0x0000000000000000000000000000000000000000',
  portfolio: [],
  strategies: [
    {
      id: 'merkl',
      title: 'Claim Merkl rewards',
      risk: 'low',
      actions: [{ apy: null }],
      security: 70,
      networks: ['ethereum'],
      tokens: ['N/A']
    },
    {
      id: 'aave-dai',
      title: 'Deposit DAI in Aave',
      risk: 'low',
      actions: [{ apy: 0.03 }],
      security: 100,
      networks: ['ethereum'],
      tokens: ['DAI']
    }
  ],
  cached: false,
  version: 'demo'
};

export const demoBalances = {
  address: '0x0000000000000000000000000000000000000000',
  portfolio: [],
  cached: false,
  version: 'demo'
};

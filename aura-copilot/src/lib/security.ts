const KNOWN_SCAM_PATTERNS = ['ponzi','guaranteed','100x','risk-free profit','get rich quick']
const HIGH_RISK_INDICATORS = ['unaudited','anonymous team','no contract verification']

export function analyzeSecurityRisk(strategy:any) {
  const text = JSON.stringify(strategy).toLowerCase()
  const warnings:string[] = []
  let score = 100
  for (const p of KNOWN_SCAM_PATTERNS) if (text.includes(p)) { warnings.push(`Contains suspicious keyword: "${p}"`); score -= 30 }
  for (const i of HIGH_RISK_INDICATORS) if (text.includes(i)) { warnings.push(`Risk indicator: ${i}`); score -= 15 }
  if ((strategy?.risk||'').toLowerCase()==='high') { warnings.push('Strategy marked as high risk'); score -= 20 }

  score = Math.max(0, Math.min(100, score))
  const level:'safe'|'caution'|'danger' = score>=70 ? 'safe' : score>=40 ? 'caution' : 'danger'
  return { score, warnings, level }
}

// Optional: contract verification check (Etherscan/Arbiscan/Basescan)
export async function isVerified(address:string, chain:'ethereum'|'arbitrum'|'base'='ethereum') {
  const key = process.env.ETHERSCAN_KEY || ''
  const hosts = { ethereum:'api.etherscan.io', arbitrum:'api.arbiscan.io', base:'api.basescan.org' }
  const host = hosts[chain]
  const res = await fetch(`https://${host}/api?module=contract&action=getabi&address=${address}&apikey=${key}`)
  const json = await res.json().catch(()=>null)
  return json?.status === '1'
}


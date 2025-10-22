// src/lib/security.ts

// Very lightweight security heuristic; safe to run client/server.
const KNOWN_SCAM_PATTERNS = [
  'ponzi', 'guaranteed', '100x', 'risk-free', 'risk free', 'get rich quick'
];

const HIGH_RISK_INDICATORS = [
  'unaudited', 'anonymous team', 'no contract verification', 'no docs'
];

export type SecurityAssessment = {
  score: number;               // 0-100: higher == safer
  warnings: string[];
  level: 'safe' | 'caution' | 'danger';
};

export function analyzeSecurityRisk(strategy: unknown): SecurityAssessment {
  const text = JSON.stringify(strategy ?? {}).toLowerCase();

  const warnings: string[] = [];
  let score = 100;

  for (const p of KNOWN_SCAM_PATTERNS) {
    if (text.includes(p)) { warnings.push(`Contains suspicious keyword: "${p}"`); score -= 30; }
  }
  for (const p of HIGH_RISK_INDICATORS) {
    if (text.includes(p)) { warnings.push(`Risk indicator: ${p}`); score -= 15; }
  }

  // crude risk field check
  if (text.includes('"risk":"high"') || text.includes('risk":"opportunistic"')) {
    warnings.push('Strategy marked as high risk/opportunistic');
    score -= 20;
  }

  // platforms present?
  if (!/platforms":\s*\[/.test(text)) {
    warnings.push('No verified platforms listed');
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));
  const level: SecurityAssessment['level'] =
    score >= 70 ? 'safe' : score >= 40 ? 'caution' : 'danger';

  return { score, warnings, level };
}


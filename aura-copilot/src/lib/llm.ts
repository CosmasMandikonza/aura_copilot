import Anthropic from '@anthropic-ai/sdk'

const MODEL          = process.env.ANTHROPIC_MODEL || 'claude-3-7-sonnet-20250219'
const FALLBACK_MODEL = process.env.ANTHROPIC_FALLBACK_MODEL || 'claude-3-5-haiku-20241022'
const RPM_BUDGET     = Math.max(1, Number(process.env.ANTHROPIC_RPM_BUDGET || 60)) // requests/minute
const MAX_CONCURRENCY = 3

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

/**
 * Simple token-bucket style limiter:
 * - caps requests/min (RPM_BUDGET)
 * - caps concurrent requests (MAX_CONCURRENCY)
 */
class RateLimiter {
  private tokens = RPM_BUDGET
  private lastRefill = Date.now()
  private running = 0
  private queue: Array<() => void> = []

  constructor() {
    setInterval(() => this.refill(), 1000)
  }

  private refill() {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000
    const add = Math.floor((RPM_BUDGET / 60) * elapsed)
    if (add > 0) {
      this.tokens = Math.min(RPM_BUDGET, this.tokens + add)
      this.lastRefill = now
      this.drain()
    }
  }

  private drain() {
    while (
      this.queue.length &&
      this.tokens > 0 &&
      this.running < MAX_CONCURRENCY
    ) {
      this.tokens -= 1
      this.running += 1
      const next = this.queue.shift()!
      next()
    }
  }

  schedule<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const run = () => {
        fn()
          .then((v) => resolve(v))
          .catch((e) => reject(e))
          .finally(() => {
            this.running -= 1
            this.drain()
          })
      }
      this.queue.push(run)
      this.drain()
    })
  }
}

const limiter = new RateLimiter()

/**
 * Retry wrapper w/ exponential backoff + jitter for 429/5xx
 */
async function withRetries<T>(op: () => Promise<T>, max = 4): Promise<T> {
  let attempt = 0
  let lastErr: any
  while (attempt < max) {
    try {
      return await op()
    } catch (err: any) {
      const status = err?.status || err?.response?.status
      lastErr = err
      // retry on 429 or 5xx
      if (status === 429 || (status >= 500 && status < 600)) {
        const base = 400; // ms
        const wait = Math.min(5000, base * 2 ** attempt) + Math.random() * 250
        await new Promise((r) => setTimeout(r, wait))
        attempt++
        continue
      }
      break
    }
  }
  throw lastErr
}

/**
 * High-level helper: safe message call
 */
export async function safeClaudeMessage(opts: {
  system?: string
  user: string
  maxTokens?: number
}) {
  const maxTokens = opts.maxTokens ?? 800
  // 1) try primary model
  try {
    return await limiter.schedule(() =>
      withRetries(async () => {
        const msg = await anthropic.messages.create({
          model: MODEL,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: opts.user }],
          ...(opts.system ? { system: opts.system } : {}),
        })
        return msg
      })
    )
  } catch (e) {
    // 2) fallback model
    return await limiter.schedule(() =>
      withRetries(async () => {
        const msg = await anthropic.messages.create({
          model: FALLBACK_MODEL,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: opts.user }],
          ...(opts.system ? { system: opts.system } : {}),
        })
        return msg
      })
    )
  }
}

/** Convenience: extract plain text from message */
export function messageToText(m: any): string {
  const c = m?.content?.[0]
  if (c?.type === 'text') return c.text
  try { return JSON.stringify(m?.content ?? m) } catch { return '' }
}

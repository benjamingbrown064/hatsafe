import { NextResponse } from 'next/server';

// In-memory fallback rate limiter (per-process, not distributed)
// When UPSTASH_REDIS_REST_URL is set, use Upstash for distributed rate limiting.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

type RateLimitTier = 'general' | 'upload' | 'extraction' | 'auth';

const LIMITS: Record<RateLimitTier, { limit: number; windowMs: number }> = {
  general: { limit: 100, windowMs: 60 * 1000 },          // 100/min per user
  upload: { limit: 20, windowMs: 60 * 1000 },             // 20/min per user
  extraction: { limit: 10, windowMs: 60 * 60 * 1000 },   // 10/hour per org
  auth: { limit: 5, windowMs: 60 * 1000 },                // 5/min per IP
};

export async function checkRateLimit(
  identifier: string,
  tier: RateLimitTier = 'general'
): Promise<{ success: boolean; response?: NextResponse }> {
  const { limit, windowMs } = LIMITS[tier];
  const key = `rl:${tier}:${identifier}`;

  // Try Upstash if configured
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit');
      const { Redis } = await import('@upstash/redis');
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowMs}ms`),
        prefix: 'hatsafe',
      });
      const result = await ratelimit.limit(key);
      if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Too many requests', retryAfter },
            {
              status: 429,
              headers: {
                'Retry-After': String(retryAfter),
                'X-RateLimit-Limit': String(limit),
                'X-RateLimit-Remaining': '0',
              },
            }
          ),
        };
      }
      return { success: true };
    } catch {
      // Fall through to in-memory
    }
  }

  const result = inMemoryRateLimit(key, limit, windowMs);
  if (!result.success) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Too many requests', retryAfter },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      ),
    };
  }
  return { success: true };
}

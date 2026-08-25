import { redis } from './redis';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Lightweight sliding window rate limiter using Upstash Redis.
 *
 * @param identifier - Unique ID (e.g. IP address or user ID)
 * @param limit - Maximum requests allowed in the window (default: 10)
 * @param windowSeconds - Window duration in seconds (default: 60)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  try {
    const key = `ratelimit:${identifier}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);
    const reset = Date.now() + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000);
    const remaining = Math.max(0, limit - current);

    return {
      success: current <= limit,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.warn('Rate limiting failed, allowing request as fallback:', error);
    // Graceful fallback if Redis is unreachable
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Date.now() + windowSeconds * 1000,
    };
  }
}

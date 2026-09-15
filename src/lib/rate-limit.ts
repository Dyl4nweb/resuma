export class RateLimiter {
  private cache = new Map<string, { count: number; resetTime: number }>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  public check(ip: string): { success: boolean; limit: number; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.cache.get(ip);

    if (!entry) {
      const resetTime = now + this.windowMs;
      this.cache.set(ip, { count: 1, resetTime });
      this.cleanup();
      return { success: true, limit: this.maxRequests, remaining: this.maxRequests - 1, resetTime };
    }

    if (now > entry.resetTime) {
      const resetTime = now + this.windowMs;
      this.cache.set(ip, { count: 1, resetTime });
      this.cleanup();
      return { success: true, limit: this.maxRequests, remaining: this.maxRequests - 1, resetTime };
    }

    if (entry.count >= this.maxRequests) {
      return { success: false, limit: this.maxRequests, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count += 1;
    return { success: true, limit: this.maxRequests, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
  }

  private cleanup() {
    // Only cleanup every 100 checks or so to avoid performance hit on every request
    if (Math.random() < 0.05) {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (now > value.resetTime) {
          this.cache.delete(key);
        }
      }
    }
  }
}

// 5 registrations per IP per hour
export const registerRateLimiter = new RateLimiter(5, 60 * 60 * 1000);

// 20 resume creations per minute
export const resumeRateLimiter = new RateLimiter(20, 60 * 1000);

// 5 manual payments per 15 mins
export const manualPaymentRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

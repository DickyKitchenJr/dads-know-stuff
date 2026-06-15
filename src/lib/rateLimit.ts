type RateLimitEntry = {
  count: number;
  windowStartedAt: number;
};

type RateLimitOptions = {
  key: string;
  maxRequests: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

declare global {
  var rateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const rateLimitStore =
  global.rateLimitStore ?? new Map<string, RateLimitEntry>();

if (!global.rateLimitStore) {
  global.rateLimitStore = rateLimitStore;
}

function cleanupExpiredEntries(now: number, windowMs: number) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStartedAt > windowMs * 2) {
      rateLimitStore.delete(key);
    }
  }
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const { key, maxRequests, windowMs } = options;

  cleanupExpiredEntries(now, windowMs);

  const existingEntry = rateLimitStore.get(key);

  if (!existingEntry || now - existingEntry.windowStartedAt >= windowMs) {
    rateLimitStore.set(key, { count: 1, windowStartedAt: now });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existingEntry.count >= maxRequests) {
    const retryAfterMs = Math.max(
      0,
      existingEntry.windowStartedAt + windowMs - now,
    );

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  existingEntry.count += 1;
  rateLimitStore.set(key, existingEntry);

  return {
    allowed: true,
    remaining: maxRequests - existingEntry.count,
    retryAfterSeconds: Math.ceil(
      (existingEntry.windowStartedAt + windowMs - now) / 1000,
    ),
  };
}

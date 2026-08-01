import { createHmac, timingSafeEqual } from "node:crypto";

type EnvMap = Record<string, string | undefined>;

type RuntimeLike = {
  process?: {
    env?: EnvMap;
  };
};

type AttemptWindow = {
  count: number;
  resetAt: number;
};

type CooldownState = {
  until: number;
  failures: number;
};

const attemptsByKey = new Map<string, AttemptWindow>();
const cooldownByKey = new Map<string, CooldownState>();

const WINDOW_MS = 60_000;
const MAX_LOGIN_ATTEMPTS_PER_WINDOW = 5;
const FAILED_LOGIN_COOLDOWN_MS = 3_000;
const CAPTCHA_AFTER_FAILURES = 3;

const getEnv = (): EnvMap => {
  const runtime = globalThis as RuntimeLike;
  return runtime.process?.env ?? {};
};

export const getRequiredEnv = (name: "ADMIN_SECRET" | "JWT_SECRET" | "VITE_SUPABASE_URL" | "VITE_SUPABASE_PUBLISHABLE_KEY") => {
  const value = getEnv()[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const getClientIp = (req: { headers?: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }) => {
  const xForwardedFor = req.headers?.["x-forwarded-for"];
  const rawHeader = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
  if (rawHeader) {
    return rawHeader.split(",")[0]?.trim() || "unknown";
  }
  return req.socket?.remoteAddress || "unknown";
};

const stableKey = (prefix: string, ip: string) => {
  const secret = getRequiredEnv("JWT_SECRET");
  return createHmac("sha256", secret).update(`${prefix}:${ip}`).digest("hex");
};

export const consumeRateLimit = (ip: string) => {
  const now = Date.now();
  const key = stableKey("rate-limit", ip);
  const existing = attemptsByKey.get(key);

  if (!existing || existing.resetAt <= now) {
    attemptsByKey.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true as const };
  }

  if (existing.count >= MAX_LOGIN_ATTEMPTS_PER_WINDOW) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { ok: false as const, retryAfterSec };
  }

  attemptsByKey.set(key, { ...existing, count: existing.count + 1 });
  return { ok: true as const };
};

export const checkCooldown = (ip: string) => {
  const now = Date.now();
  const key = stableKey("cooldown", ip);
  const existing = cooldownByKey.get(key);

  if (!existing || existing.until <= now) {
    return { ok: true as const };
  }

  const retryAfterSec = Math.max(1, Math.ceil((existing.until - now) / 1000));
  return { ok: false as const, retryAfterSec, failures: existing.failures };
};

export const markFailedLogin = (ip: string) => {
  const key = stableKey("cooldown", ip);
  const existing = cooldownByKey.get(key);
  const failures = (existing?.failures ?? 0) + 1;

  cooldownByKey.set(key, {
    failures,
    until: Date.now() + FAILED_LOGIN_COOLDOWN_MS,
  });

  return { failures, captchaRequired: failures >= CAPTCHA_AFTER_FAILURES };
};

export const clearFailedLogins = (ip: string) => {
  const key = stableKey("cooldown", ip);
  cooldownByKey.delete(key);
};

export const verifyAdminSecret = (input: string | undefined) => {
  if (!input) {
    return false;
  }

  const expected = Buffer.from(getRequiredEnv("ADMIN_SECRET"));
  const provided = Buffer.from(input);

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
};

export const verifyCaptchaPlaceholder = (answer: string | undefined) => {
  // Placeholder captcha: keep logic intentionally simple and server-side.
  return (answer ?? "").trim() === "7";
};

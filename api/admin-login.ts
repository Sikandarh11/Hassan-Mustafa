import {
  checkCooldown,
  clearFailedLogins,
  consumeRateLimit,
  getClientIp,
  getRequiredEnv,
  markFailedLogin,
  verifyCaptchaPlaceholder,
} from "./_lib/security.js";

type VercelReq = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
};

type VercelRes = {
  status: (code: number) => VercelRes;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type LoginPayload = {
  email?: string;
  password?: string;
  captchaAnswer?: string;
};

const INVALID_CREDENTIALS = "Invalid credentials";

const mapSupabaseAuthErrorMessage = (authData: Record<string, unknown>) => {
  const rawMessage =
    typeof authData.error_description === "string"
      ? authData.error_description
      : typeof authData.message === "string"
        ? authData.message
        : typeof authData.error === "string"
          ? authData.error
          : "";

  const normalized = rawMessage.toLowerCase();
  if (normalized.includes("email not confirmed") || normalized.includes("email not verified")) {
    return "Email not confirmed. Check your inbox/spam and click the confirmation link.";
  }

  // Keep credential failures intentionally generic.
  if (normalized.includes("invalid") || normalized.includes("credentials") || normalized.includes("grant")) {
    return INVALID_CREDENTIALS;
  }

  return rawMessage || INVALID_CREDENTIALS;
};

const normalizePayload = (body: unknown): LoginPayload => {
  if (!body || typeof body !== "object") {
    return {};
  }
  return body as LoginPayload;
};

export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const supabaseUrl = getRequiredEnv("VITE_SUPABASE_URL");
    const supabaseAnonKey = getRequiredEnv("VITE_SUPABASE_PUBLISHABLE_KEY");
    getRequiredEnv("JWT_SECRET");

    const ip = getClientIp(req);

    const rateLimit = consumeRateLimit(ip);
    if (!rateLimit.ok) {
      res.status(429).json({ message: "Too many login attempts", retryAfterSec: rateLimit.retryAfterSec });
      return;
    }

    const cooldown = checkCooldown(ip);
    if (!cooldown.ok) {
      res.status(429).json({ message: "Too many login attempts", retryAfterSec: cooldown.retryAfterSec });
      return;
    }

    const payload = normalizePayload(req.body);
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password ?? "";

    if (!email || !password) {
      res.status(400).json({ message: INVALID_CREDENTIALS });
      return;
    }

    if ((cooldown.failures ?? 0) >= 3 && !verifyCaptchaPlaceholder(payload.captchaAnswer)) {
      res.status(400).json({
        message: "Captcha verification required",
        captchaRequired: true,
        captchaQuestion: "What is 3 + 4?",
      });
      return;
    }

    const authResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({ email, password }),
    });

    const authData = await authResponse.json().catch(() => ({} as Record<string, unknown>));

    if (!authResponse.ok) {
      const message = mapSupabaseAuthErrorMessage(authData as Record<string, unknown>);
      const failure = markFailedLogin(ip);
      res.status(401).json({
        message,
        captchaRequired: failure.captchaRequired,
        captchaQuestion: failure.captchaRequired ? "What is 3 + 4?" : undefined,
      });
      return;
    }

    clearFailedLogins(ip);

    const accessToken = typeof authData.access_token === "string" ? authData.access_token : "";
    const refreshToken = typeof authData.refresh_token === "string" ? authData.refresh_token : "";

    if (!accessToken || !refreshToken) {
      res.status(401).json({ message: INVALID_CREDENTIALS });
      return;
    }

    res.status(200).json({
      session: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch {
    res.status(500).json({ message: "Authentication service unavailable" });
  }
}

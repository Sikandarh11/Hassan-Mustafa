import { consumeRateLimit, getClientIp, getRequiredEnv, verifyAdminSecret } from "./_lib/security.js";

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

type SignupPayload = {
  email?: string;
  password?: string;
  adminSecret?: string;
};

const normalizePayload = (body: unknown): SignupPayload => {
  if (!body || typeof body !== "object") {
    return {};
  }
  return body as SignupPayload;
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
    getRequiredEnv("ADMIN_SECRET");

    const ip = getClientIp(req);
    const rateLimit = consumeRateLimit(ip);

    if (!rateLimit.ok) {
      res.status(429).json({ message: "Too many requests", retryAfterSec: rateLimit.retryAfterSec });
      return;
    }

    const payload = normalizePayload(req.body);
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password ?? "";

    if (!email || !password) {
      res.status(400).json({ message: "Invalid signup request" });
      return;
    }

    if (!verifyAdminSecret(payload.adminSecret)) {
      res.status(403).json({ message: "Unauthorized signup attempt" });
      return;
    }

    const signUpResponse = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!signUpResponse.ok) {
      const errorBody = await signUpResponse.json().catch(() => ({}));
      const errorMessage =
        typeof errorBody?.message === "string"
          ? errorBody.message
          : typeof errorBody?.error_description === "string"
            ? errorBody.error_description
            : typeof errorBody?.error === "string"
              ? errorBody.error
              : "Signup failed";

      const status = signUpResponse.status >= 400 && signUpResponse.status < 600 ? signUpResponse.status : 400;
      res.status(status).json({ message: errorMessage });
      return;
    }

    res.status(200).json({ message: "Signup accepted. Check your email to confirm your account." });
  } catch {
    res.status(500).json({ message: "Signup service unavailable" });
  }
}

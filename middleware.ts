import type { IncomingMessage } from "node:http";

type RuntimeLike = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

type ReqLike = IncomingMessage & {
  url?: string;
  method?: string;
};

type ResLike = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (chunk?: string) => void;
};

const env = (globalThis as RuntimeLike).process?.env ?? {};

const json = (res: ResLike, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

// Vercel style middleware export.
export default function middleware(req: ReqLike, res: ResLike) {
  if (!req.url?.startsWith("/api/")) {
    return;
  }

  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");

  if (req.url.startsWith("/api/admin-signup") && !env.ADMIN_SECRET) {
    json(res, 503, { message: "Signup is disabled by server configuration" });
    return;
  }

  if ((req.url.startsWith("/api/admin-signup") || req.url.startsWith("/api/admin-login")) && req.method !== "POST") {
    json(res, 405, { message: "Method not allowed" });
  }
}

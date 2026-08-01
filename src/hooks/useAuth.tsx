import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, captchaAnswer?: string) => Promise<{ error: Error | null; captchaRequired?: boolean; retryAfterSec?: number }>;
  signUp: (email: string, password: string, adminSecret: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isLocalhost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInDirectLocal = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return { error: new Error("Invalid credentials") };
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string, captchaAnswer?: string) => {
    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, captchaAnswer }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        if (isLocalhost) {
          return await signInDirectLocal(email, password);
        }
        return { error: new Error("Authentication service unavailable") };
      }

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = typeof payload?.message === "string" ? payload.message : "Invalid credentials";
        const retryAfterSec = typeof payload?.retryAfterSec === "number" ? payload.retryAfterSec : undefined;
        const captchaRequired = payload?.captchaRequired === true;
        return { error: new Error(message), retryAfterSec, captchaRequired };
      }

      const accessToken = payload?.session?.access_token;
      const refreshToken = payload?.session?.refresh_token;

      if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
        return { error: new Error("Invalid credentials") };
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        return { error: new Error("Invalid credentials") };
      }

      return { error: null };
    } catch {
      if (isLocalhost) {
        return await signInDirectLocal(email, password);
      }
      return { error: new Error("Authentication service unavailable") };
    }
  };

  const signUp = async (email: string, password: string, adminSecret: string) => {
    try {
      // For localhost, bypass API and sign up directly if admin secret is correct
      if (isLocalhost) {
        const correctSecret = import.meta.env.VITE_ADMIN_SECRET || "test-admin-secret";
        if (adminSecret !== correctSecret) {
          return { error: new Error("Invalid admin secret") };
        }
        
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          return { error: new Error(error.message || "Signup failed") };
        }
        return { error: null };
      }

      // For production, use API endpoint
      const response = await fetch("/api/admin-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, adminSecret }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return { error: new Error("Signup service unavailable") };
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message =
          typeof payload?.message === "string"
            ? payload.message
            : typeof payload?.error_description === "string"
              ? payload.error_description
              : typeof payload?.error === "string"
                ? payload.error
                : "Signup failed";
        return { error: new Error(message) };
      }

      return { error: null };
    } catch {
      return { error: new Error("Signup service unavailable") };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

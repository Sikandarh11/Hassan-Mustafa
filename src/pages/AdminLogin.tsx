import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, LogIn } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [localCooldownUntil, setLocalCooldownUntil] = useState(0);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() < localCooldownUntil) {
      setError("Please wait a moment before trying again.");
      return;
    }

    setError("");
    setLoading(true);
    const result = isSignUp
      ? await signUp(email, password, adminSecret)
      : await signIn(email, password, captchaAnswer);

    setLoading(false);
    if (result.error) {
      if (!isSignUp) {
        setCaptchaRequired(Boolean(result.captchaRequired));
        const retryAfterSec = result.retryAfterSec ?? 3;
        setLocalCooldownUntil(Date.now() + retryAfterSec * 1000);
      }
      setError(result.error.message);
    } else if (!isSignUp) {
      navigate("/admin");
    } else {
      setAdminSecret("");
      setError("Signup submitted. Check your inbox/spam for a confirmation email, then log in.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Cloud className="mx-auto text-primary mb-3" size={40} />
          <h1 className="text-2xl font-semibold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your portfolio</p>
        </div>
        <form onSubmit={handleSubmit} className="card-surface p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1" />
          </div>
          {isSignUp && (
            <div>
              <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Admin Secret</label>
              <Input
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                type="password"
                required
                className="mt-1"
              />
            </div>
          )}
          {!isSignUp && captchaRequired && (
            <div>
              <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Captcha: What is 3 + 4?</label>
              <Input
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn size={16} />
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setCaptchaRequired(false);
              setCaptchaAnswer("");
              setAdminSecret("");
            }}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

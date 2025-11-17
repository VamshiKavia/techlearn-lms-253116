import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Common Supabase messages are user-friendly; add fallback
        setErr(error.message || "Login failed. Please check your credentials.");
        return;
      }
      // Determine role from JWT/app_metadata
      const role =
        (data.session?.user?.app_metadata as any)?.role ||
        (data.session?.user?.user_metadata as any)?.role ||
        "student";
      if (role === "admin") nav("/admin/overview", { replace: true });
      else if (role === "instructor") nav("/instructor/overview", { replace: true });
      else nav("/student/overview", { replace: true });
    } catch (ex: any) {
      setErr(ex?.message || "Unexpected error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "4rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" autoComplete="email" />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" autoComplete="current-password" />
        </div>
        {err && <p style={{ color: "red" }}>{err}</p>}
        <button disabled={loading} type="submit">{loading ? "Signing in..." : "Login"}</button>
      </form>
    </div>
  );
}

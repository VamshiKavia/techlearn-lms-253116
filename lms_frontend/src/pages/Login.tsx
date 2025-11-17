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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    // Determine role from JWT
    const role =
      (data.session?.user?.app_metadata as any)?.role ||
      (data.session?.user?.user_metadata as any)?.role ||
      "student";
    if (role === "admin") nav("/admin/overview");
    else if (role === "instructor") nav("/instructor/overview");
    else nav("/student/overview");
  };

  return (
    <div style={{ maxWidth: 360, margin: "4rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
        </div>
        {err && <p style={{ color: "red" }}>{err}</p>}
        <button disabled={loading} type="submit">{loading ? "..." : "Login"}</button>
      </form>
    </div>
  );
}

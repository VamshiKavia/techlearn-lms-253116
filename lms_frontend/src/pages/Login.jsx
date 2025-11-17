import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMsg(error.message);
      return;
    }
    if (data?.session) {
      navigate("/dashboard");
    } else {
      setMsg("Unexpected response. Check Supabase configuration.");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 24, border: "1px solid #E5E7EB", borderRadius: 8, background: "#FFFFFF" }}>
      <h2 style={{ marginTop: 0, color: "#111827" }}>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Email</div>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }}/>
        </label>
        <label>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Password</div>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }}/>
        </label>
        <button type="submit" style={{ background: "#374151", color: "#fff", padding: "10px 14px", border: "none", borderRadius: 6, cursor: "pointer" }}>Sign in</button>
      </form>
      {msg && <div style={{ marginTop: 12, color: "#EF4444" }}>{msg}</div>}
      <p style={{ fontSize: 12, color: "#6B7280", marginTop: 16 }}>
        Note: Sign up should be done via Supabase-hosted flows or separate UI; backend trusts Supabase JWTs.
      </p>
    </div>
  );
}

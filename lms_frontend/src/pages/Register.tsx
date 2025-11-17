import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
        emailRedirectTo:
          (import.meta as any)?.env?.VITE_SITE_URL ||
          process.env.REACT_APP_SITE_URL ||
          window.location.origin,
      },
    });
    if (error) {
      setErr(error.message);
    } else {
      setMsg("Check your email to confirm your account.");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "4rem auto" }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
        </div>
        {err && <p style={{ color: "red" }}>{err}</p>}
        {msg && <p>{msg}</p>}
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}

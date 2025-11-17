import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setError("Not authenticated. Please login.");
        return;
      }
      try {
        const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
        const res = await fetch(`${base}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const me = await res.json();
        setProfile(me);
      } catch (e) {
        setError("Failed to load profile.");
      }
    }
    load();
  }, []);

  return (
    <div>
      <h2 style={{ color: "#111827" }}>Dashboard</h2>
      {error && <div style={{ color: "#EF4444" }}>{error}</div>}
      {profile ? (
        <div style={{ marginTop: 12, padding: 16, border: "1px solid #E5E7EB", borderRadius: 8 }}>
          <div><strong>Email:</strong> {profile.email}</div>
          <div><strong>Name:</strong> {profile.name || "-"}</div>
          <div><strong>Role:</strong> {profile.role}</div>
        </div>
      ) : !error ? (
        <div>Loading...</div>
      ) : null}
    </div>
  );
}

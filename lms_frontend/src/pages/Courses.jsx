import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../lib/supabaseClient.js";
import { apiGet } from "../lib/api.js";

export default function Courses() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        // List courses is public to authenticated roles with DB enabled (require_db only)
        const data = await apiGet("/courses", token);
        setItems(data);
      } catch (e) {
        setErr("Failed to load courses. Is backend running and DB configured?");
      }
    }
    load();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems:"center", justifyContent: "space-between" }}>
        <h2 style={{ color: "#111827" }}>Courses</h2>
        <Link to="/courses/new" style={{ background: "#10B981", color:"#fff", padding:"8px 12px", borderRadius:6, textDecoration:"none" }}>
          Create Course
        </Link>
      </div>
      {err && <div style={{ color: "#EF4444", marginTop: 8 }}>{err}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginTop: 16 }}>
        {items.map(c => (
          <div key={c.id} style={{ border:"1px solid #E5E7EB", borderRadius:8, padding:16, background:"#FFFFFF" }}>
            <div style={{ fontWeight:600, color:"#111827" }}>{c.title}</div>
            <div style={{ fontSize:14, color:"#6B7280", marginTop:4 }}>{c.description || "No description"}</div>
            <div style={{ marginTop:8, fontSize:12, color:"#6B7280" }}>Categories: {Array.isArray(c.categories) ? c.categories.join(", ") : "-"}</div>
          </div>
        ))}
        {items.length === 0 && !err && <div style={{ color:"#6B7280" }}>No courses yet.</div>}
      </div>
    </div>
  );
}

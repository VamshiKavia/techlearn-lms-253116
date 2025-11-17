import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { apiPost } from "../lib/api";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [categories, setCategories] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
      setMsg("Please login first.");
      return;
    }
    try {
      const body = {
        title,
        description: description || null,
        categories: categories ? categories.split(",").map(s=>s.trim()).filter(Boolean) : []
      };
      await apiPost("/courses", body, token);
      navigate("/courses");
    } catch (e) {
      setMsg("Failed to create course. Ensure your role is instructor/admin and DB is configured.");
    }
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ color:"#111827" }}>Create Course</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Title</div>
          <input value={title} onChange={e=>setTitle(e.target.value)} required style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }}/>
        </label>
        <label>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Description</div>
          <textarea value={description} onChange={e=>setDesc(e.target.value)} rows={4} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }} />
        </label>
        <label>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Categories (comma separated)</div>
          <input value={categories} onChange={e=>setCategories(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #D1D5DB", borderRadius: 6 }}/>
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ background: "#374151", color: "#fff", padding: "10px 14px", border: "none", borderRadius: 6, cursor: "pointer" }}>Create</button>
          <button type="button" onClick={()=>navigate("/courses")} style={{ background: "#9CA3AF", color: "#fff", padding: "10px 14px", border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
        </div>
      </form>
      {msg && <div style={{ color:"#EF4444", marginTop: 12 }}>{msg}</div>}
    </div>
  );
}

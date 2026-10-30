import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(setStats).catch(()=>{});
  }, [token]);

  const cards = stats ? [
    { icon:"ðŸ’", label:"Total Donations", value:stats.donations, sub:"All time", color:"#3b82f6", bg:"#eff6ff", link:"/admin/donations" },
    { icon:"💰", label:"Money Collected", value:`₹${(stats.totalMoney||0).toLocaleString("en-IN")}`, sub:"Verified payments", color:"#10b981", bg:"#ecfdf5", link:"/admin/donations" },
    { icon:"🌟", label:"Volunteers",      value:stats.volunteers, sub:"Applications received", color:"#f59e0b", bg:"#fffbeb", link:"/admin/volunteers" },
    { icon:"âœ‰ï¸", label:"Messages",        value:stats.contacts,  sub:"Contact submissions", color:"#8b5cf6", bg:"#f5f3ff", link:"/admin/contacts" },
    { icon:"📅", label:"Events",          value:stats.events,    sub:"Created & managed", color:"#ef4444", bg:"#fef2f2", link:"/admin/events" },
  ] : [];

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0f172a", margin:0 }}>Good {getGreeting()} 👋</h1>
        <p style={{ color:"#64748b", fontSize:14, margin:"6px 0 0" }}>Here's what's happening at Smile Foundation today.</p>
      </div>

      {!stats ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#94a3b8" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>â³</div>
          <p>Loading stats...</p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
            {cards.map(({ icon, label, value, sub, color, bg, link }) => (
              <a key={label} href={link} style={{ textDecoration:"none" }}>
                <div style={{
                  background:"white", borderRadius:20, padding:"22px 20px",
                  border:"1px solid #f1f5f9",
                  boxShadow:"0 2px 12px rgba(0,0,0,0.04)",
                  transition:"all 0.2s", cursor:"pointer",
                  display:"block",
                }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04)"}
                >
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                      {icon}
                    </div>
                    <span style={{ fontSize:10, color:color, fontWeight:700, background:bg, padding:"4px 8px", borderRadius:20 }}>
                      VIEW →
                    </span>
                  </div>
                  <p style={{ margin:"0 0 4px", fontSize:28, fontWeight:900, color:"#0f172a" }}>{value}</p>
                  <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:"#334155" }}>{label}</p>
                  <p style={{ margin:0, fontSize:11, color:"#94a3b8" }}>{sub}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ background:"white", borderRadius:20, padding:"24px", border:"1px solid #f1f5f9", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:800, color:"#0f172a" }}>Quick Actions</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10 }}>
              {[
                { label:"Add Event", icon:"📅", href:"/admin/events" },
                { label:"View Messages", icon:"âœ‰ï¸", href:"/admin/contacts" },
                { label:"Review Volunteers", icon:"🌟", href:"/admin/volunteers" },
                { label:"See Donations", icon:"ðŸ’", href:"/admin/donations" },
              ].map(({ label, icon, href }) => (
                <a key={label} href={href}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"12px 14px", borderRadius:14,
                    border:"1.5px solid #e2e8f0", textDecoration:"none",
                    color:"#334155", fontSize:13, fontWeight:700,
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor="#004B8D"; e.currentTarget.style.color="#004B8D"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#334155"; }}
                >
                  <span style={{ fontSize:20 }}>{icon}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to:"/dashboard", label:"Dashboard",  icon:"📊" },
  { to:"/donations",  label:"Donations",  icon:"💝" },
  { to:"/contacts",   label:"Messages",   icon:"✉️" },
  { to:"/volunteers", label:"Volunteers", icon:"🌟" },
  { to:"/events",     label:"Events",     icon:"📅" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Segoe UI',sans-serif", background:"#f1f5f9" }}>
      <style>{`
        .nav-link:hover { background: rgba(255,255,255,0.08) !important; }
        .logout-btn:hover { background: rgba(239,68,68,0.15) !important; color: #f87171 !important; }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        display:"flex", flexDirection:"column",
        boxShadow:"4px 0 24px rgba(0,0,0,0.15)",
        position:"sticky", top:0, height:"100vh", flexShrink:0,
      }}>
        {/* Logo area */}
        <div style={{ padding:"28px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🛡️</div>
            <div>
              <p style={{ margin:0, color:"white", fontWeight:900, fontSize:14, lineHeight:1.2 }}>Admin Panel</p>
              <p style={{ margin:0, color:"#64748b", fontSize:11 }}>Smile Foundation</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"white", flexShrink:0 }}>
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div style={{ overflow:"hidden" }}>
              <p style={{ margin:0, color:"#e2e8f0", fontSize:13, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.name}</p>
              <p style={{ margin:0, color:"#475569", fontSize:11, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"16px 12px", overflowY:"auto" }}>
          <p style={{ color:"#334155", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", margin:"0 8px 10px" }}>Navigation</p>
          {links.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className={active ? "" : "nav-link"}
                style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"11px 12px", borderRadius:12, marginBottom:4,
                  textDecoration:"none",
                  background: active ? "rgba(245,158,11,0.15)" : "transparent",
                  border: active ? "1px solid rgba(245,158,11,0.3)" : "1px solid transparent",
                  color: active ? "#f59e0b" : "#94a3b8",
                  fontWeight: active ? 700 : 500,
                  fontSize:14,
                  transition:"all 0.15s",
                }}>
                <span style={{ fontSize:18, lineHeight:1 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding:"12px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={handleLogout} className="logout-btn"
            style={{
              width:"100%", display:"flex", alignItems:"center", gap:12,
              padding:"11px 12px", borderRadius:12,
              background:"transparent", border:"none", cursor:"pointer",
              color:"#64748b", fontSize:14, fontWeight:600,
              fontFamily:"inherit", transition:"all 0.15s",
            }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflow:"auto" }}>
        {/* Top bar */}
        <div style={{
          background:"white", borderBottom:"1px solid #e2e8f0",
          padding:"16px 28px", display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:10,
          boxShadow:"0 1px 8px rgba(0,0,0,0.05)",
        }}>
          <div>
            <h2 style={{ margin:0, fontSize:20, fontWeight:900, color:"#0f172a" }}>
              {links.find(l => l.to === location.pathname)?.icon}{" "}
              {links.find(l => l.to === location.pathname)?.label || "Admin"}
            </h2>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ background:"#f59e0b", color:"white", fontSize:11, fontWeight:800, padding:"4px 10px", borderRadius:20 }}>
              ADMIN
            </div>
          </div>
        </div>

        <div style={{ padding:"28px", maxWidth:1100 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

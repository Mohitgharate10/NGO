import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to:"/dashboard",  label:"Dashboard",         icon:"🏠" },
  { to:"/apply",       label:"Apply to Volunteer", icon:"✋" },
  { to:"/history",     label:"My Applications",   icon:"📋" },
];

export default function VolunteerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); window.location.href = "/"; };
  const initials = user?.name?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) || "V";

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Segoe UI',sans-serif", background:"#f0fdf4" }}>
      <style>{`
        .vnav:hover { background: rgba(255,255,255,0.12) !important; }
        .vlogout:hover { background: rgba(239,68,68,0.15) !important; color:#fca5a5 !important; }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width:240, flexShrink:0,
        background:"linear-gradient(180deg,#065f46 0%,#047857 50%,#064e3b 100%)",
        display:"flex", flexDirection:"column",
        boxShadow:"4px 0 24px rgba(4,120,87,0.25)",
        position:"sticky", top:0, height:"100vh",
      }}>
        {/* Logo */}
        <div style={{ padding:"24px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:28 }}>🌿</div>
            <div>
              <p style={{ margin:0, color:"white", fontWeight:900, fontSize:14 }}>Volunteer Portal</p>
              <p style={{ margin:0, color:"rgba(255,255,255,0.5)", fontSize:11 }}>Smile Foundation</p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:40, height:40, borderRadius:"50%",
              background:"rgba(255,255,255,0.15)",
              border:"2px solid rgba(255,255,255,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:15, fontWeight:900, color:"white", flexShrink:0,
            }}>{initials}</div>
            <div style={{ overflow:"hidden" }}>
              <p style={{ margin:0, color:"white", fontSize:13, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.name}</p>
              <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80" }}/>
                <p style={{ margin:0, color:"rgba(255,255,255,0.45)", fontSize:11 }}>Volunteer Account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"14px 10px" }}>
          {links.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className={active ? "" : "vnav"}
                style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"11px 12px", borderRadius:12, marginBottom:4,
                  textDecoration:"none",
                  background: active ? "rgba(255,255,255,0.18)" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  fontWeight: active ? 700 : 500,
                  fontSize:14, transition:"all 0.15s",
                  borderLeft: active ? "3px solid rgba(255,255,255,0.8)" : "3px solid transparent",
                }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <a href="/" style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:12, textDecoration:"none", color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:4 }}>
            🌐 Public Site
          </a>
          <button onClick={handleLogout} className="vlogout"
            style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:12, background:"transparent", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.4)", fontSize:13, fontFamily:"inherit", transition:"all 0.15s" }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflow:"auto" }}>
        <div style={{ background:"white", borderBottom:"1px solid #d1fae5", padding:"16px 28px", position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
          <h2 style={{ margin:0, fontSize:18, fontWeight:900, color:"#047857" }}>
            {links.find(l=>l.to===location.pathname)?.icon}{" "}
            {links.find(l=>l.to===location.pathname)?.label}
          </h2>
        </div>
        <div style={{ padding:"28px", maxWidth:900 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function LoginPage({ portalRole = null }) {
  const defaultRole = portalRole || "donor";
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const isLocked = !!portalRole;

  const roles = [
    { id: "donor",     label: "Donor",     emoji: "ðŸ’", grad: "linear-gradient(135deg,#1e40af,#3b82f6)", accent: "#1d4ed8", ring: "#3b82f6", softBg: "#eff6ff" },
    { id: "volunteer", label: "Volunteer", emoji: "ðŸŒ¿", grad: "linear-gradient(135deg,#065f46,#10b981)", accent: "#047857", ring: "#10b981", softBg: "#ecfdf5" },
  ];
  const sel = roles.find(r => r.id === role) || roles[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      login(data.token, data.user);
      // Determine which portal file to open based on role
      const portalMap = {
        volunteer: "/volunteer.html#/dashboard",
        donor: "/donor.html#/dashboard",
      };
      const portalUrl = portalMap[data.user.role] || "/donor.html#/dashboard";
      window.open(portalUrl, "_blank");
      // Stay on the login page (or navigate back to home)
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Segoe UI',sans-serif" }}>
      <style>{`
        @media(min-width:1024px){.lg-show{display:flex!important}}
        .lg-hide{display:block}
        @media(min-width:1024px){.lg-hide{display:none!important}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .bobble{animation:floatY 3s ease-in-out infinite}
      `}</style>

      {/* Left hero */}
      <div className="lg-show" style={{ display:"none", width:"46%", background:sel.grad, flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 48px", position:"relative", overflow:"hidden", transition:"background 0.5s" }}>
        <div style={{ position:"absolute", top:-100, right:-100, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
        <div style={{ position:"absolute", bottom:-80, left:-80, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
        <div style={{ textAlign:"center", color:"white", maxWidth:320, position:"relative", zIndex:1 }}>
          <div className="bobble" style={{ fontSize:88, marginBottom:24 }}>{sel.emoji}</div>
          <h1 style={{ fontSize:44, fontWeight:900, lineHeight:1.1, margin:"0 0 14px", letterSpacing:"-1px" }}>Welcome<br/>Back</h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:15, lineHeight:1.7, margin:0 }}>
            {role === "donor" ? "Your generosity keeps us going. Every donation counts." : "Your time is the most precious gift. Thank you for volunteering."}
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:44 }}>
            {[["95K+","Lives Touched"],["3.2K+","Volunteers"],["â‚¹20L+","Raised"]].map(([n,l]) => (
              <div key={l}>
                <p style={{ fontSize:22, fontWeight:900, margin:0 }}>{n}</p>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.55)", margin:"3px 0 0", textTransform:"uppercase", letterSpacing:"0.4px" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 20px", background:"#f8fafc" }}>
        <div style={{ width:"100%", maxWidth:440 }}>
          {/* Mobile logo */}
          <div className="lg-hide" style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:36 }}>ðŸ¤</div>
            <h1 style={{ fontSize:20, fontWeight:900, color:"#0f172a", margin:"8px 0 0" }}>Smile Foundation</h1>
          </div>

          <div style={{ background:"white", borderRadius:28, boxShadow:"0 20px 60px rgba(0,0,0,0.08)", padding:"40px 36px" }}>
            <h2 style={{ fontSize:26, fontWeight:900, color:"#0f172a", margin:"0 0 4px" }}>Welcome back ðŸ‘‹</h2>
            <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 24px" }}>Sign in to continue making a difference</p>

            {/* Role toggle â€” only on main site login */}
            {!isLocked && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
                {roles.map(r => (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)}
                    style={{ padding:"14px 10px", borderRadius:14, border:role===r.id?`2px solid ${r.ring}`:"2px solid #f1f5f9", background:role===r.id?r.softBg:"#f8fafc", cursor:"pointer", outline:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:5, transition:"all 0.2s" }}>
                    <span style={{ fontSize:22 }}>{r.emoji}</span>
                    <span style={{ fontWeight:800, fontSize:13, color:"#1e293b" }}>{r.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Locked badge */}
            {isLocked && (
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:sel.softBg, borderRadius:14, marginBottom:24, border:`1px solid ${sel.ring}33` }}>
                <span style={{ fontSize:24 }}>{sel.emoji}</span>
                <div>
                  <p style={{ margin:0, fontWeight:800, fontSize:14, color:"#1e293b" }}>{sel.label} Portal</p>
                  <p style={{ margin:0, fontSize:12, color:"#64748b" }}>Sign in with your {sel.label.toLowerCase()} account</p>
                </div>
              </div>
            )}

            {error && (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", borderRadius:12, padding:"12px 16px", fontSize:13, marginBottom:18 }}>
                âš ï¸ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:7 }}>Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required
                  style={{ width:"100%", padding:"13px 16px", background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border 0.2s" }}
                  onFocus={e=>e.target.style.borderColor=sel.ring} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>
              <div style={{ marginBottom:24, position:"relative" }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:7 }}>Password</label>
                <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" required
                  style={{ width:"100%", padding:"13px 44px 13px 16px", background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border 0.2s" }}
                  onFocus={e=>e.target.style.borderColor=sel.ring} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  style={{ position:"absolute", right:14, bottom:14, background:"none", border:"none", cursor:"pointer", fontSize:16, padding:0 }}>
                  {showPass?"ðŸ™ˆ":"ðŸ‘ï¸"}
                </button>
              </div>
              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"15px", background:loading?"#94a3b8":sel.accent, color:"white", fontWeight:800, fontSize:15, border:"none", borderRadius:14, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", transition:"background 0.2s" }}>
                {loading ? "Signing in..." : `Sign in as ${sel.label} â†’`}
              </button>
            </form>

            <div style={{ marginTop:22, paddingTop:22, borderTop:"1px solid #f1f5f9", textAlign:"center" }}>
              <p style={{ fontSize:14, color:"#64748b", margin:0 }}>
                New here?{" "}
                <a href="register" style={{ fontWeight:800, color:"#1d4ed8", textDecoration:"none" }}>Create account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

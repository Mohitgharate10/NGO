import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function AdminLogin({ redirectTo = null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");
      login(data.token, data.user);
      // Open the admin dashboard in a new tab
      window.open("/admin.html#/dashboard", "_blank");
      // Stay on or redirect current tab
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 20px",
      fontFamily: "'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.2; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .admin-card { animation: fadeUp 0.5s ease both; }
        .admin-input:focus { border-color: #f59e0b !important; box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
      `}</style>

      {/* Background grid pattern */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        pointerEvents:"none",
      }}/>

      {/* Glowing orbs */}
      <div style={{ position:"absolute", top:"15%", left:"10%", width:300, height:300, borderRadius:"50%", background:"rgba(245,158,11,0.05)", filter:"blur(60px)", animation:"pulse-ring 4s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", bottom:"15%", right:"10%", width:250, height:250, borderRadius:"50%", background:"rgba(59,130,246,0.06)", filter:"blur(50px)", animation:"pulse-ring 5s ease-in-out infinite" }}/>

      <div className="admin-card" style={{ width:"100%", maxWidth:420, position:"relative", zIndex:1 }}>
        {/* Shield icon */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{
            width:72, height:72, borderRadius:20,
            background:"linear-gradient(135deg,#f59e0b,#d97706)",
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            fontSize:32, marginBottom:16,
            boxShadow:"0 8px 32px rgba(245,158,11,0.3)",
          }}>
            ðŸ›¡ï¸
          </div>
          <h1 style={{ color:"white", fontSize:24, fontWeight:900, margin:0, letterSpacing:"-0.5px" }}>Admin Portal</h1>
          <p style={{ color:"#64748b", fontSize:13, margin:"6px 0 0" }}>Smile Foundation · Authorized Access Only</p>
        </div>

        {/* Card */}
        <div style={{
          background:"rgba(255,255,255,0.04)",
          border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:24,
          backdropFilter:"blur(12px)",
          padding:"36px 32px",
        }}>
          {error && (
            <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#f87171", borderRadius:12, padding:"12px 16px", fontSize:13, marginBottom:20, display:"flex", gap:8, alignItems:"center" }}>
              ⚠️ï¸ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>
                Admin Email
              </label>
              <input
                type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                placeholder="admin@smilefoundation.org" required
                className="admin-input"
                style={{ width:"100%", padding:"13px 16px", background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:12, fontSize:14, outline:"none", boxSizing:"border-box", color:"white", fontFamily:"inherit", transition:"border 0.2s, box-shadow 0.2s" }}
              />
            </div>

            <div style={{ marginBottom:28 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>
                Password
              </label>
              <div style={{ position:"relative" }}>
                <input
                  type={showPass ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)}
                  placeholder="Enter admin password" required
                  className="admin-input"
                  style={{ width:"100%", padding:"13px 44px 13px 16px", background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:12, fontSize:14, outline:"none", boxSizing:"border-box", color:"white", fontFamily:"inherit", transition:"border 0.2s, box-shadow 0.2s" }}
                />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, padding:0 }}>
                  {showPass ? "🙈" : "ðŸ‘ï¸"}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width:"100%", padding:"14px",
                background: loading ? "#92400e" : "linear-gradient(135deg,#f59e0b,#d97706)",
                color:"white", fontWeight:800, fontSize:15,
                border:"none", borderRadius:14,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily:"inherit",
                boxShadow: loading ? "none" : "0 4px 20px rgba(245,158,11,0.35)",
                transition:"all 0.2s",
              }}
            >
              {loading ? "Authenticating..." : "ðŸ”  Sign In to Admin Panel"}
            </button>
          </form>

          <div style={{ marginTop:24, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.07)", textAlign:"center" }}>
            <p style={{ fontSize:12, color:"#475569", margin:0 }}>
              Not an admin?{" "}
             
<a href="/" style={{ color:"#f59e0b", fontWeight:700, textDecoration:"none" }}>
  Back to Main Site →
</a>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <p style={{ textAlign:"center", fontSize:11, color:"#334155", marginTop:20 }}>
          🔒 Secured connection · All access is logged
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function RegisterPage({ portalRole = null }) {
  const defaultRole = portalRole || "donor";
  const [role, setRole] = useState(defaultRole);
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const isLocked = !!portalRole;

  const roles = [
    { id:"donor",     label:"I want to Donate",   emoji:"💝", accent:"#1d4ed8", ring:"#3b82f6", softBg:"#eff6ff", grad:"linear-gradient(135deg,#1e40af,#3b82f6)" },
    { id:"volunteer", label:"I want to Volunteer", emoji:"🌿", accent:"#047857", ring:"#10b981", softBg:"#ecfdf5", grad:"linear-gradient(135deg,#065f46,#10b981)" },
  ];
  const sel = roles.find(r => r.id === role) || roles[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone)) { setError("Enter a valid 10-digit Indian mobile number"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      login(data.token, data.user);
      // Open the correct portal dashboard in a new tab
      const portalMap = {
        volunteer: "/volunteer.html#/dashboard",
        donor: "/donor.html#/dashboard",
      };
      const portalUrl = portalMap[data.user.role] || "/donor.html#/dashboard";
      window.open(portalUrl, "_blank");
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
          <div className="bobble" style={{ fontSize:80, marginBottom:22 }}>{sel.emoji}</div>
          <h1 style={{ fontSize:40, fontWeight:900, lineHeight:1.1, margin:"0 0 14px" }}>Join the<br/>Movement</h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:15, lineHeight:1.7, margin:0 }}>
            Be part of something bigger. Your contribution creates ripples of change.
          </p>
          <div style={{ marginTop:40, textAlign:"left" }}>
            {[["1","Create your account","Under 2 minutes"],["2","Verify your role","Donor or Volunteer"],["3","Start making impact","Track it in your portal"]].map(([n,t,d]) => (
              <div key={n} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:18 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, flexShrink:0, color:"white" }}>{n}</div>
                <div>
                  <p style={{ margin:0, fontWeight:700, fontSize:14, color:"white" }}>{t}</p>
                  <p style={{ margin:"2px 0 0", fontSize:12, color:"rgba(255,255,255,0.55)" }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 20px", background:"#f8fafc" }}>
        <div style={{ width:"100%", maxWidth:460 }}>
          <div className="lg-hide" style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:36 }}>ðŸ¤</div>
            <h1 style={{ fontSize:20, fontWeight:900, color:"#0f172a", margin:"8px 0 0" }}>Smile Foundation</h1>
          </div>

          <div style={{ background:"white", borderRadius:28, boxShadow:"0 20px 60px rgba(0,0,0,0.08)", padding:"40px 36px" }}>
            <h2 style={{ fontSize:24, fontWeight:900, color:"#0f172a", margin:"0 0 4px" }}>Create account ✨</h2>
            <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 22px" }}>Join our community and make a difference</p>

            {!isLocked && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
                {roles.map(r => (
                  <button key={r.id} type="button" onClick={()=>setRole(r.id)}
                    style={{ padding:"13px 10px", borderRadius:14, border:role===r.id?`2px solid ${r.ring}`:"2px solid #f1f5f9", background:role===r.id?r.softBg:"#f8fafc", cursor:"pointer", outline:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:4, transition:"all 0.2s" }}>
                    <span style={{ fontSize:22 }}>{r.emoji}</span>
                    <span style={{ fontWeight:800, fontSize:12, color:"#1e293b", textAlign:"center" }}>{r.label}</span>
                  </button>
                ))}
              </div>
            )}

            {isLocked && (
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:sel.softBg, borderRadius:14, marginBottom:22, border:`1px solid ${sel.ring}33` }}>
                <span style={{ fontSize:24 }}>{sel.emoji}</span>
                <p style={{ margin:0, fontWeight:800, fontSize:14, color:"#1e293b" }}>Registering as {sel.label}</p>
              </div>
            )}

            {error && (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", borderRadius:12, padding:"12px 16px", fontSize:13, marginBottom:14 }}>
                ⚠️ï¸ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {[
                { name:"name",  label:"Full Name",     type:"text",  placeholder:"Your full name" },
                { name:"email", label:"Email Address",  type:"email", placeholder:"you@example.com" },
                { name:"phone", label:"Phone Number",   type:"tel",   placeholder:"10-digit mobile number" },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name} style={{ marginBottom:13 }}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:6 }}>{label}</label>
                  <input type={type} value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})}
                    placeholder={placeholder} required maxLength={name==="phone"?10:undefined}
                    style={{ width:"100%", padding:"12px 14px", background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border 0.2s" }}
                    onFocus={e=>e.target.style.borderColor=sel.ring} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
                </div>
              ))}
              <div style={{ marginBottom:20, position:"relative" }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:6 }}>Password</label>
                <input type={showPass?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                  placeholder="Min 6 characters" required
                  style={{ width:"100%", padding:"12px 40px 12px 14px", background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border 0.2s" }}
                  onFocus={e=>e.target.style.borderColor=sel.ring} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  style={{ position:"absolute", right:12, bottom:12, background:"none", border:"none", cursor:"pointer", fontSize:14, padding:0 }}>
                  {showPass?"🙈":"ðŸ‘ï¸"}
                </button>
              </div>
              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"14px", background:loading?"#94a3b8":sel.accent, color:"white", fontWeight:800, fontSize:15, border:"none", borderRadius:14, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", transition:"background 0.2s" }}>
                {loading ? "Creating account..." : `Register as ${role==="donor"?"Donor":"Volunteer"} →`}
              </button>
            </form>

            <p style={{ textAlign:"center", fontSize:14, color:"#64748b", marginTop:20, paddingTop:20, borderTop:"1px solid #f1f5f9", margin:"20px 0 0" }}>
              Already have an account?{" "}
              <a href="login" style={{ fontWeight:800, color:"#1d4ed8", textDecoration:"none" }}>Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

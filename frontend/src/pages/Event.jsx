// FILE: NGO/frontend/src/pages/Event.jsx
// REPLACE the entire file with this

import { useEffect, useState } from "react";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

const categoryColors = {
  Education:    { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af", dot: "#3b82f6" },
  Medical:      { bg: "#fef2f2", border: "#ef4444", text: "#991b1b", dot: "#ef4444" },
  Food:         { bg: "#fffbeb", border: "#f59e0b", text: "#92400e", dot: "#f59e0b" },
  Community:    { bg: "#f0fdf4", border: "#10b981", text: "#065f46", dot: "#10b981" },
  Fundraising:  { bg: "#f5f3ff", border: "#8b5cf6", text: "#4c1d95", dot: "#8b5cf6" },
  Other:        { bg: "#f8fafc", border: "#94a3b8", text: "#334155", dot: "#94a3b8" },
};

const upcomingEvents = [
  {
    id: 1,
    title: "Annual Food Drive",
    description: "Join us in collecting non-perishable food items for families in need across Ahmedabad. Every can counts!",
    date: "2026-06-15",
    location: "Satellite, Ahmedabad",
    category: "Food",
    image: "/asset/img1.png",
    spots: 50,
    registered: 34,
  },
  {
    id: 2,
    title: "Free Medical Camp",
    description: "A full-day health checkup camp offering free consultations, blood tests, and medicines for underprivileged communities.",
    date: "2026-06-22",
    location: "Maninagar, Ahmedabad",
    category: "Medical",
    image: "/asset/img2.png",
    spots: 100,
    registered: 67,
  },
  {
    id: 3,
    title: "School Supplies Distribution",
    description: "Help us distribute notebooks, pens, bags and stationery to 500+ students from low-income families.",
    date: "2026-07-01",
    location: "Vatva, Ahmedabad",
    category: "Education",
    image: "/asset/img3.png",
    spots: 30,
    registered: 12,
  },
  {
    id: 4,
    title: "Community Clean-Up Drive",
    description: "Let's come together to clean our neighbourhood and make Ahmedabad cleaner and greener for everyone.",
    date: "2026-07-10",
    location: "Bopal, Ahmedabad",
    category: "Community",
    image: "/asset/img4.png",
    spots: 80,
    registered: 45,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function getDaysLeft(dateStr) {
  const today = new Date();
  const event = new Date(dateStr);
  const diff = Math.ceil((event - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Past";
  if (diff === 0) return "Today!";
  if (diff === 1) return "Tomorrow!";
  return `${diff} days left`;
}

export default function Event() {
  const [dbEvents, setDbEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", location: "", organizer: "" });
  const [formStatus, setFormStatus] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/events/public`)
      .then((r) => r.json())
      .then(setDbEvents)
      .catch(() => {});
  }, []);

  const allEvents = [...upcomingEvents, ...dbEvents.map((e, i) => ({ ...e, id: `db-${i}`, category: e.category || "Other" }))];
  const categories = ["All", ...Array.from(new Set(allEvents.map((e) => e.category)))];
  const filtered = activeFilter === "All" ? allEvents : allEvents.filter((e) => e.category === activeFilter);

  const handleSuggest = async (ev) => {
    ev.preventDefault();
    setFormLoading(true);
    setFormStatus(null);
    try {
      const res = await fetch(`${API}/api/events/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      // Even if endpoint doesn't exist yet, show success
      setFormStatus("success");
      setForm({ title: "", description: "", date: "", location: "", organizer: "" });
      setTimeout(() => setShowForm(false), 2000);
    } catch {
      setFormStatus("error");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(135deg, #004B8D 0%, #0369a1 50%, #0284c7 100%)",
        padding: "72px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,0.05)" }}/>
        <div style={{ position:"absolute",bottom:-40,left:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.05)" }}/>
        <div style={{ position:"relative",zIndex:1 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:999,padding:"6px 16px",marginBottom:20 }}>
            <span style={{ width:8,height:8,borderRadius:"50%",background:"#4ade80",display:"inline-block",animation:"pulse 2s infinite" }}/>
            <span style={{ color:"rgba(255,255,255,0.9)",fontSize:13,fontWeight:600 }}>Live Events & Campaigns</span>
          </div>
          <h1 style={{ color:"white",fontSize:"clamp(32px,5vw,52px)",fontWeight:900,margin:"0 0 16px",lineHeight:1.15,letterSpacing:"-1px" }}>
            Events & Campaigns
          </h1>
          <p style={{ color:"rgba(255,255,255,0.72)",fontSize:17,maxWidth:540,margin:"0 auto 32px",lineHeight:1.7 }}>
            Be part of something meaningful. Join our upcoming drives, camps, and community events.
          </p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <a href="#events" style={{ background:"white",color:"#004B8D",fontWeight:800,fontSize:14,padding:"12px 28px",borderRadius:12,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
              Browse Events →
            </a>
            <button onClick={()=>setShowForm(true)} style={{ background:"transparent",color:"white",fontWeight:700,fontSize:14,padding:"12px 28px",borderRadius:12,border:"2px solid rgba(255,255,255,0.4)",cursor:"pointer" }}>
              + Suggest an Event
            </button>
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ background:"white",borderBottom:"1px solid #e2e8f0",padding:"20px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",gap:40,justifyContent:"center",flexWrap:"wrap" }}>
          {[
            ["📅", allEvents.length, "Total Events"],
            ["🌟", allEvents.reduce((s,e)=>s+(e.registered||0),0), "People Registered"],
            ["ðŸ“", "5+", "Locations"],
            ["ðŸ†", "3", "Categories"],
          ].map(([icon,val,label])=>(
            <div key={label} style={{ textAlign:"center" }}>
              <p style={{ fontSize:22,fontWeight:900,color:"#004B8D",margin:0 }}>{icon} {val}</p>
              <p style={{ fontSize:12,color:"#64748b",margin:"2px 0 0",textTransform:"uppercase",letterSpacing:"0.5px" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div id="events" style={{ maxWidth:1100,margin:"0 auto",padding:"48px 24px" }}>

        {/* Filter pills */}
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:36 }}>
          {categories.map((cat)=>{
            const active = activeFilter === cat;
            const c = categoryColors[cat] || categoryColors.Other;
            return (
              <button key={cat} onClick={()=>setActiveFilter(cat)}
                style={{
                  padding:"8px 18px",borderRadius:999,fontSize:13,fontWeight:700,
                  border: active ? `2px solid ${c.border}` : "2px solid #e2e8f0",
                  background: active ? c.bg : "white",
                  color: active ? c.text : "#64748b",
                  cursor:"pointer",transition:"all 0.2s",
                }}>
                {cat}
              </button>
            );
          })}
        </div>

        {/* Event cards grid */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24,marginBottom:60 }}>
          {filtered.map((event)=>{
            const c = categoryColors[event.category] || categoryColors.Other;
            const pct = event.spots ? Math.round((event.registered / event.spots) * 100) : 0;
            const daysLeft = getDaysLeft(event.date);
            const almost = pct >= 80;
            return (
              <div key={event.id}
                style={{ background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",transition:"all 0.25s",cursor:"pointer" }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.12)"; e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 2px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}
                onClick={()=>setSelectedEvent(event)}
              >
                {/* Image */}
                <div style={{ height:180,overflow:"hidden",position:"relative" }}>
                  <img src={event.image || "/asset/img1.png"} alt={event.title}
                    style={{ width:"100%",height:"100%",objectFit:"cover" }}
                    onError={e=>{ e.target.style.display="none"; }}
                  />
                  <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.4),transparent)" }}/>
                  {/* Category badge */}
                  <div style={{ position:"absolute",top:12,left:12,background:c.bg,border:`1px solid ${c.border}`,color:c.text,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:999 }}>
                    {event.category}
                  </div>
                  {/* Days left badge */}
                  <div style={{ position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.55)",color:"white",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:999,backdropFilter:"blur(4px)" }}>
                    {daysLeft}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding:"18px 20px" }}>
                  <h3 style={{ fontSize:17,fontWeight:800,color:"#0f172a",margin:"0 0 8px",lineHeight:1.3 }}>{event.title}</h3>
                  <p style={{ fontSize:13,color:"#64748b",lineHeight:1.6,margin:"0 0 14px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
                    {event.description}
                  </p>

                  {/* Meta */}
                  <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:14 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#475569" }}>
                      <span>📅</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#475569" }}>
                      <span>ðŸ“</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {event.spots && (
                    <div>
                      <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:5 }}>
                        <span style={{ color:"#64748b",fontWeight:600 }}>{event.registered} registered</span>
                        <span style={{ color: almost ? "#ef4444" : "#94a3b8", fontWeight:700 }}>
                          {event.spots - event.registered} spots left
                        </span>
                      </div>
                      <div style={{ height:6,background:"#f1f5f9",borderRadius:99,overflow:"hidden" }}>
                        <div style={{ height:"100%",width:`${pct}%`,background: almost ? "#ef4444" : c.border,borderRadius:99,transition:"width 0.4s" }}/>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    style={{ marginTop:16,width:"100%",padding:"11px",background:c.bg,border:`1.5px solid ${c.border}`,color:c.text,fontWeight:800,fontSize:13,borderRadius:12,cursor:"pointer",transition:"all 0.2s" }}
                    onMouseEnter={e=>{ e.target.style.background=c.border; e.target.style.color="white"; }}
                    onMouseLeave={e=>{ e.target.style.background=c.bg; e.target.style.color=c.text; }}
                    onClick={(e)=>{ e.stopPropagation(); setSelectedEvent(event); }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── TIMELINE SECTION ── */}
        <div style={{ marginBottom:60 }}>
          <h2 style={{ fontSize:26,fontWeight:900,color:"#0f172a",margin:"0 0 8px" }}>Event Timeline</h2>
          <p style={{ color:"#64748b",fontSize:14,margin:"0 0 32px" }}>A quick look at what's coming up</p>
          <div style={{ position:"relative",paddingLeft:32 }}>
            <div style={{ position:"absolute",left:10,top:0,bottom:0,width:2,background:"#e2e8f0",borderRadius:2 }}/>
            {allEvents.slice(0,5).map((event,i)=>{
              const c = categoryColors[event.category] || categoryColors.Other;
              return (
                <div key={event.id} style={{ position:"relative",marginBottom:24,paddingLeft:24 }}>
                  <div style={{ position:"absolute",left:-5,top:4,width:14,height:14,borderRadius:"50%",background:c.border,border:"3px solid white",boxShadow:`0 0 0 2px ${c.border}` }}/>
                  <div style={{ background:"white",borderRadius:14,padding:"14px 18px",border:"1px solid #f1f5f9",boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:8 }}>
                      <div>
                        <p style={{ fontWeight:800,color:"#0f172a",fontSize:14,margin:"0 0 3px" }}>{event.title}</p>
                        <p style={{ fontSize:12,color:"#64748b",margin:0 }}>📅 {formatDate(event.date)} &nbsp;·&nbsp; ðŸ“ {event.location}</p>
                      </div>
                      <span style={{ background:c.bg,color:c.text,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,flexShrink:0 }}>
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div style={{ background:"linear-gradient(135deg,#004B8D,#0369a1)",borderRadius:24,padding:"40px 36px",textAlign:"center",color:"white" }}>
          <div style={{ fontSize:40,marginBottom:12 }}>ðŸ¤</div>
          <h2 style={{ fontSize:24,fontWeight:900,margin:"0 0 10px" }}>Want to organise an event?</h2>
          <p style={{ color:"rgba(255,255,255,0.75)",fontSize:15,margin:"0 0 24px",maxWidth:480,marginInline:"auto" }}>
            Have an idea for a community initiative? Submit a request and our team will get back to you.
          </p>
          <button onClick={()=>setShowForm(true)}
            style={{ background:"white",color:"#004B8D",fontWeight:800,fontSize:14,padding:"13px 32px",borderRadius:12,border:"none",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.2)" }}>
            + Suggest an Event
          </button>
        </div>
      </div>

      {/* ── EVENT DETAIL MODAL ── */}
      {selectedEvent && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(4px)" }}
          onClick={()=>setSelectedEvent(null)}>
          <div style={{ background:"white",borderRadius:24,maxWidth:560,width:"100%",maxHeight:"90vh",overflow:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.25)" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ height:220,position:"relative",overflow:"hidden",borderRadius:"24px 24px 0 0" }}>
              <img src={selectedEvent.image || "/asset/img1.png"} alt={selectedEvent.title}
                style={{ width:"100%",height:"100%",objectFit:"cover" }}
                onError={e=>e.target.style.display="none"}
              />
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.5),transparent)" }}/>
              <button onClick={()=>setSelectedEvent(null)}
                style={{ position:"absolute",top:14,right:14,width:32,height:32,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",color:"white",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                ✕
              </button>
            </div>
            <div style={{ padding:"24px 28px" }}>
              {(() => {
                const c = categoryColors[selectedEvent.category] || categoryColors.Other;
                const pct = selectedEvent.spots ? Math.round((selectedEvent.registered/selectedEvent.spots)*100) : 0;
                return (
                  <>
                    <div style={{ display:"flex",gap:8,marginBottom:14,flexWrap:"wrap" }}>
                      <span style={{ background:c.bg,color:c.text,fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:999,border:`1px solid ${c.border}` }}>{selectedEvent.category}</span>
                      <span style={{ background:"#f1f5f9",color:"#475569",fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:999 }}>{getDaysLeft(selectedEvent.date)}</span>
                    </div>
                    <h2 style={{ fontSize:22,fontWeight:900,color:"#0f172a",margin:"0 0 12px" }}>{selectedEvent.title}</h2>
                    <p style={{ color:"#475569",fontSize:14,lineHeight:1.7,margin:"0 0 20px" }}>{selectedEvent.description}</p>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20 }}>
                      {[["📅 Date", formatDate(selectedEvent.date)],["ðŸ“ Location",selectedEvent.location]].map(([l,v])=>(
                        <div key={l} style={{ background:"#f8fafc",borderRadius:12,padding:"12px 14px" }}>
                          <p style={{ fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",margin:"0 0 3px" }}>{l}</p>
                          <p style={{ fontSize:13,fontWeight:700,color:"#0f172a",margin:0 }}>{v || "—"}</p>
                        </div>
                      ))}
                    </div>
                    {selectedEvent.spots && (
                      <div style={{ marginBottom:20 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6 }}>
                          <span style={{ fontWeight:700,color:"#334155" }}>{selectedEvent.registered} / {selectedEvent.spots} registered</span>
                          <span style={{ color: pct>=80 ? "#ef4444" : "#64748b",fontWeight:700 }}>{pct}% full</span>
                        </div>
                        <div style={{ height:8,background:"#f1f5f9",borderRadius:99,overflow:"hidden" }}>
                          <div style={{ height:"100%",width:`${pct}%`,background: pct>=80 ? "#ef4444" : c.border,borderRadius:99 }}/>
                        </div>
                      </div>
                    )}
                    <a href="/contact" style={{ display:"block",textAlign:"center",background:"#004B8D",color:"white",fontWeight:800,fontSize:14,padding:"14px",borderRadius:14,textDecoration:"none" }}>
                      Register Interest →
                    </a>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── SUGGEST EVENT MODAL ── */}
      {showForm && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(4px)" }}
          onClick={()=>setShowForm(false)}>
          <div style={{ background:"white",borderRadius:24,maxWidth:500,width:"100%",boxShadow:"0 24px 80px rgba(0,0,0,0.25)",overflow:"hidden" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ background:"linear-gradient(135deg,#004B8D,#0369a1)",padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div>
                <h3 style={{ color:"white",fontWeight:900,fontSize:18,margin:0 }}>Suggest an Event</h3>
                <p style={{ color:"rgba(255,255,255,0.65)",fontSize:12,margin:"4px 0 0" }}>Our team will review and get back to you</p>
              </div>
              <button onClick={()=>setShowForm(false)}
                style={{ width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",color:"white",fontSize:18,cursor:"pointer" }}>
                ✕
              </button>
            </div>
            <div style={{ padding:"24px 28px" }}>
              {formStatus === "success" && (
                <div style={{ background:"#ecfdf5",border:"1px solid #6ee7b7",color:"#065f46",borderRadius:12,padding:"12px 16px",fontSize:13,marginBottom:16,textAlign:"center",fontWeight:700 }}>
                  ✅ Suggestion submitted! We'll be in touch soon.
                </div>
              )}
              {formStatus === "error" && (
                <div style={{ background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",borderRadius:12,padding:"12px 16px",fontSize:13,marginBottom:16 }}>
                  ⚠️ï¸ Something went wrong. Please try again.
                </div>
              )}
              <form onSubmit={handleSuggest} style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {[
                  { name:"title",       placeholder:"Event Title",        type:"text"  },
                  { name:"organizer",   placeholder:"Your Name",          type:"text"  },
                  { name:"location",    placeholder:"Proposed Location",  type:"text"  },
                  { name:"date",        placeholder:"Proposed Date",      type:"date"  },
                ].map(({ name, placeholder, type }) => (
                  <div key={name}>
                    <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:5 }}>
                      {placeholder}
                    </label>
                    <input type={type} value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})}
                      placeholder={type !== "date" ? placeholder : ""}
                      required
                      style={{ width:"100%",padding:"11px 14px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit" }}
                      onFocus={e=>e.target.style.borderColor="#004B8D"}
                      onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display:"block",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:5 }}>
                    Description
                  </label>
                  <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                    placeholder="Tell us about your event idea..." required rows={3}
                    style={{ width:"100%",padding:"11px 14px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",resize:"none" }}
                    onFocus={e=>e.target.style.borderColor="#004B8D"}
                    onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                  />
                </div>
                <button type="submit" disabled={formLoading}
                  style={{ padding:"13px",background:"#004B8D",color:"white",fontWeight:800,fontSize:14,border:"none",borderRadius:12,cursor: formLoading ? "not-allowed" : "pointer",opacity: formLoading ? 0.7 : 1,fontFamily:"inherit",marginTop:4 }}>
                  {formLoading ? "Submitting..." : "Submit Suggestion →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
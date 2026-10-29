import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const causes = [
  { icon: "🍱", title: "Food Security", desc: "Ensuring no child sleeps hungry. We distribute 500+ meals daily.", color: "#FF6B35", count: "50K+" },
  { icon: "📚", title: "Education", desc: "Books, tutors, and scholarships for underprivileged children.", color: "#004B8D", count: "12K+" },
  { icon: "💊", title: "Healthcare", desc: "Free medical camps and essential medicines for rural communities.", color: "#22C55E", count: "8K+" },
  { icon: "👕", title: "Clothing Drive", desc: "Seasonal clothing campaigns reaching thousands of families.", color: "#A855F7", count: "25K+" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Volunteer, Mumbai", text: "Volunteering with Smile Foundation changed my perspective on life. The impact we create together is incredible.", avatar: "PS" },
  { name: "Rohit Mehta", role: "Donor since 2022", text: "Transparent, impactful, and incredibly organized. Every rupee I donate reaches those who need it most.", avatar: "RM" },
  { name: "Anjali Gupta", role: "Beneficiary", text: "The education support gave my daughter a chance she would never have had otherwise. Forever grateful.", avatar: "AG" },
];

function CounterNumber({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const observed = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        let start = 0;
        const step = (target / 2000) * 16;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString("en-IN")}{suffix}</span>;
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#001f3f" }}>
        <img src="/asset/img1.png" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,31,63,0.92) 0%, rgba(0,75,141,0.7) 60%, transparent 100%)" }} />
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10" style={{ background: "#FFDE73", filter: "blur(80px)" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-6 border" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "#FFDE73" }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#FFDE73" }} />
              Registered NGO · Est. 2018
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Every Smile<br />
              <span style={{ color: "#FFDE73" }}>Starts With</span><br />
              Your Help
            </h1>
            <p className="text-lg mb-10 max-w-xl" style={{ color: "rgba(255,255,255,0.75)" }}>
              Smile Foundation bridges generous hearts with those who need it most. Donate, volunteer, or simply spread the word — every action matters.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="px-8 py-4 font-black text-lg rounded-2xl transition-all hover:-translate-y-0.5" style={{ background: "#FFDE73", color: "#001f3f" }}>
                Donate Now
              </Link>
              <Link to="/register" className="px-8 py-4 font-bold text-lg rounded-2xl text-white border transition-all hover:bg-white/10" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.3)" }}>
                Volunteer →
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          <span>Scroll down</span>
          <div className="w-0.5 h-8 animate-bounce" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }} />
        </div>
      </section>

      {/* STATS BAND */}
      <section className="py-16" style={{ background: "#004B8D" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: 95000, suf: "+", label: "Lives Impacted" },
              { num: 500000, suf: "+", label: "Meals Distributed" },
              { num: 3200, suf: "+", label: "Active Volunteers" },
              { num: 28, suf: "", label: "Cities Pan India" },
            ].map(({ num, suf, label }) => (
              <div key={label}>
                <div className="text-4xl md:text-5xl font-black" style={{ color: "#FFDE73" }}>
                  <CounterNumber target={num} suffix={suf} />
                </div>
                <div className="mt-1 text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAUSES */}
      <section className="py-24" style={{ background: "#f8fafc" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#004B8D" }}>What We Do</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">Our Core Causes</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">We focus on the most fundamental needs — food, education, health, and dignity for all.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {causes.map(({ icon, title, desc, color, count }) => (
              <div key={title} className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5" style={{ background: color + "18" }}>{icon}</div>
                <div className="text-2xl font-black mb-1" style={{ color }}>{count}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#004B8D" }}>Simple Steps</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Create Account", desc: "Register as a donor or volunteer in under 2 minutes. No paperwork needed.", icon: "👤" },
              { step: "02", title: "Choose Your Impact", desc: "Select a cause to donate to, or pick a volunteering slot that works for you.", icon: "🎯" },
              { step: "03", title: "Make a Difference", desc: "Contribute and track your impact in real-time from your personal dashboard.", icon: "✨" },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="relative">
                <div className="text-7xl font-black absolute -top-4 -left-2 select-none" style={{ color: "#f1f5f9" }}>{step}</div>
                <div className="relative bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24" style={{ background: "#0f172a" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#FFDE73" }}>Our Work in Photos</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["/asset/img1.png", "/asset/img2.png", "/asset/img3.png", "/asset/img4.png"].map((src, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 brightness-90 hover:brightness-100" style={{ minHeight: i === 0 ? "320px" : "150px" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#004B8D" }}>Stories</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">Voices of Change</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, role, text, avatar }) => (
              <div key={name} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="text-4xl font-black mb-4" style={{ color: "#FFDE73" }}>"</div>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm">{text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#004B8D" }}>{avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{name}</div>
                    <div className="text-gray-400 text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24" style={{ background: "#001f3f" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#FFDE73" }}>Who We Are</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-6">A Movement, Not Just an Organisation</h2>
            <p className="mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              Since 2018, Smile Foundation has worked at the grassroots level to address hunger, illiteracy, and healthcare gaps across 28 Indian cities. Every donation is tracked and reported for full transparency.
            </p>
            <p className="mb-8 leading-relaxed text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Our 3,200+ volunteers are the backbone of everything we do. Together, we have distributed over 500,000 meals, educated 12,000+ children, and run 200+ free medical camps.
            </p>
            <Link to="/contact" className="inline-block px-8 py-4 font-black rounded-2xl transition-all" style={{ background: "#FFDE73", color: "#001f3f" }}>
              Get In Touch
            </Link>
          </div>
          <div className="relative">
            <img src="/asset/img2.png" alt="About" className="rounded-3xl w-full shadow-2xl" />
            <div className="absolute -bottom-6 -right-6 rounded-2xl p-6 shadow-xl" style={{ background: "#FFDE73" }}>
              <div className="text-3xl font-black" style={{ color: "#001f3f" }}>6+</div>
              <div className="text-sm font-medium" style={{ color: "rgba(0,31,63,0.7)" }}>Years of Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "#FFDE73" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#001f3f" }}>Ready to Make a Difference?</h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "rgba(0,31,63,0.7)" }}>
            Join thousands of donors and volunteers building a better tomorrow, one smile at a time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="px-10 py-4 font-black text-lg rounded-2xl transition-all shadow-lg text-white" style={{ background: "#001f3f" }}>Donate Today</Link>
            <Link to="/events" className="px-10 py-4 font-black text-lg rounded-2xl border-2 transition-all" style={{ background: "white", color: "#001f3f", borderColor: "rgba(0,31,63,0.2)" }}>See Our Events</Link>
          </div>
        </div>
      </section>
    </>
  );
}

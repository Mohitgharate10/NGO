

export default function VolunteerPortal() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #001f3f 0%, #003366 50%, #004B8D 100%)" }}>
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-4xl mb-6 shadow-2xl"
            style={{ background: "rgba(255,222,115,0.15)", border: "2px solid rgba(255,222,115,0.3)" }}>🤝</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Volunteer Portal</h1>
          <p className="text-xl max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Your time and skills can change lives. Join our community of passionate volunteers making a real difference.
          </p>
        </div>

        {/* What you'll do */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "🍽️", title: "Food Distribution", desc: "Help pack and distribute meals to families in need every weekend." },
            { icon: "📖", title: "Teach & Mentor", desc: "Share your knowledge with underprivileged children and youth." },
            { icon: "🏥", title: "Medical Camps", desc: "Assist medical professionals at free health camps across the city." },
            { icon: "💻", title: "IT Support", desc: "Use your tech skills to digitize records and train beneficiaries." },
            { icon: "🎉", title: "Event Management", desc: "Organise fundraisers, drives, and awareness campaigns." },
            { icon: "💰", title: "Fundraising", desc: "Lead donation drives and corporate partnership outreach." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-6 transition-all hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="rounded-3xl p-8 mb-10" style={{ background: "rgba(255,222,115,0.08)", border: "1px solid rgba(255,222,115,0.2)" }}>
          <h2 className="text-2xl font-black text-white mb-6">Why Volunteer With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Official certificate of service", "Flexible scheduling — weekend or weekday", "Pan-India network of like-minded changemakers", "Training & mentorship programs", "Recognition awards for top contributors", "Real community impact tracking"].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <span className="text-lg" style={{ color: "#FFDE73" }}>✓</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/volunteer.html#/register"
            className="px-10 py-4 rounded-2xl font-black text-xl text-center transition-all hover:-translate-y-0.5 shadow-2xl"
            style={{ background: "#FFDE73", color: "#001f3f" }}>
            Go to Volunteer Portal →
          </a>
          <a href="/volunteer.html#/login"
            className="px-10 py-4 rounded-2xl font-bold text-xl text-center text-white border transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}>
            Already registered? Sign In
          </a>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          After logging in, go to <strong className="text-white/60">My Portal → Apply to Volunteer</strong> to submit your application.
        </p>
      </div>
    </div>
  );
}



export default function AdminPortal() {
  return (
    <div className="min-h-screen" style={{ background: "#0f172a" }}>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-4xl mb-6 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>🔐</div>
          <h1 className="text-5xl font-black text-white mb-4">Admin Portal</h1>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.55)" }}>
            Restricted access. Authorised administrators only.
          </p>
        </div>

        {/* Admin capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: "📊", title: "Dashboard & Stats", desc: "Real-time donation totals, volunteer counts, and contact submissions." },
            { icon: "💰", title: "Manage Donations", desc: "View all donations, payment status, and donor history." },
            { icon: "🤝", title: "Volunteer Approvals", desc: "Review applications and approve or reject volunteer slots." },
            { icon: "📅", title: "Event Management", desc: "Create, edit, approve, and delete events on the public calendar." },
            { icon: "✉️", title: "Contact Inbox", desc: "Read and manage all public contact form submissions." },
            { icon: "🔑", title: "Role Management", desc: "View all registered users and their assigned roles." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-start gap-4">
                <span className="text-2xl">{icon}</span>
                <div>
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning box */}
        <div className="rounded-2xl p-5 mb-10 flex items-start gap-4"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-red-400 mb-1">Authorised Access Only</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              This portal is restricted to approved Smile Foundation administrators. Unauthorised access attempts are logged and reported.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="/admin.html"
            className="inline-block px-12 py-4 rounded-2xl font-black text-xl text-white transition-all hover:-translate-y-0.5 shadow-2xl"
            style={{ background: "linear-gradient(135deg, #004B8D, #001f3f)" }}>
            Open Admin Portal →
          </a>
          <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            Don't have admin credentials? Contact the foundation director.
          </p>
        </div>
      </div>
    </div>
  );
}

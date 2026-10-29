

const causes = [
  { icon: "🍱", title: "Food Security", raised: 84000, goal: 100000, color: "#FF6B35" },
  { icon: "📚", title: "Education Fund", raised: 62000, goal: 80000, color: "#004B8D" },
  { icon: "💊", title: "Medical Aid", raised: 45000, goal: 60000, color: "#22C55E" },
  { icon: "👕", title: "Clothing Drive", raised: 28000, goal: 40000, color: "#A855F7" },
];

export default function DonorPortal() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="py-20 px-6" style={{ background: "linear-gradient(135deg, #004B8D 0%, #001f3f 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-4xl mb-6 shadow-2xl"
            style={{ background: "rgba(255,222,115,0.15)", border: "2px solid rgba(255,222,115,0.3)" }}>💝</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Donor Portal</h1>
          <p className="text-xl max-w-xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
            Your generosity directly funds the change you want to see. 100% transparent. 100% impactful.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
            style={{ background: "rgba(255,222,115,0.15)", color: "#FFDE73", border: "1px solid rgba(255,222,115,0.3)" }}>
            🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Active campaigns */}
        <h2 className="text-3xl font-black text-gray-900 mb-3">Active Campaigns</h2>
        <p className="text-gray-500 mb-8">Every rupee goes directly to the cause. No hidden charges.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {causes.map(({ icon, title, raised, goal, color }) => {
            const pct = Math.round((raised / goal) * 100);
            return (
              <div key={title} className="rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: color + "18" }}>{icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                    <p className="text-sm text-gray-400">{pct}% of goal reached</p>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3">
                  <div className="h-2.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-900">₹{raised.toLocaleString("en-IN")} raised</span>
                  <span className="text-gray-400">Goal: ₹{goal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* What your money does */}
        <div className="rounded-3xl p-10 mb-12" style={{ background: "#f8fafc" }}>
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">What Your Donation Does</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { amount: "₹100", impact: "Feeds a child for a week" },
              { amount: "₹500", impact: "Provides school supplies" },
              { amount: "₹1,000", impact: "Covers medical consultation" },
              { amount: "₹5,000", impact: "Sponsors a month of tuition" },
            ].map(({ amount, impact }) => (
              <div key={amount}>
                <div className="text-2xl font-black mb-2" style={{ color: "#004B8D" }}>{amount}</div>
                <div className="text-sm text-gray-500">{impact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {["🏛️ Registered NGO", "📊 Audited Annually", "🔐 Razorpay Secured", "📧 Instant Tax Receipt"].map((b) => (
            <div key={b} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 border border-gray-200 bg-white shadow-sm">
              {b}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/donor.html"
            className="px-10 py-4 rounded-2xl font-black text-xl text-center transition-all hover:-translate-y-0.5 shadow-lg text-white"
            style={{ background: "#004B8D" }}>
            Go to Donor Portal →
          </a>
          <a href="/donor.html#/login"
            className="px-10 py-4 rounded-2xl font-bold text-xl text-center border-2 transition-all hover:bg-gray-50"
            style={{ color: "#004B8D", borderColor: "#004B8D" }}>
            Already registered? Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

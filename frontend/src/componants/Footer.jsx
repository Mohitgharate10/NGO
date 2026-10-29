import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "#0a1628" }}>
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow"
                style={{ background: "#FFDE73", color: "#001f3f" }}>S</div>
              <span className="text-white text-xl font-black">Smile Foundation</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              A registered NGO working since 2018 to eradicate hunger, expand education access,
              and provide healthcare to underserved communities across India.
            </p>
            <div className="flex gap-3">
              {[
                { label: "FB", href: "#" },
                { label: "TW", href: "#" },
                { label: "IG", href: "#" },
                { label: "YT", href: "#" },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/events", label: "Events" },
                { to: "/contact", label: "Contact Us" },
                { to: "/volunteer-portal", label: "Volunteer Portal" },
                { to: "/donor-portal", label: "Donor Portal" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4">
              {[
                { icon: "📍", text: "123 Gandhi Nagar, Mumbai, MH 400001" },
                { icon: "📞", text: "+91 98765 43210" },
                { icon: "✉️", text: "hello@smilefoundation.org" },
                { icon: "🕐", text: "Mon–Sat, 9 AM – 6 PM" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span className="mt-0.5">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {["🏛️ Govt. Registered", "📊 Annually Audited", "🔐 Razorpay Secured", "📧 80G Tax Exemption"].map((b) => (
              <span key={b} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}>
                {b}
              </span>
            ))}
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} Smile Foundation · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

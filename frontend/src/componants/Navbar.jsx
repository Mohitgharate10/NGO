import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate("/"); };

  const isActive = (path) => location.pathname === path;

  // Portal links open as separate pages (different HTML entry points)
  const portalLinks = [
    { href: "/volunteer.html", label: "Volunteer", emoji: "🤝" },
    { href: "/donor.html",     label: "Donor",     emoji: "💝" },
    { href: "/admin.html",     label: "Admin",     emoji: "🔐" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-xl" : ""}`}
      style={{ background: "#004B8D" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow"
            style={{ background: "#FFDE73", color: "#001f3f" }}>S</div>
          <span className="text-white text-lg font-black tracking-tight group-hover:text-yellow-200 transition-colors">
            Smile Foundation
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Main pages */}
          {[{ to: "/", label: "Home" }, { to: "/events", label: "Events" }, { to: "/contact", label: "Contact" }].map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive(to) ? "text-yellow-300 bg-white/10" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
              {label}
            </Link>
          ))}

          <div className="w-px h-5 mx-2" style={{ background: "rgba(255,255,255,0.2)" }} />

          {/* Portal links — open separate pages */}
          {portalLinks.map(({ href, label, emoji }) => (
            <a key={href} href={href}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5">
              <span className="text-base">{emoji}</span> {label}
            </a>
          ))}

          <div className="w-px h-5 mx-2" style={{ background: "rgba(255,255,255,0.2)" }} />

          {user ? (
            <button onClick={handleLogout}
              className="ml-1 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all">Login</Link>
              <Link to="/register"
                className="px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ml-1"
                style={{ background: "#FFDE73", color: "#001f3f" }}>
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
          onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 space-y-1 border-t" style={{ background: "#003d75", borderColor: "rgba(255,255,255,0.1)" }}>
          {[{ to: "/", label: "🏠 Home" }, { to: "/events", label: "📅 Events" }, { to: "/contact", label: "✉️ Contact" }].map(({ to, label }) => (
            <Link key={to} to={to}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive(to) ? "text-yellow-300 bg-white/10" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
              {label}
            </Link>
          ))}
          <div className="pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <p className="px-4 py-2 text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Portals</p>
            {portalLinks.map(({ href, label, emoji }) => (
              <a key={href} href={href}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                {emoji} {label} Portal
              </a>
            ))}
          </div>
          <div className="pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-300 hover:bg-white/10">🚪 Logout</button>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/10">Login</Link>
                <Link to="/register" className="block mt-1 px-4 py-2.5 rounded-xl text-sm font-bold text-center"
                  style={{ background: "#FFDE73", color: "#001f3f" }}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

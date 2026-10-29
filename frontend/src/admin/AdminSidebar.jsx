import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/dashboard",  label: "Dashboard",  icon: "📊" },
  { to: "/donations",  label: "Donations",  icon: "💰" },
  { to: "/volunteers", label: "Volunteers", icon: "🤝" },
  { to: "/contacts",   label: "Contacts",   icon: "✉️" },
  { to: "/events",     label: "Events",     icon: "📅" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#004B8D] text-white p-6 flex flex-col min-h-screen">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="space-y-2 flex-1">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              location.pathname === to
                ? "bg-white/20 text-yellow-300"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>{icon}</span> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;

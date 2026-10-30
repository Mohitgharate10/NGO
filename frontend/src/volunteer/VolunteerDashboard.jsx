import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function VolunteerDashboard() {
  const { user, token } = useAuth();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/volunteers/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setRecords)
      .catch(() => {});
  }, [token]);

  const approved = records.filter((r) => r.status === "Approved").length;
  const pending = records.filter((r) => r.status === "Pending").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {user?.name}! ðŸŒŸ</h1>
      <p className="text-gray-500 mb-8">Your volunteering journey at Smile Foundation.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon="ðŸ“" label="Total Applications" value={records.length} color="blue" />
        <StatCard icon="âœ…" label="Approved" value={approved} color="green" />
        <StatCard icon="â³" label="Pending" value={pending} color="yellow" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <Link to="/apply"
          className="bg-emerald-700 text-white rounded-2xl p-6 hover:bg-emerald-800 transition group">
          <div className="text-3xl mb-3">âœ‹</div>
          <h3 className="text-lg font-bold mb-1">Apply to Volunteer</h3>
          <p className="text-emerald-200 text-sm">Book a volunteering slot for an upcoming date</p>
          <span className="mt-3 inline-block text-yellow-300 text-sm group-hover:translate-x-1 transition-transform">Apply Now â†’</span>
        </Link>
        <Link to="/history"
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-600 transition group">
          <div className="text-3xl mb-3">ðŸ“‹</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">My Applications</h3>
          <p className="text-gray-500 text-sm">Track approval status of your applications</p>
          <span className="mt-3 inline-block text-emerald-700 text-sm group-hover:translate-x-1 transition-transform">View All â†’</span>
        </Link>
      </div>

      {records.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Recent Applications</h2>
          <div className="space-y-3">
            {records.slice(0, 3).map((r) => (
              <div key={r._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{r.skill}</p>
                  <p className="text-xs text-gray-400">{r.date} {r.time && `at ${r.time}`}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs uppercase tracking-wide font-medium opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${map[status] || map.Pending}`}>
      {status}
    </span>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function VolunteerHistory() {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/volunteers/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setRecords(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">My Applications 📋</h1>
      <p className="text-gray-500 mb-8">Track the status of your volunteering applications.</p>

      {records.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">✋</div>
          <p className="text-gray-500 mb-4">You haven't applied for volunteering yet.</p>
          <a href="/apply"
            className="inline-block px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-800 transition">
            Apply Now →
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Skill", "Date", "Time", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-medium text-gray-700">{r.skill}</td>
                  <td className="px-5 py-4 text-gray-600">{r.date}</td>
                  <td className="px-5 py-4 text-gray-500">{r.time || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      r.status === "Approved" ? "bg-green-100 text-green-700" :
                      r.status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {r.status === "Approved" ? "✅ " : r.status === "Rejected" ? "âŒ " : "â³ "}{r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

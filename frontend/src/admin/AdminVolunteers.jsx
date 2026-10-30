import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function AdminVolunteers() {
  const { token } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch(`${API}/api/volunteers`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setVolunteers(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/api/volunteers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setVolunteers((prev) => prev.map((v) => v._id === id ? { ...v, status } : v));
  };

  const filtered = filter === "all" ? volunteers : volunteers.filter((v) => v.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Volunteers 🌟</h1>
      <p className="text-gray-500 mb-6">Manage volunteer applications and their statuses.</p>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "Pending", "Approved", "Rejected"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              filter === f ? "bg-[#004B8D] text-white border-[#004B8D]" : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}>
            {f}
            {f !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({volunteers.filter((v) => v.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Name", "Email", "Skill", "Date", "Time", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No volunteers found.</td></tr>
              ) : filtered.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{v.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{v.email}</td>
                  <td className="px-4 py-3 text-gray-600">{v.skill}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{v.date}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{v.time || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      v.status === "Approved" ? "bg-green-100 text-green-700" :
                      v.status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {v.status === "Pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(v._id, "Approved")}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition">
                          Approve
                        </button>
                        <button onClick={() => updateStatus(v._id, "Rejected")}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition">
                          Reject
                        </button>
                      </div>
                    )}
                    {v.status !== "Pending" && (
                      <button onClick={() => updateStatus(v._id, "Pending")}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition">
                        Reset
                      </button>
                    )}
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

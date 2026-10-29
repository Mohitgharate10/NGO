import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDonations() {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch(`${API}/api/donations`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setDonations(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const filtered = filter === "all" ? donations : donations.filter((d) => d.donationType === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Donations 💝</h1>
      <p className="text-gray-500 mb-6">All donation submissions from donors.</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "money", "food", "clothing", "education", "medical"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition capitalize ${
              filter === f ? "bg-[#004B8D] text-white border-[#004B8D]" : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}>
            {f === "all" ? "All" : f}
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
                {["Name", "Phone", "Type", "Amount", "Location", "Date", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No donations found.</td></tr>
              ) : filtered.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{d.name}</td>
                  <td className="px-4 py-3 text-gray-500">{d.phone}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{d.donationType}</td>
                  <td className="px-4 py-3 text-gray-600">{d.donationType === "money" ? `₹${d.amount?.toLocaleString("en-IN")}` : "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{d.location}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      d.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{d.paymentStatus === "paid" ? "Paid" : "Pending"}</span>
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

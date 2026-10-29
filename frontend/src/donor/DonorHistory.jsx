import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const typeIcon = { money: "💰", food: "🍱", clothing: "👕", education: "📚", medical: "💊" };

export default function DonorHistory() {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/donations/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setDonations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">My Donation History 📋</h1>
      <p className="text-gray-500 mb-8">A record of all your generous contributions.</p>

      {donations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">🤲</div>
          <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
          <a href="/donate" className="inline-block px-6 py-2.5 bg-[#004B8D] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition">
            Make Your First Donation →
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Type", "Amount", "Location", "Date", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donations.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-medium text-gray-700 capitalize">
                    {typeIcon[d.donationType] || "📦"} {d.donationType}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {d.donationType === "money" ? `₹${d.amount?.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{d.location}</td>
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      d.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {d.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function DonorDashboard() {
  const { user, token } = useAuth();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/donations/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setDonations)
      .catch(() => {});
  }, [token]);

  const totalMoney = donations
    .filter((d) => d.donationType === "money" && d.paymentStatus === "paid")
    .reduce((s, d) => s + (d.amount || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back, {user?.name}! 👋</h1>
      <p className="text-gray-500 mb-8">Thank you for your generous support.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon="📦" label="Total Donations" value={donations.length} color="blue" />
        <StatCard icon="💰" label="Money Donated" value={`₹${totalMoney.toLocaleString("en-IN")}`} color="green" />
        <StatCard
          icon="ðŸ†"
          label="Status"
          value={donations.length > 5 ? "Champion" : donations.length > 2 ? "Active" : "New Donor"}
          color="yellow"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <Link
          to="/donate"
          className="bg-[#004B8D] text-white rounded-2xl p-6 hover:bg-blue-800 transition group"
        >
          <div className="text-3xl mb-3">ðŸ’</div>
          <h3 className="text-lg font-bold mb-1">Make a Donation</h3>
          <p className="text-blue-200 text-sm">Donate money, food, clothes or medical supplies</p>
          <span className="mt-3 inline-block text-[#FFDE73] text-sm group-hover:translate-x-1 transition-transform">
            Donate Now →
          </span>
        </Link>
        <Link
          to="/history"
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-[#004B8D] transition group"
        >
          <div className="text-3xl mb-3">📋</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">View History</h3>
          <p className="text-gray-500 text-sm">See all your past donations and their status</p>
          <span className="mt-3 inline-block text-[#004B8D] text-sm group-hover:translate-x-1 transition-transform">
            View All →
          </span>
        </Link>
      </div>

      {/* Recent donations */}
      {donations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Recent Donations</h2>
          <div className="space-y-3">
            {donations.slice(0, 3).map((d) => (
              <div key={d._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700 capitalize">{d.donationType}</p>
                  <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="text-right">
                  {d.donationType === "money" && (
                    <p className="text-sm font-bold text-[#004B8D]">₹{d.amount?.toLocaleString("en-IN")}</p>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    d.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {d.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
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

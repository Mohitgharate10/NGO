import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function AdminContacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/contacts`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setContacts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Contact Messages âœ‰ï¸</h1>
      <p className="text-gray-500 mb-6">Messages sent from the contact form (also forwarded to your email).</p>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {contacts.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-400 border">No messages yet.</div>
            ) : contacts.map((c) => (
              <button key={c._id} onClick={() => setSelected(c)}
                className={`w-full text-left bg-white rounded-xl p-4 border shadow-sm hover:shadow transition ${
                  selected?._id === c._id ? "border-[#004B8D]" : "border-gray-100"
                }`}>
                <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.email}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{c.message}</p>
                <p className="text-xs text-gray-300 mt-2">{new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selected.name}</h2>
                    <p className="text-sm text-gray-400">{selected.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 text-gray-700 text-sm leading-relaxed">
                  {selected.message}
                </div>
                <a href={`mailto:${selected.email}`}
                  className="mt-4 inline-block px-5 py-2 bg-[#004B8D] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition">
                  Reply via Email →
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

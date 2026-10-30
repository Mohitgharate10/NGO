import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

export default function AdminEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", location: "", status: "Approved" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/events`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setEvents(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`${API}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setEvents([data, ...events]);
    setForm({ title: "", description: "", date: "", location: "", status: "Approved" });
    setShowForm(false);
    setSaving(false);
  };

  const toggleStatus = async (id, current) => {
    const status = current === "Approved" ? "Pending" : "Approved";
    await fetch(`${API}/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setEvents((prev) => prev.map((e) => e._id === id ? { ...e, status } : e));
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`${API}/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents((prev) => prev.filter((e) => e._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Events ðŸ“…</h1>
          <p className="text-gray-500">Create and manage public events.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-[#004B8D] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition">
          {showForm ? "Cancel" : "+ Add Event"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-700 mb-4">New Event</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Event Title *" required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004B8D] bg-gray-50" />
            </div>
            <div className="sm:col-span-2">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description" rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004B8D] bg-gray-50 resize-none" />
            </div>
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              type="date" placeholder="Date"
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004B8D] bg-gray-50" />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Location"
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004B8D] bg-gray-50" />
            <button type="submit" disabled={saving}
              className="sm:col-span-2 py-3 bg-[#004B8D] text-white font-semibold rounded-xl hover:bg-blue-800 transition disabled:opacity-60">
              {saving ? "Saving..." : "Create Event"}
            </button>
          </form>
        </div>
      )}

      {/* Events list */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border text-gray-400">No events yet. Create one!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => (
            <div key={ev._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-800">{ev.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ml-2 shrink-0 ${
                  ev.status === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>{ev.status}</span>
              </div>
              {ev.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{ev.description}</p>}
              {(ev.date || ev.location) && (
                <div className="text-xs text-gray-400 space-y-1 mb-4">
                  {ev.date && <p>ðŸ“… {ev.date}</p>}
                  {ev.location && <p>ðŸ“ {ev.location}</p>}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => toggleStatus(ev._id, ev.status)}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:border-[#004B8D] hover:text-[#004B8D] transition">
                  {ev.status === "Approved" ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => deleteEvent(ev._id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

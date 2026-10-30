import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== null) ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? "" : "http://localhost:5000");

const skills = [
  { label: "Teaching", icon: "ðŸ“–" },
  { label: "Medical", icon: "ðŸ’Š" },
  { label: "Food Distribution", icon: "ðŸ±" },
  { label: "Event Management", icon: "ðŸŽ‰" },
  { label: "IT Support", icon: "ðŸ’»" },
  { label: "Fundraising", icon: "ðŸ’°" },
];

export default function VolunteerApply() {
  const { user, token } = useAuth();

  // Compute today's date in local timezone (fix for date issues)
  const todayLocal = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const [form, setForm] = useState({ date: "", time: "", skill: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.skill) e.skill = "Please select a skill";
    if (!form.date) e.date = "Please pick a date";
    if (form.date < todayLocal()) e.date = "Date cannot be in the past";
    if (!form.time) e.time = "Please select a time";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  ...form,
  name: user.name,
  email: user.email,
  phone: user.phone || "0000000000",
  userId: user.id,
}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      setStatus("success");
      setForm({ date: "", time: "", skill: "", message: "" });
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
            style={{ background: "#dcfce7" }}>ðŸŽ‰</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-8">Our team will review and get back to you within 24 hours.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setStatus(null)}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all"
              style={{ background: "#16a34a" }}>
              Apply Again
            </button>
            <a href="/history"
              className="px-6 py-2.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
              View Applications
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">Apply to Volunteer âœ‹</h1>
      <p className="text-gray-500 mb-8">Choose your skill and pick a date â€” we'll confirm your slot.</p>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            âŒ Submission failed. Please check your details and try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Skill selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Select Your Skill *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skills.map(({ label, icon }) => (
                <button key={label} type="button"
                  onClick={() => { setForm({ ...form, skill: label }); setErrors({ ...errors, skill: undefined }); }}
                  className={`p-3.5 rounded-2xl border-2 text-sm font-semibold text-left transition-all flex items-center gap-2 ${form.skill === label
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"}`}>
                  <span className="text-lg">{icon}</span> {label}
                </button>
              ))}
            </div>
            {errors.skill && <p className="text-red-500 text-xs mt-2">{errors.skill}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Preferred Date *</label>
              <input type="date" value={form.date}
                min={todayLocal()}
                onChange={(e) => { setForm({ ...form, date: e.target.value }); setErrors({ ...errors, date: undefined }); }}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-sm"
                style={{ borderColor: errors.date ? "#ef4444" : "#d1d5db" }} />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            {/* Time */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Preferred Time *</label>
              <input type="time" value={form.time}
                onChange={(e) => { setForm({ ...form, time: e.target.value }); setErrors({ ...errors, time: undefined }); }}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-sm"
                style={{ borderColor: errors.time ? "#ef4444" : "#d1d5db" }} />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Optional message */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Additional Message <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea rows={3} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us more about your experience or availability..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-sm resize-none" />
          </div>

          {/* Applying as */}
          <div className="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-800 border border-emerald-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              Applying as <strong>{user?.name}</strong>
              <span className="text-emerald-600"> Â· {user?.email}</span>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 font-black text-white rounded-xl transition-all disabled:opacity-60 text-base"
            style={{ background: loading ? "#6b7280" : "#16a34a" }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Submitting...
              </span>
            ) : "Submit Application â†’"}
          </button>
        </form>
      </div>
    </div>
  );
}

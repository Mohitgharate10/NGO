import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // "success" | "error"
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Get In Touch</h1>
          <p className="text-gray-500 text-lg">We'd love to hear from you. Our team will respond within 24 hours.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-[#004B8D] mb-4">Contact Information</h2>
              {[
                { icon: "📍", label: "Address", value: "123 NGO Street, Ahmedabad, Gujarat 380001" },
                { icon: "📞", label: "Phone", value: "+91 98765 43210" },
                { icon: "✉️", label: "Email", value: "info@smilefoundation.org" },
                { icon: "🕐", label: "Working Hours", value: "Mon–Sat: 9AM – 6PM" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex gap-4 py-3 border-b last:border-0">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-gray-700 text-sm mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#004B8D] text-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">Want to make a difference?</h3>
              <p className="text-blue-200 text-sm mb-4">Join us as a donor or volunteer and help us change lives.</p>
              <a
                href="/register"
                className="inline-block bg-[#FFDE73] text-[#004B8D] font-semibold px-5 py-2 rounded-full text-sm hover:bg-yellow-400 transition"
              >
                Join Now →
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Send us a Message</h2>

            {status === "success" && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-6 flex items-center gap-2">
                <span>✅</span> Message sent! We'll get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6 flex items-center gap-2">
                <span>❌</span> Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004B8D] bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004B8D] bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004B8D] bg-gray-50 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#004B8D] text-white font-semibold rounded-xl hover:bg-blue-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message ✉️"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

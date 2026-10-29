import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Load Razorpay script dynamically
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Local date helper - avoids timezone off-by-one
const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const donationTypes = [
  { value: "money", label: "Money", icon: "💰", desc: "Secure online payment" },
  { value: "food", label: "Food", icon: "🍱", desc: "Cooked or packed meals" },
  { value: "clothing", label: "Clothing", icon: "👕", desc: "Wearable items" },
  { value: "education", label: "Education", icon: "📚", desc: "Books, stationery" },
  { value: "medical", label: "Medical", icon: "💊", desc: "Medicines, kits" },
];

const quickAmounts = [100, 250, 500, 1000, 2500, 5000];

export default function DonorDonate() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    donationType: "",
    amount: "",
    date: todayLocal(),
    location: "",
    phone: user?.phone || "",
    note: "",
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep date in sync but never let it be past
  const today = todayLocal();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.donationType) return "Please select a donation type.";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim())) return "Enter a valid 10-digit Indian mobile number.";
    if (!form.location.trim()) return "Please enter your location.";
    if (!form.date || form.date < today) return "Please select a valid date (today or future).";
    if (form.donationType === "money") {
      if (!form.amount || Number(form.amount) < 1) return "Please enter a donation amount.";
    }
    return null;
  };

  const handleNonMoneySubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          name: user.name,
          userId: user.id,
          paymentStatus: "pending",
          date: new Date(form.date + "T00:00:00").toISOString(),
        }),
      });
      if (!res.ok) throw new Error();
      setStep(3);
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay failed to load. Check your internet connection.");

      const orderRes = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(form.amount) }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Smile Foundation",
        description: "Donation for a better tomorrow",
        image: "/logo.png",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                ...response,
                donationData: {
                  ...form,
                  amount: Number(form.amount),
                  name: user.name,
                  userId: user.id,
                  date: new Date(form.date + "T00:00:00").toISOString(),
                },
              }),
            });
            if (verifyRes.ok) { setStep(3); }
            else throw new Error("Payment verification failed.");
          } catch (e) {
            setError(e.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: { name: user.name, email: user.email, contact: form.phone },
        theme: { color: "#004B8D" },
        modal: {
          ondismiss: () => {
            setError("Payment was cancelled. You can try again.");
            setLoading(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) { setError(err); return; }
    if (form.donationType === "money") handleRazorpay();
    else handleNonMoneySubmit();
  };

  if (step === 3) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
            style={{ background: "#dbeafe" }}>🙏</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Thank You, {user?.name}!</h2>
          <p className="text-gray-500 mb-2">Your donation has been recorded.</p>
          {form.donationType === "money" && (
            <p className="text-sm text-green-600 font-semibold mb-6">
              ₹{Number(form.amount).toLocaleString("en-IN")} · Payment Verified ✓
            </p>
          )}
          <p className="text-gray-400 text-xs mb-8">A confirmation has been sent to {user?.email}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setStep(1); setForm({ donationType: "", amount: "", date: today, location: "", phone: user?.phone || "", note: "" }); }}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all"
              style={{ background: "#004B8D" }}>
              Donate Again
            </button>
            <a href="/history"
              className="px-6 py-2.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
              View History
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">Make a Donation 💝</h1>
      <p className="text-gray-500 mb-8">Your generosity helps us reach more lives. 100% transparent.</p>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6 flex items-start gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donation type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">What would you like to donate? *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {donationTypes.map(({ value, label, icon, desc }) => (
                <button key={value} type="button"
                  onClick={() => setForm({ ...form, donationType: value, amount: "" })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${form.donationType === value
                    ? "border-[#004B8D] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"}`}>
                  <p className="text-2xl mb-1">{icon}</p>
                  <p className="font-bold text-sm text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Amount (money only) */}
          {form.donationType === "money" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Amount (₹) *</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickAmounts.map((v) => (
                  <button key={v} type="button"
                    onClick={() => setForm({ ...form, amount: String(v) })}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${Number(form.amount) === v
                      ? "text-white border-[#004B8D]"
                      : "border-gray-200 text-gray-600 hover:border-[#004B8D]"}`}
                    style={Number(form.amount) === v ? { background: "#004B8D" } : {}}>
                    ₹{v.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
              <input type="number" name="amount" value={form.amount} onChange={handleChange}
                placeholder="Or enter a custom amount" min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-sm"
                style={{ "--tw-ring-color": "#004B8D" }} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="10-digit number" maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-sm" />
            </div>
            {/* Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Donation Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange}
                min={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-sm" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Your Location *</label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              placeholder="City / Area (e.g. Andheri, Mumbai)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-sm" />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Note <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea name="note" value={form.note} onChange={handleChange} rows={2}
              placeholder="Any message for the team..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-sm resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 font-black text-white rounded-xl transition-all disabled:opacity-60 text-base flex items-center justify-center gap-2"
            style={{ background: loading ? "#6b7280" : "#004B8D" }}>
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processing...
              </>
            ) : form.donationType === "money" ? "💳 Pay & Donate" : "📦 Submit Donation"}
          </button>

          {form.donationType === "money" && (
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>🔒 Razorpay Secured</span>
              <span>·</span>
              <span>UPI · Cards · Net Banking</span>
              <span>·</span>
              <span>Wallets accepted</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

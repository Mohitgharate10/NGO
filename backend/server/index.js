const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const Donation = require("../models/Donation");
const Contact = require("../models/Contact");
const Volunteer = require("../models/Volunteer");
const User = require("../models/User");
const Event = require("../models/Event");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== MONGODB CONNECT =====
const seedAdmin = async () => {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      const hashed = await bcrypt.hash("Admin@123", 10);
      await User.create({
        name: "Admin",
        email: "admin@smilefoundation.org",
        password: hashed,
        role: "admin",
      });
      console.log("✅ Default admin seeded: admin@smilefoundation.org / Admin@123");
    }
  } catch (err) {
    console.warn("⚠️ Admin seed check:", err.message);
  }
};

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ Connected to MongoDB");
      seedAdmin();
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));
} else {
  console.warn("⚠️ MONGO_URI is not set. Please set MONGO_URI in your Render environment variables.");
}

// Database connectivity check for API routes
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database is not connected. Please ensure MONGO_URI is set in Render Environment Variables.",
    });
  }
  next();
});

// ===== NODEMAILER SETUP =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

// ===== RAZORPAY SETUP =====
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "dummy_key",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
  });
} catch (e) {
  console.warn("⚠️ Razorpay initialization warning:", e.message);
}

// ===== AUTH MIDDLEWARE =====
const authMiddleware = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ngo_secret_key");
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ===== AUTH ROUTES =====

// Register (donor or volunteer)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: role || "donor", phone });
    await user.save();
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "ngo_secret_key",
      { expiresIn: "7d" }
    );
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: err.message || "Registration failed" });
  }
});

// Login (donor, volunteer, admin)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "ngo_secret_key",
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: err.message || "Login failed" });
  }
});

// Get current user profile
app.get("/api/auth/me", authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

// ===== CONTACT ROUTES =====
app.post("/api/contacts", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({ name, email, message });
    await contact.save();

    // Send email notification to admin
    await transporter.sendMail({
      from: `"Smile Foundation" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
          <div style="background:#004B8D;padding:20px;color:white">
            <h2 style="margin:0">New Contact Message</h2>
            <p style="margin:4px 0 0;opacity:0.8">Smile Foundation NGO</p>
          </div>
          <div style="padding:24px">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background:#f5f5f5;padding:12px;border-radius:6px">${message}</div>
            <p style="margin-top:20px;font-size:12px;color:#888">Received on ${new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>
      `,
    });

    // Send confirmation to sender
    await transporter.sendMail({
      from: `"Smile Foundation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message – Smile Foundation",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
          <div style="background:#004B8D;padding:20px;color:white">
            <h2 style="margin:0">Thank You, ${name}!</h2>
            <p style="margin:4px 0 0;opacity:0.8">Smile Foundation</p>
          </div>
          <div style="padding:24px">
            <p>We've received your message and will get back to you within 24 hours.</p>
            <p style="margin-top:20px;font-size:12px;color:#888">— Team Smile Foundation</p>
          </div>
        </div>
      `,
    });

    res.status(201).json({ message: "Message sent and saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/api/contacts", authMiddleware(["admin"]), async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// ===== DONATION ROUTES =====
app.post("/api/donations", authMiddleware(["donor"]), async (req, res) => {
  try {
    const donation = new Donation({ ...req.body, userId: req.user.id });
    await donation.save();
    res.status(201).json({ message: "Donation saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save donation" });
  }
});

app.get("/api/donations", authMiddleware(["admin"]), async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// Donor's own donations
app.get("/api/donations/my", authMiddleware(["donor"]), async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

// ===== RAZORPAY PAYMENT =====
app.post("/api/payment/create-order", authMiddleware(["donor"]), async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

app.post("/api/payment/verify", authMiddleware(["donor"]), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationData } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Save verified donation
    const donation = new Donation({
      ...donationData,
      userId: req.user.id,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "paid",
    });
    await donation.save();
    res.json({ message: "Payment verified and donation saved" });
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// ===== VOLUNTEER ROUTES =====
app.post("/api/volunteers", authMiddleware(), async (req, res) => {
  try {
    const volunteer = new Volunteer({ ...req.body, userId: req.user.id });
    await volunteer.save();
    res.status(201).json({ message: "Volunteer request submitted" });
  } catch (err) {
    res.status(500).json({ message: "Error saving volunteer" });
  }
});

app.get("/api/volunteers", authMiddleware(["admin"]), async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch {
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
});

// Volunteer's own requests
app.get("/api/volunteers/my", authMiddleware(["volunteer"]), async (req, res) => {
  try {
    const records = await Volunteer.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(records);
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

app.patch("/api/volunteers/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await Volunteer.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ message: "Volunteer status updated" });
  } catch {
    res.status(500).json({ message: "Error updating status" });
  }
});

// ===== EVENT ROUTES =====
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Suggest event (public, no auth needed)
app.post("/api/events/suggest", async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      status: "Pending", // needs admin approval
    });
    await event.save();
    res.status(201).json({ message: "Event suggestion submitted" });
  } catch {
    res.status(500).json({ error: "Failed to save suggestion" });
  }
});

app.get("/api/events/public", async (req, res) => {
  try {
    const events = await Event.find({ status: "Approved" }).sort({ createdAt: -1 });
    res.json(events);
  } catch {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/api/events", authMiddleware(["admin"]), async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch {
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.patch("/api/events/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch {
    res.status(500).json({ error: "Failed to update event" });
  }
});

app.delete("/api/events/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// ===== ADMIN STATS =====
app.get("/api/admin/stats", authMiddleware(["admin"]), async (req, res) => {
  try {
    const [donations, contacts, volunteers, events] = await Promise.all([
      Donation.countDocuments(),
      Contact.countDocuments(),
      Volunteer.countDocuments(),
      Event.countDocuments(),
    ]);
    const totalMoney = await Donation.aggregate([
      { $match: { donationType: "money", paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res.json({
      donations,
      contacts,
      volunteers,
      events,
      totalMoney: totalMoney[0]?.total || 0,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ===== SERVE FRONTEND IN PRODUCTION =====
const path = require("path");
const fs = require("fs");

const candidatePaths = [
  path.join(__dirname, "../../frontend/dist"),
  path.join(process.cwd(), "frontend/dist"),
  path.join(__dirname, "../frontend/dist"),
];
const frontendDist = candidatePaths.find((p) => fs.existsSync(p));

if (frontendDist) {
  app.use(express.static(frontendDist));
  app.get("/volunteer", (req, res) => res.sendFile(path.join(frontendDist, "volunteer.html")));
  app.get("/donor", (req, res) => res.sendFile(path.join(frontendDist, "donor.html")));
  app.get("/admin", (req, res) => res.sendFile(path.join(frontendDist, "admin.html")));
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

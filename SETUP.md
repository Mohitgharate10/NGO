# 🚀 Smile Foundation NGO — Setup Guide

## What Was Improved
- ✅ **Home page** — Full redesign: Hero, stats counter, causes, how-it-works, gallery, testimonials, about, CTA
- ✅ **Navbar** — Sticky, mobile-responsive, portal links, active state indicators
- ✅ **Footer** — Full footer with links, contact info, trust badges
- ✅ **Volunteer Portal Page** (`/volunteer-portal`) — New standalone landing page
- ✅ **Donor Portal Page** (`/donor-portal`) — New standalone landing page with campaign progress bars
- ✅ **Admin Portal Page** (`/admin-portal`) — New standalone landing page
- ✅ **Volunteer Application** — Fixed validation, date bug (no past dates), auth token sent
- ✅ **Donor Donation** — Full Razorpay payment gateway, date fix, phone validation
- ✅ **Date Bug Fixed** — All date inputs use local timezone (no off-by-one day issue)
- ✅ **API URLs** — All files now use `VITE_API_URL` from `.env` instead of hardcoded localhost
- ✅ **Backend auth** — Volunteer & donation POST routes now properly protected

---
## Step 1 — Add Your Keys

### Backend (`backend/.env`)
```
MONGO_URI=mongodb://localhost:27017/ngo
PORT=5000
JWT_SECRET=pick_a_random_long_string_here

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_google_app_password
ADMIN_EMAIL=admin@yourdomain.com

RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```
> ⚠️ The frontend only needs the KEY_ID (public). Never put KEY_SECRET in frontend!

---

## Step 2 — Get Razorpay Keys

1. Go to https://dashboard.razorpay.com
2. Sign up / Login → Settings → API Keys
3. Generate Test Key → copy **Key ID** and **Key Secret**
4. Paste them in both `.env` files as shown above
5. For production: generate Live Keys and change `rzp_test_` → `rzp_live_`

---

## Step 3 — Gmail App Password (for email notifications)

1. Go to your Google Account → Security
2. Enable 2-Step Verification (required)
3. Search "App Passwords" → Select app: Mail → Device: Other → name it "NGO"
4. Copy the 16-character password → paste as `EMAIL_PASS`

---

## Step 4 — Install & Run

```bash
# Backend
cd backend
npm install
node server/index.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Step 5 — Create Admin Account

Use MongoDB Compass or run this in `mongosh`:
```js
use ngo
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2a$10$HASH",   // use bcrypt to hash your password
  role: "admin",
  createdAt: new Date()
})
```

Or use the `/api/auth/register` endpoint with `role: "admin"` from Postman.

---

## Page Routes Summary

| URL | Description |
|-----|-------------|
| `/` | Home page |
| `/events` | Public events |
| `/contact` | Contact form |
| `/register` | Register as donor/volunteer |
| `/login` | Login |
| `/volunteer-portal` | Volunteer info landing page |
| `/donor-portal` | Donor info landing page |
| `/admin-portal` | Admin info landing page |
| `/donor` | Donor dashboard (protected) |
| `/donor/donate` | Make a donation (protected) |
| `/donor/history` | Donation history (protected) |
| `/volunteer` | Volunteer dashboard (protected) |
| `/volunteer/apply` | Apply to volunteer (protected) |
| `/volunteer/history` | Application history (protected) |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard (protected) |
| `/admin/donations` | Manage donations (protected) |
| `/admin/volunteers` | Manage volunteers (protected) |
| `/admin/contacts` | View messages (protected) |
| `/admin/events` | Manage events (protected) |

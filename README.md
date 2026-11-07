# NGOConnect

> A full-stack platform for charities to manage donations, volunteers, events, and public outreach.

[Live application](https://ngo-platform-r52v.onrender.com) · [Setup notes](SETUP.md) · [Contributing](CONTRIBUTING.md)

## Overview

NGOConnect brings donor, volunteer, and administrator workflows into one application. It supports online donation processing through Razorpay, in-kind donation drives, volunteer applications, event publishing, donor history, and an admin dashboard.

## Features

- Donation flows with Razorpay order creation and verification
- In-kind donation drives and campaign participation
- Donor and volunteer registration, authentication, and dashboards
- Volunteer applications, review, and assignment workflows
- Event discovery and admin event management
- Donation, volunteer, contact, and dashboard administration
- Transactional email notifications through Nodemailer

## Architecture

```text
frontend/       React 19 + Vite + Tailwind CSS client
backend/        Express API, JWT authorization, payment and email services
backend/models/ Mongoose models for users, donations, volunteers, events, contacts
MongoDB         Primary data store
Razorpay        Payment gateway
SMTP            Transactional email delivery
```

## Prerequisites

- Node.js 18+
- npm or Yarn
- MongoDB Atlas or a local MongoDB instance
- Razorpay test credentials for payment testing
- An SMTP account for email notifications

## Run locally

Clone the project and install each application separately:

```bash
git clone https://github.com/Mohitgharate10/NGO.git
cd NGO

cd backend
npm install
npm run dev
```

In a second terminal:

```bash
cd NGO/frontend
npm install
npm run dev
```

The frontend runs at [http://localhost:5173](http://localhost:5173); the backend defaults to port 5000.

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/ngo
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_smtp_or_app_password
ADMIN_EMAIL=admin@example.com
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

> **Security:** Never commit environment files or payment credentials. The current backend contains a development admin seed with publicly known credentials; change or remove that behavior before any public deployment. The README intentionally does not reproduce those credentials.

## Useful commands

| Location | Command | Purpose |
| --- | --- | --- |
| repository root | `npm run install:all` | Install backend and frontend dependencies |
| repository root | `npm run build` | Build the frontend for production |
| repository root | `npm start` | Start the backend entry point |
| `backend/` | `npm run dev` | Run the Express API with Nodemon |
| `frontend/` | `npm run dev` | Run the Vite development server |
| `frontend/` | `npm run lint` | Lint the frontend |

## API overview

| Area | Example endpoints |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login` |
| Donations | `POST /api/donations/create-order`, `POST /api/donations/verify` |
| Volunteers | `POST /api/volunteer/apply`, `GET /api/volunteer/all` |
| Events | `GET /api/events`, `POST /api/events` |
| Admin | `GET /api/admin/stats` |
| Contact | `POST /api/contact` |

Refer to the source routes and [SETUP.md](SETUP.md) for the current implementation details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for issue, branch, and pull-request guidance.

## License

Licensed under the [MIT License](LICENSE).

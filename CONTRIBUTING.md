# Contributing to NGOConnect

Thank you for considering contributing to **NGOConnect**. Together, we can build tools that empower non-profits, volunteers, and donors worldwide.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Local Development Setup](#local-development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Standards](#commit-message-standards)
- [Submitting a Pull Request](#submitting-a-pull-request)

---

## Code of Conduct

We are dedicated to creating a welcoming, respectful, and safe community. Please be polite, empathetic, and constructive in all discussions, issues, and code reviews.

---

## How Can I Contribute?

### 1. Reporting Bugs
- Verify that the issue has not already been logged under [Issues](https://github.com/Mohitgharate10/NGO/issues).
- Provide a clear and descriptive issue title.
- Detail the exact reproduction steps, expected vs. actual outcomes, browser version, and console error messages.

### 2. Suggesting Features
- Propose new features or enhancements by creating an issue labeled `enhancement`.
- Describe the motivation, target audience (donor, volunteer, or admin), and proposed workflow.

### 3. Submitting Improvements
- Feel free to pick up any open issue or propose an improvement (UI polish, API optimization, accessibility, tests).

---

## Local Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/<your-username>/NGO.git
   cd NGO
   ```

2. **Branch Naming**
   Create a descriptive feature branch:
   ```bash
   git checkout -b feat/donation-receipt-pdf
   # or
   git checkout -b fix/admin-sidebar-mobile
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create server/.env with your MONGO_URI and JWT_SECRET
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

5. **Test Your Changes**
   - Verify frontend interactions at `http://localhost:5173`.
   - Verify backend APIs responding correctly on `http://localhost:5000`.

---

## Coding Guidelines

### Frontend (React + Vite + Tailwind CSS)
- Maintain modular component structures in `frontend/src/componants`, `frontend/src/pages`, and `frontend/src/admin`.
- Use Tailwind CSS utility classes; avoid inline styles.
- Follow functional React component patterns with hooks.
- Keep responsive design intact for mobile, tablet, and desktop viewports.

### Backend (Node.js + Express + Mongoose)
- Place route handlers and database queries cleanly, keeping error handling robust (`try/catch` with informative status codes).
- Protect sensitive endpoints with the `jwt` authentication middleware.
- Never hardcode secrets, API keys, or database credentials; always utilize environment variables.

---

## Commit Message Standards

We recommend following the [Conventional Commits](https://www.conventionalcommits.org/) convention:

```text
<type>: <short description>

[optional body]
```

**Common prefixes:**
- `feat:` for new capabilities
- `fix:` for bug fixes
- `docs:` for documentation updates
- `style:` for code style or UI tweaks
- `refactor:` for internal improvements without functional change

---

## Submitting a Pull Request

1. Ensure the code compiles cleanly and there are no lint or runtime console errors.
2. Commit your changes:
   ```bash
   git add .
   git commit -m "feat(volunteer): add availability filter to admin volunteer dashboard"
   ```
3. Push to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
4. Open a Pull Request on GitHub against the `main` branch of `Mohitgharate10/NGO`.
5. Clearly describe the changes and link any related issues.

---

Thank you for contributing to NGOConnect.

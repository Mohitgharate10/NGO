# Contributing to NGOConnect

Thanks for contributing. Bug fixes, documentation improvements, accessibility work, tests, and product enhancements are all welcome.

## Start with an issue

Search the [issue tracker](https://github.com/Mohitgharate10/NGO/issues) first. For substantial changes, create an issue describing the problem, intended users, proposed approach, and any data or payment impact before writing code.

Do not post credentials, payment details, personal information, or security vulnerabilities in public issues.

## Local setup

```bash
git clone https://github.com/<your-username>/NGO.git
cd NGO

cd backend && npm install
cd ../frontend && npm install
```

Create local environment files as described in the [README](README.md). Keep all secrets out of version control. Run the backend with `npm run dev` from `backend/` and the frontend with `npm run dev` from `frontend/`.

## Code guidelines

- Keep frontend work organized within `frontend/src`; use React function components, hooks, and Tailwind utilities.
- Keep API and database work in `backend/`, with clear validation, explicit error handling, and appropriate authorization checks.
- Preserve responsive layouts and keyboard-accessible interactions.
- Never hardcode database credentials, JWT secrets, SMTP passwords, or Razorpay secrets.
- Treat payment and role-management changes as security-sensitive and include focused testing notes in the pull request.

## Branches and commits

Create focused branches from `main`, such as `feat/donation-receipts` or `fix/admin-navigation`.

Use clear commits:

```text
feat(volunteers): add availability filtering
fix(donations): validate payment verification input
docs(readme): clarify environment setup
```

## Pull requests

Before opening a pull request:

1. Run `npm run lint` from `frontend/`.
2. Build the frontend with `npm run build`.
3. Manually verify any affected frontend flow and API endpoint.
4. Add screenshots for visible UI changes and explain any environment changes.
5. Link related issues and describe both user-facing behavior and testing performed.

## Security reporting

For authentication, payment, secrets, or authorization concerns, contact the repository owner privately instead of opening a public issue.

Thank you for helping make NGOConnect more useful and trustworthy.

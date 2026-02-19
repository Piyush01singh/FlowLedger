# Velora - Personal Finance Tracker

Frontend-only fintech dashboard built with React, Firebase Auth/Firestore, and polished motion-driven UI.

## Features

- Google authentication with Firebase (falls back to local demo mode if Firebase env vars are missing).
- Add, edit, delete, and filter transactions.
- Summary cards for total balance, income, and expenses.
- Animated spending chart by category.
- Responsive dashboard with dark/light mode toggle.

## Tech Stack

- React + Vite
- Firebase Auth + Firestore
- React Router
- Framer Motion
- Lucide Icons

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment template and fill Firebase credentials:

```bash
# macOS/Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

3. Run development server:

```bash
npm run dev
```

4. Build production bundle:

```bash
npm run build
```

## Firebase Notes

- Enable `Google` sign-in provider in Firebase Authentication.
- Create Firestore database and set rules for authenticated user access.
- Transactions are stored under: `users/{uid}/transactions`.

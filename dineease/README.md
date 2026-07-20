# 🍽️ DineEase — Smart Restaurant Reservation & Management System

> CSE470 Software Engineering Project · **Group 9** · BRAC University

DineEase is a full-stack **MERN** application that digitises restaurant operations for
customers, waiters, cleaners and administrators — table reservation, menu browsing,
pre-ordering, digital payments, invoicing, loyalty rewards, cleaning workflows,
dashboards and reports.

---

## 👥 Group Members

| Name | Student ID | GitHub | Owned Features |
|------|-----------|--------|----------------|
| Provat Saha Pranto | 23301668 | _add_ | F01, F02, F06, F07, F20 |
| B.M. Jaber Seam | 23301364 | _add_ | F12, F13, F14, F18, F19 |
| Mushfique Nayeeb Ayon | 23101211 | _add_ | F03, F04, F05, F16, F17 |
| Noor-E-Jannat | 23201509 | _add_ | F08, F09, F10, F11, F15 |

> Replace _add_ with each member's GitHub username before submission.

---

## 📖 Project Description

DineEase replaces manual restaurant workflows with a role-based digital platform.
Customers browse the menu, reserve tables (with overlap-safe scheduling), pre-order
food, pay through a simulated bKash/Nagad gateway, receive invoices, earn loyalty
points and leave reviews. Staff approve reservations, run the kitchen order queue and
process a structured table-cleaning workflow. Admins manage the menu, tables and staff,
and monitor the business through a live dashboard and sales/reservation reports.

### User Roles

- **Customer** — browse, reserve, pre-order, pay, review, earn loyalty points.
- **Waiter** — approve/reject reservations, advance order status, complete dining (raise cleaning tasks).
- **Cleaner** — process the table-cleaning queue (start → ready).
- **Admin** — full management of menu, tables, staff, plus dashboard and reports.

---

## ✅ The 20 Features

| ID | Feature | Owner |
|----|---------|-------|
| F01 | Restaurant Menu | Provat |
| F02 | Search and Filter Menu | Provat |
| F03 | Table Reservation | Ayon |
| F04 | Reservation History | Ayon |
| F05 | Pre-order Food | Ayon |
| F06 | Favourite Menu Items | Provat |
| F07 | Customer Reviews and Ratings | Provat |
| F08 | Real-time Table Availability | Noor |
| F09 | Reservation Approval | Noor |
| F10 | Order Status Tracking | Noor |
| F11 | In-site Notification System | Noor |
| F12 | Menu Management | Jaber |
| F13 | Table Management | Jaber |
| F14 | Staff Management | Jaber |
| F15 | Table Cleaning Workflow | Noor |
| F16 | Digital Payment Integration | Ayon |
| F17 | Digital Invoice | Ayon |
| F18 | Admin Dashboard | Jaber |
| F19 | Sales and Reservation Reports | Jaber |
| F20 | Customer Loyalty and Reward Points | Provat |

### Mandatory Authentication Module (not counted in the 20 features)

Registration · Login · Logout · Password hashing (bcrypt) · JWT authentication ·
Protected routes · Role-based authorization · Authentication error handling.

---

## 🛠️ Technology Stack

- **MongoDB** + **Mongoose** — database and ODM
- **Express.js** — REST API (MVC)
- **React.js** (Vite) — SPA frontend
- **Node.js** — runtime
- **JWT** + **bcryptjs** — auth & password hashing
- **express-validator** — request validation
- **axios**, **react-router-dom** — client data + routing
- **Jest** + **Supertest** + **mongodb-memory-server** — testing

---

## 🏛️ MVC Architecture

The backend strictly separates concerns:

```
React View → API request → Express route → validation middleware →
authentication middleware → role middleware → controller →
service / model → MongoDB → controller response → React View
```

- **Models** (`server/src/models`) — Mongoose schemas & DB logic only.
- **Controllers** (`server/src/controllers`) — request handling & coordination.
- **Services** (`server/src/services`) — business logic (reservations, orders, payment, loyalty, reports).
- **Views** — the React app in `client/`.

No MongoDB queries live in route files; no business logic lives in React components;
no secrets or IDs are hard-coded.

---

## 📁 Project Structure

```
dineease/
├── client/                 # React + Vite SPA
│   └── src/
│       ├── api/            # axios client + endpoint modules
│       ├── components/     # reusable UI (StateViews, ui, NotificationBell)
│       ├── context/        # AuthContext, ToastContext
│       ├── hooks/          # useAsync
│       ├── layouts/        # MainLayout (role-aware nav)
│       ├── pages/          # customer / admin / staff pages
│       └── routes/         # ProtectedRoute, RoleRoute guards
├── server/                 # Express MVC API
│   └── src/
│       ├── config/         # env, db, constants (enums, roles)
│       ├── controllers/    # one per domain
│       ├── middleware/     # auth, authorize, validate, errorHandler
│       ├── models/         # 14 Mongoose models
│       ├── routes/         # feature routers + index
│       ├── services/       # reservation, order, payment, loyalty, report, notification
│       ├── validators/     # express-validator chains
│       ├── seed/           # seedData + seed script
│       └── app.js
├── docs/                   # SRS, class diagram, DB design, API docs, GitHub plan, tracker
└── .github/                # issue & PR templates
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js `^20.19.0` or `>=22.12.0`** — required by Vite 8 (the client build tool).
  Older Node 18 is no longer sufficient. Verified on Node v22.
- MongoDB running locally on `mongodb://127.0.0.1:27017` **or** a MongoDB Atlas URI

### 1. Install dependencies
```bash
# from the repo root (installs both workspaces)
npm install
```

### 2. Configure environment variables
```bash
# server
cp server/.env.example server/.env
# client
cp client/.env.example client/.env
```
Edit `server/.env` and set a strong `JWT_SECRET` (and `MONGO_URI` if using Atlas).

### 3. Seed the database
```bash
npm run seed          # creates test accounts, menu, categories, tables
```

### 4. Run the app
```bash
# option A — both together (from root)
npm run dev

# option B — separately
npm run server        # http://localhost:5000
npm run client        # http://localhost:5173
```

Open **http://localhost:5173**.

---

## 🔐 Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `PORT` | server | API port (default 5000) |
| `MONGO_URI` | server | MongoDB connection string |
| `JWT_SECRET` | server | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | server | Token lifetime (default 7d) |
| `CLIENT_URL` | server | Allowed CORS origin |
| `LOYALTY_EARN_RATE` | server | Points earned per 1 unit paid |
| `LOYALTY_REDEEM_VALUE` | server | Discount value per point |
| `VAT_RATE` | server | VAT applied on invoices |
| `VITE_API_URL` | client | Base API URL |

`.env` files are git-ignored — never commit secrets.

---

## 🧪 Test Accounts

All seeded accounts use password **`password123`**:

| Role | Email |
|------|-------|
| Admin | admin@dineease.com |
| Waiter | waiter@dineease.com |
| Cleaner | cleaner@dineease.com |
| Customer | customer@dineease.com |

---

## 📡 API Overview

Base URL: `http://localhost:5000/api`. All responses follow:
```json
{ "success": true, "message": "…", "data": {} }
```
See **[docs/api-documentation.md](docs/api-documentation.md)** for the full endpoint list.

Key groups: `/auth`, `/menu-items`, `/categories`, `/tables`, `/reservations`,
`/orders`, `/favourites`, `/reviews`, `/notifications`, `/cleaning`, `/staff`,
`/payments`, `/invoices`, `/loyalty`, `/admin`.

---

## 🧫 Testing

```bash
cd server && npm test
```
The suite (in-memory MongoDB — no real DB needed) currently runs **56 tests
across 5 suites, all passing**. It covers authentication, validation and
protected routes, plus regression tests for the audited correctness fixes:

- exact & partial-overlap reservation concurrency (parallel `Promise.all` → one 201, one 409) **and a deterministic sequential-overlap guard**;
- atomic reservation + pre-order (an invalid item leaves no reservation/order/slot);
- strict calendar-date rejection (e.g. `2026-02-31`) and seating-preference revalidation;
- future-reservation table-status separation;
- standalone takeaway creation, tableless dine-in rejection, unavailable-item rejection, concurrent order attachment;
- payment: cancelled-order rejection, fulfilment-status preservation, idempotency under retry/concurrency, invoice uniqueness, paid-order cancel block;
- cleaning: dining-window timing and idempotent single-task creation;
- role authorization on changed endpoints, including **customer-only loyalty** and **waiter/cleaner role separation**;
- **category** remove-in-use `409`, unused delete, rename + duplicate-name `409`, admin-only guard;
- **review** owner-eligibility, duplicate/foreign/pending/invalid-rating cases, truthful empty average;
- **malformed menu search** (`[`) returns a safe `200`, never a `500`;
- **refund extension** — eligibility, authorization (waiter/cleaner blocked), idempotency, concurrent request/process, loyalty reversal & redeemed-point restore, simulated failure, and refund-aware net revenue.

### Refund extension (F16 add-on)
A **simulated** refund flow beyond the formal F16 list: a customer requests a full
refund on their own paid order; an **admin only** processes or rejects it. Approval
is atomic and idempotent, reverses earned loyalty points and restores redeemed
points exactly once, marks the order refunded, and excludes the payment from net
revenue. The original invoice is preserved immutably. See
[docs/api-documentation.md](docs/api-documentation.md#refunds----refunds-f16-extension--user-requested-simulated).

---

## 📓 Sprint Progress

- **Sprint 0** — planning, MERN setup, MVC scaffold, DB design, auth foundation, seed data. ✅
- **Sprint 1** — Auth + F01, F02, F03, F04, F08, F09, F12, F13 (due 20 July 2026).
- **Sprint 2** — F05, F06, F10, F14.
- **Sprint 3** — F07, F11, F15, F16.
- **Sprint 4** — F17, F18, F19, F20.

See **[docs/roadmap.md](docs/roadmap.md)** and **[docs/contribution-tracker.md](docs/contribution-tracker.md)**.

---

## 🎨 UI & Ordering (recent enhancements)

- **Light-first theme with a complete dark mode.** All colour is driven by CSS
  custom properties keyed on a document `data-theme` attribute; a navbar toggle
  re-themes every surface and persists the choice in `localStorage`, with an
  inline head script preventing a theme flash on reload.
- **Anonymous menu browsing.** Visitors can browse the public menu; favourites,
  checkout, reservations and private history still require sign-in.
- **Order without a reservation.** A localStorage-backed cart with quantity
  controls, a slide-over drawer and a submit-locked checkout creates standalone
  **takeaway** orders via the existing `POST /api/orders`. Reservation-linked
  dine-in pre-ordering is preserved.
- **Real food imagery.** Every seeded dish has a stable image; a reusable
  `FoodImage` component adds lazy loading, fixed aspect ratios and a branded
  fallback for empty/broken URLs (no infinite `onError`). Admin menu management
  validates http(s) URLs and shows a live preview.
- **Reachable menu.** `Load More` uses API pagination metadata so every item
  (including the 13th, beyond the default page size of 12) is reachable.
- **Accessibility.** Keyboard-operable dialogs (focus trap, Escape, focus
  restoration), `:focus-visible` styles, labelled icon-only controls and
  `prefers-reduced-motion` support.

## ⚠️ Known Limitations

- The payment gateway is **simulated** (bKash/Nagad) — no real transactions.
- Notifications and staff queues are **polled** (15–20s), not WebSocket push.
- Invoice "download" uses the browser print-to-PDF dialog.
- Seeded food images use stable Unsplash CDN URLs (Unsplash License) rather than
  locally bundled assets; the `FoodImage` fallback covers any that fail to load.
  No admin file-upload storage is configured (URL-based images only).
- Reservations use fixed 30-minute start slots and a 90-minute dining window.

---

## 📄 License

Academic project for CSE470, BRAC University. Not licensed for commercial use.

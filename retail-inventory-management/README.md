# Retail Inventory Management System

A full-stack retail inventory platform for managing products, categories, warehouses, inventory, orders, suppliers, procurement, fulfillment, reporting, and dashboard analytics.

## Features

- Role-based user authentication and access control
- Product catalog with filtering and status management
- Multi-warehouse inventory tracking and transfers
- Order and fulfillment workflow
- Supplier and purchase order management
- Inventory alerts and dashboard analytics
- Demo-ready seed data

## Run project

```bash
npm run install:all
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Environment setup

Create `.env` in the project root from the example file. Replace the JWT placeholder with a unique random secret of at least 32 characters, set a reachable MongoDB connection string, and provide unique bootstrap administrator credentials (at least 12 characters for the password):

```bash
Copy-Item .env.example .env
```

Create the first administrator once:

```bash
npm --prefix backend run seed:admin
```

Set `ADMIN_SIGNUP_CODE` in the root `.env` to a long, private invite code and restart the backend to enable Admin signup from the login screen. Anyone with that code can create an Admin account. Alternatively, after signing in with a database-backed administrator, use **Settings → Add administrator**. Passwords are hashed before storage.

The application does not load sample records. Import or create your operational data after signing in. The LMS integration still requires its API documentation or a representative export and field mapping.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express.js, Mongoose
- Auth: JWT + bcryptjs
- Data Visualization: Recharts
- Icons: Lucide React

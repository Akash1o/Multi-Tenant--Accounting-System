# Multi-Tenant Accounting System

A robust, multi-tenant accounting application built to manage users, organizations, parties (customers/suppliers), and financial transactions. This system is designed to allow multiple organizations to operate independently within a single application instance, each managing their own members, contacts, and accounting records.

## Features

- **Multi-Tenancy:** Users can belong to multiple organizations with different roles (e.g., STAFF, ADMIN).
- **Authentication:** Secure OTP-based authentication using phone numbers, along with JWT for session management and refresh tokens.
- **Party Management:** Keep track of customers, suppliers, and other entities (parties) associated with an organization, including their current balance.
- **Transaction Tracking:** Record financial transactions (inflows/outflows) linked to specific parties and organizations.
- **Role-Based Access Control:** Differentiate access levels within an organization.
- **Modern UI:** Built with React, Tailwind CSS, Shadcn UI, and Framer Motion for a sleek, responsive, and dynamic user experience.

## Tech Stack

### Frontend (`CoreFrontend/react-ts`)
- **Framework:** React 19 (via Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4), Shadcn UI, framer-motion, tw-animate-css
- **State Management:** Zustand, React Hook Form
- **Routing:** React Router DOM
- **Data Fetching:** Axios

### Backend (`CoreBackend`)
- **Runtime:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Logging:** Winston

## Project Structure

```
MultiTenantAccounting/
├── CoreBackend/              # Node.js + Express Backend
│   ├── prisma/               # Database schema and migrations
│   ├── src/                  # Backend source code (routes, controllers, services)
│   ├── package.json
│   └── tsconfig.json
│
├── CoreFrontend/
│   └── react-ts/             # React + Vite Frontend
│       ├── src/              # Frontend source code (components, pages, store, etc.)
│       ├── package.json
│       └── vite.config.ts
└── README.md
```

## Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** (Running locally or hosted)

## Getting Started

### 1. Database Setup

Ensure you have PostgreSQL installed and running. Create a new database for the project.

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd CoreBackend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `CoreBackend` directory and add the necessary variables, such as:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/your_database_name?schema=public"
   JWT_SECRET="your-secret-key"
   JWT_REFRESH_SECRET="your-refresh-secret-key"
   ```
4. Run Prisma migrations to set up the database schema:
   ```bash
   npm run db:migrate
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd CoreFrontend/react-ts
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `CoreFrontend/react-ts` directory for any required frontend variables (e.g., API base URL).
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Database Schema Overview

The core entities in the Prisma schema are:
- `User`: Represents an application user (authenticated via phone number).
- `Organization`: Represents a tenant/company.
- `UserOrganization`: A mapping table defining a user's role within an organization.
- `Party`: Contacts (customers/suppliers) belonging to an organization.
- `Transaction`: Financial records linked to an organization and optionally a party.

To explore or modify the database visually, you can run Prisma Studio from the backend directory:
```bash
npm run db:studio
```

## License

ISC

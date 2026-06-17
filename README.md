# FLCut

FLCut is a URL shortener and link management platform built for Finite Loop Club (FLC).

It allows authorized FLC members to create and manage short links for registrations, workshops, resources, events, and club activities.

---

## Why I Built This

FLC frequently shares Google Forms, event registrations, workshop resources, and other links across WhatsApp groups, Instagram, posters, and presentations.

Most of these URLs are long and difficult to remember or share.

I wanted to build a platform where members can:

* Create short and clean URLs
* Manage links in one place
* Track usage through click analytics
* Control when links become active or inactive
* Restrict access to authorized FLC members only

---

## Features

### Authentication

* Google Sign In
* Only authorized FLC members can log in
* Student and faculty email verification
* Role based access control

### Link Management

* Create short links
* Custom aliases
* Auto generated aliases
* Edit existing links
* Delete links

### Smart Redirects

* Scheduled activation
* Expiry date support
* Click limits
* Alternate URL after limit is reached

### Analytics

* Total click tracking
* Click history storage
* Link performance monitoring

### Admin Panel

* View authorized users
* Enable or disable access
* Manage user permissions

---

## Tech Stack

* Next.js 16
* TypeScript
* Tailwind CSS
* Prisma ORM
* PostgreSQL (Neon)
* NextAuth v5

---

## Project Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd flcut
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

AUTH_SECRET=

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

### 4. Run database migrations

```bash
npx prisma migrate dev
```

---

### 5. Seed initial users

```bash
npm run seed
```

---

### 6. Start the application

```bash
npm run dev
```

Application will run on:

```text
http://localhost:3000
```

---

## User Roles

### Admin

* Full platform access
* User management
* Link management

### Manager

* Can manage links
* Can view and update links

### Creator

* Can create and manage their own links

---

## Project Structure

```text
src
├── app
│   ├── dashboard
│   ├── api
│   ├── actions
│   ├── unauthorized
│   └── [slug]
├── auth.ts
├── lib
├── types
└── prisma
```

---

## Documentation

Additional implementation details and technical decisions are available in:

```text
decisions.md
```

This document explains the major design choices, tradeoffs, and architecture decisions made during development.

---

## Future Improvements

* QR code generation
* Advanced analytics dashboard
* CSV exports
* Bulk link operations
* Better reporting tools

---

## Author

Shravya N Bhat
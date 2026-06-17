# Engineering Decisions

Author: Shravya N Bhat

This document explains some important decisions I made while building FLCut.

---

## Why Google OAuth?

FLC members already use Google accounts provided by the institution. Instead of building a username-password system, I used Google OAuth because it is simpler, more secure, and easier for users.

---

## Why Use an Allowlist?

Not every NMAMIT student should be able to access FLCut.

Only members present in the database are allowed to log in. This gives better control over who can use the platform.

---

## Why Separate Role and Position?

A person's position in FLC and their permissions in the application are different things.

For example:

* President → Position
* Admin → Permission

Keeping them separate makes the system easier to maintain if the committee structure changes.

---

## Why JWT Sessions?

JWT sessions are lightweight and simple to manage.

I still verify user authorization from the database whenever protected actions are performed, so access can be revoked immediately if needed.

---

## Why Store Analytics?

Even after a link expires, the click data can still be useful.

Organizers may want to see how many people visited a registration link after an event is over.

---

## Why Click Limits?

FLCut does not control the destination website.

Since registrations happen on external platforms like Google Forms, the only thing FLCut can reliably track is the number of clicks.

That is why I implemented click limits instead of registration limits.

---

## Why Prisma?

Prisma provides type safety and makes database operations easier to manage.

It also integrates very well with Next.js and PostgreSQL.

---

## Why Neon?

Neon provides a free PostgreSQL database with easy deployment support and works well with Vercel.

---

## What I Would Build Next

If I continue working on FLCut, I would add:

1. QR code generation
2. Analytics dashboard
3. CSV exports
4. Better reporting
5. Bulk operations for managers

These features were intentionally left for future versions so I could focus on building the core functionality first.

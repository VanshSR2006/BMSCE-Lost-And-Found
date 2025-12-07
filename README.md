📦 Lost & Found • BMSCE Portal
A full‑stack Lost & Found management system built for BMSCE students to quickly report lost items, post found items, and automatically get notified when a possible match is detected.

🚀 Features
User Authentication (Login / Signup / Logout)

Role‑based Access (User + Admin)

Post Lost / Found Items with description, images, location

Smart Notifications System

Alerts users when a newly created item matches their lost item

Real‑time notification badge + dropdown

Email Confirmation when a user claims an item

Admin Dashboard to manage posts, verify items, and moderate content

Dark/Light Theme Toggle

Responsive UI with clean UX

Fully deployed frontend + backend

🛠️ Tech Stack
Frontend
React + TypeScript

Vite

TailwindCSS

ShadCN UI

Context API (Auth + Notifications)

Backend
Node.js

Express

MongoDB + Mongoose

JWT Authentication

Nodemailer (Email system)

📡 API Features
JWT‑based login/signup

Endpoint to post lost/found items

Automatic match-checking logic

Notification creation & fetching

Admin routes for moderation

📬 Notifications System
Whenever someone posts a “found” item that resembles a user’s “lost” item:

A notification is created for that specific user

A badge appears in the navbar

The user can mark it “It’s mine” or “Not mine”

🚧 Future Improvements
AI‑based image similarity

Location-based smart scoring

Push notifications

Mobile app
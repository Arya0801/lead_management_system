# Lead Management Backend

This is the Express + MongoDB backend for the Lead Management System.

## Features
- JWT auth stored in httpOnly cookies
- Passwords hashed with bcrypt
- Leads CRUD (create, list with server-side pagination & filters, fetch single, update, delete)
- Server-side filters supporting equals/contains/in/gt/lt/between for numbers/dates
- Seed script to create test user + 100+ leads

## Setup (local)
1. Copy `.env` and update environment variables (MONGO_URI, JWT_SECRET, FRONTEND_URL).
2. Install dependencies:
   ```bash
   npm install

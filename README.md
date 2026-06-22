# Joka

AI automation for German-speaking local businesses — WhatsApp auto-replies, email triage, and calendar booking in one SaaS product.

![Next.js](https://img.shields.io/badge/Next.js_14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma) ![Anthropic](https://img.shields.io/badge/Claude_Haiku-191919?logo=anthropic) ![Stripe](https://img.shields.io/badge/Stripe-008CDD?logo=stripe&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel)

> GitHub repo: `joka` · package name: `jokaai`

## What it is

Small businesses lose customers because they can't respond fast enough to WhatsApp messages or stay on top of appointment-booking emails. Joka connects to a business's existing WhatsApp Business account and email inbox, uses Claude Haiku to draft context-aware replies and classify incoming messages, and writes directly to Google Calendar when a booking is confirmed. It's sold as a monthly Stripe subscription with a self-serve portal, so customers can upgrade, downgrade, or cancel without contacting support.

## Features

- **WhatsApp auto-replies** — incoming messages hit a HMAC-verified Meta webhook; Claude Haiku generates a reply using the business's configured name, hours, services, and custom instructions
- **Email classification & labeling** — Gmail (Pub/Sub push) and Outlook (Microsoft Graph subscriptions) deliver new messages in real time; Claude reads each email and applies labels / flags for human review when needed
- **Calendar booking** — appointment requests in email are parsed and written to Google Calendar via the Calendar API with OAuth write-scope
- **Stripe subscriptions** — checkout, webhook-driven status sync, and a self-serve customer portal; subscription state gates access to both products
- **Human-in-the-loop inbox** — a password-protected `/inbox` dashboard lets business owners pause the AI, review flagged conversations, and reply manually
- **Dual email provider support** — Google (OAuth + Gmail watch) and Microsoft (OAuth + Graph subscriptions) are both first-class, with per-provider token storage

## Tech stack

**Frontend**
- Next.js 14 App Router, TypeScript, Tailwind CSS
- PWA manifest, Vercel Analytics

**Backend**
- Next.js API routes (20+ endpoints)
- Prisma 5 + PostgreSQL (Supabase) — 8 models: `Customer`, `AutoChatConfig`, `Conversation`, `Message`, `MailPilotConfig`, `GoogleToken`, `MicrosoftToken`, plus enums
- NextAuth v4 with Prisma adapter; bcrypt password hashing for the inbox token flow

**AI**
- Anthropic Claude Haiku (`@anthropic-ai/sdk`) for WhatsApp reply generation and email classification

**Infra & integrations**
- Vercel (hosting + nightly cron at 03:00 UTC)
- Stripe (Checkout, webhooks, Customer Portal)
- Google APIs — Gmail watch (Pub/Sub push), Calendar read/write, OAuth token refresh
- Microsoft Graph — Outlook mail subscriptions, OAuth token refresh
- Resend (transactional email)

## How it works

1. **WhatsApp webhook** (`/api/whatsapp/webhook`) — Meta sends a POST with an HMAC-SHA256 signature; after verification the handler loads the business config, fetches conversation history from Postgres, calls Claude Haiku with a system prompt built from `businessName`, `openingHours`, and `services`, then POSTs the reply back to the Meta Graph API.
2. **Gmail push** (`/api/gmail/webhook`) — Google Pub/Sub delivers a push notification; the handler calls the Gmail History API with the stored `historyId`, fetches new messages, runs them through Claude for classification, updates labels, and persists the new `historyId`.
3. **Outlook subscriptions** (`/api/outlook/webhook`) — Microsoft Graph sends change notifications for new mail; the handler fetches the message via delta link, classifies it, and writes the result to the inbox.
4. **Calendar booking** — when Claude detects a booking request in an email it calls the Google Calendar API (with write-scoped `GoogleToken`) to create an event, then replies to the thread confirming the slot.
5. **Nightly renewal cron** (`/api/cron/renew-subscriptions`, `0 3 * * *`) — refreshes all Gmail watch subscriptions (which expire after 7 days) and Microsoft Graph subscriptions (which expire after 3 days) so push delivery never lapses silently.

## Status

Deployed and live at **[joka.chat](https://joka.chat)** — MVP with paying customers. Active development.

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET,
# ANTHROPIC_API_KEY, STRIPE_SECRET_KEY + WEBHOOK_SECRET,
# Google OAuth credentials, Microsoft OAuth credentials,
# RESEND_API_KEY, and META_APP_SECRET.

# 3. Set up the database
npx prisma generate
npx prisma migrate deploy

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For webhook development, use a tunnel (e.g. `ngrok`) and point the Meta, Google Pub/Sub, and Microsoft Graph subscription URLs at your local tunnel address.

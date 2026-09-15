# Resuma Production Checklist

Before launching to production, verify the following steps:

## 1. Database
- [ ] Ensure `DATABASE_URL` is pointing to a managed PostgreSQL instance (e.g., Supabase, Neon).
- [ ] Run `npx prisma db push` (or migrate) to ensure the latest schema is applied in production.
- [ ] If using a serverless provider (Vercel), ensure you are using connection pooling (e.g. PgBouncer or Supabase connection pool URL).

## 2. Authentication
- [ ] Generate a secure `NEXTAUTH_SECRET` using `openssl rand -base64 32`.
- [ ] Set `NEXTAUTH_URL` exactly to your production domain (e.g., `https://resuma.com`).

## 3. Stripe & Billing
- [ ] Ensure `STRIPE_SECRET_KEY` is a live key (`sk_live_...`), not a test key. The application will block payments in production if it detects a test key.
- [ ] Configure Stripe Webhooks in the Stripe Dashboard to point to `https://your-domain.com/api/webhooks/stripe`.
- [ ] Ensure the webhook is listening for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] Copy the webhook secret into `STRIPE_WEBHOOK_SECRET`.
- [ ] Create a Product/Price in Stripe for the PRO tier and set `STRIPE_PRO_MONTHLY_PRICE_ID`.

## 4. Security & Compliance
- [ ] Security Headers (CSP, X-Frame-Options, HSTS, etc.) are configured in `next.config.ts`.
- [ ] Rate limits (auth, resume creation, manual payments) are enforced. Note: `src/lib/rate-limit.ts` uses an in-memory cache. If deploying to a serverless edge (e.g., Vercel), this cache resets across cold starts. Consider moving to Redis (e.g., Upstash) for strict, distributed rate limiting at scale.
- [ ] Terms & Conditions and Privacy Policy pages are accessible to users during registration.

## 5. Build
- [ ] Run `npm run build` locally to ensure no TypeScript or linting errors block the build.

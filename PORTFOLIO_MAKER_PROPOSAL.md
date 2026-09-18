# Portfolio Maker Proposal

This document outlines the plan for introducing a "Portfolio Maker" feature in Resuma. This will allow users to generate a professional portfolio website alongside their resume, utilizing simple, modern templates.

## Proposed Features

1. **Portfolio Data Management**
   - A dedicated form interface in the dashboard for users to input their portfolio details:
     - **About/Bio:** Short introduction.
     - **Projects:** Title, description, image/screenshot, and external link.
     - **Skills:** List of technical or soft skills.
     - **Social Links:** GitHub, LinkedIn, Twitter, etc.

2. **Template System**
   - **Minimalist Template:** A clean, modern layout focusing on typography and spacing.
   - **Grid/Gallery Template:** Ideal for designers and developers to showcase project screenshots in a grid.
   - Users can switch between templates and preview changes in real-time.

## Hosting & Domain Strategy

We have three options for how user portfolios will be accessed on the web. Our strategy is to launch with Option 1, and eventually offer Option 3 as a premium feature.

### 1. Subdirectory (Initial Launch Strategy)
- **URL Format:** `resuma.com/p/juan-dela-cruz`
- **How it works:** Next.js dynamic routing (`/app/p/[username]/page.tsx`). We fetch the portfolio data based on the username parameter.
- **Pros:** Zero DNS or hosting configuration required. Free and instant for all users.

### 2. Subdomains (Mid-level)
- **URL Format:** `juan.resuma.com`
- **How it works:** Requires Wildcard DNS (`*.resuma.com`) on the domain provider, and Next.js Middleware to rewrite the request to the correct page route.
- **Pros:** Looks more professional than a subdirectory.

### 3. Custom Domains (Future Premium Feature)
- **URL Format:** `www.juandelacruz.com`
- **How it works:** Users connect their own purchased domains. If hosted on Vercel, this utilizes the Vercel Domains API. The user adds a CNAME or A Record, and Next.js Middleware maps it to their portfolio.
- **Pros:** The ultimate premium feature for a portfolio builder. Can be monetized via Stripe.

## Technical Implementation Approach

### 1. Database Changes
- **`prisma/schema.prisma` updates:**
  - Add `Portfolio` model (linked to User, stores template selection).
  - Add `Project` model (title, description, imageUrl, link).

### 2. Backend & APIs
- **`/api/portfolio` routes:**
  - Secure CRUD operations for portfolio data. 
  - Strictly follows our `backend-api-security` skill (Zod validation, error hiding, parameterized queries).

### 3. Frontend Development
- **Dashboard Workspace:** `/app/(dashboard)/dashboard/portfolio/page.tsx`
- **Template Components:** `src/components/portfolio/templates/*` (Built following the `frontend-best-practices` skill for premium aesthetics).
- **Public Route:** `/app/p/[username]/page.tsx` (To handle the Subdirectory hosting strategy).

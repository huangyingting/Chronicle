# Architecture Decision Records (ADR) — Chronicle Clone

## Context & Reverse-Engineering Summary

Using Playwright with authenticated session cookies from `.cred`, we systematically explored and reverse-engineered both:
1. **`https://chroniclehq.com`** — Marketing & growth website (20 routes including Home, AI Presentation Maker, API/MCP, Integrations, Gallery, Academy, Blog, Solutions, Sales, Product, Marketing, Agencies, Startups, Templates, Enterprise, Pricing, and Comparison pages).
2. **`https://app.chroniclehq.com`** — The Chronicle web application (Vite + React Router + XState + Apollo GraphQL + Yjs/Liveblocks + TipTap), capturing **95 high-resolution screenshots** in `/screenshots/marketing/` and `/screenshots/app/`, extracting all **185 GraphQL operations** (`docs/reference/graphql_operations.json`), and downloading all **19 official Themes** (`docs/reference/real_themes.json`) and **19 official Brand Kits** (`docs/reference/real_brandkits.json`).

---

## ADR-001: Unified Next.js App Router Monolith

- **Status:** Accepted
- **Context:** In production, Chronicle separates `chroniclehq.com` (Framer marketing site), `app.chroniclehq.com` (Vite React SPA), `api.chroniclehq.com` (Apollo GraphQL + REST Yjs API), and `auth-api.chroniclehq.com` (WorkOS AuthKit). For a self-contained, deployable full-stack clone, running four separate services adds operational friction.
- **Decision:** Build a unified **Next.js (App Router, TypeScript, Tailwind CSS)** application serving:
  - **Marketing & Documentation Routes** (`/`, `/ai-presentation-maker`, `/api-platform`, `/integrations`, `/gallery`, `/academy`, `/blog`, `/solutions`, `/sales`, `/product-use-case`, `/marketing`, `/agencies`, `/startups`, `/templates`, `/templates/[slug]`, `/enterprise`, `/pricing`, `/chronicle-vs-gamma`, `/chronicle-vs-pitch`, `/docs`)
  - **Authentication Routes** (`/login`, `/signup`, `/api/auth/[...nextauth]`)
  - **Authenticated Web Application Routes** (`/[workspaceId]/home`, `/[workspaceId]/brand-kit`, `/[workspaceId]/media-library`, `/[workspaceId]/chat`, `/[workspaceId]/chat/[sessionId]`, `/[workspaceId]/workspace/new`, `/[workspaceId]/document/[documentId]`, `/[workspaceId]/document/[documentId]/[sectionId]`, `/[workspaceId]/settings/[tab]`)
  - **Public Share & Duplication Routes** (`/share/[workspaceId]/[documentId]`, `/share/[workspaceId]/[documentId]/[sectionId]`, `/duplicate/[documentId]`)
  - **Backend API & GraphQL Compatibility Layer** (`/api/graphql` and REST endpoints under `/api/*` including `/api/v1/decks` for Chronicle MCP/API key access).
- **Consequences:** Single `npm run dev` / `npm run build` workflow, zero CORS issues, shared TypeScript types between frontend and backend, and exact URL parity with `app.chroniclehq.com`.

---

## ADR-002: NextAuth.js Authentication with Credentials, OAuth & MCP API Keys

- **Status:** Accepted
- **Context:** Chronicle uses WorkOS AuthKit for user sessions plus `chr_live_...` API keys for Chronicle MCP/agent integrations. The user requested **NextAuth** for authentication.
- **Decision:**
  - Use **NextAuth.js** (`/api/auth/[...nextauth]`) backed by Prisma (`User`, `Account`, `Session`) with JWT session strategy.
  - Provide a **Credentials Provider** (email + password, plus instant 1-click demo login and auto-registration) alongside optional Google/GitHub OAuth providers.
  - Support **Chronicle MCP/API Bearer Tokens** (`Authorization: Bearer chr_live_...`) on `/api/v1/*` and `/api/graphql` so external AI agents can list, create, and update presentations programmatically.
- **Consequences:** Seamless local login without external WorkOS keys, full multi-user workspace membership support, and working API key management in the `Chronicle MCP/API` modal.

---

## ADR-003: Dual-Target Prisma Persistence (SQLite Local Dev + PostgreSQL Production)

- **Status:** Accepted
- **Context:** The user requested Prisma with **SQLite for local development** and **PostgreSQL for production deployment**.
- **Decision:**
  - Maintain `prisma/schema.prisma` configured with `provider = "sqlite"` and `DATABASE_URL="file:./dev.db"` as the default local development schema.
  - Provide `prisma/schema.postgres.prisma` configured with `provider = "postgresql"` and scripts (`npm run db:use:sqlite`, `npm run db:use:postgres`, `npm run db:push`, `npm run db:seed`) to switch providers cleanly in CI/CD or production deployments.
  - Store hierarchical slide/widget trees and theme palettes as structured JSON columns (supported natively in PostgreSQL and as serialized JSON strings/fields in Prisma SQLite via transparent model helpers) alongside relational tables (`User`, `Workspace`, `WorkspaceMember`, `Folder`, `Document`, `Theme`, `BrandKit`, `MediaAsset`, `Template`, `MuseChatSession`, `ApiKey`).
- **Consequences:** Instant zero-dependency local setup (`file:./dev.db`) and 1-command switch to PostgreSQL in production.

---

## ADR-004: Smart Slide Canvas, 30+ Widget System & Theme/BrandKit Engine

- **Status:** Accepted
- **Context:** Chronicle's editor (`DocumentContainer.Live`) is distinguished from traditional slide tools by its dark studio chrome, floating bottom dock (`Insert`, `Media`, `Remix`, `Templates`, `Brand Kit`, `Background`), left slide scrubber + collapsible thumbnail drawer, and structured smart widgets.
- **Decision:**
  - Seed all **19 official Chronicle Themes** (`docs/reference/real_themes.json`) and **19 official Brand Kits** (`docs/reference/real_brandkits.json`) directly into the database.
  - Implement a structured **Slide & Widget Canvas Engine** supporting:
    - **Basic Widgets:** Heading, Paragraph, Numbers/Stat, List, Sticky Note, Quote, Divider, Link, Embed.
    - **Visuals & Media Widgets:** Image, Video, GIF, Unsplash Search, Icon, Bar/Line/Area/Donut Charts, Table, People Avatar Grid, Device Frame.
    - **Cards & Tiles Widgets:** Bento Box, Image Card, Fact Card, Feature Card, Metric KPI Card, Person Card, Quote Card.
    - **Comparison Widgets:** Comparison Matrix, Pros & Cons, Before & After.
    - **Chronology Widgets:** Timeline, Roadmap, Steps, Process Flow, Funnel, Pyramid.
  - Support **1-Click Layout Remixing** (`Switch layout`, `Swap sides`, `Compact`, `Expanded`, `Bento grid`, `Split columns`) that transforms a slide's widget arrangement non-destructively.
  - Support **Contextual Floating Widget Toolbar** (typography level `H1`/`H2`/`H3`/`Body`, font size, bold/italic/underline/strikethrough, alignment, color swatch, AI rewrite, duplicate, lock, delete), drag/resize handles, keyboard navigation (`ArrowUp`/`ArrowDown` between slides, `/` command menu, `Cmd+K` search, `Escape` to deselect), and fullscreen **Present Mode**.

---

## ADR-005: Muse AI Deck Generator & Inline Slide Copilot

- **Status:** Accepted
- **Context:** Chronicle features two primary AI entry points:
  1. **Start From Chat (`/:workspaceId/chat`)**: Full-screen prompt composer with style/theme selector, slide count (`Auto`, `Short 5-8`, `Medium 9-14`, `Detailed 15+`), quick category pills (`Update`, `Pitch`, `Roadmap`, `Report`, `Review`, `Custom`), and interactive storyline outline generation before generating the deck.
  2. **Inline `Ask Muse...` Bar in the Editor**: Floating bottom-right AI copilot that can add slides, rewrite selected widgets, summarize content, add KPI metrics, or remix slide layouts.
- **Decision:**
  - Implement `/api/ai/storyline`, `/api/ai/generate-deck`, and `/api/ai/muse` endpoints.
  - When `OPENAI_API_KEY` is configured in the environment, use LLM structured generation; when running offline or without external API keys, use a rich, domain-aware **Deterministic Presentation Storyline & Slide Synthesis Engine** that parses the user's topic, audience, and prompt to generate tailored multi-slide presentations with diverse widget layouts (Cover, Agenda, KPI Metrics, Charts, Comparison, Roadmap, Team, and Closing slides).
- **Consequences:** 100% functional AI storyline, deck generation, slide remixing, and inline Muse editing out-of-the-box with zero external API key requirement.

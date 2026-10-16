# Implementation Plan (PLAN) — Chronicle Clone

## Phase 1: Project Scaffolding & Dual-Database Prisma Setup
1. Initialize Next.js 15 TypeScript application with Tailwind CSS and App Router in `/home/azadmin/Chronicle`.
2. Configure Prisma ORM with:
   - `prisma/schema.prisma` (`sqlite`, `file:./dev.db` for local dev).
   - `prisma/schema.postgres.prisma` (`postgresql`, `env("DATABASE_URL")` for production).
   - Helper scripts in `package.json` (`db:push`, `db:seed`, `db:use:sqlite`, `db:use:postgres`).
3. Create `prisma/seed.ts` that imports:
   - All **19 official Chronicle Themes** from `docs/reference/real_themes.json`.
   - All **19 official Chronicle Brand Kits** from `docs/reference/real_brandkits.json`.
   - Default demo user (`alex@chroniclehq.com` / `chronicle123`) & team members (`Mayuresh Patole`, `Tejas Gawande`).
   - Default workspace (`Chronicle Studio`, ID `51cc6d69-94bb-40b1-9340-7f19eefcfdc8`, Max Plan).
   - Default folders (`Board & Investor Decks`, `Product Strategy`), media library assets, API key (`chr_live_...`), and Muse chat sessions.
   - Rich multi-slide decks matching the real captured Chronicle decks:
     - **Q3 Board Meeting & Investor Update** (`b703967e-998f-4a2e-8432-f324d58b7afa` — Cover, Agenda, Section Divider, Performance Highlights KPIs, Revenue & ARR Growth Chart, Strategic Priorities Roadmap, Competitive Matrix, Team & Culture, Decisions & Approvals).
     - **Getting Started with Chronicle** (`400a2996-474f-4e45-b38f-940604252e4d` — Interactive onboarding deck showcasing Smart Widgets, Remixing, Brand Kits, Muse AI, and Keyboard Shortcuts).
     - **Series B Investor Pitch Deck**, **2026 Product Strategy & Roadmap**, **Enterprise Sales Deck**, and **Agency Brand Proposal** templates.

## Phase 2: Authentication & API Layer
1. Implement NextAuth (`/api/auth/[...nextauth]`) with Credentials + Demo 1-Click Login + session callbacks.
2. Build `/login` and `/signup` pages matching `screenshots/marketing/21-auth-login-viewport.png` and WorkOS AuthKit styling.
3. Build REST & GraphQL API routes (`/api/workspaces`, `/api/documents`, `/api/folders`, `/api/brand-kits`, `/api/themes`, `/api/media`, `/api/ai/*`, `/api/v1/decks`, `/api/graphql`).

## Phase 3: Marketing Website & Documentation (`chroniclehq.com` Clone)
1. Build shared marketing navigation header (`Product`, `Resources`, `Solutions`, `Templates`, `Enterprise`, `Pricing`, `Login`, `Try for free`) and rich footer.
2. Implement all marketing routes:
   - `/` (Home with interactive hero deck preview, AI storyline showcase, Smart Widgets bento grid, Brand Kit showcase, and template carousel)
   - `/ai-presentation-maker`, `/api-platform` (and `/api` info page), `/integrations`, `/gallery`, `/academy`, `/blog`, `/solutions`, `/sales`, `/product-use-case`, `/marketing`, `/agencies`, `/startups`, `/templates`, `/templates/[slug]`, `/enterprise`, `/pricing`, `/chronicle-vs-gamma`, `/chronicle-vs-pitch`, and `/docs`.

## Phase 4: Web Application Core (`app.chroniclehq.com` Clone)
1. Build the unified App Sidebar (`Chronicle Studio / Max plan` switcher, `Media library`, `Templates`, `Brand Kit`, `Recents`, `My decks`, `Workspace`, `Shared with you`, `Settings`, `Chronicle MCP/API`, `Trash`, `Help & support`).
2. Implement **Workspace Home (`/[workspaceId]/home`)** with:
   - Tab views (`My decks`, `Recents`, `Workspace`, `Shared with you`).
   - `+ New folder`, `+ New deck`, `Generate with AI`, and `Search decks`.
   - Interactive folder cards and deck cards with multi-select, rename, duplicate, move to folder, share, and soft-delete to Trash.
   - **Templates Gallery Modal**, **Trash Restore/Purge Modal**, **Chronicle MCP/API Keys Modal**, and **Multi-tab Settings Modal** (`General`, `Members`, `Billing`, `Chronicle MCP/API`, `Account General`, `Appearance`, `Editor`).
3. Implement **Brand Kit (`/[workspaceId]/brand-kit`)** with Brand Kit creator/editor, official 19 Brand Kits, Custom Theme creator/editor (all 19 official themes), and Custom Font uploader.
4. Implement **Media Library (`/[workspaceId]/media-library`)** with `All`, `Workspace`, `Personal`, `Generated` tabs, upload modal, and AI image generator.
5. Implement **AI Muse / Start From Chat (`/[workspaceId]/chat` & `/[workspaceId]/chat/[sessionId]`)** with prompt composer, style/length selectors, quick category pills, interactive storyline outline editor, and 1-click deck synthesis.

## Phase 5: Live Slide Canvas Editor, Smart Widgets, Present Mode & Public Share
1. Implement **`/[workspaceId]/document/[documentId]` & `/[workspaceId]/document/[documentId]/[sectionId]`**:
   - Top-left breadcrumb bar (`Sidebar toggle`, editable Deck Title, `/ Slide X of N`).
   - Top-right action bar (`Share` modal, `Export` modal with PDF/Print, PPTX/JSON download, and PNG export, `Present` fullscreen mode).
   - Left vertical slide scrubber + collapsible **Slides Thumbnail Drawer** with section headers, slide reordering, duplication, deletion, and `+ New slide`.
   - Center **16:9 Interactive Slide Canvas** rendering all 30+ widget types across 12-column responsive layouts with inline text editing, purple selection bounding box, resize/span controls, and **Contextual Floating Widget Toolbar**.
   - Bottom-center **Floating Dock Toolbar**:
     - `🔍` Quick Command Palette
     - `+ Insert` (categorized 30+ widget menu with search filter)
     - `Media` (insert image/video/unsplash/AI image)
     - `Remix` (layout variations + AI remix instructions)
     - `Templates` (insert pre-designed slide templates)
     - `Brand Kit` (live theme & brand kit switcher)
     - `Background` (solid/gradient/image background with opacity, blur, and `Apply to all slides`)
   - Bottom-right **`Ask Muse...` AI Copilot** panel for natural-language slide edits and generation.
2. Implement **Public Share Viewer (`/share/[workspaceId]/[documentId]/[sectionId]`)** and **Duplicate Deck (`/duplicate/[documentId]`)**.

## Phase 6: Verification & End-to-End Playwright Testing
1. Run `npm run build` and verify zero TypeScript or Next.js build errors.
2. Start the production/dev server and run an automated Playwright E2E test suite verifying every marketing page, authentication flow, workspace dashboard, folder/deck CRUD, Brand Kit, Media Library, AI Chat generator, Slide Editor, Widget insertion, Layout Remix, Theme switching, Share modal, Export modal, Present mode, and MCP API.

# Engineering Tasks (TASKS) — Chronicle Clone

## 1. Reverse Engineering & Documentation
- [x] Load `.cred` cookies into Playwright and explore `https://chroniclehq.com` and `https://app.chroniclehq.com`
- [x] Capture 95 viewport and full-page screenshots across all 21 marketing/docs/auth pages and 46 webapp routes/modals/menus/slides (`/screenshots/marketing/` & `/screenshots/app/`)
- [x] Extract all 185 GraphQL operations (`docs/reference/graphql_operations.json`), 19 official Themes (`docs/reference/real_themes.json`), and 19 official Brand Kits (`docs/reference/real_brandkits.json`)
- [x] Author `docs/ADR.md`, `docs/PRD.md`, `docs/SPEC.md`, `docs/PLAN.md`, and `docs/TASKS.md`

## 2. Database, Auth & Seed Infrastructure
- [x] Scaffold Next.js 15 + TypeScript + Tailwind CSS project in `/home/azadmin/Chronicle`
- [x] Create `prisma/schema.prisma` (SQLite dev) and `prisma/schema.postgres.prisma` (PostgreSQL prod)
- [x] Seed database (`prisma/seed.ts`) with 19 real Themes, 19 real Brand Kits, default Workspace (`51cc6d69-94bb-40b1-9340-7f19eefcfdc8`), Demo User (`alex@chroniclehq.com`), Folders, Media Assets, API Keys, and full multi-slide decks (`Q3 Board Meeting & Investor Update` and `Getting started with Chronicle`)
- [x] Implement NextAuth (`/api/auth/[...nextauth]`), `/login`, `/signup`, `/start`, and `/[workspaceId]/workspace/new`
- [x] Implement REST & GraphQL API endpoints (`/api/workspaces`, `/api/documents`, `/api/folders`, `/api/themes`, `/api/brand-kits`, `/api/media`, `/api/ai/*`, `/api/v1/decks`, `/api/graphql`)

## 3. Marketing Website (`chroniclehq.com`)
- [x] Build Marketing Navigation Bar, Interactive Hero Deck Preview, and Footer
- [x] Implement `/` (Home), `/ai-presentation-maker`, `/api-platform`, `/integrations`, `/gallery`, `/academy`, `/blog`
- [x] Implement `/solutions`, `/sales`, `/product-use-case`, `/marketing`, `/agencies`, `/startups`, `/enterprise`
- [x] Implement `/templates`, `/templates/[slug]`, `/pricing`, `/chronicle-vs-gamma`, `/chronicle-vs-pitch`, `/docs`

## 4. Web Application Workspace, Brand Kit, Media Library & AI Chat (`app.chroniclehq.com`)
- [x] Implement `AppSidebar` with Workspace Switcher, `Recents`, `My decks`, `Workspace`, `Shared with you`, `Media library`, `Templates`, `Brand Kit`, `Settings`, `Chronicle MCP/API`, `Trash`
- [x] Implement `/[workspaceId]/home` with Folders CRUD, Decks CRUD, Search, Multi-select, Templates Gallery modal, Trash modal, MCP/API modal, and Settings modal (`General`, `Members`, `Billing`, `Chronicle MCP/API`, `Appearance`, `Editor`)
- [x] Implement `/[workspaceId]/brand-kit` with Brand Kits (`Google`, `Apple`, `OpenAI`, `+ Create brand kit`), Custom Themes (`+ Create theme`), and Custom Fonts (`+ Upload font`)
- [x] Implement `/[workspaceId]/media-library` with `All`, `Workspace`, `Personal`, `Generated` tabs, Media Upload, and AI Image Generation
- [x] Implement `/[workspaceId]/chat` & `/[workspaceId]/chat/[sessionId]` ("Ready to build your deck?" AI Muse prompt composer, quick category pills, interactive storyline outline editor, and 1-click deck generation)

## 5. Interactive Slide Canvas Editor, Smart Widgets & Sharing
- [x] Implement `/[workspaceId]/document/[documentId]` & `/[workspaceId]/document/[documentId]/[sectionId]`
- [x] Implement Top Bar (Document title rename, slide counter, `Share` popover, `Export` popover, `Present` mode)
- [x] Implement Left Slide Scrubber & Collapsible `Slides` Thumbnail Drawer with section headers, slide add/duplicate/delete/reorder
- [x] Implement 16:9 Interactive Slide Canvas with 30+ Smart Widget types (`Basic`, `Visuals & Media`, `Cards & Tiles`, `Compare`, `Chronology`), inline editing, purple bounding box, and Contextual Floating Widget Toolbar
- [x] Implement Bottom Floating Dock (`Search`, `+ Insert`, `Media`, `Remix`, `Templates`, `Brand Kit`, `Background`) and Bottom-Right `Ask Muse...` AI Copilot
- [x] Implement `/share/[workspaceId]/[documentId]/[sectionId]` public viewer and `/duplicate/[documentId]` flow

## 6. Verification & Testing
- [x] Verify production build (`npm run build`)
- [x] Run Playwright E2E test suite verifying all routes, UI combinations, and persistence

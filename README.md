# Chronicle — Full-Stack AI Presentation Studio Clone

Full-stack clone of **Chronicle** (`chroniclehq.com` & `app.chroniclehq.com`) built with **Next.js 16.4.2**, **NextAuth 4.24.15**, **Prisma 7.10.1** (SQLite for local development + PostgreSQL for production deployment), **Invite-Only Account Admission**, **Azure OpenAI**, and **Headless Chromium (Playwright)** production engines.

---

## Stack & Architecture

- **Framework**: Next.js 16.4.2 (App Router, React 19, TypeScript)
- **Authentication**: NextAuth 4.24.15 + custom scrypt password credentials (`PasswordCredential`) & Invite-Only Admission (`AccountInvitation`)
- **Database**: Prisma 7.10.1 with `@prisma/adapter-better-sqlite3` (`prisma/schema.prisma`) and `@prisma/adapter-pg` (`prisma/schema.postgres.prisma`)
- **AI Production Engine (`src/lib/production-engine/ai-provider.ts`)**:
  - Live Azure OpenAI integration (`AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT`) for 2-stage AI Muse storyline generation, 16:9 multi-slide deck widget synthesis, inline slide remixing, and 1920×1080 visual generation.
- **Website Brand Crawler (`src/lib/production-engine/live-crawler.ts`)**:
  - Live Playwright Chromium crawler that extracts real brand hex palettes, typography, logos, and screenshots from any company domain.
- **Server-Side Deck Exporter (`src/lib/production-engine/deck-exporter.ts`)**:
  - Headless Chromium renderer producing downloadable 16:9 multi-page `.pdf`, high-DPI `.png`, and standalone `.html` presentations.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Push schema & seed database (19 Studio Themes, 19 Brand Kits, sample decks, demo invitations)
npm run db:push
npm run db:seed

# 4. Bootstrap initial root administrator (CLI-only, no public HTTP bootstrap endpoint)
npm run bootstrap:admin -- --email admin@chroniclehq.com --password "chronicle-admin-2026" --name "Root Admin"

# 5. Build and start production server
npm run build
npm run start
```

---

## API Endpoints (`src/app/api/**` — 28 Route Files / 45 HTTP Handlers)

### Health & Diagnostics
- `GET /api/health` — Live DB connectivity, Azure OpenAI configuration, admission mode, and endpoint registry

### AI & Headless Deck API
- `GET | POST | PATCH /api/ai/storyline` — Stage 1 AI Muse storyline outline synthesis & editing
- `POST /api/ai/generate-deck` — Stage 2 full 16:9 slide & widget deck synthesis
- `POST /api/ai/muse` — Inline slide copilot (rewrite, metric injection, layout remix, add slide)
- `GET | POST /api/v1/decks` — Public REST & MCP Headless Deck Generation API
- `POST /api/graphql` — GraphQL compatibility gateway

### Authentication & Invite-Only Admission
- `GET | POST /api/auth/[...nextauth]` — NextAuth session & provider handler
- `GET /api/auth/invitation?token=...` — Validate invitation token status
- `POST /api/auth/register` — Invite-gated account registration (`403 invitation_required` without valid token)
- `POST /api/auth/password/login` — Scrypt password verification & session login
- `POST /api/auth/password/forgot` & `POST /api/auth/password/reset` — Password reset token workflow
- `POST /api/auth/logout` — Session sign-out
- `GET | POST /api/admin/invitations` — Admin invitation list & creation
- `PATCH | DELETE /api/admin/invitations/[id]` — Revoke or delete invitations
- `POST /api/admin/invitations/[id]/rotate` — Rotate invitation token & extend expiry

### Workspace, Documents, Brand Kit, Media & Export
- `GET | POST /api/workspaces` & `GET | PATCH | DELETE /api/workspaces/[workspaceId]`
- `GET | POST /api/documents` & `GET | PATCH | DELETE /api/documents/[documentId]`
- `POST /api/documents/[documentId]/export` — Live Playwright 16:9 PDF / PNG / HTML deck export
- `GET | POST /api/folders` & `PATCH | DELETE /api/folders/[folderId]`
- `GET | POST | PATCH | DELETE /api/brand-kits` — Live website brand crawler & Brand Kit CRUD
- `GET | POST /api/themes` — Studio Themes catalog & custom theme creation
- `GET | POST /api/templates` — Template gallery & one-click deck cloning
- `GET | POST | DELETE /api/media` — Media library & AI 1920×1080 visual generation
- `POST /api/uploads` — Multipart & base64 asset upload to `/public/uploads/files/`

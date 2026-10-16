# Technical Specification (SPEC) — Chronicle Clone

## 1. Technology Stack

- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Authentication:** NextAuth.js (`next-auth`) with Credentials + OAuth support & `chr_live_*` API Key authentication
- **Database & ORM:** Prisma ORM (`@prisma/client`)
  - Local Development: **SQLite** (`prisma/schema.prisma`, `file:./dev.db`)
  - Production Deployment: **PostgreSQL** (`prisma/schema.postgres.prisma`, `postgresql://...`)
- **Styling & UI:** Tailwind CSS + Lucide Icons + Custom Chronicle Design System tokens (`#0b0b0e` studio canvas, `#141419` elevated surface, `#a855f7` / `#7c5cff` Chronicle purple accent)
- **Testing:** Playwright E2E test suite verifying Marketing pages, Auth, Workspace Home, Brand Kits, Media Library, AI Generator, Slide Editor, Widget Insertion, Remix, Share, and Export.

---

## 2. Database Schema Specification (Prisma)

### 2.1 Core Models

```prisma
model User {
  id               String            @id @default(uuid())
  email            String            @unique
  passwordHash     String?
  fullName         String
  picture          String?
  onboardingStatus String            @default("COMPLETED")
  userConfigJson   String            @default("{}")
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  memberships      WorkspaceMember[]
  documents        Document[]
  apiKeys          ApiKey[]
  museSessions     MuseChatSession[]
}

model Workspace {
  id                         String            @id @default(uuid())
  name                       String
  slug                       String            @unique
  icon                       String?
  pricingPlanId              String            @default("e2860a7b-6550-4573-a1a0-bde7508be48b")
  defaultThemeId             String?
  apiKeyCreationScope        String            @default("ALL_MEMBERS")
  tokensUsed                 Int               @default(12)
  tokensLimit                Int               @default(2000)
  createdAt                  DateTime          @default(now())
  updatedAt                  DateTime          @updatedAt
  members                    WorkspaceMember[]
  folders                    Folder[]
  documents                  Document[]
  themes                     Theme[]
  brandKits                  BrandKit[]
  mediaAssets                MediaAsset[]
  apiKeys                    ApiKey[]
  museSessions               MuseChatSession[]
}

model WorkspaceMember {
  id          String    @id @default(uuid())
  workspaceId String
  userId      String
  role        String    @default("OWNER") // OWNER | ADMIN | MEMBER | GUEST
  createdAt   DateTime  @default(now())
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

model Folder {
  id          String    @id @default(uuid())
  workspaceId String
  name        String
  parentId    String?
  scope       String    @default("WORKSPACE") // PERSONAL | WORKSPACE | SHARED
  isShared    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  documents   Document[]
}

model Document {
  id                                 String    @id @default(uuid())
  workspaceId                        String
  authorId                           String?
  folderId                           String?
  title                              String
  scope                              String    @default("WORKSPACE") // PERSONAL | WORKSPACE | SHARED
  workspaceAccess                    String    @default("EDIT")      // EDIT | VIEW | NONE
  isPublic                           Boolean   @default(true)
  isPublicDocumentDuplicationEnabled Boolean   @default(true)
  showWatermark                      Boolean   @default(false)
  themeId                            String?
  brandKitId                         String?
  previewUrl                         String?
  viewCount                          Int       @default(1)
  sortOrder                          Int       @default(0)
  slidesJson                         String    // JSON array of SlideSection objects
  collaboratorsJson                  String    @default("[]")
  deletedAt                          DateTime?
  deletedBy                          String?
  createdAt                          DateTime  @default(now())
  updatedAt                          DateTime  @updatedAt
  workspace                          Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  author                             User?     @relation(fields: [authorId], references: [id], onDelete: SetNull)
  folder                             Folder?   @relation(fields: [folderId], references: [id], onDelete: SetNull)
}

model Theme {
  id          String     @id @default(uuid())
  workspaceId String?
  name        String
  isCustom    Boolean    @default(false)
  isDefault   Boolean    @default(false)
  dataJson    String     // Full Chronicle theme token payload from real_themes.json
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  workspace   Workspace? @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}

model BrandKit {
  id          String     @id @default(uuid())
  workspaceId String?
  name        String
  isDefault   Boolean    @default(false)
  colorsJson  String     // Array of brand colors
  logosJson   String     // Array of brand logos
  themesJson  String     // Associated theme IDs/objects
  fontsJson   String     @default("[]")
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  workspace   Workspace? @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}

model MediaAsset {
  id          String    @id @default(uuid())
  workspaceId String
  url         String
  type        String    @default("IMAGE") // IMAGE | VIDEO | GIF | ICON
  source      String    @default("UPLOAD") // UPLOAD | GENERATED | UNSPLASH
  mediaAccess String    @default("WORKSPACE") // WORKSPACE | PERSONAL
  fileName    String
  dimensions  String    @default("{\"width\":1920,\"height\":1080}")
  colors      String    @default("[\"#0d2238\",\"#7c5cff\"]")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}

model Template {
  id          String   @id @default(uuid())
  slug        String   @unique
  name        String
  description String
  author      String   @default("Chronicle")
  category    String
  previewUrl  String
  themeId     String?
  slidesJson  String   // Full multi-slide template definition
  createdAt   DateTime @default(now())
}

model MuseChatSession {
  id          String    @id @default(uuid())
  workspaceId String
  userId      String?
  name        String
  prompt      String
  style       String    @default("Midnight")
  slideCount  Int       @default(8)
  outlineJson String    // Array of storyline sections
  messagesJson String   // Array of { id, role, content, createdAt }
  documentId  String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
}

model ApiKey {
  id          String    @id @default(uuid())
  workspaceId String
  userId      String
  name        String
  maskedKey   String
  rawKeyHash  String
  lastUsedAt  DateTime?
  revokedAt   DateTime?
  createdAt   DateTime  @default(now())
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 3. Slide & Widget JSON Schema (`SlideSection` & `SlideWidget`)

Each document stores an ordered array of `SlideSection` objects in `slidesJson`:

```ts
export interface SlideBackground {
  type: "solid" | "gradient" | "image";
  color: string;
  gradient?: string;
  imageUrl?: string;
  opacity?: number; // 0 - 100
  blur?: number;    // 0 - 20
}

export interface SlideWidget {
  id: string;
  type:
    | "heading" | "paragraph" | "numbers" | "list" | "sticky-note" | "quote" | "divider" | "link" | "embed"
    | "image" | "video" | "gif" | "icon" | "chart" | "table" | "people" | "device-frame"
    | "box" | "image-card" | "fact" | "feature" | "metric" | "person" | "quote-card"
    | "comparison" | "pros-cons" | "before-after"
    | "timeline" | "roadmap" | "steps" | "process" | "funnel" | "pyramid";
  colSpan: 1 | 2 | 3 | 4 | 6 | 12; // 12-column responsive smart grid
  title?: string;
  subtitle?: string;
  content?: string;
  value?: string;       // e.g., "$84.2M", "+118%"
  delta?: string;       // e.g., "+34% YoY"
  badge?: string;       // e.g., "01 PERFORMANCE REVIEW"
  items?: Array<{
    id: string;
    label: string;
    value?: string;
    description?: string;
    status?: string;
    avatar?: string;
    role?: string;
  }>;
  chartType?: "bar" | "area" | "line" | "donut";
  chartData?: Array<{ label: string; value: number; secondary?: number }>;
  tableHeaders?: string[];
  tableRows?: string[][];
  imageUrl?: string;
  style?: {
    align?: "left" | "center" | "right";
    fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    accentColor?: string;
    surfaceColor?: string;
    textColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    locked?: boolean;
  };
}

export interface SlideSection {
  id: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  layoutVariant: "cover" | "agenda" | "section-divider" | "bento-3" | "bento-2" | "split-left" | "split-right" | "metrics-4" | "single-focus";
  background: SlideBackground;
  widgets: SlideWidget[];
  notes?: string;
}
```

---

## 4. API & GraphQL Endpoints

1. **`POST /api/graphql`**: Supports Chronicle GraphQL operations (`UserDetails`, `Workspaces`, `DocumentsTree`, `Themes`, `BrandKits`, `Document`, `PlanUsage`, `ListApiKeys`, etc.) for client compatibility.
2. **`GET / POST /api/workspaces`** & **`PATCH / DELETE /api/workspaces/[workspaceId]`**: Workspace CRUD, member invites, settings updates, and API key management.
3. **`GET / POST /api/documents`** & **`GET / PATCH / DELETE /api/documents/[documentId]`**: Create, update slides/widgets/themes/backgrounds, duplicate, soft-delete to trash, restore, or permanently delete decks.
4. **`POST /api/folders`** & **`PATCH / DELETE /api/folders/[folderId]`**: Folder creation, renaming, sharing, and moving decks into folders.
5. **`GET / POST /api/brand-kits`** & **`GET / POST /api/themes`**: Manage workspace Brand Kits, Custom Themes, and Custom Fonts.
6. **`GET / POST / DELETE /api/media`**: Upload, AI-generate, list, and delete workspace media library assets.
7. **`POST /api/ai/storyline`**, **`POST /api/ai/generate-deck`**, **`POST /api/ai/muse`**:
   - Generate multi-section storylines from topic/prompt.
   - Generate complete multi-slide decks from storyline outlines.
   - Run inline Muse AI actions (`rewrite`, `summarize`, `make-visual`, `split-slide`, `add-metrics`, `add-slide`, or freeform chat instruction).
8. **`GET / POST /api/v1/decks`**: Public Chronicle MCP/REST API authenticated via `Authorization: Bearer chr_live_...` header.

# Product Requirements Document (PRD) — Chronicle Clone

## 1. Product Overview

**Chronicle** ("Credible decks at the speed of AI") is a next-generation AI storytelling and presentation platform designed for founders, executives, product leaders, sales teams, and agencies. Unlike traditional slide software that requires manual box-pushing, Chronicle combines an AI presentation agent (**Muse**), designer-crafted **Templates**, automatic **Brand Kits**, and interactive **Smart Widgets** on a responsive grid canvas.

All requirements below are derived from Playwright reverse-engineering and visual inspection of `https://chroniclehq.com` and `https://app.chroniclehq.com` (see `/screenshots/marketing/*` and `/screenshots/app/*`).

---

## 2. Target Personas & Core Use Cases

1. **Founders & Executives:** Creating Series A/B pitch decks, quarterly board meeting decks, and investor updates.
2. **Product & Engineering Leaders:** Authoring product strategy narratives, Q1–Q4 roadmaps, and launch reviews.
3. **Sales & GTM Teams:** Generating tailored customer pitch decks and competitive comparisons via UI or Chronicle MCP/API.
4. **Agencies & Designers:** Enforcing client brand kits (logos, custom fonts, color palettes, custom themes) across reusable templates.

---

## 3. Marketing Website Requirements (`chroniclehq.com`)

The marketing experience must provide high-craft dark & light editorial aesthetics matching the captured screenshots in `/screenshots/marketing/`:

| Route | Page Title / Hero Headline | Key Sections & Interactive Features |
|---|---|---|
| `/` | **Credible decks at the speed of AI** | Sticky top nav (`Product`, `Resources`, `Solutions`, `Templates`, `Enterprise`, `Pricing`, `Login`, `Try for free`), interactive deck showcase, AI storyline demo, Smart Widgets bento grid, Brand Kit preview, Template carousel, customer testimonials, footer |
| `/ai-presentation-maker` | **Go from idea to presentation in minutes** | Interactive prompt-to-deck demo, 3-step AI workflow, feature deep-dives, FAQ accordion |
| `/api-platform` (`/api`) | **The presentation layer for AI agents** | Chronicle MCP & REST API documentation preview, code snippets (`curl`, TypeScript, Python, Claude Desktop MCP config), API key CTA |
| `/integrations` | **Chronicle integrations** | Interactive integration directory (Figma, Loom, YouTube, Google Sheets, Notion, Linear, Miro, Typeform, Pitch, PDF/PPTX) |
| `/gallery` | **The world's most beautiful decks** | Filterable showcase of public Chronicle decks with live preview modal |
| `/academy` | **Chronicle Academy** | Video tutorials and storytelling masterclasses (Getting Started, AI Prompting, Designing with Widgets, Brand Kits) |
| `/blog` | **Chronicle Blog** | Product announcements, storytelling guides, and design articles |
| `/solutions` | **Solutions for every team** | Role-based overview linking to Sales, Product, Marketing, Agencies, Startups, and Enterprise |
| `/sales`, `/product-use-case`, `/marketing`, `/agencies`, `/startups` | **Use-Case Landing Pages** | Dedicated vertical landing pages with tailored templates, metrics, and workflows |
| `/templates` & `/templates/[slug]` | **Presentation Templates** | Searchable, category-filtered template library (`Pitch Decks`, `Board Meetings`, `Product`, `Sales`, `Marketing`, `Startups`) + template detail page with live slide preview and **"Use this template"** button that opens directly in the editor |
| `/enterprise` | **Built for serious business** | SOC2/GDPR security posture, SSO/SAML, custom branding governance, dedicated support |
| `/pricing` | **Simple, transparent pricing** | Monthly/Annual billing toggle, 4 tiers (`Free` $0, `Pro` $12/mo, `Plus` $25/mo, `Max` $45/mo), feature comparison matrix, token usage FAQ |
| `/chronicle-vs-gamma`, `/chronicle-vs-pitch` | **Competitor Comparison Pages** | Side-by-side feature & design quality breakdowns |
| `/docs` | **Chronicle Documentation** | Quickstart guide, MCP skill installation (`npx skills add ...`), REST API & webhook reference |

---

## 4. Web Application Requirements (`app.chroniclehq.com`)

### 4.1 Authentication & Onboarding (`/login`, `/signup`, `/start`, `/[workspaceId]/workspace/new`)
- Email/password sign-in & sign-up, plus 1-click **"Continue with Demo Account"** (`Alex Rivera — Chronicle Studio Max Plan`).
- Onboarding flow (`/start`) capturing user role, presentation use cases, and visual style preferences.
- Workspace creation route (`/[workspaceId]/workspace/new`) with workspace name, icon, and initial member invites.

### 4.2 Workspace Home & Deck Management (`/[workspaceId]/home`)
- **Left Sidebar Navigation:**
  - Workspace switcher dropdown (`Chronicle Studio · Max plan`, switch/create workspace).
  - Primary links: `Media library`, `Templates`, `Brand Kit`.
  - Deck views: `Recents`, `My decks`, `Workspace`, `Shared with you`.
  - Bottom links: `Settings`, `Chronicle MCP/API`, `Trash`, `Help & support`.
- **Main Content Area:**
  - Header action bar: `+ New folder`, `+ New deck`, `Generate with AI` (purple accent button), and real-time `Search decks` filter.
  - **Folders Grid:** Visual folder cards showing deck count and shared badge; create, rename, move decks into folders, share folders, and delete folders.
  - **Decks Grid:** Rich 16:9 thumbnail preview cards with title, slide count, last updated timestamp, folder badge, quick actions (Open, Rename, Duplicate, Move to Folder, Share, Move to Trash), multi-select support, and drag/keyboard reordering.
  - **Templates Modal/Tab:** Browse official Chronicle templates, preview all slides, and click **Use Template** to clone into the workspace.
  - **Trash Modal:** View soft-deleted decks (`Deleted on`, `Deleted by`), **Restore**, or **Delete permanently**.

### 4.3 Brand Kit & Custom Themes (`/[workspaceId]/brand-kit`)
- **Brand Kits Management:** View official & custom Brand Kits (e.g., `Google`, `Apple`, `OpenAI`, `Chronicle Studio`), set workspace `Default` brand kit, or click **`+ Create brand kit`** (domain lookup, logos, brand colors, typography, brand voice).
- **Custom Themes:** View and edit all 19 official Chronicle themes (`Dark`, `Light`, `Byte Labs`, `Midnight`, `Ivory`, `Cobalt`, `Emerald`, `Sunset`, etc.) plus create custom themes with background, surface, heading, body, and accent color palettes.
- **Custom Fonts:** Upload or register custom font families for workspace slides.

### 4.4 Media Library (`/[workspaceId]/media-library`)
- Filter tabs: `All`, `Workspace`, `Personal`, `Generated`.
- Upload image/video assets (via file upload or URL), generate AI images from prompts, inspect image dimensions & dominant color swatches, copy asset into clipboard/slides, or delete media.

### 4.5 AI Presentation Generator — Start From Chat (`/[workspaceId]/chat` & `/[workspaceId]/chat/[sessionId]`)
- **Prompt Composer:** "Ready to build your deck?" centered studio interface with:
  - Topic/audience/key-points multi-line prompt input.
  - Attachment button (`+` import text/markdown/notes), `Auto` slide count selector (`Auto`, `6 slides`, `8 slides`, `12 slides`), and `Style` / Theme selector.
  - Quick category pills: `Update`, `Pitch`, `Roadmap`, `Report`, `Review`, `Custom`.
- **Interactive Storyline & Chat Session (`/[workspaceId]/chat/[sessionId]`):**
  - Displays user prompt, Muse AI assistant response, and an editable **Slide-by-Slide Storyline Outline** (reorder, add, edit, or remove sections).
  - **"Generate Deck"** CTA that synthesizes the complete multi-slide presentation and redirects into the live editor.

### 4.6 Live Slide Canvas Editor (`/[workspaceId]/document/[documentId]/[sectionId]`)
- **Top Left Bar:** Sidebar drawer toggle, editable Document Title, breadcrumb `/ Slide X of N`, save status indicator.
- **Top Right Bar:** Muse AI status icon, `Share` popover, `Export` popover, `Present` fullscreen launcher, `...` document actions menu.
- **Left Slide Rail & Drawer:**
  - Compact vertical tick scrubber showing current slide position and section dividers.
  - Clicking `Slides` opens the **Slide Thumbnail Drawer** with live mini-previews, section headers, drag/up/down slide reordering, duplicate slide, delete slide, and `+ New slide`.
- **Interactive 16:9 Slide Canvas:**
  - Renders themed background (solid, gradient, or background image with opacity/blur).
  - Renders structured header/eyebrow badges, titles, subtitles, and a responsive multi-column **Smart Widget Grid**.
  - Clicking any widget selects it with a `#a855f7` purple bounding frame and opens the **Contextual Floating Widget Toolbar** (heading level, font size, bold/italic/underline, alignment, color picker, column span `1x`/`2x`/`3x`, AI Rewrite, Duplicate, Delete).
  - Double-clicking text edits inline with live persistence.
- **Bottom Center Floating Dock:**
  - `🔍` Quick Command / Search palette (`Cmd+K`).
  - **`+ Insert`**: Full categorized widget insertion popover (`Search widgets`, `Basic`, `Visuals & Media`, `Cards & Tiles`, `Compare`, `Chronology`).
  - **`Media`**: Insert from Workspace Media Library, curated photography, icons, or AI image generator.
  - **`Remix`**: Instant layout variations (`Switch layout`, `Swap sides`, `Compact`, `Expanded`, `Bento Grid`) + AI slide remix instructions (`Summarize`, `Make visual`, `Split slide`, `Add metrics`).
  - **`Templates`**: Insert a pre-designed slide template (Cover, Agenda, Section Divider, 4-KPI Metrics, Revenue Chart, Competitor Matrix, Product Roadmap, Team Bios, Quote Callout).
  - **`Brand Kit`**: Live 1-click theme and brand kit switcher that restyles the entire deck or current slide immediately.
  - **`Background`**: Preset colors (`Dark`, `Light`, `Accent`), custom color, gradient, or background image with `Opacity` and `Blur` sliders + `Apply to all slides`.
- **Bottom Right Floating `Ask Muse...` Copilot:**
  - Expandable AI chat panel anchored to the current slide: ask Muse to generate a new slide, rewrite slide copy for executives, add a chart/metric card, or translate/condense the slide.

### 4.7 Share, Export, Present & Settings Modals
- **Share Popover:** Invite collaborators by email (`Can edit` / `Can view`), Workspace access level, `Publish to web` toggle, view counter (`142 views`), and `Copy public link` (`/share/[workspaceId]/[documentId]/[sectionId]`).
- **Export Popover:** Export to **PDF / Print-ready Slides**, Export to **PowerPoint (`.pptx` / JSON deck bundle)**, Export current slide as **PNG image**, and `Include Chronicle watermark` toggle.
- **Present Mode:** Fullscreen distraction-free presentation player with keyboard arrow navigation, slide counter hud, laser pointer toggle, and `Escape` to exit.
- **Settings Modal (`General`, `Members`, `Billing`, `Chronicle MCP/API`, `Appearance`, `Editor`):**
  - Update workspace name/icon, invite/remove members, inspect Max Plan token usage (`12 / 2000 used`) and upcoming invoice, create/revoke `chr_live_...` MCP API keys, and toggle dark/light appearance and smart snaplines.

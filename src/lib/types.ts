export type WidgetCategory =
  | "Basic"
  | "Visuals & Media"
  | "Cards & Tiles"
  | "Compare"
  | "Chronology";

export type WidgetType =
  | "heading"
  | "paragraph"
  | "numbers"
  | "list"
  | "bullet-list"
  | "numbered-list"
  | "callout"
  | "sticky-note"
  | "quote"
  | "divider"
  | "link"
  | "link-card"
  | "embed"
  | "figma"
  | "youtube"
  | "loom"
  | "tweet"
  | "image"
  | "video"
  | "gif"
  | "unsplash"
  | "icon"
  | "icon-card"
  | "mosaic"
  | "hover-card"
  | "chart"
  | "chart-bar"
  | "chart-line"
  | "progress-ring"
  | "table"
  | "comparison-table"
  | "people"
  | "person-card"
  | "device-frame"
  | "box"
  | "image-card"
  | "fact"
  | "feature"
  | "metric"
  | "StatBox"
  | "person"
  | "quote-card"
  | "comparison"
  | "pros-cons"
  | "before-after"
  | "swot"
  | "timeline"
  | "roadmap"
  | "steps"
  | "process"
  | "process-steps"
  | "gantt"
  | "funnel"
  | "pyramid";

export interface SlideBackground {
  type: "solid" | "gradient" | "image";
  preset?: "dark" | "light" | "accent";
  color: string;
  gradient?: string;
  imageUrl?: string;
  opacity?: number;
  blur?: number;
}

export interface WidgetItem {
  id: string;
  label: string;
  value?: string;
  delta?: string;
  description?: string;
  status?: string;
  role?: string;
  avatar?: string;
  tag?: string;
  accent?: string;
  progress?: number;
}

export interface SlideWidget {
  id: string;
  type: WidgetType;
  colSpan: number;
  title?: string;
  subtitle?: string;
  content?: string;
  value?: string;
  delta?: string;
  badge?: string;
  imageUrl?: string;
  videoUrl?: string;
  embedUrl?: string;
  mediaUrl?: string;
  iconName?: string;
  items?: WidgetItem[];
  chartType?: "bar" | "area" | "line" | "donut";
  chartData?: Array<{ label: string; value: number; secondary?: number }>;
  tableHeaders?: string[];
  tableRows?: string[][];
  columns?: string[];
  rows?: string[][];
  style?: {
    align?: "left" | "center" | "right";
    fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    headingLevel?: "H1" | "H2" | "H3" | "P";
    accentColor?: string;
    surfaceColor?: string;
    textColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    locked?: boolean;
  };
}

export interface SlideSection {
  id: string;
  title: string;
  sectionGroup?: string;
  eyebrow?: string;
  subtitle?: string;
  layoutVariant: string;
  background: SlideBackground;
  widgets: SlideWidget[];
  notes?: string;
}

export interface WidgetCatalogEntry {
  type: WidgetType;
  label: string;
  category: WidgetCategory;
  description: string;
  defaultColSpan: 3 | 4 | 6 | 8 | 12;
  createDefault: () => Omit<SlideWidget, "id">;
}

export const WIDGET_CATALOG: WidgetCatalogEntry[] = [
  // Basic
  {
    type: "heading",
    label: "Heading",
    category: "Basic",
    description: "Display headline or section title",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "heading",
      colSpan: 12,
      title: "Key strategic takeaway for this section",
      subtitle: "Add supporting narrative context that anchors the slide.",
      style: { headingLevel: "H1", fontSize: "2xl", bold: true }
    })
  },
  {
    type: "paragraph",
    label: "Paragraph",
    category: "Basic",
    description: "Rich body copy and narrative text",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "paragraph",
      colSpan: 6,
      title: "Executive Context",
      content:
        "Our enterprise adoption accelerated significantly this quarter, driven by multi-seat expansion and automated brand governance workflows."
    })
  },
  {
    type: "numbers",
    label: "Numbers",
    category: "Basic",
    description: "High-impact hero stat or percentage",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "numbers",
      colSpan: 4,
      badge: "NORTH STAR METRIC",
      value: "94.8%",
      delta: "+12.4% QoQ",
      title: "Enterprise Gross Retention",
      content: "Across 1,420 active customer workspaces"
    })
  },
  {
    type: "list",
    label: "List",
    category: "Basic",
    description: "Structured bulleted or numbered checklist",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "list",
      colSpan: 6,
      title: "Core Priorities",
      items: [
        { id: "i1", label: "Scale enterprise self-serve onboarding", status: "done" },
        { id: "i2", label: "Launch Chronicle MCP & Agent API v2", status: "done" },
        { id: "i3", label: "Expand custom Brand Kit governance", status: "in-progress" }
      ]
    })
  },
  {
    type: "sticky-note",
    label: "Sticky note",
    category: "Basic",
    description: "Highlighted annotation or workshop callout",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "sticky-note",
      colSpan: 4,
      badge: "ANNOTATION",
      title: "Discussion Note",
      content: "Confirm Q1 headcount allocation with Finance before finalizing regional GTM targets.",
      style: { surfaceColor: "#fef08a", textColor: "#18181b" }
    })
  },
  {
    type: "quote",
    label: "Quote",
    category: "Basic",
    description: "Editorial pull-quote with attribution",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "quote",
      colSpan: 6,
      content: "“Chronicle cut our board deck preparation time from two weeks to 45 minutes while raising visual quality across the board.”",
      title: "Elena Rostova",
      subtitle: "VP of Strategy, LinearFlow"
    })
  },
  {
    type: "divider",
    label: "Divider",
    category: "Basic",
    description: "Horizontal visual separator line with label",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "divider",
      colSpan: 12,
      badge: "SECTION BREAK",
      title: "Key Supporting Evidence"
    })
  },
  {
    type: "link",
    label: "Link",
    category: "Basic",
    description: "Interactive bookmark card to external resource",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "link",
      colSpan: 4,
      title: "Q4 Financial Data Room",
      subtitle: "docs.chroniclehq.com/ir-2026",
      embedUrl: "https://docs.chroniclehq.com/introduction",
      content: "Live interactive model & cohort breakdown"
    })
  },
  {
    type: "embed",
    label: "Embed",
    category: "Basic",
    description: "Embed Figma, Loom, YouTube, or live web preview",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "embed",
      colSpan: 6,
      badge: "LIVE EMBED",
      title: "Interactive Product Prototype",
      subtitle: "figma.com/file/chronicle-v3-canvas",
      embedUrl: "https://chroniclehq.com"
    })
  },

  // Visuals & Media
  {
    type: "image",
    label: "Image",
    category: "Visuals & Media",
    description: "High-resolution visual with caption",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "image",
      colSpan: 6,
      title: "Visual Architecture",
      subtitle: "Next-generation responsive slide canvas",
      imageUrl: "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg"
    })
  },
  {
    type: "video",
    label: "Video",
    category: "Visuals & Media",
    description: "Inline video player card",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "video",
      colSpan: 6,
      badge: "PRODUCT DEMO · 02:14",
      title: "Muse AI Agent Walkthrough",
      subtitle: "Watch how Chronicle turns raw notes into board-ready slides",
      imageUrl: "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg"
    })
  },
  {
    type: "gif",
    label: "GIFs",
    category: "Visuals & Media",
    description: "Animated motion callout",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "gif",
      colSpan: 4,
      badge: "MOTION",
      title: "Smart Widget Snap",
      imageUrl: "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg"
    })
  },
  {
    type: "unsplash",
    label: "Unsplash",
    category: "Visuals & Media",
    description: "Curated editorial photography",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "unsplash",
      colSpan: 6,
      badge: "UNSPLASH EDITORIAL",
      title: "Global Enterprise Footprint",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
    })
  },
  {
    type: "icon",
    label: "Icon",
    category: "Visuals & Media",
    description: "Vector icon badge with title",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "icon",
      colSpan: 4,
      iconName: "Sparkles",
      title: "AI-First Workflow",
      content: "Generate outlines, remix layouts, and polish executive copy in one click."
    })
  },
  {
    type: "chart",
    label: "Charts",
    category: "Visuals & Media",
    description: "Bar, Area, Line, or Donut data visualization",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "chart",
      colSpan: 6,
      badge: "ARR TRAJECTORY ($M)",
      title: "Quarterly ARR Growth",
      subtitle: "+68% YoY Net New ARR expansion",
      chartType: "bar",
      chartData: [
        { label: "Q1", value: 48, secondary: 36 },
        { label: "Q2", value: 59, secondary: 42 },
        { label: "Q3", value: 71, secondary: 51 },
        { label: "Q4", value: 84.2, secondary: 60 }
      ]
    })
  },
  {
    type: "table",
    label: "Table",
    category: "Visuals & Media",
    description: "Structured data table with formatted cells",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "table",
      colSpan: 12,
      title: "Quarterly Financial Summary",
      tableHeaders: ["Metric", "Q2 Actual", "Q3 Actual", "Q4 Target", "YoY Change"],
      tableRows: [
        ["Annual Recurring Revenue", "$59.0M", "$71.4M", "$84.2M", "+68%"],
        ["Net Dollar Retention", "114%", "116%", "118%", "+400 bps"],
        ["Gross Margin (Non-GAAP)", "74%", "76%", "78%", "+400 bps"],
        ["CAC Payback Period", "14 mos", "12 mos", "11 mos", "-3 mos"]
      ]
    })
  },
  {
    type: "people",
    label: "People",
    category: "Visuals & Media",
    description: "Leadership or team roster grid",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "people",
      colSpan: 12,
      title: "Executive Leadership Team",
      items: [
        { id: "p1", label: "Dominic Huntley", role: "Chief Executive Officer", tag: "Product & Vision" },
        { id: "p2", label: "Mayuresh Patole", role: "Chief Technology Officer", tag: "Platform & AI" },
        { id: "p3", label: "Elena Rostova", role: "VP of Revenue", tag: "Global GTM" },
        { id: "p4", label: "Marcus Vance", role: "VP of Design", tag: "Brand Systems" }
      ]
    })
  },
  {
    type: "device-frame",
    label: "Device frame",
    category: "Visuals & Media",
    description: "Browser or mobile mockup showcase",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "device-frame",
      colSpan: 6,
      badge: "LIVE PRODUCT",
      title: "Chronicle Studio 3.0 Workspace",
      subtitle: "app.chroniclehq.com",
      imageUrl: "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg"
    })
  },

  // Cards & Tiles
  {
    type: "box",
    label: "Box",
    category: "Cards & Tiles",
    description: "Clean bento container card",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "box",
      colSpan: 4,
      badge: "PILLAR 01",
      title: "Enterprise Governance",
      content: "Centralized Brand Kits, custom fonts, and role-based permissions ensure every deck stays 100% on-brand."
    })
  },
  {
    type: "image-card",
    label: "Image Card",
    category: "Cards & Tiles",
    description: "Visual card with image header and body copy",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "image-card",
      colSpan: 4,
      badge: "CASE STUDY",
      title: "Global Design Systems",
      content: "How top design teams scale executive storytelling across 40+ markets.",
      imageUrl: "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg"
    })
  },
  {
    type: "fact",
    label: "Fact",
    category: "Cards & Tiles",
    description: "Evidence callout card with source citation",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "fact",
      colSpan: 4,
      badge: "MARKET INSIGHT",
      value: "3.4x",
      title: "Faster Decision Velocity",
      content: "Teams using structured visual storylines close executive alignment 3.4x faster than slide-heavy decks."
    })
  },
  {
    type: "feature",
    label: "Feature",
    category: "Cards & Tiles",
    description: "Product capability card with status badge",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "feature",
      colSpan: 4,
      badge: "SHIPPED",
      title: "Chronicle MCP Server",
      content: "Generate and update live Chronicle decks directly from Claude, Cursor, or custom AI agents."
    })
  },
  {
    type: "metric",
    label: "Metric",
    category: "Cards & Tiles",
    description: "KPI tile with trend indicator and spark bar",
    defaultColSpan: 3,
    createDefault: () => ({
      type: "metric",
      colSpan: 3,
      badge: "ARR",
      value: "$84.2M",
      delta: "+68% YoY",
      title: "Annual Recurring Revenue",
      content: "Exceeded Q4 board plan by $4.2M"
    })
  },
  {
    type: "person",
    label: "Person",
    category: "Cards & Tiles",
    description: "Speaker or stakeholder profile card",
    defaultColSpan: 4,
    createDefault: () => ({
      type: "person",
      colSpan: 4,
      title: "Dominic Huntley",
      subtitle: "CEO & Co-Founder, Byte Labs",
      badge: "PRESENTER",
      content: "Leading 2026 strategic priorities and enterprise product expansion."
    })
  },
  {
    type: "quote-card",
    label: "Quote Card",
    category: "Cards & Tiles",
    description: "Customer testimonial card with rating badge",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "quote-card",
      colSpan: 6,
      badge: "CUSTOMER VOICE",
      content: "“Every board member asked what tool we used to build our Q3 review. Chronicle is in a league of its own.”",
      title: "Sarah Jenkins",
      subtitle: "COO, Acme Cloud"
    })
  },

  // Compare
  {
    type: "comparison",
    label: "Comparison",
    category: "Compare",
    description: "Side-by-side competitive or option comparison",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "comparison",
      colSpan: 12,
      title: "Why Teams Switch to Chronicle",
      items: [
        {
          id: "c1",
          label: "Legacy Slide Tools",
          value: "Manual box-pushing",
          description: "Hours spent aligning text boxes, inconsistent fonts, static layouts that break on mobile."
        },
        {
          id: "c2",
          label: "Chronicle AI Studio",
          value: "Credible decks in minutes",
          description: "AI storyline generation, responsive Smart Widgets, 1-click Remix, and automatic Brand Kits."
        }
      ]
    })
  },
  {
    type: "pros-cons",
    label: "Pros & Cons",
    category: "Compare",
    description: "Balanced trade-off analysis card",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "pros-cons",
      colSpan: 12,
      title: "Strategic Option Evaluation",
      items: [
        { id: "pc1", label: "Accelerates enterprise ACV expansion (+42%)", status: "pro" },
        { id: "pc2", label: "Zero additional infrastructure overhead", status: "pro" },
        { id: "pc3", label: "Requires dedicated solutions engineering onboarding", status: "con" },
        { id: "pc4", label: "90-day enterprise procurement cycle", status: "con" }
      ]
    })
  },
  {
    type: "before-after",
    label: "Before & After",
    category: "Compare",
    description: "Transformation state comparison",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "before-after",
      colSpan: 12,
      title: "Workflow Transformation",
      items: [
        {
          id: "ba1",
          label: "BEFORE CHRONICLE",
          value: "14 Hours / Deck",
          description: "Fragmented Google Docs outlines, manual slide formatting, and off-brand sales decks."
        },
        {
          id: "ba2",
          label: "WITH CHRONICLE + MUSE AI",
          value: "18 Minutes / Deck",
          description: "Instant storyline generation, locked Brand Kits, and live collaborative web sharing."
        }
      ]
    })
  },

  // Chronology
  {
    type: "timeline",
    label: "Timeline",
    category: "Chronology",
    description: "Sequential milestone timeline",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "timeline",
      colSpan: 12,
      title: "2026 Execution Milestones",
      items: [
        { id: "t1", badge: "Q1 2026", label: "Muse 2.0 Launch", description: "Storyline agent + inline slide remixing" },
        { id: "t2", badge: "Q2 2026", label: "Chronicle MCP & API", description: "Programmatic deck generation for AI agents" },
        { id: "t3", badge: "Q3 2026", label: "Enterprise Brand Governance", description: "Custom fonts, SSO, and workspace permissions" },
        { id: "t4", badge: "Q4 2026", label: "Global Scale", description: "100k+ active teams & bidirectional PPTX sync" }
      ]
    })
  },
  {
    type: "roadmap",
    label: "Roadmap",
    category: "Chronology",
    description: "Multi-track product & GTM roadmap",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "roadmap",
      colSpan: 12,
      title: "Product & Platform Roadmap",
      items: [
        { id: "r1", tag: "NOW", label: "Smart Widget Grid 3.0", description: "30+ interactive widget blocks & instant layout remixing", status: "done" },
        { id: "r2", tag: "NEXT", label: "Bi-directional PowerPoint Export", description: "Editable native .pptx export with custom fonts", status: "in-progress" },
        { id: "r3", tag: "LATER", label: "Live CRM & Warehouse Sync", description: "Real-time Snowflake, Looker, and HubSpot metric bindings", status: "planned" }
      ]
    })
  },
  {
    type: "steps",
    label: "Steps",
    category: "Chronology",
    description: "Numbered step-by-step progression",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "steps",
      colSpan: 12,
      title: "How Chronicle Works in 3 Steps",
      items: [
        { id: "s1", value: "01", label: "Start from a prompt or notes", description: "Paste your doc, brief, or prompt into Muse AI to structure a compelling storyline." },
        { id: "s2", value: "02", label: "Remix with Smart Widgets", description: "Snap metrics, charts, timelines, and bento cards into place without manual alignment." },
        { id: "s3", value: "03", label: "Share live or export anywhere", description: "Present full-screen, share an interactive web link, or export to PDF & PowerPoint." }
      ]
    })
  },
  {
    type: "process",
    label: "Process",
    category: "Chronology",
    description: "Connected horizontal process pipeline",
    defaultColSpan: 12,
    createDefault: () => ({
      type: "process",
      colSpan: 12,
      title: "Enterprise Deal Velocity Pipeline",
      items: [
        { id: "pr1", label: "Discovery", value: "Day 1", description: "Capture customer pain points" },
        { id: "pr2", label: "AI Tailored Deck", value: "Day 2", description: "Generate custom pitch via MCP" },
        { id: "pr3", label: "Executive Review", value: "Day 7", description: "Interactive shared deck analytics" },
        { id: "pr4", label: "Closed Won", value: "Day 14", description: "3.4x faster cycle time" }
      ]
    })
  },
  {
    type: "funnel",
    label: "Funnel",
    category: "Chronology",
    description: "Conversion funnel visualization",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "funnel",
      colSpan: 6,
      title: "PLG to Enterprise Conversion Funnel",
      items: [
        { id: "f1", label: "Workspace Signups", value: "120,000", delta: "100%" },
        { id: "f2", label: "Active Deck Creators", value: "68,400", delta: "57%" },
        { id: "f3", label: "Shared Team Workspaces", value: "24,900", delta: "21%" },
        { id: "f4", label: "Paid Pro / Plus / Max", value: "8,950", delta: "7.5%" }
      ]
    })
  },
  {
    type: "pyramid",
    label: "Pyramid",
    category: "Chronology",
    description: "Hierarchical strategy pyramid",
    defaultColSpan: 6,
    createDefault: () => ({
      type: "pyramid",
      colSpan: 6,
      title: "Strategic Architecture",
      items: [
        { id: "py1", label: "01 · Category Leadership", description: "Default storytelling standard for modern business" },
        { id: "py2", label: "02 · AI Storyline + Smart Widgets", description: "10x faster creation with designer-grade output" },
        { id: "py3", label: "03 · Brand Governance & MCP Ecosystem", description: "API-first extensibility and enterprise controls" }
      ]
    })
  }
];

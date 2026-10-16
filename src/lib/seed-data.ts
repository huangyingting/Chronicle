import { SlideSection, SlideWidget } from "./types";

export const DEFAULT_WORKSPACE_ID = "51cc6d69-94bb-40b1-9340-7f19eefcfdc8";
export const DOC_BOARD_ID = "b703967e-998f-4a2e-8432-f324d58b7afa";
export const DOC_INTRO_ID = "400a2996-474f-4e45-b38f-940604252e4d";
export const DOC_SERIES_B_ID = "c814078f-112a-4c9b-9410-a12b3c4d5e6f";
export const DOC_PRODUCT_ID = "d925189a-223b-4d0c-a521-b23c4d5e6f7a";
export const DEFAULT_USER_ID = "4b29f9a8-afd5-4f58-832c-073d9d234192";

export const BOARD_MEETING_SLIDES: SlideSection[] = [
  {
    id: "94f27e3a-b5bd-4c5d-865c-9a6fe1f334cf",
    title: "Cover",
    sectionGroup: "Cover",
    eyebrow: "BYTE LABS · Q4 2025",
    subtitle: "December 2025 · Presented by Dominic Huntley, CEO",
    layoutVariant: "cover",
    background: {
      type: "image",
      preset: "dark",
      color: "#09192b",
      imageUrl:
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      opacity: 65,
      blur: 0
    },
    widgets: [
      {
        id: "bm-w-1",
        type: "heading",
        colSpan: 12,
        badge: "BYTE LABS · BOARD OF DIRECTORS",
        title: "BOARD MEETING",
        subtitle: "Q4 2025 Executive Review & 2026 Strategic Plan",
        style: { headingLevel: "H1", fontSize: "3xl", bold: true }
      },
      {
        id: "bm-w-2",
        type: "person",
        colSpan: 6,
        badge: "PRESENTED BY",
        title: "Dominic Huntley, CEO",
        subtitle: "Byte Labs Inc.",
        content: "Joined by Executive Leadership & Finance"
      },
      {
        id: "bm-w-3",
        type: "fact",
        colSpan: 6,
        badge: "DATE & DURATION",
        value: "December 2025",
        title: "⏱️ 60 Mins · Confidential",
        content: "Q4 2025 Formal Board Session"
      }
    ]
  },
  {
    id: "slide-board-agenda",
    title: "Agenda",
    sectionGroup: "Agenda",
    eyebrow: "MEETING STRUCTURE · ⏱️ 60 MINS",
    subtitle: "Eight core topics covering performance, strategy, financials, and governance",
    layoutVariant: "agenda",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0a1624"
    },
    widgets: [
      {
        id: "bm-ag-1",
        type: "steps",
        colSpan: 6,
        title: "Part I · Performance & Strategy",
        items: [
          { id: "ag1", value: "01", label: "PERFORMANCE REVIEW", description: "Q4 KPIs, ARR growth & operational velocity" },
          { id: "ag2", value: "02", label: "STRATEGIC PRIORITIES 2026", description: "AI agent platform & enterprise expansion" },
          { id: "ag3", value: "03", label: "PRODUCT & CUSTOMER HIGHLIGHTS", description: "Muse 2.0 adoption & Fortune 500 wins" },
          { id: "ag4", value: "04", label: "FINANCIAL + OPERATIONAL HEALTH", description: "Gross margin, burn multiple & cash runway" }
        ]
      },
      {
        id: "bm-ag-2",
        type: "steps",
        colSpan: 6,
        title: "Part II · Organization & Governance",
        items: [
          { id: "ag5", value: "05", label: "CULTURE & TALENT UPDATES", description: "Executive hires & engineering retention" },
          { id: "ag6", value: "06", label: "KEY RISKS & MITIGATIONS", description: "Enterprise security & competitive moat" },
          { id: "ag7", value: "07", label: "DECISIONS & APPROVALS", description: "2026 operating budget & equity pool" },
          { id: "ag8", value: "08", label: "DISCUSSION & CLOSING", description: "Executive session & Q&A" }
        ]
      }
    ]
  },
  {
    id: "slide-board-sec1",
    title: "01 Performance Review",
    sectionGroup: "01 PERFORMANCE REVIEW",
    eyebrow: "SECTION 01",
    subtitle: "Quarterly execution against board plan",
    layoutVariant: "section-divider",
    background: {
      type: "gradient",
      preset: "dark",
      color: "#0b1d33",
      gradient: "linear-gradient(135deg, #09182a 0%, #143352 55%, #0a1420 100%)"
    },
    widgets: [
      {
        id: "bm-sec1-w1",
        type: "heading",
        colSpan: 12,
        badge: "01 · PERFORMANCE REVIEW",
        title: "Record Enterprise Momentum in Q4",
        subtitle: "Outperformed net new ARR target by 18% while improving Rule of 40 efficiency score to 62%.",
        style: { headingLevel: "H1", fontSize: "3xl", bold: true }
      }
    ]
  },
  {
    id: "slide-board-highlights",
    title: "Performance Highlights",
    sectionGroup: "01 PERFORMANCE REVIEW",
    eyebrow: "01 PERFORMANCE REVIEW · EXECUTIVE SUMMARY",
    subtitle: "Key financial and operational metrics for Q4 2025",
    layoutVariant: "metrics-4",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0b1420"
    },
    widgets: [
      {
        id: "bm-m1",
        type: "metric",
        colSpan: 3,
        badge: "ENDING ARR",
        value: "$84.2M",
        delta: "+68% YoY",
        title: "Annual Recurring Revenue",
        content: "$4.2M above Q4 board plan target"
      },
      {
        id: "bm-m2",
        type: "metric",
        colSpan: 3,
        badge: "RETENTION",
        value: "118%",
        delta: "+400 bps",
        title: "Net Dollar Retention",
        content: "Driven by enterprise seat & token expansion"
      },
      {
        id: "bm-m3",
        type: "metric",
        colSpan: 3,
        badge: "EFFICIENCY",
        value: "78.4%",
        delta: "+280 bps",
        title: "Non-GAAP Gross Margin",
        content: "Inference cost optimization via caching"
      },
      {
        id: "bm-m4",
        type: "metric",
        colSpan: 3,
        badge: "CUSTOMERS",
        value: "1,420",
        delta: "+310 QoQ",
        title: "Enterprise Workspaces",
        content: "Accounts >$50K ACV grew 92% YoY"
      },
      {
        id: "bm-chart-1",
        type: "chart",
        colSpan: 8,
        badge: "REVENUE TRAJECTORY ($M)",
        title: "Quarterly ARR Expansion (2025)",
        subtitle: "Consistent beat-and-raise across all four quarters",
        chartType: "bar",
        chartData: [
          { label: "Q1 '25", value: 52.4, secondary: 48.0 },
          { label: "Q2 '25", value: 61.8, secondary: 57.0 },
          { label: "Q3 '25", value: 72.1, secondary: 68.0 },
          { label: "Q4 '25", value: 84.2, secondary: 80.0 }
        ]
      },
      {
        id: "bm-quote-1",
        type: "box",
        colSpan: 4,
        badge: "KEY TAKEAWAY",
        title: "Enterprise ACV Inflection",
        content:
          "Chronicle MCP & Brand Kit governance unlocked company-wide rollouts across 38 Fortune 500 enterprises in Q4, reducing average sales cycle from 46 days to 19 days."
      }
    ]
  },
  {
    id: "slide-board-financials",
    title: "Key Metrics & Financial Health",
    sectionGroup: "01 PERFORMANCE REVIEW",
    eyebrow: "04 FINANCIAL + OPERATIONAL HEALTH",
    subtitle: "Full P&L and efficiency scorecard against plan",
    layoutVariant: "bento-2",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0b1420"
    },
    widgets: [
      {
        id: "bm-tbl-1",
        type: "table",
        colSpan: 12,
        title: "Q4 2025 Financial Scorecard",
        tableHeaders: ["Metric", "Q3 Actual", "Q4 Plan", "Q4 Actual", "Variance", "YoY Growth"],
        tableRows: [
          ["Ending ARR", "$72.1M", "$80.0M", "$84.2M", "+$4.2M (+5.3%)", "+68%"],
          ["Net New ARR", "$10.3M", "$7.9M", "$12.1M", "+$4.2M (+53%)", "+84%"],
          ["Gross Margin", "76.8%", "77.0%", "78.4%", "+140 bps", "+280 bps"],
          ["Free Cash Flow Margin", "+8.2%", "+10.0%", "+14.5%", "+450 bps", "+1,100 bps"],
          ["Cash & Marketable Securities", "$142.0M", "$146.5M", "$154.8M", "+$8.3M", "48+ mos runway"]
        ]
      }
    ]
  },
  {
    id: "slide-board-roadmap",
    title: "Strategic Priorities 2026",
    sectionGroup: "02 STRATEGIC PRIORITIES 2026",
    eyebrow: "02 STRATEGIC PRIORITIES 2026",
    subtitle: "Three core bets to reach $160M ARR in FY2026",
    layoutVariant: "bento-3",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0b1420"
    },
    widgets: [
      {
        id: "bm-rm-1",
        type: "roadmap",
        colSpan: 12,
        title: "2026 Product & GTM Execution Roadmap",
        items: [
          {
            id: "r1",
            tag: "Q1 2026 · SHIPPED",
            label: "Muse Agent 2.0 & Storyline Copilot",
            description: "Autonomous deck generation from raw docs, PDFs, and warehouse metrics",
            status: "done"
          },
          {
            id: "r2",
            tag: "Q2 2026 · IN PROGRESS",
            label: "Chronicle MCP & Agent API Ecosystem",
            description: "Native presentation layer for Claude, Cursor, ChatGPT, and custom enterprise agents",
            status: "in-progress"
          },
          {
            id: "r3",
            tag: "H2 2026 · PLANNED",
            label: "Enterprise Brand Governance & Bi-Directional PPTX",
            description: "Automated brand compliance, SAML SCIM 2.0, and round-trip PowerPoint editing",
            status: "planned"
          }
        ]
      }
    ]
  },
  {
    id: "slide-board-team",
    title: "Culture & Talent Updates",
    sectionGroup: "05 CULTURE & TALENT UPDATES",
    eyebrow: "05 CULTURE & TALENT UPDATES",
    subtitle: "World-class product, AI research, and GTM leadership",
    layoutVariant: "bento-2",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0b1420"
    },
    widgets: [
      {
        id: "bm-team-1",
        type: "people",
        colSpan: 12,
        title: "Executive Leadership & Key Q4 Additions",
        items: [
          { id: "p1", label: "Dominic Huntley", role: "Chief Executive Officer", tag: "Strategy & Product" },
          { id: "p2", label: "Mayuresh Patole", role: "Chief Technology Officer", tag: "Canvas & AI Systems" },
          { id: "p3", label: "Tejas Gawande", role: "Head of Design Systems", tag: "Smart Widgets & Brand" },
          { id: "p4", label: "Elena Rostova", role: "VP of Enterprise Sales", tag: "Joined Q4 ex-Figma" }
        ]
      }
    ]
  },
  {
    id: "slide-board-decisions",
    title: "Decisions & Approvals",
    sectionGroup: "07 DECISIONS & APPROVALS",
    eyebrow: "07 DECISIONS & APPROVALS",
    subtitle: "Formal board resolutions requested at today's meeting",
    layoutVariant: "bento-2",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0b1420"
    },
    widgets: [
      {
        id: "bm-dec-1",
        type: "list",
        colSpan: 6,
        title: "Resolutions for Board Vote",
        items: [
          { id: "d1", label: "Approve FY2026 Operating Plan ($160M ARR target)", status: "done" },
          { id: "d2", label: "Approve Q1–Q2 R&D compute budget for Muse 2.0", status: "done" },
          { id: "d3", label: "Ratify Q4 executive option grants & 2026 refresh pool", status: "in-progress" }
        ]
      },
      {
        id: "bm-dec-2",
        type: "pros-cons",
        colSpan: 6,
        title: "Strategic Expansion Trade-offs",
        items: [
          { id: "pc1", label: "Captures enterprise AI agent standardization wave", status: "pro" },
          { id: "pc2", label: "Maintains >12% positive Free Cash Flow margin", status: "pro" },
          { id: "pc3", label: "Requires 18 net-new enterprise AE & SE hires in H1", status: "con" }
        ]
      }
    ]
  }
];

export const GETTING_STARTED_SLIDES: SlideSection[] = [
  {
    id: "c763b2e4-aff4-45e7-a3bd-b9d5f2034af8",
    title: "Welcome to Chronicle",
    sectionGroup: "Welcome",
    eyebrow: "GETTING STARTED GUIDE",
    subtitle: "Credible decks at the speed of AI",
    layoutVariant: "cover",
    background: {
      type: "gradient",
      preset: "dark",
      color: "#0c0c10",
      gradient: "radial-gradient(circle at 80% 20%, rgba(139,92,246,0.32), transparent 55%), linear-gradient(180deg, #0c0c10 0%, #12121a 100%)"
    },
    widgets: [
      {
        id: "gs-w-1",
        type: "heading",
        colSpan: 12,
        badge: "WELCOME TO CHRONICLE",
        title: "Getting started with Chronicle",
        subtitle: "Learn how to generate, remix, and present high-craft decks in minutes.",
        style: { headingLevel: "H1", fontSize: "3xl", bold: true }
      },
      {
        id: "gs-w-2",
        type: "box",
        colSpan: 4,
        badge: "01 · GENERATE",
        title: "Prompt, Paste, or Import",
        content: "Turn rough notes, briefs, or prompts into a structured storyline with Muse AI."
      },
      {
        id: "gs-w-3",
        type: "box",
        colSpan: 4,
        badge: "02 · DESIGN",
        title: "Smart Widgets that Snap",
        content: "Insert 30+ interactive widgets—KPI cards, charts, comparisons, and roadmaps—without box-pushing."
      },
      {
        id: "gs-w-4",
        type: "box",
        colSpan: 4,
        badge: "03 · BRAND & SHARE",
        title: "1-Click Brand Kits",
        content: "Apply your company's colors, logos, and fonts automatically, then publish to web or export to PPTX/PDF."
      }
    ]
  },
  {
    id: "d64b0416-c9a0-4533-8488-39f0af19cce7",
    title: "Generating a deck",
    sectionGroup: "1. Generating",
    eyebrow: "STEP 01 · AI GENERATION",
    subtitle: "Go from idea to structured presentation in seconds",
    layoutVariant: "bento-3",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0d0d12"
    },
    widgets: [
      {
        id: "gs-s2-1",
        type: "steps",
        colSpan: 12,
        title: "Generating a deck: Prompt, paste or import",
        items: [
          {
            id: "st1",
            value: "01",
            label: "Describe your topic & audience",
            description: "Click 'Generate with AI' and tell Muse who you're presenting to and what matters most."
          },
          {
            id: "st2",
            value: "02",
            label: "Refine the storyline outline",
            description: "Review, reorder, or add sections before Chronicle generates a single slide."
          },
          {
            id: "st3",
            value: "03",
            label: "Pick your Brand Kit or Theme",
            description: "Select from 19 designer themes or your custom workspace Brand Kit."
          }
        ]
      }
    ]
  },
  {
    id: "gs-slide-3-widgets",
    title: "Editing with Smart Widgets",
    sectionGroup: "2. Editing",
    eyebrow: "STEP 02 · SMART CANVAS",
    subtitle: "Every block is responsive, structured, and keyboard-first",
    layoutVariant: "bento-3",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0d0d12"
    },
    widgets: [
      {
        id: "gs-s3-1",
        type: "feature",
        colSpan: 4,
        badge: "+ INSERT MENU",
        title: "30+ Smart Widget Blocks",
        content: "Open '+ Insert' in the bottom dock or press '/' to add Metrics, Charts, Comparisons, Timelines, and Cards."
      },
      {
        id: "gs-s3-2",
        type: "feature",
        colSpan: 4,
        badge: "REMIX ENGINE",
        title: "1-Click Layout Remix",
        content: "Click 'Remix' in the bottom dock to cycle layouts, swap columns, condense text, or convert bullets into cards."
      },
      {
        id: "gs-s3-3",
        type: "feature",
        colSpan: 4,
        badge: "ASK MUSE...",
        title: "Inline AI Copilot",
        content: "Use the bottom-right 'Ask Muse...' bar to rewrite copy, add KPI metrics, or create a brand-new slide."
      }
    ]
  },
  {
    id: "gs-slide-4-shortcuts",
    title: "Keyboard shortcuts & speed",
    sectionGroup: "3. Shortcuts",
    eyebrow: "STEP 03 · SPEED WORKFLOW",
    subtitle: "Navigate and edit at the speed of thought",
    layoutVariant: "bento-2",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0d0d12"
    },
    widgets: [
      {
        id: "gs-s4-1",
        type: "table",
        colSpan: 12,
        title: "Essential Chronicle Keyboard Shortcuts",
        tableHeaders: ["Action", "Shortcut (Mac)", "Shortcut (Windows / Linux)", "Where it works"],
        tableRows: [
          ["Open Quick Command / Insert Widget", "⌘ K or /", "Ctrl + K or /", "Slide Editor"],
          ["Next / Previous Slide", "↓ / ↑", "ArrowDown / ArrowUp", "Editor & Present Mode"],
          ["Duplicate Selected Widget or Slide", "⌘ D", "Ctrl + D", "Slide Editor"],
          ["Deselect Widget / Close Popover", "Esc", "Escape", "Everywhere"],
          ["Start Fullscreen Presentation", "⌘ Enter", "Ctrl + Enter", "Slide Editor"]
        ]
      }
    ]
  },
  {
    id: "gs-slide-5-share",
    title: "Sharing, Exporting & MCP API",
    sectionGroup: "4. Sharing",
    eyebrow: "STEP 04 · COLLABORATE & PUBLISH",
    subtitle: "Share an interactive link, export to PDF/PPTX, or connect AI agents via MCP",
    layoutVariant: "comparison",
    background: {
      type: "solid",
      preset: "dark",
      color: "#0d0d12"
    },
    widgets: [
      {
        id: "gs-s5-1",
        type: "comparison",
        colSpan: 12,
        title: "Three Ways to Deliver Your Deck",
        items: [
          {
            id: "sh1",
            label: "Live Web Link & Present Mode",
            value: "Interactive & Tracked",
            description: "Publish to web with 1 click, track viewer engagement, and present in crisp 60fps fullscreen."
          },
          {
            id: "sh2",
            label: "PDF, PPTX & Chronicle MCP API",
            value: "Portable & Programmable",
            description: "Export board-ready PDFs and PowerPoint files, or let Claude/Cursor build decks via API keys."
          }
        ]
      }
    ]
  }
];

export const SERIES_B_SLIDES: SlideSection[] = [
  {
    id: "sb-slide-1",
    title: "Cover · Series B Investor Deck",
    sectionGroup: "Cover",
    eyebrow: "CHRONICLE AI · SERIES B",
    subtitle: "The Presentation Layer for Modern Teams & AI Agents",
    layoutVariant: "cover",
    background: {
      type: "gradient",
      preset: "dark",
      color: "#09090f",
      gradient: "radial-gradient(circle at 75% 25%, rgba(124,92,255,0.35), transparent 60%), linear-gradient(135deg, #09090f 0%, #151326 100%)"
    },
    widgets: [
      {
        id: "sb-w1",
        type: "heading",
        colSpan: 12,
        badge: "SERIES B INVESTMENT PRESENTATION",
        title: "Credible Decks at the Speed of AI",
        subtitle: "Reinventing executive storytelling for 100M+ knowledge workers and autonomous AI agents.",
        style: { headingLevel: "H1", fontSize: "3xl", bold: true }
      },
      {
        id: "sb-w2",
        type: "metric",
        colSpan: 4,
        badge: "ARR",
        value: "$28.5M",
        delta: "3.8x YoY",
        title: "Annual Recurring Revenue",
        content: "Profitable PLG + Enterprise motion"
      },
      {
        id: "sb-w3",
        type: "metric",
        colSpan: 4,
        badge: "USERS",
        value: "420K+",
        delta: "+18% MoM",
        title: "Active Deck Creators",
        content: "Across 18,000+ company workspaces"
      },
      {
        id: "sb-w4",
        type: "metric",
        colSpan: 4,
        badge: "NDR",
        value: "126%",
        delta: "Best-in-Class",
        title: "Enterprise Net Dollar Retention",
        content: "Zero churn in >$50K ACV cohort"
      }
    ]
  },
  {
    id: "sb-slide-2",
    title: "The Problem with Slides Today",
    sectionGroup: "Problem",
    eyebrow: "01 · THE PROBLEM",
    subtitle: "Your reputation is on the slide—yet existing tools fail modern leaders",
    layoutVariant: "comparison",
    background: { type: "solid", preset: "dark", color: "#0b0b10" },
    widgets: [
      {
        id: "sb-w5",
        type: "before-after",
        colSpan: 12,
        title: "Why Legacy Slide Tools & Generic AI Generators Fall Short",
        items: [
          {
            id: "sb-ba1",
            label: "PowerPoint & Google Slides",
            value: "High Effort · Manual Formatting",
            description: "Executives and PMs waste hours nudging text boxes by 2px instead of sharpening their narrative."
          },
          {
            id: "sb-ba2",
            label: "Chronicle AI Studio",
            value: "Executive Craft · Instant Velocity",
            description: "Structured storyline synthesis, designer-built Smart Widgets, and locked Brand Kits."
          }
        ]
      }
    ]
  },
  {
    id: "sb-slide-3",
    title: "Growth & Financial Trajectory",
    sectionGroup: "Traction",
    eyebrow: "02 · TRACTION",
    subtitle: "Compounding organic growth + high-velocity enterprise expansion",
    layoutVariant: "bento-2",
    background: { type: "solid", preset: "dark", color: "#0b0b10" },
    widgets: [
      {
        id: "sb-w6",
        type: "chart",
        colSpan: 8,
        badge: "ARR GROWTH ($M)",
        title: "8-Quarter ARR Trajectory",
        subtitle: "3.8x YoY growth with 81% gross margins",
        chartType: "bar",
        chartData: [
          { label: "Q1 '25", value: 7.5, secondary: 6.0 },
          { label: "Q2 '25", value: 12.2, secondary: 10.0 },
          { label: "Q3 '25", value: 19.4, secondary: 16.0 },
          { label: "Q4 '25", value: 28.5, secondary: 24.0 }
        ]
      },
      {
        id: "sb-w7",
        type: "funnel",
        colSpan: 4,
        title: "Viral Shared-Deck Loop",
        items: [
          { id: "vf1", label: "Shared Deck Views / Mo", value: "2.4M", delta: "100%" },
          { id: "vf2", label: "New Signups from Watermark", value: "96K", delta: "4.0%" },
          { id: "vf3", label: "Activated Workspaces", value: "38K", delta: "40%" },
          { id: "vf4", label: "Paid Team Conversions", value: "4.8K", delta: "12.6%" }
        ]
      }
    ]
  }
];

export const PRODUCT_STRATEGY_SLIDES: SlideSection[] = [
  {
    id: "ps-slide-1",
    title: "2026 Product Strategy & AI Roadmap",
    sectionGroup: "Overview",
    eyebrow: "PRODUCT STRATEGY · FY2026",
    subtitle: "Building the AI-native presentation studio & agent API",
    layoutVariant: "cover",
    background: {
      type: "gradient",
      preset: "dark",
      color: "#091519",
      gradient: "linear-gradient(135deg, #071318 0%, #0f2930 60%, #081014 100%)"
    },
    widgets: [
      {
        id: "ps-w1",
        type: "heading",
        colSpan: 12,
        badge: "PRODUCT & ENGINEERING",
        title: "2026 Product Strategy & Roadmap",
        subtitle: "Empowering humans in the studio and AI agents via Chronicle MCP.",
        style: { headingLevel: "H1", fontSize: "3xl", bold: true }
      },
      {
        id: "ps-w2",
        type: "roadmap",
        colSpan: 12,
        title: "Strategic Product Pillars",
        items: [
          { id: "psr1", tag: "PILLAR 1", label: "Muse Storyline & Inline Copilot", description: "Context-aware slide generation and 1-click visual remixing", status: "done" },
          { id: "psr2", tag: "PILLAR 2", label: "Chronicle MCP & REST API", description: "Turn any LLM workflow into a polished presentation deck", status: "in-progress" },
          { id: "psr3", tag: "PILLAR 3", label: "Enterprise Brand Kit Governance", description: "Locked themes, custom fonts, and organization-wide asset libraries", status: "planned" }
        ]
      }
    ]
  }
];

export interface StorylineOutlineItem {
  id: string;
  sectionNumber: string;
  title: string;
  summary: string;
  suggestedLayout: SlideSection["layoutVariant"];
  bullets: string[];
}

export function generateStorylineOutline(
  prompt: string,
  slideCount = 8,
  category = "Pitch"
): StorylineOutlineItem[] {
  const cleanTopic = prompt.trim() || "Executive Strategy & Growth Update";
  const count = Math.max(4, Math.min(12, slideCount || 8));

  const baseTemplates: Array<Omit<StorylineOutlineItem, "id" | "sectionNumber">> = [
    {
      title: `${cleanTopic.slice(0, 64)}`,
      summary: `Executive cover slide framing the core thesis and presenter context for ${cleanTopic}.`,
      suggestedLayout: "cover",
      bullets: [
        "Core strategic headline & executive thesis",
        "Target audience & decision context",
        "North-star impact summary"
      ]
    },
    {
      title: "Executive Agenda & Narrative Arc",
      summary: "Structured walkthrough of performance, market opportunity, product execution, and next steps.",
      suggestedLayout: "agenda",
      bullets: [
        "01 Context & Market Inflection",
        "02 Key Performance Metrics & Traction",
        "03 Strategic Solution & Architecture",
        "04 Roadmap, Resource Plan & Decisions"
      ]
    },
    {
      title: "Headline Metrics & Performance Scorecard",
      summary: "Quantified KPIs demonstrating velocity, efficiency, and customer adoption.",
      suggestedLayout: "metrics-4",
      bullets: [
        "Revenue / adoption growth rate (+68% YoY)",
        "Net retention & customer expansion (118% NDR)",
        "Operational efficiency & gross margin profile",
        "Quarter-over-quarter trajectory chart"
      ]
    },
    {
      title: "Problem Landscape & Why Now",
      summary: "Contrast legacy manual workflows against the AI-native transformation.",
      suggestedLayout: "bento-2",
      bullets: [
        "Legacy bottleneck costing teams 10+ hours per week",
        "Fragmented tooling and inconsistent brand execution",
        "Why AI + structured canvas solves this now"
      ]
    },
    {
      title: "Strategic Solution & Core Architecture",
      summary: "Three-pillar breakdown of how the solution delivers 10x value.",
      suggestedLayout: "bento-3",
      bullets: [
        "Pillar 1: Automated AI storyline & content synthesis",
        "Pillar 2: Responsive Smart Widgets & instant layout remixing",
        "Pillar 3: Enterprise Brand Kit governance & live sharing"
      ]
    },
    {
      title: "Financial & Operational Deep Dive",
      summary: "Cohort economics, quarterly benchmarks, and unit efficiency table.",
      suggestedLayout: "bento-2",
      bullets: [
        "Quarterly plan vs. actual variance breakdown",
        "Enterprise ACV growth and payback efficiency",
        "Multi-quarter forward projection"
      ]
    },
    {
      title: "Execution Roadmap & Key Milestones",
      summary: "Phased Now / Next / Later delivery plan with clear ownership.",
      suggestedLayout: "bento-3",
      bullets: [
        "Now (Q1): Core platform rollout & self-serve onboarding",
        "Next (Q2): API / MCP ecosystem & enterprise integrations",
        "Later (H2): Global scale & advanced governance"
      ]
    },
    {
      title: "Leadership Team & Key Decisions",
      summary: "Stakeholder alignment, resource allocation, and immediate next steps.",
      suggestedLayout: "bento-2",
      bullets: [
        "Cross-functional leadership owners",
        "Key trade-offs and risk mitigations",
        "Immediate approvals & 30-day action plan"
      ]
    }
  ];

  const items: StorylineOutlineItem[] = [];
  for (let i = 0; i < count; i++) {
    const tpl = baseTemplates[i % baseTemplates.length];
    items.push({
      id: `outline-${i + 1}`,
      sectionNumber: String(i + 1).padStart(2, "0"),
      title: i === 0 ? cleanTopic.slice(0, 70) : tpl.title,
      summary: tpl.summary,
      suggestedLayout: tpl.suggestedLayout,
      bullets: tpl.bullets
    });
  }
  return items;
}

export function generateSlidesFromOutline(
  deckTitle: string,
  outline: StorylineOutlineItem[],
  style = "Midnight"
): SlideSection[] {
  const paletteMap: Record<string, { bg: string; accent: string; preset: "dark" | "light" }> = {
    Midnight: { bg: "#0b1320", accent: "#8b5cf6", preset: "dark" },
    Obsidian: { bg: "#0b0b0f", accent: "#a855f7", preset: "dark" },
    Cobalt: { bg: "#09192b", accent: "#38bdf8", preset: "dark" },
    Emerald: { bg: "#071c18", accent: "#10b981", preset: "dark" },
    Ivory: { bg: "#f8fafc", accent: "#6366f1", preset: "light" }
  };
  const pal = paletteMap[style] || paletteMap.Midnight;

  return outline.map((item, idx) => {
    const slideId = `slide-gen-${idx + 1}-${Date.now().toString(36)}`;
    if (idx === 0) {
      return {
        id: slideId,
        title: item.title,
        sectionGroup: "Cover",
        eyebrow: `01 · EXECUTIVE PRESENTATION`,
        subtitle: item.summary,
        layoutVariant: "cover",
        background: {
          type: "gradient",
          preset: pal.preset,
          color: pal.bg,
          gradient:
            pal.preset === "light"
              ? "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)"
              : `radial-gradient(circle at 80% 20%, ${pal.accent}44, transparent 55%), linear-gradient(135deg, ${pal.bg} 0%, #141422 100%)`
        },
        widgets: [
          {
            id: `${slideId}-w1`,
            type: "heading",
            colSpan: 12,
            badge: "GENERATED WITH CHRONICLE MUSE AI",
            title: deckTitle || item.title,
            subtitle: item.summary,
            style: { headingLevel: "H1", fontSize: "3xl", bold: true }
          },
          ...item.bullets.slice(0, 3).map((b, bIdx) => ({
            id: `${slideId}-wb-${bIdx}`,
            type: "box" as const,
            colSpan: 4 as const,
            badge: `FOCUS 0${bIdx + 1}`,
            title: b,
            content: `Key narrative pillar supporting ${deckTitle}.`
          }))
        ]
      };
    }

    if (item.suggestedLayout === "agenda") {
      return {
        id: slideId,
        title: item.title,
        sectionGroup: "Agenda",
        eyebrow: `${item.sectionNumber} · AGENDA`,
        subtitle: item.summary,
        layoutVariant: "agenda",
        background: { type: "solid", preset: pal.preset, color: pal.bg },
        widgets: [
          {
            id: `${slideId}-steps`,
            type: "steps",
            colSpan: 12,
            title: item.title,
            items: item.bullets.map((b, bIdx) => ({
              id: `${slideId}-s-${bIdx}`,
              value: String(bIdx + 1).padStart(2, "0"),
              label: b,
              description: `Section ${bIdx + 1} walkthrough and strategic takeaways`
            }))
          }
        ]
      };
    }

    if (item.suggestedLayout === "metrics-4") {
      return {
        id: slideId,
        title: item.title,
        sectionGroup: "Metrics",
        eyebrow: `${item.sectionNumber} · KEY METRICS`,
        subtitle: item.summary,
        layoutVariant: "metrics-4",
        background: { type: "solid", preset: pal.preset, color: pal.bg },
        widgets: [
          {
            id: `${slideId}-m1`,
            type: "metric",
            colSpan: 3,
            badge: "GROWTH",
            value: "+68%",
            delta: "+14% QoQ",
            title: item.bullets[0] || "Annual Growth Rate",
            content: "Outperforming target benchmark"
          },
          {
            id: `${slideId}-m2`,
            type: "metric",
            colSpan: 3,
            badge: "RETENTION",
            value: "118%",
            delta: "+400 bps",
            title: item.bullets[1] || "Net Dollar Retention",
            content: "Strong multi-team expansion"
          },
          {
            id: `${slideId}-m3`,
            type: "metric",
            colSpan: 3,
            badge: "EFFICIENCY",
            value: "78.4%",
            delta: "+280 bps",
            title: item.bullets[2] || "Gross Margin Profile",
            content: "Best-in-class unit economics"
          },
          {
            id: `${slideId}-m4`,
            type: "metric",
            colSpan: 3,
            badge: "VELOCITY",
            value: "3.4x",
            delta: "Faster",
            title: "Execution Velocity",
            content: "Compared to legacy baseline"
          },
          {
            id: `${slideId}-chart`,
            type: "chart",
            colSpan: 12,
            badge: "QUARTERLY PERFORMANCE",
            title: `${item.title} Trajectory`,
            chartType: "bar",
            chartData: [
              { label: "Q1", value: 42, secondary: 35 },
              { label: "Q2", value: 58, secondary: 46 },
              { label: "Q3", value: 74, secondary: 60 },
              { label: "Q4", value: 92, secondary: 75 }
            ]
          }
        ]
      };
    }

    if (idx === outline.length - 2) {
      return {
        id: slideId,
        title: item.title,
        sectionGroup: "Roadmap",
        eyebrow: `${item.sectionNumber} · ROADMAP`,
        subtitle: item.summary,
        layoutVariant: "bento-3",
        background: { type: "solid", preset: pal.preset, color: pal.bg },
        widgets: [
          {
            id: `${slideId}-rm`,
            type: "roadmap",
            colSpan: 12,
            title: item.title,
            items: item.bullets.map((b, bIdx) => ({
              id: `${slideId}-rmi-${bIdx}`,
              tag: bIdx === 0 ? "NOW · Q1" : bIdx === 1 ? "NEXT · Q2" : "LATER · H2",
              label: b,
              description: `Deliverable milestone ${bIdx + 1} for ${deckTitle}`,
              status: bIdx === 0 ? "done" : bIdx === 1 ? "in-progress" : "planned"
            }))
          }
        ]
      };
    }

    return {
      id: slideId,
      title: item.title,
      sectionGroup: `Section ${item.sectionNumber}`,
      eyebrow: `${item.sectionNumber} · STRATEGIC PILLAR`,
      subtitle: item.summary,
      layoutVariant: "bento-3",
      background: { type: "solid", preset: pal.preset, color: pal.bg },
      widgets: item.bullets.map((b, bIdx) => ({
        id: `${slideId}-card-${bIdx}`,
        type: bIdx % 2 === 0 ? ("box" as const) : ("feature" as const),
        colSpan: (item.bullets.length === 2 ? 6 : 4) as 4 | 6,
        badge: `0${bIdx + 1} · KEY INSIGHT`,
        title: b,
        content: `${item.summary} Focused on measurable executive outcomes and rapid alignment.`
      }))
    };
  });
}

export const PRICING_PLANS = [
  {
    id: "f9fc45fa-3d72-4d30-a31d-f1cd8bfdf896",
    name: "Free",
    price: "$0",
    period: "/month",
    tokens: 200,
    badge: "Starter",
    features: [
      "Unlimited presentations & folders",
      "200 AI Muse tokens / month",
      "19 official Chronicle Studio themes",
      "Public web sharing with watermark"
    ]
  },
  {
    id: "373b0df2-b310-4b97-833f-d9e2fa3a8843",
    name: "Pro",
    price: "$16",
    period: "/member/mo",
    tokens: 600,
    badge: "Creator",
    features: [
      "Everything in Free",
      "600 AI Muse tokens / month",
      "Remove 'Made with Chronicle' badge",
      "PDF & lossless .chronicle exports"
    ]
  },
  {
    id: "70c1b41e-5fd1-4090-9f5f-c6a6cb90b5bc",
    name: "Plus",
    price: "$28",
    period: "/member/mo",
    tokens: 1200,
    badge: "Most Popular",
    features: [
      "Everything in Pro",
      "1,200 AI Muse tokens / month",
      "1-Click Domain Brand Kit extraction",
      "Custom WOFF2 typography uploads"
    ]
  },
  {
    id: "e2860a7b-6550-4573-a1a0-bde7508be48b",
    name: "Max",
    price: "$49",
    period: "/member/mo",
    tokens: 2000,
    badge: "Enterprise & API",
    features: [
      "Everything in Plus",
      "2,000+ AI Muse tokens / month",
      "Chronicle MCP Server & REST API keys",
      "Workspace role permissions & governance"
    ]
  }
];

export const SEED_DOCUMENTS = [
  {
    id: DOC_BOARD_ID,
    title: "Q3 Board Meeting & Investor Update",
    slides: BOARD_MEETING_SLIDES
  },
  {
    id: DOC_INTRO_ID,
    title: "Getting started with Chronicle",
    slides: GETTING_STARTED_SLIDES
  },
  {
    id: DOC_SERIES_B_ID,
    title: "Series B Investor Pitch Deck",
    slides: SERIES_B_SLIDES
  },
  {
    id: DOC_PRODUCT_ID,
    title: "2026 Product Strategy & AI Roadmap",
    slides: PRODUCT_STRATEGY_SLIDES
  }
];

export const SEED_TEMPLATES = [
  {
    id: "tpl-series-b",
    slug: "series-b-pitch-deck",
    title: "Series B Venture Pitch Deck",
    category: "Fundraising",
    authorName: "Chronicle Venture Studio",
    slideCount: SERIES_B_SLIDES.length,
    description:
      "Proven multi-slide venture fundraising narrative covering problem, traction, unit economics, and product moat.",
    previewUrl:
      "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
    slides: SERIES_B_SLIDES
  },
  {
    id: "tpl-board-meeting",
    slug: "board-of-directors-update",
    title: "Quarterly Board of Directors Readout",
    category: "Executive",
    authorName: "Dominic Huntley",
    slideCount: BOARD_MEETING_SLIDES.length,
    description:
      "Boardroom-ready executive deck with KPI scorecards, ARR waterfalls, strategic priorities, and risk register.",
    previewUrl:
      "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-2.jpg",
    slides: BOARD_MEETING_SLIDES
  },
  {
    id: "tpl-product-strategy",
    slug: "product-strategy-roadmap",
    title: "2026 Product Strategy & AI Roadmap",
    category: "Product",
    authorName: "Chronicle Product Team",
    slideCount: PRODUCT_STRATEGY_SLIDES.length,
    description:
      "Align engineering, design, and leadership around quarterly milestones, architecture pillars, and OKRs.",
    previewUrl:
      "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-1.jpg",
    slides: PRODUCT_STRATEGY_SLIDES
  },
  {
    id: "tpl-getting-started",
    slug: "getting-started-playbooks",
    title: "Chronicle Interactive Studio Playbook",
    category: "Sales",
    authorName: "Chronicle Design",
    slideCount: GETTING_STARTED_SLIDES.length,
    description:
      "Interactive walkthrough of Chronicle Smart Widgets, instant layout remixing, and Brand Kit governance.",
    previewUrl:
      "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
    slides: GETTING_STARTED_SLIDES
  }
];


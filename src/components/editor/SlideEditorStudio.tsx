"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SlideSection,
  SlideWidget,
  WIDGET_CATALOG,
  WidgetCategory,
  WidgetType
} from "@/lib/types";
import { SmartWidgetBlock } from "@/components/editor/SmartWidgetBlock";
import { SEED_TEMPLATES } from "@/lib/seed-data";
import {
  ArrowLeft,
  PanelLeft,
  Plus,
  Copy,
  Trash2,
  Share2,
  Download,
  Play,
  Sparkles,
  Search,
  Image as ImageIcon,
  Shuffle,
  Layers,
  Palette,
  PaintBucket,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Wand2,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface SlideEditorStudioProps {
  workspaceId: string;
  documentId: string;
  initialSectionId?: string;
}

const WIDGET_CATEGORIES: WidgetCategory[] = [
  "Basic",
  "Visuals & Media",
  "Cards & Tiles",
  "Compare",
  "Chronology"
];

const BACKGROUND_PRESETS = [
  {
    id: "obsidian",
    name: "Obsidian Dark",
    type: "gradient" as const,
    preset: "dark" as const,
    color: "#0b0b10",
    gradient:
      "radial-gradient(circle at 80% 20%, rgba(139,92,246,0.28), transparent 55%), linear-gradient(135deg, #0b0b10 0%, #141422 100%)"
  },
  {
    id: "midnight-blue",
    name: "Midnight Indigo",
    type: "gradient" as const,
    preset: "dark" as const,
    color: "#080d1a",
    gradient:
      "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.28), transparent 55%), linear-gradient(135deg, #080d1a 0%, #111827 100%)"
  },
  {
    id: "emerald-aurora",
    name: "Emerald Aurora",
    type: "gradient" as const,
    preset: "dark" as const,
    color: "#071712",
    gradient:
      "radial-gradient(circle at 75% 15%, rgba(16,185,129,0.26), transparent 55%), linear-gradient(135deg, #071712 0%, #0d1f1a 100%)"
  },
  {
    id: "crisp-light",
    name: "Crisp Studio Light",
    type: "solid" as const,
    preset: "light" as const,
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)"
  },
  {
    id: "warm-ivory",
    name: "Editorial Ivory",
    type: "solid" as const,
    preset: "light" as const,
    color: "#faf8f5",
    gradient: "linear-gradient(135deg, #faf8f5 0%, #f3efe6 100%)"
  }
];

export function SlideEditorStudio({
  workspaceId,
  documentId,
  initialSectionId
}: SlideEditorStudioProps) {
  const router = useRouter();

  const [doc, setDoc] = useState<any>(null);
  const [slides, setSlides] = useState<SlideSection[]>([]);
  const [activeSlideId, setActiveSlideId] = useState<string>(
    initialSectionId || "s1"
  );
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  // Bottom dock active popover
  const [activeDockMenu, setActiveDockMenu] = useState<
    | null
    | "search"
    | "insert"
    | "media"
    | "remix"
    | "templates"
    | "brandkit"
    | "background"
  >(null);
  const [insertCategory, setInsertCategory] =
    useState<WidgetCategory>("Basic");
  const [searchCommand, setSearchCommand] = useState("");

  // Top bar popovers
  const [shareOpen, setShareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Ask Muse AI Copilot
  const [museOpen, setMuseOpen] = useState(false);
  const [musePrompt, setMusePrompt] = useState("");
  const [museStatus, setMuseStatus] = useState<string | null>(null);
  const [museLoading, setMuseLoading] = useState(false);

  // Present mode
  const [presentMode, setPresentMode] = useState(false);

  // Themes, BrandKits, Media
  const [themes, setThemes] = useState<any[]>([]);
  const [brandKits, setBrandKits] = useState<any[]>([]);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);

  useEffect(() => {
    async function loadAll() {
      const [docRes, thRes, bkRes, mediaRes] = await Promise.all([
        fetch(`/api/documents/${documentId}`),
        fetch(`/api/themes?workspaceId=${workspaceId}`),
        fetch(`/api/brand-kits?workspaceId=${workspaceId}`),
        fetch(`/api/media?workspaceId=${workspaceId}`)
      ]);
      const docData = await docRes.json();
      const thData = await thRes.json();
      const bkData = await bkRes.json();
      const mediaData = await mediaRes.json();

      if (docData.document) {
        setDoc(docData.document);
        const loadedSlides: SlideSection[] = docData.document.slides || [];
        setSlides(loadedSlides);
        if (
          initialSectionId &&
          loadedSlides.some((s) => s.id === initialSectionId)
        ) {
          setActiveSlideId(initialSectionId);
        } else if (loadedSlides[0]?.id) {
          setActiveSlideId(loadedSlides[0].id);
        }
      }
      setThemes(thData.themes || []);
      setBrandKits(bkData.brandKits || []);
      setMediaAssets(mediaData.assets || []);
    }
    loadAll();
  }, [documentId, workspaceId]);

  const activeSlideIndex = Math.max(
    0,
    slides.findIndex((s) => s.id === activeSlideId)
  );
  const activeSlide: SlideSection | undefined =
    slides[activeSlideIndex] || slides[0];

  // Keyboard shortcuts for Present Mode & navigation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "Escape" && presentMode) {
        setPresentMode(false);
      } else if (e.key === "ArrowRight" && presentMode) {
        const next = slides[Math.min(slides.length - 1, activeSlideIndex + 1)];
        if (next) setActiveSlideId(next.id);
      } else if (e.key === "ArrowLeft" && presentMode) {
        const prev = slides[Math.max(0, activeSlideIndex - 1)];
        if (prev) setActiveSlideId(prev.id);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [presentMode, slides, activeSlideIndex]);

  async function persistDocument(
    nextSlides: SlideSection[],
    extraPatch: Record<string, any> = {}
  ) {
    setSlides(nextSlides);
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slides: nextSlides,
          ...extraPatch
        })
      });
      const data = await res.json();
      if (data.document) setDoc(data.document);
    } finally {
      setSaveStatus("saved");
    }
  }

  function updateActiveSlide(patch: Partial<SlideSection>) {
    if (!activeSlide) return;
    const nextSlides = slides.map((s) =>
      s.id === activeSlide.id ? { ...s, ...patch } : s
    );
    persistDocument(nextSlides);
  }

  function handleAddSlide() {
    const newId = `slide-${Date.now().toString(36)}`;
    const newSlide: SlideSection = {
      id: newId,
      title: "New Strategic Section",
      sectionGroup: "Deep Dive",
      eyebrow: "KEY TAKEAWAY",
      subtitle: "Click any widget below or open + Insert to add blocks.",
      layoutVariant: "grid-3",
      background: activeSlide?.background || BACKGROUND_PRESETS[0],
      widgets: [
        {
          id: `w-${Date.now().toString(36)}-1`,
          type: "heading",
          colSpan: 12,
          badge: "SECTION HEADLINE",
          title: "New Strategic Section",
          subtitle: "Summarize the primary conclusion for this slide."
        },
        {
          id: `w-${Date.now().toString(36)}-2`,
          type: "metric",
          colSpan: 4,
          badge: "KPI 01",
          value: "3.8x",
          delta: "+92% YoY",
          title: "Primary Velocity Metric",
          content: "Double-click any value to customize"
        },
        {
          id: `w-${Date.now().toString(36)}-3`,
          type: "box",
          colSpan: 4,
          badge: "DRIVER 01",
          title: "Core Execution Pillar",
          content: "Explain the initiative driving this outcome."
        },
        {
          id: `w-${Date.now().toString(36)}-4`,
          type: "box",
          colSpan: 4,
          badge: "DRIVER 02",
          title: "Next Quarter Target",
          content: "Highlight the measurable milestone ahead."
        }
      ]
    };
    const nextSlides = [...slides];
    nextSlides.splice(activeSlideIndex + 1, 0, newSlide);
    persistDocument(nextSlides);
    setActiveSlideId(newId);
  }

  function handleDuplicateSlide(idx: number) {
    const src = slides[idx];
    if (!src) return;
    const copyId = `slide-${Date.now().toString(36)}`;
    const copy: SlideSection = {
      ...JSON.parse(JSON.stringify(src)),
      id: copyId,
      title: `${src.title} (Copy)`
    };
    const nextSlides = [...slides];
    nextSlides.splice(idx + 1, 0, copy);
    persistDocument(nextSlides);
    setActiveSlideId(copyId);
  }

  function handleDeleteSlide(idx: number) {
    if (slides.length <= 1) return;
    const nextSlides = slides.filter((_, i) => i !== idx);
    persistDocument(nextSlides);
    setActiveSlideId(
      nextSlides[Math.max(0, idx - 1)]?.id || nextSlides[0].id
    );
  }

  function handleMoveSlide(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    const nextSlides = [...slides];
    const tmp = nextSlides[idx];
    nextSlides[idx] = nextSlides[target];
    nextSlides[target] = tmp;
    persistDocument(nextSlides);
  }

  function handleInsertWidget(type: WidgetType, defaultColSpan: number) {
    if (!activeSlide) return;
    const id = `w-${Date.now().toString(36)}`;
    const catalogEntry = WIDGET_CATALOG.find((c) => c.type === type);
    const defaultData = catalogEntry?.createDefault ? catalogEntry.createDefault() : null;

    const newWidget: SlideWidget = defaultData
      ? { id, ...defaultData }
      : {
          id,
          type,
          colSpan: defaultColSpan,
          badge: type.toUpperCase(),
          title: `New ${type} block`,
          subtitle: "Supporting takeaway",
          content: "Click to edit text inline or use the floating toolbar."
        };

    updateActiveSlide({
      widgets: [...activeSlide.widgets, newWidget]
    });
    setSelectedWidgetId(id);
    setActiveDockMenu(null);
  }

  function handleRemixSlide(
    mode:
      | "grid-3"
      | "split-2"
      | "hero-bento"
      | "metric-focus"
      | "comparison"
      | "timeline"
  ) {
    if (!activeSlide) return;
    let nextWidgets = [...activeSlide.widgets];

    if (mode === "grid-3") {
      nextWidgets = nextWidgets.map((w, i) => ({
        ...w,
        colSpan: i === 0 && w.type === "heading" ? 12 : 4
      }));
    } else if (mode === "split-2") {
      nextWidgets = nextWidgets.map((w, i) => ({
        ...w,
        colSpan: i === 0 && w.type === "heading" ? 12 : 6
      }));
    } else if (mode === "hero-bento") {
      nextWidgets = nextWidgets.map((w, i) => ({
        ...w,
        colSpan: i === 0 ? 12 : i === 1 ? 8 : 4
      }));
    } else if (mode === "metric-focus") {
      nextWidgets = [
        ...nextWidgets.slice(0, 1),
        {
          id: `rmx-${Date.now().toString(36)}-1`,
          type: "metric",
          colSpan: 4,
          badge: "NORTH STAR",
          value: "$84.2M",
          delta: "+118% YoY",
          title: "Annual Recurring Revenue",
          content: "Remixed metric spotlight"
        },
        ...nextWidgets.slice(1).map((w) => ({ ...w, colSpan: 4 }))
      ];
    } else if (mode === "comparison") {
      nextWidgets = [
        ...nextWidgets.slice(0, 1),
        {
          id: `rmx-cmp-${Date.now().toString(36)}`,
          type: "comparison-table",
          colSpan: 12,
          badge: "STRATEGIC COMPARISON",
          title: `${activeSlide.title} — Benchmark Matrix`,
          columns: ["Dimension", "Chronicle Studio", "Legacy Approach"],
          rows: [
            ["Creation Velocity", "< 45 seconds", "4-6 hours"],
            ["Brand Governance", "Automated tokens", "Manual formatting"]
          ]
        }
      ];
    } else if (mode === "timeline") {
      nextWidgets = [
        ...nextWidgets.slice(0, 1),
        {
          id: `rmx-tl-${Date.now().toString(36)}`,
          type: "timeline",
          colSpan: 12,
          badge: "EXECUTION TIMELINE",
          title: `${activeSlide.title} — Rollout Phases`,
          items: [
            { id: "p1", label: "Phase 1 • Q1", value: "Pilot Launch", description: "Initial design partner rollout" },
            { id: "p2", label: "Phase 2 • Q2", value: "Enterprise GA", description: "Workspace RBAC & Brand Kits" },
            { id: "p3", label: "Phase 3 • Q3", value: "MCP Ecosystem", description: "Autonomous deck generation" }
          ]
        }
      ];
    }

    updateActiveSlide({
      layoutVariant: mode,
      widgets: nextWidgets
    });
    setActiveDockMenu(null);
  }

  async function handleAskMuse(action: string, customPrompt?: string) {
    if (!activeSlide) return;
    setMuseLoading(true);
    setMuseStatus(null);
    try {
      const res = await fetch("/api/ai/muse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          action,
          prompt: customPrompt ?? musePrompt,
          slide: activeSlide
        })
      });
      const data = await res.json();
      if (data.slide) {
        updateActiveSlide(data.slide);
        setMuseStatus(data.message || "Slide enhanced by Muse AI");
        setMusePrompt("");
      }
    } finally {
      setMuseLoading(false);
    }
  }

  async function handleServerExport(format: "pdf" | "png") {
    setExportOpen(false);
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/documents/${documentId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format })
      });
      const data = await res.json();
      if (data.fileUrl) {
        const a = document.createElement("a");
        a.href = data.fileUrl;
        a.download = data.fileName || `chronicle-deck.${format}`;
        a.target = "_blank";
        a.click();
      }
    } finally {
      setSaveStatus("saved");
    }
  }

  function handleExportJson() {
    const blob = new Blob(
      [JSON.stringify({ document: doc, slides }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(doc?.title || "chronicle-deck").toLowerCase().replace(/\s+/g, "-")}.chronicle.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  }

  const activeTheme = themes.find((t) => t.id === doc?.themeId);
  const activeBrandKit = brandKits.find((b) => b.id === doc?.brandKitId);
  const accentColor =
    activeBrandKit?.colors?.[0]?.hex ||
    activeTheme?.themeJson?.colors?.accent?.default ||
    "#8b5cf6";

  const isLightSlide = activeSlide?.background?.preset === "light";

  if (!activeSlide) {
    return (
      <div className="min-h-screen bg-[#0b0b10] text-white flex items-center justify-center text-sm text-zinc-400">
        Loading Chronicle Studio Canvas...
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        setSelectedWidgetId(null);
      }}
      className="h-screen w-screen overflow-hidden bg-[#09090e] text-[#f4f4f6] flex flex-col select-none"
    >
      {/* Top Studio Header Bar */}
      {!presentMode && (
        <header
          onClick={(e) => e.stopPropagation()}
          className="h-14 px-4 border-b border-white/[0.08] bg-[#0d0d14] flex items-center justify-between gap-4 z-30 shrink-0"
        >
          {/* Left: Back, Slides Toggle, Deck Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href={`/${workspaceId}/home`}
              className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition"
              title="Back to Workspace Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 border transition ${
                drawerOpen
                  ? "bg-white/10 border-white/15 text-white"
                  : "bg-transparent border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              <PanelLeft className="w-3.5 h-3.5" /> Slides ({slides.length})
            </button>

            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            <input
              type="text"
              value={doc?.title || "Untitled presentation"}
              onChange={(e) => {
                setDoc({ ...doc, title: e.target.value });
              }}
              onBlur={(e) =>
                persistDocument(slides, { title: e.target.value })
              }
              className="bg-transparent text-sm font-bold text-white focus:outline-none focus:bg-white/5 px-2.5 py-1 rounded-lg truncate max-w-md"
            />

            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {saveStatus === "saving" ? "Saving..." : "Saved"}
            </span>
          </div>

          {/* Right: Collaborators, Export, Share, Present */}
          <div className="flex items-center gap-2">
            {/* Active Collaborator Avatars */}
            <div className="hidden sm:flex items-center -space-x-1.5 mr-2">
              {[
                { initials: "AR", bg: "bg-violet-600" },
                { initials: "SC", bg: "bg-sky-600" },
                { initials: "MJ", bg: "bg-emerald-600" }
              ].map((u) => (
                <div
                  key={u.initials}
                  className={`w-7 h-7 rounded-full ${u.bg} border-2 border-[#0d0d14] text-[10px] font-bold text-white flex items-center justify-center`}
                  title="Active Collaborator"
                >
                  {u.initials}
                </div>
              ))}
            </div>

            {/* Export Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setExportOpen(!exportOpen);
                  setShareOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-zinc-200 inline-flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>

              {exportOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#151521] border border-white/15 shadow-2xl p-2 z-50 space-y-1 text-xs">
                  <button
                    onClick={() => handleServerExport("pdf")}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center justify-between text-white"
                  >
                    <span>Export as PDF (16:9 Render)</span>
                    <span className="text-[10px] text-emerald-300">PDF</span>
                  </button>
                  <button
                    onClick={() => handleServerExport("png")}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center justify-between text-white"
                  >
                    <span>Export Slide as High-Res PNG</span>
                    <span className="text-[10px] text-sky-300">1920×1080</span>
                  </button>
                  <button
                    onClick={handleExportJson}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left flex items-center justify-between text-white"
                  >
                    <span>Download .chronicle JSON</span>
                    <span className="text-[10px] text-violet-300">Lossless</span>
                  </button>
                </div>
              )}
            </div>

            {/* Share Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setShareOpen(!shareOpen);
                  setExportOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-zinc-200 inline-flex items-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>

              {shareOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-[#151521] border border-white/15 shadow-2xl p-4 z-50 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      Share Presentation
                    </span>
                    <button
                      onClick={() => setShareOpen(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400">Workspace Access</label>
                    <select
                      value={doc?.workspaceAccess || "EDIT"}
                      onChange={(e) =>
                        persistDocument(slides, {
                          workspaceAccess: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-white"
                    >
                      <option value="EDIT">Everyone in workspace can edit</option>
                      <option value="COMMENT">Can comment</option>
                      <option value="VIEW">Can view only</option>
                      <option value="NO_ACCESS">Private (No workspace access)</option>
                    </select>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-white/10">
                    <label className="flex items-center justify-between">
                      <span className="text-zinc-200">Publish public web link</span>
                      <input
                        type="checkbox"
                        checked={doc?.isPublic ?? true}
                        onChange={(e) =>
                          persistDocument(slides, { isPublic: e.target.checked })
                        }
                        className="accent-violet-500"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-zinc-200">
                        Allow viewers to duplicate deck
                      </span>
                      <input
                        type="checkbox"
                        checked={
                          doc?.isPublicDocumentDuplicationEnabled ?? true
                        }
                        onChange={(e) =>
                          persistDocument(slides, {
                            isPublicDocumentDuplicationEnabled: e.target.checked
                          })
                        }
                        className="accent-violet-500"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-zinc-200">
                        Show &ldquo;Made with Chronicle&rdquo; badge
                      </span>
                      <input
                        type="checkbox"
                        checked={doc?.showWatermark ?? true}
                        onChange={(e) =>
                          persistDocument(slides, {
                            showWatermark: e.target.checked
                          })
                        }
                        className="accent-violet-500"
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/share/${workspaceId}/${documentId}/${activeSlide.id}`;
                        navigator.clipboard.writeText(shareUrl);
                        setCopiedShare(true);
                        setTimeout(() => setCopiedShare(false), 1600);
                      }}
                      className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-1.5"
                    >
                      {copiedShare ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Link Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Public Link
                        </>
                      )}
                    </button>
                    <Link
                      href={`/share/${workspaceId}/${documentId}/${activeSlide.id}`}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setPresentMode(true)}
              className="px-4 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs inline-flex items-center gap-1.5 transition shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-black" /> Present
            </button>
          </div>
        </header>
      )}

      {/* Main Editor Body */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Slide Thumbnail Drawer (when not in Present Mode) */}
        {!presentMode && drawerOpen && (
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-64 border-r border-white/[0.08] bg-[#0d0d14] flex flex-col justify-between p-3 shrink-0 z-20"
          >
            <div className="flex items-center justify-between px-1 pb-2 border-b border-white/[0.07]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Storyline Slides
              </span>
              <button
                onClick={handleAddSlide}
                className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2.5 pr-1">
              {slides.map((slide, idx) => {
                const isActive = slide.id === activeSlide.id;
                return (
                  <div
                    key={slide.id}
                    onClick={() => {
                      setActiveSlideId(slide.id);
                      setSelectedWidgetId(null);
                    }}
                    className={`group rounded-xl p-2.5 border cursor-pointer transition ${
                      isActive
                        ? "bg-violet-600/15 border-violet-500 text-white"
                        : "bg-[#13131e] border-white/10 text-zinc-400 hover:text-white hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-mono font-bold text-violet-300">
                        0{idx + 1} • {slide.sectionGroup || "Slide"}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(idx, -1);
                          }}
                          className="p-0.5 hover:text-white"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSlide(idx, 1);
                          }}
                          className="p-0.5 hover:text-white"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateSlide(idx);
                          }}
                          className="p-0.5 hover:text-white"
                          title="Duplicate Slide"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                          className="p-0.5 hover:text-rose-400"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-semibold truncate">
                      {slide.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {slide.widgets.length} smart blocks
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleAddSlide}
              className="w-full py-2 rounded-xl border border-dashed border-white/15 hover:border-violet-400 text-xs text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" /> New Slide
            </button>
          </aside>
        )}

        {/* Center 16:9 Interactive Slide Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto relative">
          {/* Present Mode Exit & Controls */}
          {presentMode && (
            <div className="fixed top-5 right-6 z-50 flex items-center gap-2 bg-black/80 border border-white/15 px-3.5 py-2 rounded-full text-xs">
              <span className="text-zinc-300">
                Slide {activeSlideIndex + 1} / {slides.length}
              </span>
              <button
                onClick={() => {
                  const prev = slides[Math.max(0, activeSlideIndex - 1)];
                  if (prev) setActiveSlideId(prev.id);
                }}
                className="p-1 rounded hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const next =
                    slides[Math.min(slides.length - 1, activeSlideIndex + 1)];
                  if (next) setActiveSlideId(next.id);
                }}
                className="p-1 rounded hover:bg-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPresentMode(false)}
                className="ml-2 px-2.5 py-1 rounded-full bg-white text-black font-semibold"
              >
                Exit (Esc)
              </button>
            </div>
          )}

          {/* 16:9 Slide Frame */}
          <div
            onClick={() => setSelectedWidgetId(null)}
            style={{
              background:
                activeSlide.background?.gradient ||
                activeSlide.background?.color ||
                activeTheme?.themeJson?.colors?.background?.default ||
                "#0b0b10",
              backgroundImage: activeSlide.background?.imageUrl
                ? `linear-gradient(rgba(10,10,16,0.72), rgba(10,10,16,0.82)), url(${activeSlide.background.imageUrl})`
                : activeSlide.background?.gradient,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            className={`w-full max-w-6xl min-h-[560px] rounded-3xl border shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-8 md:p-12 flex flex-col justify-between transition-all relative ${
              isLightSlide
                ? "border-black/15 text-zinc-900"
                : "border-white/15 text-white"
            }`}
          >
            {/* Slide Header: Eyebrow + Title + Subtitle + Brand Kit Logo */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="space-y-1.5 flex-1">
                {presentMode ? (
                  <div
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: accentColor }}
                  >
                    {activeSlide.eyebrow || activeSlide.sectionGroup}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={activeSlide.eyebrow || activeSlide.sectionGroup || ""}
                    onChange={(e) =>
                      updateActiveSlide({ eyebrow: e.target.value })
                    }
                    placeholder="SECTION EYEBROW"
                    style={{ color: accentColor }}
                    className="bg-transparent text-xs font-bold uppercase tracking-widest focus:outline-none w-full"
                  />
                )}

                {presentMode ? (
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                    {activeSlide.title}
                  </h1>
                ) : (
                  <input
                    type="text"
                    value={activeSlide.title}
                    onChange={(e) =>
                      updateActiveSlide({ title: e.target.value })
                    }
                    placeholder="Slide headline..."
                    className="bg-transparent text-2xl md:text-4xl font-bold tracking-tight focus:outline-none w-full"
                  />
                )}

                {(activeSlide.subtitle || !presentMode) &&
                  (presentMode ? (
                    <p
                      className={`text-sm ${
                        isLightSlide ? "text-zinc-600" : "text-zinc-400"
                      }`}
                    >
                      {activeSlide.subtitle}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={activeSlide.subtitle || ""}
                      onChange={(e) =>
                        updateActiveSlide({ subtitle: e.target.value })
                      }
                      placeholder="Add slide subtitle or narrative context..."
                      className={`bg-transparent text-sm ${
                        isLightSlide ? "text-zinc-600" : "text-zinc-400"
                      } focus:outline-none w-full`}
                    />
                  ))}
              </div>

              {activeBrandKit && (
                <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2 shrink-0">
                  {activeBrandKit.logoLightUrl && (
                    <img
                      src={activeBrandKit.logoLightUrl}
                      alt={activeBrandKit.name}
                      className="w-4 h-4 object-contain"
                    />
                  )}
                  <span className="text-[11px] font-semibold">
                    {activeBrandKit.name}
                  </span>
                </div>
              )}
            </div>

            {/* 12-Column Responsive Smart Widget Bento Grid */}
            <div className="grid grid-cols-12 gap-4 my-auto">
              {activeSlide.widgets.map((widget) => (
                <SmartWidgetBlock
                  key={widget.id}
                  widget={widget}
                  selected={selectedWidgetId === widget.id}
                  readOnly={presentMode}
                  isLightSurface={isLightSlide}
                  accentColor={accentColor}
                  onSelect={() => setSelectedWidgetId(widget.id)}
                  onChange={(updatedWidget) => {
                    const nextWidgets = activeSlide.widgets.map((w) =>
                      w.id === widget.id ? updatedWidget : w
                    );
                    updateActiveSlide({ widgets: nextWidgets });
                  }}
                  onDuplicate={() => {
                    const copy: SlideWidget = {
                      ...JSON.parse(JSON.stringify(widget)),
                      id: `w-${Date.now().toString(36)}`
                    };
                    updateActiveSlide({
                      widgets: [...activeSlide.widgets, copy]
                    });
                  }}
                  onDelete={() => {
                    updateActiveSlide({
                      widgets: activeSlide.widgets.filter(
                        (w) => w.id !== widget.id
                      )
                    });
                    setSelectedWidgetId(null);
                  }}
                />
              ))}
            </div>

            {/* Slide Footer */}
            <div
              className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] ${
                isLightSlide
                  ? "border-black/10 text-zinc-500"
                  : "border-white/10 text-zinc-400"
              }`}
            >
              <span>{doc?.title}</span>
              <span className="font-mono">
                0{activeSlideIndex + 1} / 0{slides.length}
              </span>
            </div>
          </div>

          {/* Bottom Floating Studio Dock (7 Tools matching app.chroniclehq.com) */}
          {!presentMode && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-6 relative z-30 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#14141f]/95 backdrop-blur-xl border border-white/15 shadow-2xl"
            >
              {[
                { id: "search", label: "Search", icon: Search },
                { id: "insert", label: "+ Insert", icon: Plus, primary: true },
                { id: "media", label: "Media", icon: ImageIcon },
                { id: "remix", label: "Remix", icon: Shuffle },
                { id: "templates", label: "Templates", icon: Layers },
                { id: "brandkit", label: "Brand Kit", icon: Palette },
                { id: "background", label: "Background", icon: PaintBucket }
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() =>
                    setActiveDockMenu(
                      activeDockMenu === tool.id ? null : (tool.id as any)
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition ${
                    activeDockMenu === tool.id
                      ? "bg-violet-600 text-white"
                      : tool.primary
                      ? "bg-white text-black hover:bg-zinc-200 font-semibold"
                      : "text-zinc-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <tool.icon className="w-3.5 h-3.5" />
                  <span>{tool.label}</span>
                </button>
              ))}

              {/* Popover 1: Search Command Palette */}
              {activeDockMenu === "search" && (
                <div className="absolute bottom-full left-0 mb-3 w-96 rounded-2xl bg-[#151521] border border-white/15 shadow-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <Search className="w-4 h-4 text-violet-400" />
                    <input
                      type="text"
                      value={searchCommand}
                      onChange={(e) => setSearchCommand(e.target.value)}
                      placeholder="Jump to slide or insert widget..."
                      autoFocus
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto space-y-1 text-xs">
                    {slides
                      .filter((s) =>
                        s.title
                          .toLowerCase()
                          .includes(searchCommand.toLowerCase())
                      )
                      .map((s, idx) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setActiveSlideId(s.id);
                            setActiveDockMenu(null);
                          }}
                          className="w-full p-2 rounded-lg hover:bg-white/5 text-left flex items-center justify-between text-zinc-200"
                        >
                          <span>
                            Slide 0{idx + 1}: {s.title}
                          </span>
                          <span className="text-[10px] text-violet-300">
                            Jump →
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Popover 2: + Insert (34 Smart Widgets Catalog) */}
              {activeDockMenu === "insert" && (
                <div className="absolute bottom-full left-0 mb-3 w-[560px] rounded-2xl bg-[#151521] border border-white/15 shadow-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {WIDGET_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setInsertCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                            insertCategory === cat
                              ? "bg-violet-600 text-white"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveDockMenu(null)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {WIDGET_CATALOG.filter(
                      (w) => w.category === insertCategory
                    ).map((item) => (
                      <button
                        key={item.type}
                        onClick={() =>
                          handleInsertWidget(item.type, item.defaultColSpan)
                        }
                        className="p-3 rounded-xl bg-white/[0.03] hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-left transition"
                      >
                        <div className="text-xs font-bold text-white">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {item.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popover 3: Media Picker */}
              {activeDockMenu === "media" && (
                <div className="absolute bottom-full left-12 mb-3 w-96 rounded-2xl bg-[#151521] border border-white/15 shadow-2xl p-4 space-y-3">
                  <div className="text-xs font-bold text-white">
                    Insert Visual from Workspace Media Library
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                    {mediaAssets.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => {
                          updateActiveSlide({
                            widgets: [
                              ...activeSlide.widgets,
                              {
                                id: `img-${Date.now().toString(36)}`,
                                type: "image",
                                colSpan: 6,
                                badge: "VISUAL",
                                title: asset.name,
                                mediaUrl: asset.url
                              }
                            ]
                          });
                          setActiveDockMenu(null);
                        }}
                        className="rounded-xl overflow-hidden border border-white/10 hover:border-violet-500 group text-left"
                      >
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="h-24 w-full object-cover"
                        />
                        <div className="p-1.5 text-[10px] text-zinc-300 truncate bg-[#0d0d14]">
                          {asset.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popover 4: Slide Layout Remix */}
              {activeDockMenu === "remix" && (
                <div className="absolute bottom-full left-24 mb-3 w-80 rounded-2xl bg-[#151521] border border-white/15 shadow-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-white mb-2">
                    Instant Slide Layout Remix
                  </div>
                  {[
                    { id: "grid-3", label: "3-Column Executive Bento (4-4-4)" },
                    { id: "split-2", label: "2-Column Split Spotlight (6-6)" },
                    { id: "hero-bento", label: "Asymmetric Hero + Bento (8-4)" },
                    { id: "metric-focus", label: "North Star KPI Spotlight" },
                    { id: "comparison", label: "Convert to Comparison Matrix" },
                    { id: "timeline", label: "Convert to Phased Timeline" }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRemixSlide(r.id as any)}
                      className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-600/20 border border-white/10 text-left text-xs text-zinc-200 hover:text-white transition"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Popover 5: Insert Template Slide */}
              {activeDockMenu === "templates" && (
                <div className="absolute bottom-full right-24 mb-3 w-80 rounded-2xl bg-[#151521] border border-white/15 shadow-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-white">
                    Insert Slide from Playbook Template
                  </div>
                  {SEED_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        const tplSlide = tpl.slides[0];
                        if (tplSlide) {
                          const newSlide: SlideSection = {
                            ...JSON.parse(JSON.stringify(tplSlide)),
                            id: `tpl-${Date.now().toString(36)}`
                          };
                          const next = [...slides, newSlide];
                          persistDocument(next);
                          setActiveSlideId(newSlide.id);
                          setActiveDockMenu(null);
                        }
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-600/20 border border-white/10 text-left text-xs"
                    >
                      <div className="font-semibold text-white">{tpl.title}</div>
                      <div className="text-[10px] text-zinc-400">
                        {tpl.category} • {tpl.slideCount} slides
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Popover 6: Brand Kit & 19 Studio Themes */}
              {activeDockMenu === "brandkit" && (
                <div className="absolute bottom-full right-10 mb-3 w-96 rounded-2xl bg-[#151521] border border-white/15 shadow-2xl p-4 space-y-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-white">
                      Active Brand Kit
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {brandKits.map((bk) => (
                        <button
                          key={bk.id}
                          onClick={() =>
                            persistDocument(slides, { brandKitId: bk.id })
                          }
                          className={`p-2 rounded-xl border text-xs font-medium truncate ${
                            doc?.brandKitId === bk.id
                              ? "bg-violet-600/25 border-violet-500 text-white"
                              : "bg-white/[0.03] border-white/10 text-zinc-300"
                          }`}
                        >
                          {bk.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="text-xs font-bold text-white">
                      19 Official Chronicle Studio Themes
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {themes.map((th) => {
                        const bg =
                          th.themeJson?.colors?.background?.default || "#0b0b10";
                        return (
                          <button
                            key={th.id}
                            onClick={() => {
                              persistDocument(slides, { themeId: th.id });
                              updateActiveSlide({
                                background: {
                                  type: "solid",
                                  preset:
                                    bg.toLowerCase() === "#ffffff" ||
                                    bg.toLowerCase().startsWith("#f")
                                      ? "light"
                                      : "dark",
                                  color: bg
                                }
                              });
                            }}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between ${
                              doc?.themeId === th.id
                                ? "border-violet-500 bg-violet-600/20"
                                : "border-white/10 bg-white/[0.03]"
                            }`}
                          >
                            <span className="text-xs text-white truncate">
                              {th.displayName}
                            </span>
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                              style={{ backgroundColor: bg }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Popover 7: Slide Background Presets */}
              {activeDockMenu === "background" && (
                <div className="absolute bottom-full right-0 mb-3 w-72 rounded-2xl bg-[#151521] border border-white/15 shadow-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-white mb-2">
                    Slide Surface &amp; Atmosphere
                  </div>
                  {BACKGROUND_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        updateActiveSlide({
                          background: {
                            type: preset.type,
                            preset: preset.preset,
                            color: preset.color,
                            gradient: preset.gradient
                          }
                        });
                        setActiveDockMenu(null);
                      }}
                      className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-white"
                    >
                      <span>{preset.name}</span>
                      <span
                        className="w-5 h-5 rounded-lg border border-white/20"
                        style={{
                          background: preset.gradient || preset.color
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom-Right "Ask Muse..." AI Copilot Pill & Popover */}
          {!presentMode && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-6 right-6 z-40"
            >
              {museOpen ? (
                <div className="w-80 rounded-2xl bg-[#151522] border border-violet-500/40 shadow-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Ask Muse AI Copilot
                    </span>
                    <button
                      onClick={() => setMuseOpen(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {museStatus && (
                    <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-300">
                      {museStatus}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <button
                      onClick={() => handleAskMuse("executive")}
                      disabled={museLoading}
                      className="p-2 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 text-left text-zinc-200"
                    >
                      ✨ Make Executive
                    </button>
                    <button
                      onClick={() => handleAskMuse("metrics")}
                      disabled={museLoading}
                      className="p-2 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 text-left text-zinc-200"
                    >
                      📊 Add KPI Metric
                    </button>
                    <button
                      onClick={() => handleAskMuse("timeline")}
                      disabled={museLoading}
                      className="p-2 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 text-left text-zinc-200"
                    >
                      🗓️ Add Roadmap
                    </button>
                    <button
                      onClick={() => handleAskMuse("comparison")}
                      disabled={museLoading}
                      className="p-2 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 text-left text-zinc-200"
                    >
                      ⚖️ Add Comparison
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAskMuse("custom", musePrompt);
                    }}
                    className="flex gap-1.5"
                  >
                    <input
                      type="text"
                      value={musePrompt}
                      onChange={(e) => setMusePrompt(e.target.value)}
                      placeholder="Ask Muse to refine this slide..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#0b0b10] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                    <button
                      type="submit"
                      disabled={museLoading}
                      className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
                    >
                      {museLoading ? "..." : "Run"}
                    </button>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setMuseOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-2xl flex items-center gap-2 border border-violet-400/30 transition"
                >
                  <Wand2 className="w-3.5 h-3.5" /> Ask Muse...
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

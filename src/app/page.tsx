"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  DEFAULT_WORKSPACE_ID,
  SEED_DOCUMENTS,
  SEED_TEMPLATES
} from "@/lib/seed-data";
import {
  Sparkles,
  ArrowRight,
  Play,
  Layers,
  Palette,
  Wand2,
  CheckCircle2,
  Terminal,
  Share2,
  BarChart3
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [heroPrompt, setHeroPrompt] = useState(
    "Series B Investor Pitch Deck for Autonomous AI Infrastructure"
  );
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [generating, setGenerating] = useState(false);

  const previewSlides = SEED_DOCUMENTS[0].slides;
  const activeSlide = previewSlides[activeSlideIdx] || previewSlides[0];

  async function handleGenerateFromHero(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/storyline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: heroPrompt,
          slideCount: 6,
          tone: "Executive",
          workspaceId: DEFAULT_WORKSPACE_ID
        })
      });
      const data = await res.json();
      if (data.session?.id) {
        router.push(`/${DEFAULT_WORKSPACE_ID}/chat/${data.session.id}`);
      } else {
        router.push(`/${DEFAULT_WORKSPACE_ID}/chat`);
      }
    } catch {
      router.push(`/${DEFAULT_WORKSPACE_ID}/chat`);
    }
  }

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.22),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Chronicle 2.0 • AI Storytelling + Smart Widgets + Brand Kits</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            Every great presenter{" "}
            <span className="bg-gradient-to-r from-violet-300 via-white to-indigo-300 bg-clip-text text-transparent">
              has a secret.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Chronicle turns raw thoughts, memos, and metrics into interactive, board-ready presentations—governed by your Brand Kit and powered by 34+ smart blocks.
          </p>

          {/* Interactive AI Prompt Composer */}
          <form
            onSubmit={handleGenerateFromHero}
            className="max-w-2xl mx-auto mt-8 p-2 rounded-2xl bg-[#13131d] border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2.5 flex-1 w-full px-3 py-2">
              <Wand2 className="w-4 h-4 text-violet-400 shrink-0" />
              <input
                type="text"
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                placeholder="Describe the presentation you want to create..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={generating}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm transition inline-flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? "Creating Storyline..." : "Generate with AI"}
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-zinc-400">
            <Link
              href={`/${DEFAULT_WORKSPACE_ID}/home`}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 transition inline-flex items-center gap-1.5"
            >
              Open Workspace Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/${DEFAULT_WORKSPACE_ID}/document/b703967e-998f-4a2e-8432-f324d58b7afa/s1`}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 transition inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-violet-400" /> Try Live Slide Editor (8-Slide Board Deck)
            </Link>
          </div>
        </div>

        {/* Interactive Live Slide Preview Window */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="rounded-2xl bg-[#111119] border border-white/10 shadow-[0_25px_90px_rgba(0,0,0,0.75)] overflow-hidden">
            {/* Window Topbar */}
            <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between bg-[#0d0d14]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/60" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <span className="ml-3 text-xs font-medium text-zinc-300">
                  Q3 Board Meeting &amp; Investor Update — Chronicle Studio
                </span>
              </div>
              <div className="flex items-center gap-2">
                {previewSlides.slice(0, 6).map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                      idx === activeSlideIdx
                        ? "bg-violet-600 text-white"
                        : "bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    0{idx + 1} • {s.sectionGroup || s.title.slice(0, 12)}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Slide Canvas Preview */}
            <div
              className="p-8 md:p-12 min-h-[420px] flex flex-col justify-between"
              style={{
                background:
                  activeSlide.background.gradient ||
                  activeSlide.background.color ||
                  "#0b0b10"
              }}
            >
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                  {activeSlide.eyebrow || activeSlide.sectionGroup}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white">
                  {activeSlide.title}
                </h2>
                {activeSlide.subtitle && (
                  <p className="text-sm md:text-base text-zinc-300 max-w-3xl">
                    {activeSlide.subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-12 gap-4 mt-8">
                {activeSlide.widgets.slice(0, 4).map((w) => (
                  <div
                    key={w.id}
                    style={{
                      gridColumn: `span ${Math.min(12, Math.max(4, w.colSpan || 4))} / span ${Math.min(12, Math.max(4, w.colSpan || 4))}`
                    }}
                    className="rounded-xl bg-white/[0.05] border border-white/10 p-5 backdrop-blur-md"
                  >
                    {w.badge && (
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 mb-2">
                        {w.badge}
                      </span>
                    )}
                    {w.value && (
                      <div className="text-3xl font-bold text-white mb-1">
                        {w.value}{" "}
                        {w.delta && (
                          <span className="text-xs font-medium text-emerald-400">
                            {w.delta}
                          </span>
                        )}
                      </div>
                    )}
                    {w.title && (
                      <div className="text-sm font-semibold text-white mb-1">
                        {w.title}
                      </div>
                    )}
                    {w.content && (
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {w.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10 text-xs text-zinc-400">
                <span>Click any slide pill above to preview interactive blocks</span>
                <Link
                  href={`/${DEFAULT_WORKSPACE_ID}/document/b703967e-998f-4a2e-8432-f324d58b7afa/${activeSlide.id}`}
                  className="text-violet-300 hover:text-white font-medium inline-flex items-center gap-1"
                >
                  Edit this slide in Studio <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              BUILT FOR MODERN STORYTELLERS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Stop pushing pixels. Start shaping narratives.
            </h2>
            <p className="text-zinc-400 text-base">
              Every block in Chronicle snaps to an intelligent 12-column bento grid and adapts to your brand tokens automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Wand2,
                title: "AI Muse Storyline Engine",
                desc: "Start from a prompt, doc, or URL. Edit the section-by-section narrative outline before generating rich widget slides.",
                href: `/${DEFAULT_WORKSPACE_ID}/chat`,
                cta: "Try AI Muse"
              },
              {
                icon: Layers,
                title: "34+ Interactive Smart Widgets",
                desc: "Metrics, comparison matrices, timelines, Gantt roadmaps, funnels, quotes, and live embeds that auto-layout cleanly.",
                href: `/${DEFAULT_WORKSPACE_ID}/document/b703967e-998f-4a2e-8432-f324d58b7afa/s1`,
                cta: "Explore Widgets"
              },
              {
                icon: Palette,
                title: "1-Click Brand Kits & 19 Themes",
                desc: "Enter any company domain to extract logos, color palettes, and typography—or choose from 19 curated studio themes.",
                href: `/${DEFAULT_WORKSPACE_ID}/brand-kit`,
                cta: "Open Brand Kits"
              },
              {
                icon: BarChart3,
                title: "Instant Slide Remixing",
                desc: "Switch any slide between Executive Grid, Split Spotlight, 3-Column Bento, Compare Matrix, and Metric Focus in one click.",
                href: `/${DEFAULT_WORKSPACE_ID}/document/b703967e-998f-4a2e-8432-f324d58b7afa/s2`,
                cta: "Test Slide Remix"
              },
              {
                icon: Terminal,
                title: "Chronicle REST API & MCP Server",
                desc: "Connect Claude Desktop, Cursor, or your internal workflows to generate and update presentations programmatically.",
                href: "/api-platform",
                cta: "Read API Docs"
              },
              {
                icon: Share2,
                title: "Live Web Sharing & PDF/PPTX Export",
                desc: "Share responsive web links with optional template duplication, or export crisp PDF, PPTX, and JSON bundles.",
                href: `/share/${DEFAULT_WORKSPACE_ID}/b703967e-998f-4a2e-8432-f324d58b7afa/s1`,
                cta: "View Public Share"
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-[#111118] border border-white/10 p-6 flex flex-col justify-between hover:border-violet-500/40 transition"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
                <Link
                  href={item.href}
                  className="mt-6 text-xs font-medium text-violet-300 hover:text-white inline-flex items-center gap-1.5"
                >
                  {item.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Templates Section */}
      <section className="py-20 px-6 border-t border-white/10 bg-[#0a0a10]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                CURATED PLAYBOOKS
              </div>
              <h2 className="text-3xl font-bold text-white mt-1">
                Start with battle-tested templates
              </h2>
            </div>
            <Link
              href="/templates"
              className="text-sm text-violet-300 hover:text-white inline-flex items-center gap-1.5"
            >
              Browse all templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SEED_TEMPLATES.map((tpl) => (
              <Link
                key={tpl.id}
                href={`/templates/${tpl.slug}`}
                className="group rounded-2xl bg-[#12121b] border border-white/10 overflow-hidden hover:border-violet-500/50 transition flex flex-col"
              >
                <div className="h-44 bg-gradient-to-br from-violet-900/40 via-[#151525] to-indigo-950/50 p-5 flex flex-col justify-between relative overflow-hidden">
                  <span className="self-start px-2.5 py-0.5 rounded-full text-[11px] bg-black/50 border border-white/15 text-zinc-200">
                    {tpl.category}
                  </span>
                  <div>
                    <div className="text-xs text-violet-300 font-medium">
                      {tpl.slideCount} Slides • Interactive
                    </div>
                    <div className="text-lg font-bold text-white group-hover:text-violet-200 transition">
                      {tpl.title}
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-zinc-300 pt-2 border-t border-white/5">
                    <span>By {tpl.authorName}</span>
                    <span className="text-violet-300 font-medium inline-flex items-center gap-1">
                      Preview template <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 border-t border-white/10 text-center bg-gradient-to-b from-[#08080c] to-[#120d24]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to craft your next breakthrough deck?
          </h2>
          <p className="text-zinc-400 text-base">
            Jump straight into Chronicle Studio with pre-loaded board decks, 19 studio themes, and AI Muse storyline generation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={`/${DEFAULT_WORKSPACE_ID}/home`}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition inline-flex items-center gap-2"
            >
              Launch Chronicle Studio <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-full bg-white/10 text-white font-medium text-sm hover:bg-white/15 border border-white/15 transition"
            >
              Compare Plans
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 34+ Smart Widgets
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 19 Studio Themes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> REST API &amp; MCP Ready
            </span>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

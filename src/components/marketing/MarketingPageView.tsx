"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { DEFAULT_WORKSPACE_ID, PRICING_PLANS, SEED_DOCUMENTS } from "@/lib/seed-data";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  Shield,
  Zap,
  Layers
} from "lucide-react";

export interface MarketingPageConfig {
  slug: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  highlights: { title: string; description: string; metric?: string }[];
}

export function MarketingPageView({ config }: { config: MarketingPageConfig }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [apiTopic, setApiTopic] = useState("Q4 Enterprise AI Roadmap & OKRs");
  const [apiResult, setApiResult] = useState<any>(null);
  const [runningApi, setRunningApi] = useState(false);

  const curlSnippet = `curl -X POST http://localhost:3000/api/v1/decks \\
  -H "Authorization: Bearer chr_live_demo_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "${apiTopic}",
    "slide_count": 6,
    "brand_kit_id": "bk-google"
  }'`;

  async function handleRunLiveApi() {
    setRunningApi(true);
    try {
      const res = await fetch("/api/v1/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: apiTopic,
          slide_count: 6,
          brand_kit_id: "bk-google"
        })
      });
      const data = await res.json();
      setApiResult(data);
    } finally {
      setRunningApi(false);
    }
  }

  return (
    <MarketingLayout>
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.18),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> {config.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            {config.title}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={config.ctaHref || `/${DEFAULT_WORKSPACE_ID}/home`}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition inline-flex items-center gap-2"
            >
              {config.ctaLabel || "Launch Chronicle Studio"}{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${DEFAULT_WORKSPACE_ID}/chat`}
              className="px-6 py-3 rounded-full bg-white/10 text-white font-medium text-sm hover:bg-white/15 border border-white/15 transition"
            >
              Generate Deck with AI Muse
            </Link>
          </div>
        </div>
      </section>

      {/* Special Interactive Section for Pricing */}
      {config.slug === "pricing" && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 border flex flex-col justify-between ${
                  plan.name === "Max"
                    ? "bg-gradient-to-b from-violet-950/50 to-[#111119] border-violet-500/60 shadow-xl"
                    : "bg-[#111119] border-white/10"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{plan.name}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-200">
                      {plan.badge}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-xs text-zinc-400">{plan.period}</span>
                  </div>
                  <div className="text-xs text-violet-300 font-medium">
                    Up to {plan.tokens.toLocaleString()} AI tokens / mo
                  </div>
                  <ul className="space-y-2.5 pt-3 border-t border-white/10 text-xs text-zinc-300">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/${DEFAULT_WORKSPACE_ID}/home`}
                  className="mt-8 w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs text-center hover:bg-zinc-200 transition"
                >
                  Start with {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Special Interactive Playground for API Platform & Docs */}
      {(config.slug === "api-platform" || config.slug === "docs") && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="rounded-2xl bg-[#101018] border border-white/15 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0b0b12] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Interactive Chronicle REST API &amp; MCP Playground (`POST /api/v1/decks`)</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(curlSnippet);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 inline-flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied cURL" : "Copy cURL"}
              </button>
            </div>

            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="p-6 space-y-4">
                <label className="block text-xs font-medium text-zinc-300">
                  Presentation Topic / Prompt
                </label>
                <input
                  type="text"
                  value={apiTopic}
                  onChange={(e) => setApiTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080c] border border-white/10 text-xs text-white"
                />
                <pre className="p-4 rounded-xl bg-[#07070b] border border-white/10 text-xs text-emerald-300 overflow-x-auto font-mono leading-relaxed">
                  {curlSnippet}
                </pre>
                <button
                  onClick={handleRunLiveApi}
                  disabled={runningApi}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs inline-flex items-center gap-2 transition"
                >
                  <Zap className="w-4 h-4" />
                  {runningApi ? "Synthesizing Deck via /api/v1/decks..." : "Execute Live API Request"}
                </button>
              </div>

              <div className="p-6 space-y-4 bg-[#0b0b11]">
                <div className="text-xs font-medium text-zinc-300">
                  Live API Response
                </div>
                {apiResult ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                      <div className="text-xs text-emerald-200">
                        Created deck <strong>{apiResult.title}</strong> ({apiResult.slide_count} slides)
                      </div>
                      <button
                        onClick={() => router.push(apiResult.editor_url)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-400 text-black font-semibold text-xs"
                      >
                        Open in Editor →
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-[#07070b] border border-white/10 text-[11px] text-zinc-300 max-h-60 overflow-auto font-mono">
                      {JSON.stringify(apiResult, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="h-60 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-zinc-500">
                    Click &ldquo;Execute Live API Request&rdquo; to generate a real deck via REST API
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Special Comparison Matrix for vs Gamma / vs Pitch */}
      {(config.slug === "chronicle-vs-gamma" || config.slug === "chronicle-vs-pitch") && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="rounded-2xl bg-[#111119] border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="p-4 text-zinc-400 font-medium">Capability</th>
                  <th className="p-4 text-violet-300 font-bold">Chronicle Studio 2.0</th>
                  <th className="p-4 text-zinc-400 font-medium">
                    {config.slug === "chronicle-vs-gamma" ? "Gamma" : "Pitch"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs">
                {[
                  ["Interactive Smart Widgets", "34+ purpose-built bento blocks", "Basic cards / static slides"],
                  ["1-Click Domain Brand Kit Extraction", "Automatic logo, palette & font sync", "Manual theme setup"],
                  ["Public REST API & MCP Server", "Native Claude/Cursor MCP + REST v1", "Limited or unavailable"],
                  ["Instant Layout Remixing", "6 structural layout presets per slide", "Manual drag-and-drop resizing"],
                  ["Cinematic Dark & Light Studio Themes", "19 official production themes", "Standard templates"]
                ].map(([cap, chr, comp]) => (
                  <tr key={cap}>
                    <td className="p-4 font-medium text-white">{cap}</td>
                    <td className="p-4 text-emerald-300 font-semibold">{chr}</td>
                    <td className="p-4 text-zinc-400">{comp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Gallery Showcase when on /gallery */}
      {config.slug === "gallery" && (
        <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-6">
          {SEED_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl bg-[#111119] border border-white/10 p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider">
                  {doc.slides.length} Interactive Slides
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">{doc.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {doc.slides[0]?.subtitle || "Executive deck crafted in Chronicle Studio"}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <Link
                  href={`/${DEFAULT_WORKSPACE_ID}/document/${doc.id}/${doc.slides[0]?.id || "s1"}`}
                  className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500 transition"
                >
                  Open in Studio Editor
                </Link>
                <Link
                  href={`/share/${DEFAULT_WORKSPACE_ID}/${doc.id}/${doc.slides[0]?.id || "s1"}`}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-200 text-xs font-medium hover:bg-white/10 transition"
                >
                  View Public Share Link
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Highlights Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {config.highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl bg-[#111119] border border-white/10 p-6 space-y-3"
            >
              {h.metric && (
                <div className="text-3xl font-bold text-violet-300">{h.metric}</div>
              )}
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-white">{h.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}

"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { DEFAULT_WORKSPACE_ID, SEED_TEMPLATES } from "@/lib/seed-data";
import { ArrowLeft, Sparkles, ArrowRight, Layers, CheckCircle2 } from "lucide-react";

export default function TemplateDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const template =
    SEED_TEMPLATES.find((t) => t.slug === slug) || SEED_TEMPLATES[0];
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [creating, setCreating] = useState(false);

  const activeSlide = template.slides[activeSlideIdx] || template.slides[0];

  async function handleUseTemplate() {
    setCreating(true);
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: template.slug,
        workspaceId: DEFAULT_WORKSPACE_ID
      })
    });
    const data = await res.json();
    if (data.document?.id) {
      router.push(`/${DEFAULT_WORKSPACE_ID}/document/${data.document.id}`);
    } else {
      setCreating(false);
    }
  }

  return (
    <MarketingLayout>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Template Gallery
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs text-violet-300 font-medium">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30">
                {template.category}
              </span>
              <span>• {template.slides.length} interactive slides</span>
              <span>• By {template.authorName}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {template.title}
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              {template.description}
            </p>
          </div>

          <button
            onClick={handleUseTemplate}
            disabled={creating}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm inline-flex items-center gap-2 shrink-0 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            {creating ? "Creating in Studio..." : "Use this Template in Studio"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Slide Preview */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-violet-400" /> Slide Outline
            </div>
            {template.slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlideIdx(idx)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  idx === activeSlideIdx
                    ? "bg-violet-600/20 border-violet-500 text-white"
                    : "bg-[#111119] border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider text-violet-300">
                  Slide 0{idx + 1} • {s.sectionGroup}
                </div>
                <div className="text-xs font-semibold mt-0.5 truncate">
                  {s.title}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-9 rounded-2xl bg-[#111119] border border-white/15 p-8 min-h-[420px] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                {activeSlide.eyebrow || activeSlide.sectionGroup}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {activeSlide.title}
              </h2>
              {activeSlide.subtitle && (
                <p className="text-sm text-zinc-400">{activeSlide.subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-12 gap-4 my-6">
              {activeSlide.widgets.map((w) => (
                <div
                  key={w.id}
                  style={{
                    gridColumn: `span ${Math.min(12, Math.max(4, w.colSpan || 6))} / span ${Math.min(12, Math.max(4, w.colSpan || 6))}`
                  }}
                  className="rounded-xl bg-white/[0.04] border border-white/10 p-4"
                >
                  {w.badge && (
                    <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 mb-1.5">
                      {w.badge}
                    </span>
                  )}
                  {w.value && (
                    <div className="text-2xl font-bold text-white mb-1">
                      {w.value}{" "}
                      {w.delta && (
                        <span className="text-xs text-emerald-400">{w.delta}</span>
                      )}
                    </div>
                  )}
                  {w.title && (
                    <div className="text-sm font-semibold text-white">
                      {w.title}
                    </div>
                  )}
                  {w.content && (
                    <p className="text-xs text-zinc-400 mt-1">{w.content}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Fully editable smart widgets &amp; brand tokens
              </span>
              <span>
                Slide {activeSlideIdx + 1} of {template.slides.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}

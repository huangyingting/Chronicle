"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SmartWidgetBlock } from "@/components/editor/SmartWidgetBlock";
import { SlideSection } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function PublicShareViewerPage({
  params
}: {
  params: Promise<{
    workspaceId: string;
    documentId: string;
    sectionId: string;
  }>;
}) {
  const { workspaceId, documentId, sectionId } = use(params);
  const router = useRouter();

  const [doc, setDoc] = useState<any>(null);
  const [slides, setSlides] = useState<SlideSection[]>([]);
  const [activeSlideId, setActiveSlideId] = useState(sectionId || "s1");

  useEffect(() => {
    fetch(`/api/documents/${documentId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.document) {
          setDoc(d.document);
          const loaded: SlideSection[] = d.document.slides || [];
          setSlides(loaded);
          if (loaded.some((s) => s.id === sectionId)) {
            setActiveSlideId(sectionId);
          } else if (loaded[0]?.id) {
            setActiveSlideId(loaded[0].id);
          }
        }
      });
  }, [documentId, sectionId]);

  const activeIdx = Math.max(
    0,
    slides.findIndex((s) => s.id === activeSlideId)
  );
  const activeSlide = slides[activeIdx] || slides[0];

  if (!activeSlide) {
    return (
      <div className="min-h-screen bg-[#08080c] text-white flex items-center justify-center text-sm text-zinc-400">
        Loading shared presentation...
      </div>
    );
  }

  const isLight = activeSlide.background?.preset === "light";

  return (
    <div className="min-h-screen bg-[#07070b] text-white flex flex-col justify-between p-6">
      {/* Viewer Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white text-black font-bold text-xs flex items-center justify-center">
            C
          </div>
          <div>
            <div className="text-sm font-bold text-white">{doc?.title}</div>
            <div className="text-[11px] text-zinc-400">
              Shared via Chronicle Studio • Slide {activeIdx + 1} of{" "}
              {slides.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {doc?.isPublicDocumentDuplicationEnabled !== false && (
            <button
              onClick={() => router.push(`/duplicate/${documentId}`)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-medium text-white inline-flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Duplicate as Template
            </button>
          )}
          <Link
            href={`/${workspaceId}/document/${documentId}/${activeSlide.id}`}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white inline-flex items-center gap-1.5"
          >
            Open in Studio <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main 16:9 Slide Frame */}
      <main className="my-6 max-w-6xl w-full mx-auto">
        <div
          style={{
            background:
              activeSlide.background?.gradient ||
              activeSlide.background?.color ||
              "#0b0b10"
          }}
          className={`w-full min-h-[540px] rounded-3xl border shadow-2xl p-8 md:p-12 flex flex-col justify-between ${
            isLight
              ? "border-black/15 text-zinc-900"
              : "border-white/15 text-white"
          }`}
        >
          <div className="space-y-2 mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-violet-400">
              {activeSlide.eyebrow || activeSlide.sectionGroup}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {activeSlide.title}
            </h1>
            {activeSlide.subtitle && (
              <p
                className={`text-sm ${
                  isLight ? "text-zinc-600" : "text-zinc-400"
                }`}
              >
                {activeSlide.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4 my-auto">
            {activeSlide.widgets.map((w) => (
              <SmartWidgetBlock
                key={w.id}
                widget={w}
                selected={false}
                readOnly
                isLightSurface={isLight}
              />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>{doc?.title}</span>
            <span>
              0{activeIdx + 1} / 0{slides.length}
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Navigation & Watermark */}
      <footer className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const prev = slides[Math.max(0, activeIdx - 1)];
              if (prev) setActiveSlideId(prev.id);
            }}
            disabled={activeIdx === 0}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSlideId(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                idx === activeIdx
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              0{idx + 1} • {s.sectionGroup || s.title.slice(0, 12)}
            </button>
          ))}
          <button
            onClick={() => {
              const next = slides[Math.min(slides.length - 1, activeIdx + 1)];
              if (next) setActiveSlideId(next.id);
            }}
            disabled={activeIdx === slides.length - 1}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {doc?.showWatermark !== false && (
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs text-zinc-300 hover:text-white inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Made with
            Chronicle
          </Link>
        )}
      </footer>
    </div>
  );
}

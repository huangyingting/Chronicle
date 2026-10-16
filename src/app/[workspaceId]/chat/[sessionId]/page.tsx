"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import {
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Layers,
  CheckCircle2
} from "lucide-react";

export default function ChatSessionPage({
  params
}: {
  params: Promise<{ workspaceId: string; sessionId: string }>;
}) {
  const { workspaceId, sessionId } = use(params);
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [storyline, setStoryline] = useState<any[]>([]);
  const [brandKitId, setBrandKitId] = useState("bk-google");
  const [GeneratingDeck, setGeneratingDeck] = useState(false);

  useEffect(() => {
    fetch(`/api/ai/storyline?sessionId=${sessionId}&workspaceId=${workspaceId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.session) {
          setSession(d.session);
          setStoryline(d.session.storyline || []);
        }
      });
  }, [sessionId, workspaceId]);

  async function saveStoryline(nextStoryline: any[]) {
    setStoryline(nextStoryline);
    await fetch("/api/ai/storyline", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        storyline: nextStoryline
      })
    });
  }

  function handleUpdateSection(idx: number, field: string, value: any) {
    const next = [...storyline];
    next[idx] = { ...next[idx], [field]: value };
    saveStoryline(next);
  }

  function handleMove(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= storyline.length) return;
    const next = [...storyline];
    const tmp = next[idx];
    next[idx] = next[target];
    next[target] = tmp;
    saveStoryline(next);
  }

  function handleAddSlide() {
    const next = [
      ...storyline,
      {
        id: `outline-${Date.now().toString(36)}`,
        sectionGroup: "Deep Dive",
        title: "Strategic Milestone & KPIs",
        summary: "Key proof points and operational targets",
        suggestedWidgets: ["metric", "box", "timeline"],
        keyPoints: [
          "Accelerate enterprise adoption across top 100 accounts",
          "Maintain >140% net dollar retention with automated expansion"
        ]
      }
    ];
    saveStoryline(next);
  }

  function handleDeleteSlide(idx: number) {
    if (storyline.length <= 1) return;
    const next = storyline.filter((_, i) => i !== idx);
    saveStoryline(next);
  }

  async function handleGeneratePresentation() {
    setGeneratingDeck(true);
    try {
      const res = await fetch("/api/ai/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          sessionId,
          prompt: session?.prompt || session?.title || "AI Presentation",
          outline: storyline,
          brandKitId
        })
      });
      const data = await res.json();
      if (data.document?.id) {
        const firstSlideId = data.document.slides?.[0]?.id || "s1";
        router.push(`/${workspaceId}/document/${data.document.id}/${firstSlideId}`);
      }
    } finally {
      setGeneratingDeck(false);
    }
  }

  return (
    <AppShell workspaceId={workspaceId}>
      <header className="h-16 px-8 border-b border-white/[0.08] flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">
            Muse Storyline Outline Editor
          </div>
          <h1 className="text-base font-bold text-white truncate max-w-xl">
            {session?.title || "Structuring Presentation Outline..."}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={brandKitId}
            onChange={(e) => setBrandKitId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#14141f] border border-white/10 text-xs text-white"
          >
            <option value="bk-google">Brand Kit: Google</option>
            <option value="bk-apple">Brand Kit: Apple</option>
            <option value="bk-openai">Brand Kit: OpenAI</option>
          </select>

          <button
            onClick={handleGeneratePresentation}
            disabled={GeneratingDeck}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            {GeneratingDeck
              ? "Synthesizing Smart Widgets..."
              : `Generate ${storyline.length}-Slide Presentation`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="p-8 max-w-5xl mx-auto w-full space-y-6 flex-1 overflow-y-auto">
        <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-violet-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Muse synthesized a <strong>{storyline.length}-slide storyline</strong>. Edit any section title, narrative summary, or reorder slides before generating your deck.
            </span>
          </div>
          <button
            onClick={handleAddSlide}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Slide Section
          </button>
        </div>

        <div className="space-y-4">
          {storyline.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rounded-2xl bg-[#12121b] border border-white/10 p-5 space-y-3 hover:border-violet-500/40 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1">
                  <span className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-300 font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.sectionGroup || "Section"}
                    onChange={(e) =>
                      handleUpdateSection(idx, "sectionGroup", e.target.value)
                    }
                    className="w-36 px-2.5 py-1 rounded-lg bg-[#0b0b10] border border-white/10 text-[11px] font-semibold uppercase tracking-wider text-violet-300"
                  />
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) =>
                      handleUpdateSection(idx, "title", e.target.value)
                    }
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b0b10] border border-white/10 text-sm font-bold text-white"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === storyline.length - 1}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(idx)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={item.summary || ""}
                onChange={(e) =>
                  handleUpdateSection(idx, "summary", e.target.value)
                }
                placeholder="Slide narrative takeaway..."
                className="w-full px-3 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-xs text-zinc-300"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-violet-400" /> Smart Widgets:
                </span>
                {(item.suggestedWidgets || ["heading", "metric", "box"]).map(
                  (w: string, wIdx: number) => (
                    <span
                      key={wIdx}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-mono"
                    >
                      {w}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

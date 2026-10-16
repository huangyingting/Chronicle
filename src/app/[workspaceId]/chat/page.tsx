"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import {
  Sparkles,
  Wand2,
  ArrowRight,
  Layers,
  Clock
} from "lucide-react";

const QUICK_PROMPTS = [
  {
    category: "Pitch Deck",
    prompt: "Series B Investor Pitch Deck for Autonomous AI Infrastructure Platform"
  },
  {
    category: "Board Update",
    prompt: "Q3 Board of Directors Readout: $84.2M ARR, 146% NRR & 2026 Priorities"
  },
  {
    category: "Product Strategy",
    prompt: "2026 Product Vision & Multi-Agent Architecture Roadmap"
  },
  {
    category: "Sales Proposal",
    prompt: "Enterprise Security & ROI Business Case for Fortune 500 Deployment"
  },
  {
    category: "QBR Readout",
    prompt: "Quarterly Business Review: GTM Funnel Efficiency & Expansion Cohorts"
  }
];

export default function StartFromChatPage({
  params
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState(6);
  const [tone, setTone] = useState("Executive");
  const [category, setCategory] = useState("Pitch Deck");
  const [sessions, setSessions] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch(`/api/ai/storyline?workspaceId=${workspaceId}`)
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions || []))
      .catch(() => null);
  }, [workspaceId]);

  async function handleStartSession(e: React.FormEvent) {
    e.preventDefault();
    const finalPrompt =
      prompt.trim() ||
      "Series B Investor Pitch Deck for Autonomous AI Infrastructure";
    setCreating(true);
    try {
      const res = await fetch("/api/ai/storyline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          prompt: finalPrompt,
          slideCount,
          tone,
          category
        })
      });
      const data = await res.json();
      if (data.session?.id) {
        router.push(`/${workspaceId}/chat/${data.session.id}`);
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <AppShell workspaceId={workspaceId}>
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.15),transparent_60%)] pointer-events-none" />

        <div className="w-full max-w-3xl space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300">
              <Sparkles className="w-3.5 h-3.5" /> Chronicle Muse Storyline Engine
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Hi Alex, ready to dive in?
            </h1>
            <p className="text-sm text-zinc-400">
              Describe your presentation topic, paste a memo, or choose a playbook below. Muse will structure an interactive storyline first.
            </p>
          </div>

          {/* Prompt Composer Box */}
          <form
            onSubmit={handleStartSession}
            className="rounded-2xl bg-[#13131f] border border-white/15 p-5 shadow-2xl space-y-4"
          >
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Build a 6-slide Series B pitch deck for our autonomous cloud database showing $84M ARR, 146% net dollar retention, competitive moat, and 2026 roadmap..."
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-[#0b0b10] border border-white/10 rounded-xl px-3 py-1.5">
                  <Layers className="w-3.5 h-3.5 text-violet-400" />
                  <select
                    value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    className="bg-transparent text-white focus:outline-none"
                  >
                    <option value={4}>4 Slides</option>
                    <option value={6}>6 Slides</option>
                    <option value={8}>8 Slides</option>
                    <option value={10}>10 Slides</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-[#0b0b10] border border-white/10 rounded-xl px-3 py-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-sky-400" />
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="bg-transparent text-white focus:outline-none"
                  >
                    <option value="Executive">Executive &amp; Boardroom</option>
                    <option value="Venture Pitch">Venture Fundraising</option>
                    <option value="Technical">Technical Architecture</option>
                    <option value="Story-Driven">Narrative &amp; Keynote</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg transition"
              >
                <Sparkles className="w-4 h-4" />
                {creating ? "Structuring Storyline..." : "Generate Storyline Outline"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Category Pills */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-zinc-400">
              Or start with a proven narrative template:
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q.category}
                  type="button"
                  onClick={() => {
                    setCategory(q.category);
                    setPrompt(q.prompt);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#13131d] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-300 hover:text-white transition"
                >
                  <span className="text-violet-400 font-semibold mr-1.5">
                    {q.category}:
                  </span>
                  {q.prompt.slice(0, 46)}...
                </button>
              ))}
            </div>
          </div>

          {/* Recent AI Storyline Sessions */}
          {sessions.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-400" /> Recent Muse Storylines
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {sessions.slice(0, 4).map((s) => (
                  <Link
                    key={s.id}
                    href={`/${workspaceId}/chat/${s.id}`}
                    className="p-4 rounded-xl bg-[#12121b] border border-white/10 hover:border-violet-500/40 transition flex items-center justify-between gap-3"
                  >
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">
                        {s.title}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {s.storyline?.length || s.slideCount} slides • {s.tone}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";
import { Sparkles, ArrowRight, Layers, Wand2 } from "lucide-react";

export default function StartOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col justify-center items-center p-6">
      <div className="max-w-2xl w-full rounded-2xl bg-[#12121b] border border-white/10 p-8 space-y-6 shadow-2xl">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 text-xs">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Chronicle Studio 2.0
          </div>
          <h1 className="text-3xl font-bold text-white">
            How would you like to create your first presentation?
          </h1>
          <p className="text-xs text-zinc-400">
            Choose an AI storyline workflow or jump directly into the interactive slide studio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href={`/${DEFAULT_WORKSPACE_ID}/chat`}
            className="p-5 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/40 hover:border-violet-400 space-y-2 transition"
          >
            <Wand2 className="w-5 h-5 text-violet-300" />
            <div className="text-base font-bold text-white">
              Start with AI Muse
            </div>
            <p className="text-xs text-zinc-400">
              Generate a structured executive storyline and full deck from a prompt in 30 seconds.
            </p>
          </Link>

          <Link
            href={`/${DEFAULT_WORKSPACE_ID}/home`}
            className="p-5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/25 space-y-2 transition"
          >
            <Layers className="w-5 h-5 text-sky-300" />
            <div className="text-base font-bold text-white">
              Explore Workspace Decks
            </div>
            <p className="text-xs text-zinc-400">
              Open pre-loaded board decks, 19 studio themes, and Brand Kits.
            </p>
          </Link>
        </div>

        <div className="text-center pt-2">
          <Link
            href={`/${DEFAULT_WORKSPACE_ID}/home`}
            className="inline-flex items-center gap-1.5 text-xs text-violet-300 hover:text-white font-medium"
          >
            Continue to Chronicle Studio <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

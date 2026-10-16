"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { DEFAULT_WORKSPACE_ID, SEED_TEMPLATES } from "@/lib/seed-data";
import { Search, Sparkles, ArrowRight, Layers } from "lucide-react";

const CATEGORIES = ["All", "Fundraising", "Executive", "Product", "Sales", "Marketing"];

export default function TemplatesPage() {
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [creatingSlug, setCreatingSlug] = useState<string | null>(null);

  const filtered = SEED_TEMPLATES.filter((t) => {
    const matchesCat = category === "All" || t.category === category;
    const matchesQuery =
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  async function useTemplate(slug: string) {
    setCreatingSlug(slug);
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, workspaceId: DEFAULT_WORKSPACE_ID })
    });
    const data = await res.json();
    if (data.document?.id) {
      router.push(`/${DEFAULT_WORKSPACE_ID}/document/${data.document.id}`);
    } else {
      setCreatingSlug(null);
    }
  }

  return (
    <MarketingLayout>
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300">
            <Layers className="w-3.5 h-3.5" /> Curated Presentation Playbooks
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Chronicle Template Gallery
          </h1>
          <p className="text-zinc-400 text-base">
            Start with executive-proven storylines designed by founders, VCs, and product leaders. Customize in one click with your Brand Kit.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111119] border border-white/10 p-3 rounded-2xl">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  category === cat
                    ? "bg-violet-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-2xl bg-[#111119] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-violet-500/40 transition"
            >
              <div>
                <Link
                  href={`/templates/${tpl.slug}`}
                  className="block h-48 bg-gradient-to-br from-violet-900/40 via-[#151525] to-indigo-950/60 p-6 flex flex-col justify-between hover:opacity-95 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-black/50 border border-white/15 text-zinc-200">
                      {tpl.category}
                    </span>
                    <span className="text-xs text-violet-300 font-medium">
                      {tpl.slideCount} slides
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tpl.title}</h3>
                    <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>
                </Link>
              </div>

              <div className="p-5 flex items-center justify-between gap-3 border-t border-white/10">
                <Link
                  href={`/templates/${tpl.slug}`}
                  className="text-xs text-zinc-300 hover:text-white font-medium"
                >
                  Preview slides
                </Link>
                <button
                  onClick={() => useTemplate(tpl.slug)}
                  disabled={creatingSlug === tpl.slug}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  {creatingSlug === tpl.slug ? "Opening..." : "Use template"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}

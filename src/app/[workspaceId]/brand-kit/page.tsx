"use client";

import React, { use, useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import {
  Palette,
  Globe,
  Plus,
  Trash2,
  Type,
  Sparkles,
  Check
} from "lucide-react";

export default function BrandKitPage({
  params
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const [activeTab, setActiveTab] = useState<"kits" | "themes" | "fonts">("kits");
  const [brandKits, setBrandKits] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [customFonts, setCustomFonts] = useState<any[]>([]);

  // Importer form
  const [domainInput, setDomainInput] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const [secondaryColor, setSecondaryColor] = useState("#3B82F6");
  const [importing, setImporting] = useState(false);

  // Custom theme form
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeBg, setNewThemeBg] = useState("#0b0b10");
  const [newThemeAccent, setNewThemeAccent] = useState("#8b5cf6");

  // Font form
  const [fontName, setFontName] = useState("");

  async function fetchBrandData() {
    const [bkRes, thRes] = await Promise.all([
      fetch(`/api/brand-kits?workspaceId=${workspaceId}`),
      fetch(`/api/themes?workspaceId=${workspaceId}`)
    ]);
    const bkData = await bkRes.json();
    const thData = await thRes.json();
    setBrandKits(bkData.brandKits || []);
    setCustomFonts(bkData.customFonts || []);
    setThemes(thData.themes || []);
  }

  useEffect(() => {
    fetchBrandData();
  }, [workspaceId]);

  async function handleImportBrandKit(e: React.FormEvent) {
    e.preventDefault();
    if (!domainInput.trim()) return;
    setImporting(true);
    try {
      await fetch("/api/brand-kits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          domain: domainInput.trim(),
          primaryColor,
          secondaryColor
        })
      });
      setDomainInput("");
      await fetchBrandData();
    } finally {
      setImporting(false);
    }
  }

  async function handleDeleteKit(id: string) {
    await fetch(`/api/brand-kits?id=${id}`, { method: "DELETE" });
    await fetchBrandData();
  }

  async function handleCreateTheme(e: React.FormEvent) {
    e.preventDefault();
    if (!newThemeName.trim()) return;
    await fetch("/api/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        name: newThemeName.trim(),
        backgroundColor: newThemeBg,
        accentColor: newThemeAccent
      })
    });
    setNewThemeName("");
    await fetchBrandData();
  }

  async function handleUploadFont(e: React.FormEvent) {
    e.preventDefault();
    if (!fontName.trim()) return;
    await fetch("/api/brand-kits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "uploadFont",
        workspaceId,
        name: fontName.trim()
      })
    });
    setFontName("");
    await fetchBrandData();
  }

  return (
    <AppShell workspaceId={workspaceId}>
      <header className="h-16 px-8 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-violet-400" />
          <h1 className="text-lg font-bold text-white">
            Brand Kits, Studio Themes &amp; Typography
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#14141f] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab("kits")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
              activeTab === "kits" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Brand Kits ({brandKits.length})
          </button>
          <button
            onClick={() => setActiveTab("themes")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
              activeTab === "themes" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Studio Themes ({themes.length})
          </button>
          <button
            onClick={() => setActiveTab("fonts")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
              activeTab === "fonts" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Custom Fonts ({customFonts.length})
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8 flex-1 overflow-y-auto">
        {activeTab === "kits" && (
          <>
            {/* 1-Click Brand Importer */}
            <form
              onSubmit={handleImportBrandKit}
              className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#13131f] to-indigo-950/40 border border-violet-500/30 flex flex-col md:flex-row items-end gap-4"
            >
              <div className="flex-1 w-full space-y-1.5">
                <label className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 1-Click Brand Kit Extraction from Domain
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="Enter company domain (e.g., stripe.com, linear.app, anthropic.com)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0b10] border border-white/15 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <span className="block text-[10px] text-zinc-400">Primary</span>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-9 rounded-lg bg-transparent cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] text-zinc-400">Accent</span>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-9 rounded-lg bg-transparent cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  disabled={importing}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  {importing ? "Extracting..." : "Import Brand Kit"}
                </button>
              </div>
            </form>

            {/* Brand Kits Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {brandKits.map((kit) => (
                <div
                  key={kit.id}
                  className="rounded-2xl bg-[#12121b] border border-white/10 p-6 space-y-5 flex flex-col justify-between hover:border-violet-500/40 transition"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 p-2 flex items-center justify-center overflow-hidden">
                          {kit.logoLightUrl ? (
                            <img
                              src={kit.logoLightUrl}
                              alt={kit.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <span className="font-bold text-sm text-white">
                              {kit.name[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-base font-bold text-white">
                            {kit.name}
                          </div>
                          <div className="text-xs text-zinc-400">{kit.domain}</div>
                        </div>
                      </div>
                      {!kit.isDefault && (
                        <button
                          onClick={() => handleDeleteKit(kit.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Color Swatches */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-zinc-400 font-medium">
                        Brand Palette
                      </div>
                      <div className="flex items-center gap-2">
                        {(kit.colors || []).slice(0, 6).map((c: any, idx: number) => (
                          <div
                            key={idx}
                            title={`${c.name || "Color"}: ${c.hex || c}`}
                            className="w-7 h-7 rounded-lg border border-white/20 shadow-sm"
                            style={{ backgroundColor: c.hex || c || "#8b5cf6" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                    <span>
                      Font: {kit.fonts?.heading || "Labil Grotesk"}
                    </span>
                    <span className="text-emerald-400 inline-flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> Ready in Studio
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "themes" && (
          <div className="space-y-8">
            <form
              onSubmit={handleCreateTheme}
              className="p-5 rounded-2xl bg-[#13131d] border border-white/10 flex flex-wrap items-end gap-4"
            >
              <div className="flex-1 min-w-[220px] space-y-1">
                <label className="text-xs text-zinc-300 font-medium">
                  Create Custom Studio Theme
                </label>
                <input
                  type="text"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="Theme Name (e.g., Cyber Neon Dark)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] text-zinc-400">Canvas BG</span>
                <input
                  type="color"
                  value={newThemeBg}
                  onChange={(e) => setNewThemeBg(e.target.value)}
                  className="w-10 h-9 rounded bg-transparent"
                />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] text-zinc-400">Accent</span>
                <input
                  type="color"
                  value={newThemeAccent}
                  onChange={(e) => setNewThemeAccent(e.target.value)}
                  className="w-10 h-9 rounded bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white"
              >
                + Save Theme
              </button>
            </form>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
              {themes.map((t) => {
                const bg =
                  t.themeJson?.colors?.background?.default || "#0b0b10";
                const accent =
                  t.themeJson?.colors?.accent?.default || "#8b5cf6";
                const text =
                  t.themeJson?.colors?.text?.default || "#ffffff";
                return (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-white/15 overflow-hidden bg-[#12121b] flex flex-col justify-between"
                  >
                    <div
                      className="h-32 p-4 flex flex-col justify-between"
                      style={{ backgroundColor: bg, color: text }}
                    >
                      <span
                        className="self-start px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{ backgroundColor: accent, color: "#fff" }}
                      >
                        {t.displayName}
                      </span>
                      <div className="text-sm font-bold">
                        Aa Bb Cc — Smart Block
                      </div>
                    </div>
                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        {t.displayName}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {bg}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "fonts" && (
          <div className="space-y-6 max-w-3xl">
            <form
              onSubmit={handleUploadFont}
              className="p-5 rounded-2xl bg-[#13131d] border border-white/10 flex gap-3"
            >
              <input
                type="text"
                value={fontName}
                onChange={(e) => setFontName(e.target.value)}
                placeholder="Font Family Name (e.g., Söhne Breit, Monument Extended)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-xs text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs"
              >
                + Register Custom Font
              </button>
            </form>

            <div className="space-y-3">
              {[
                { name: "Labil Grotesk", weight: "500-700", builtIn: true },
                { name: "Inter Variable", weight: "400-700", builtIn: true },
                ...customFonts
              ].map((f, idx) => (
                <div
                  key={f.id || idx}
                  className="p-4 rounded-xl bg-[#12121b] border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Type className="w-4 h-4 text-violet-400" />
                    <div>
                      <div className="text-sm font-bold text-white">{f.name}</div>
                      <div className="text-xs text-zinc-400">
                        Weights: {f.weight || "400-700"} • WOFF2
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] text-zinc-300">
                    {f.builtIn ? "Studio Default" : "Custom Uploaded"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

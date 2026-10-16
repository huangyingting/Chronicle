"use client";

import React, { use, useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import {
  Image as ImageIcon,
  Sparkles,
  Upload,
  Copy,
  Check,
  Trash2
} from "lucide-react";

export default function MediaLibraryPage({
  params
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const [assets, setAssets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "ALL" | "WORKSPACE" | "PERSONAL" | "GENERATED"
  >("ALL");
  const [prompt, setPrompt] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  async function fetchAssets() {
    const res = await fetch(`/api/media?workspaceId=${workspaceId}`);
    const data = await res.json();
    setAssets(data.assets || []);
  }

  useEffect(() => {
    fetchAssets();
  }, [workspaceId]);

  async function handleGenerateVisual(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setGenerating(true);
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          name: `${prompt.trim()}.jpg`,
          scope: "GENERATED"
        })
      });
      setPrompt("");
      await fetchAssets();
    } finally {
      setGenerating(false);
    }
  }

  async function handleUploadAsset(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        name: uploadName || "Uploaded Slide Visual.jpg",
        url: uploadUrl || undefined,
        scope: "WORKSPACE"
      })
    });
    setUploadName("");
    setUploadUrl("");
    await fetchAssets();
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("workspaceId", workspaceId);
    await fetch("/api/uploads", {
      method: "POST",
      body: formData
    });
    e.target.value = "";
    await fetchAssets();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    await fetchAssets();
  }

  const filtered = assets.filter((a) =>
    activeTab === "ALL" ? true : a.scope === activeTab
  );

  return (
    <AppShell workspaceId={workspaceId}>
      <header className="h-16 px-8 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-violet-400" />
          <h1 className="text-lg font-bold text-white">Workspace Media Library</h1>
        </div>

        <div className="flex items-center gap-1.5 bg-[#14141f] p-1 rounded-xl border border-white/10 text-xs">
          {[
            { id: "ALL", label: "All Media" },
            { id: "WORKSPACE", label: "Workspace" },
            { id: "PERSONAL", label: "Personal" },
            { id: "GENERATED", label: "AI Generated" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
                activeTab === t.id
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="p-8 space-y-8 flex-1 overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-4">
          {/* AI Image Generator */}
          <form
            onSubmit={handleGenerateVisual}
            className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 to-[#13131d] border border-violet-500/30 space-y-3"
          >
            <div className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Generate 16:9 Slide Visual with AI
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Abstract obsidian glass geometric architecture"
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-xs text-white"
              />
              <button
                type="submit"
                disabled={generating}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs"
              >
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </form>

          {/* Upload Asset by URL or File */}
          <form
            onSubmit={handleUploadAsset}
            className="p-5 rounded-2xl bg-[#13131d] border border-white/10 space-y-3"
          >
            <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-sky-400" /> Add Image / Visual Asset to Library
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="Asset title (e.g., Product Dashboard Hero)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-xs text-white"
              />
              <input
                type="text"
                value={uploadUrl}
                onChange={(e) => setUploadUrl(e.target.value)}
                placeholder="Optional image URL"
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-xs text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs"
              >
                Upload URL
              </button>
              <label className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs cursor-pointer flex items-center">
                File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </form>
        </div>

        {/* Assets Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl bg-[#12121b] border border-white/10 overflow-hidden flex flex-col justify-between group"
            >
              <div className="h-44 bg-black relative overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-[10px] text-zinc-200">
                  {asset.scope}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">
                    {asset.name}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {asset.width}×{asset.height}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(asset.url);
                      setCopiedId(asset.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    title="Copy asset URL"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300"
                  >
                    {copiedId === asset.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    title="Delete asset"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import {
  Search,
  Sparkles,
  Plus,
  Folder as FolderIcon,
  Copy,
  Trash2,
  Share2,
  Play,
  Palette,
  Layers,
  CheckSquare,
  Square,
  Check
} from "lucide-react";

export default function WorkspaceHomePage({
  params
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const router = useRouter();

  const [documents, setDocuments] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "recents" | "mine" | "workspace" | "shared"
  >("recents");
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDocs() {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents?workspaceId=${workspaceId}`);
      const data = await res.json();
      setDocuments(data.documents || []);
      setFolders(data.folders || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocs();
  }, [workspaceId]);

  const filteredDocs = documents.filter((doc) => {
    if (activeFolderId && doc.folderId !== activeFolderId) return false;
    if (activeTab === "mine" && doc.scope !== "PERSONAL" && doc.scope !== "WORKSPACE")
      return false;
    if (activeTab === "workspace" && doc.scope !== "WORKSPACE") return false;
    if (activeTab === "shared" && !doc.isPublic) return false;
    if (
      searchQuery &&
      !doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  async function handleCreateBlank() {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        folderId: activeFolderId,
        title: "Untitled presentation"
      })
    });
    const data = await res.json();
    if (data.document?.id) {
      router.push(`/${workspaceId}/document/${data.document.id}`);
    }
  }

  async function handleDuplicate(docId: string) {
    await fetch(`/api/documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate", workspaceId })
    });
    await fetchDocs();
  }

  async function handleSoftDelete(docId: string) {
    await fetch(`/api/documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "softDelete" })
    });
    setSelectedIds((prev) => prev.filter((id) => id !== docId));
    await fetchDocs();
  }

  async function handleBulkDelete() {
    await Promise.all(
      selectedIds.map((id) =>
        fetch(`/api/documents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "softDelete" })
        })
      )
    );
    setSelectedIds([]);
    await fetchDocs();
  }

  async function handleMoveToFolder(docId: string, folderId: string | null) {
    await fetch(`/api/documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId })
    });
    await fetchDocs();
  }

  async function handleSaveRename(docId: string) {
    if (editingTitle.trim()) {
      await fetch(`/api/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() })
      });
      await fetchDocs();
    }
    setEditingDocId(null);
  }

  function toggleSelect(docId: string) {
    setSelectedIds((prev) =>
      prev.includes(docId) ? prev.filter((x) => x !== docId) : [...prev, docId]
    );
  }

  const activeFolder = folders.find((f) => f.id === activeFolderId);

  return (
    <AppShell
      workspaceId={workspaceId}
      activeFolderId={activeFolderId}
      onSelectFolder={setActiveFolderId}
      onDataChanged={fetchDocs}
    >
      {/* Top Header */}
      <header className="h-16 px-8 border-b border-white/[0.08] flex items-center justify-between gap-4">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search presentations..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14141f] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/${workspaceId}/chat`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Create with AI Muse
          </Link>
          <button
            onClick={handleCreateBlank}
            className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs inline-flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Blank Presentation
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8 flex-1 overflow-y-auto">
        {/* Quick Start Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href={`/${workspaceId}/chat`}
            className="p-4 rounded-2xl bg-gradient-to-br from-violet-600/20 via-[#141422] to-indigo-600/10 border border-violet-500/30 hover:border-violet-400 transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-violet-200">
              Start from AI Prompt
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              Synthesize an outline &amp; deck in 30s
            </div>
          </Link>

          <button
            onClick={handleCreateBlank}
            className="p-4 rounded-2xl bg-[#13131d] border border-white/10 hover:border-white/25 transition text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center mb-3">
              <Plus className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white">Start from Scratch</div>
            <div className="text-xs text-zinc-400 mt-0.5">
              Open the 16:9 Smart Widget canvas
            </div>
          </button>

          <Link
            href={`/${workspaceId}/brand-kit`}
            className="p-4 rounded-2xl bg-[#13131d] border border-white/10 hover:border-white/25 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center mb-3">
              <Palette className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white">
              Configure Brand Kit
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              19 studio themes &amp; domain auto-import
            </div>
          </Link>

          <Link
            href="/templates"
            className="p-4 rounded-2xl bg-[#13131d] border border-white/10 hover:border-white/25 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white">
              Curated Playbooks
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              Pitch, board, QBR &amp; product templates
            </div>
          </Link>
        </div>

        {/* Filter Tabs & Folder Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            {[
              { id: "recents", label: "Recents" },
              { id: "mine", label: "My decks" },
              { id: "workspace", label: "Workspace" },
              { id: "shared", label: "Shared with you" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeTab === tab.id
                    ? "bg-white text-black font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {activeFolder && (
              <div className="ml-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-xs text-violet-200 flex items-center gap-2">
                <span>
                  {activeFolder.icon} {activeFolder.name}
                </span>
                <button
                  onClick={() => setActiveFolderId(null)}
                  className="text-violet-300 hover:text-white font-bold"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3 bg-violet-950/50 border border-violet-500/40 px-3.5 py-1.5 rounded-xl text-xs">
              <span className="text-violet-200 font-medium">
                {selectedIds.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="text-rose-300 hover:text-rose-200 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Move to Trash
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Presentations Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center space-y-3">
            <div className="text-base font-semibold text-white">
              No presentations match your filter
            </div>
            <p className="text-xs text-zinc-400">
              Create a new deck with AI Muse or start a blank presentation.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => {
              const slides = (() => {
                try {
                  return JSON.parse(doc.slidesJson || "[]");
                } catch {
                  return [];
                }
              })();
              const firstSlide = slides[0] || {};
              const isSelected = selectedIds.includes(doc.id);

              return (
                <div
                  key={doc.id}
                  className={`group rounded-2xl bg-[#12121b] border transition overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "border-violet-500 ring-1 ring-violet-500"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  {/* Slide Thumbnail Preview */}
                  <div className="relative h-44 p-5 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#19192b] via-[#11111a] to-[#1e1538]">
                    <div className="flex items-center justify-between relative z-10">
                      <button
                        onClick={() => toggleSelect(doc.id)}
                        className="p-1 rounded bg-black/40 text-zinc-300 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-violet-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/50 border border-white/15 text-zinc-300">
                        {slides.length} slides
                      </span>
                    </div>

                    <Link
                      href={`/${workspaceId}/document/${doc.id}/${firstSlide.id || "s1"}`}
                      className="block space-y-1 relative z-10"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-violet-300">
                        {firstSlide.eyebrow || firstSlide.sectionGroup || "CHRONICLE DECK"}
                      </div>
                      <div className="text-base font-bold text-white line-clamp-2 group-hover:text-violet-200 transition">
                        {doc.title}
                      </div>
                    </Link>

                    {/* Quick Hover Overlay Actions */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 relative z-10 pt-2 border-t border-white/10">
                      <span>
                        {doc.folder ? `${doc.folder.icon} ${doc.folder.name}` : "Workspace"}
                      </span>
                      <Link
                        href={`/${workspaceId}/document/${doc.id}/${firstSlide.id || "s1"}`}
                        className="text-violet-300 hover:text-white font-medium inline-flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Open Studio
                      </Link>
                    </div>
                  </div>

                  {/* Card Footer & Actions */}
                  <div className="p-4 space-y-3 bg-[#0f0f17]">
                    {editingDocId === doc.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(doc.id);
                          }}
                          autoFocus
                          className="flex-1 px-2.5 py-1 rounded bg-[#08080c] border border-violet-500 text-xs text-white"
                        />
                        <button
                          onClick={() => handleSaveRename(doc.id)}
                          className="px-2.5 py-1 rounded bg-violet-600 text-white text-xs"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <div
                          onDoubleClick={() => {
                            setEditingDocId(doc.id);
                            setEditingTitle(doc.title);
                          }}
                          title="Double-click to rename"
                          className="text-sm font-semibold text-white truncate cursor-pointer"
                        >
                          {doc.title}
                        </div>
                        <button
                          onClick={() => {
                            setEditingDocId(doc.id);
                            setEditingTitle(doc.title);
                          }}
                          className="text-[11px] text-zinc-500 hover:text-zinc-300"
                        >
                          Rename
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5 text-xs">
                      <select
                        value={doc.folderId || ""}
                        onChange={(e) =>
                          handleMoveToFolder(doc.id, e.target.value || null)
                        }
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-zinc-300 focus:outline-none"
                      >
                        <option value="">No Folder</option>
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.icon} {f.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicate(doc.id)}
                          title="Duplicate presentation"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/share/${workspaceId}/${doc.id}/${firstSlide.id || "s1"}`;
                            navigator.clipboard.writeText(url);
                            setCopiedId(doc.id);
                            setTimeout(() => setCopiedId(null), 1500);
                          }}
                          title="Copy public share link"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                        >
                          {copiedId === doc.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSoftDelete(doc.id)}
                          title="Move to trash"
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

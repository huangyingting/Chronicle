"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_WORKSPACE_ID,
  PRICING_PLANS,
  SEED_TEMPLATES
} from "@/lib/seed-data";
import {
  Home,
  Sparkles,
  Palette,
  Image as ImageIcon,
  FolderPlus,
  Folder as FolderIcon,
  Trash2,
  Settings,
  Plus,
  Layers,
  Terminal,
  ChevronDown,
  X,
  RotateCcw,
  KeyRound,
  Copy,
  Check,
  Users,
  CreditCard,
  Sliders,
  SunMoon,
  ExternalLink
} from "lucide-react";

interface AppShellProps {
  workspaceId: string;
  children: React.ReactNode;
  activeFolderId?: string | null;
  onSelectFolder?: (folderId: string | null) => void;
  onDataChanged?: () => void;
}

export function AppShell({
  workspaceId,
  children,
  activeFolderId,
  onSelectFolder,
  onDataChanged
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [workspace, setWorkspace] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [trashed, setTrashed] = useState<any[]>([]);
  const [wsMenuOpen, setWsMenuOpen] = useState(false);

  // Modals
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [trashModalOpen, setTrashModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<
    "general" | "members" | "billing" | "mcp" | "appearance" | "editor"
  >("general");
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderIcon, setNewFolderIcon] = useState("📁");

  // Settings form state
  const [wsNameInput, setWsNameInput] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [newKeyName, setNewKeyName] = useState("");
  const [latestRawKey, setLatestRawKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [creatingBlank, setCreatingBlank] = useState(false);

  async function loadSidebarData() {
    try {
      const [wsListRes, wsRes, docsRes] = await Promise.all([
        fetch("/api/workspaces"),
        fetch(`/api/workspaces/${workspaceId || DEFAULT_WORKSPACE_ID}`),
        fetch(`/api/documents?workspaceId=${workspaceId || DEFAULT_WORKSPACE_ID}`)
      ]);
      const wsListData = await wsListRes.json();
      const wsData = await wsRes.json();
      const docsData = await docsRes.json();

      if (wsListData.workspaces) setWorkspaces(wsListData.workspaces);
      if (wsData.workspace) {
        setWorkspace(wsData.workspace);
        setWsNameInput(wsData.workspace.name);
      }
      if (docsData.folders) setFolders(docsData.folders);
      if (docsData.trashed) setTrashed(docsData.trashed);
    } catch (e) {
      console.error("Failed loading sidebar data", e);
    }
  }

  useEffect(() => {
    loadSidebarData();
  }, [workspaceId]);

  async function handleCreateBlankDeck() {
    setCreatingBlank(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          folderId: activeFolderId || null,
          title: "Untitled presentation"
        })
      });
      const data = await res.json();
      if (data.document?.id) {
        router.push(`/${workspaceId}/document/${data.document.id}`);
      }
    } finally {
      setCreatingBlank(false);
    }
  }

  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        name: newFolderName.trim(),
        icon: newFolderIcon
      })
    });
    setNewFolderName("");
    setNewFolderModalOpen(false);
    await loadSidebarData();
    onDataChanged?.();
  }

  async function handleRestoreDoc(docId: string) {
    await fetch(`/api/documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore" })
    });
    await loadSidebarData();
    onDataChanged?.();
  }

  async function handlePermanentDelete(docId: string) {
    await fetch(`/api/documents/${docId}`, { method: "DELETE" });
    await loadSidebarData();
    onDataChanged?.();
  }

  async function handleUseTemplate(slug: string) {
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, workspaceId })
    });
    const data = await res.json();
    setTemplatesModalOpen(false);
    if (data.document?.id) {
      router.push(`/${workspaceId}/document/${data.document.id}`);
    }
  }

  async function handleSaveWorkspaceName(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/workspaces/${workspaceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: wsNameInput })
    });
    await loadSidebarData();
  }

  async function handleInviteMember(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    await fetch(`/api/workspaces/${workspaceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "inviteMember",
        email: inviteEmail,
        role: inviteRole
      })
    });
    setInviteEmail("");
    await loadSidebarData();
  }

  async function handleCreateApiKey(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/workspaces/${workspaceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createApiKey",
        name: newKeyName || "Claude Desktop MCP Key"
      })
    });
    const data = await res.json();
    if (data.rawKey) setLatestRawKey(data.rawKey);
    setNewKeyName("");
    await loadSidebarData();
  }

  async function handleRevokeApiKey(keyId: string) {
    await fetch(`/api/workspaces/${workspaceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revokeApiKey", keyId })
    });
    await loadSidebarData();
  }

  async function handleTopUpTokens() {
    await fetch(`/api/workspaces/${workspaceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "topUpTokens", amount: 1000 })
    });
    await loadSidebarData();
  }

  const tokensUsed = workspace?.tokensUsed ?? 160;
  const tokensLimit = workspace?.tokensLimit ?? 2000;
  const tokenPct = Math.min(100, Math.round((tokensUsed / tokensLimit) * 100));

  return (
    <div className="min-h-screen bg-[#0b0b10] text-[#f4f4f6] flex">
      {/* Left Workspace Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/[0.08] bg-[#0e0e15] flex flex-col justify-between select-none">
        <div className="p-3.5 space-y-4">
          {/* Workspace Switcher */}
          <div className="relative">
            <button
              onClick={() => setWsMenuOpen(!wsMenuOpen)}
              className="w-full p-2 rounded-xl hover:bg-white/[0.05] flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {(workspace?.name || "C")[0]}
                </div>
                <div className="text-left truncate">
                  <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                    <span className="truncate">{workspace?.name || "Chronicle Studio"}</span>
                    <span className="px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 text-[10px] font-medium">
                      Max
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {workspace?.members?.length || 3} members
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>

            {wsMenuOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 rounded-xl bg-[#151521] border border-white/15 shadow-2xl p-1.5 z-50 space-y-1">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setWsMenuOpen(false);
                      router.push(`/${ws.id}/home`);
                    }}
                    className={`w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between ${
                      ws.id === workspaceId
                        ? "bg-violet-600/20 text-white font-semibold"
                        : "text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">{ws.name}</span>
                    {ws.id === workspaceId && (
                      <Check className="w-3.5 h-3.5 text-violet-400" />
                    )}
                  </button>
                ))}
                <div className="border-t border-white/10 pt-1">
                  <Link
                    href={`/${workspaceId}/workspace/new`}
                    onClick={() => setWsMenuOpen(false)}
                    className="w-full px-2.5 py-2 rounded-lg text-xs text-violet-300 hover:bg-white/5 flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create new workspace
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Primary Creation Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/${workspaceId}/chat`}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> Start with AI
            </Link>
            <button
              onClick={handleCreateBlankDeck}
              disabled={creatingBlank}
              className="py-2 px-3 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" /> New Deck
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-0.5 text-xs">
            <Link
              href={`/${workspaceId}/home`}
              onClick={() => onSelectFolder?.(null)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                pathname?.includes("/home") && !activeFolderId
                  ? "bg-white/[0.09] text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </Link>

            <button
              onClick={() => setTemplatesModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition text-left"
            >
              <Layers className="w-4 h-4" /> Templates
            </button>

            <Link
              href={`/${workspaceId}/brand-kit`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                pathname?.includes("/brand-kit")
                  ? "bg-white/[0.09] text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Palette className="w-4 h-4" /> Brand Kit
            </Link>

            <Link
              href={`/${workspaceId}/media-library`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                pathname?.includes("/media-library")
                  ? "bg-white/[0.09] text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Media Library
            </Link>

            <Link
              href={`/${workspaceId}/chat`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                pathname?.includes("/chat")
                  ? "bg-white/[0.09] text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-violet-400" /> AI Muse Chat
            </Link>

            <button
              onClick={() => {
                setSettingsTab("mcp");
                setSettingsModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition text-left"
            >
              <span className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-emerald-400" /> Chronicle MCP
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                API
              </span>
            </button>

            <Link
              href="/admin/invitations"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition"
            >
              <span className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-amber-400" /> Invite-Only Admin
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
                ACL
              </span>
            </Link>
          </nav>

          {/* Folders Section */}
          <div className="pt-3 border-t border-white/[0.07] space-y-1.5">
            <div className="px-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <span>Folders</span>
              <button
                onClick={() => setNewFolderModalOpen(true)}
                title="Create folder"
                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5 max-h-48 overflow-y-auto">
              {folders.map((folder) => {
                const isSelected = activeFolderId === folder.id;
                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      if (onSelectFolder) {
                        onSelectFolder(isSelected ? null : folder.id);
                      } else {
                        router.push(`/${workspaceId}/home?folderId=${folder.id}`);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition ${
                      isSelected
                        ? "bg-violet-600/20 text-white font-medium"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{folder.icon || "📁"}</span>
                      <span className="truncate">{folder.name}</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {folder.documents?.length || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Workspace Utilities */}
        <div className="p-3.5 space-y-3 border-t border-white/[0.08]">
          {/* AI Tokens Widget */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-400" /> AI Tokens
              </span>
              <span className="text-zinc-400">
                {tokensLimit - tokensUsed} left
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400"
                style={{ width: `${Math.max(8, 100 - tokenPct)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500">
              <span>{tokensUsed} used</span>
              <button
                onClick={handleTopUpTokens}
                className="text-violet-300 hover:text-white font-medium"
              >
                + Top up
              </button>
            </div>
          </div>

          <div className="space-y-0.5 text-xs">
            <button
              onClick={() => setTrashModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition"
            >
              <span className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4" /> Trash
              </span>
              {trashed.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-zinc-300">
                  {trashed.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setSettingsTab("general");
                setSettingsModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>

          {/* Current User Profile */}
          <div className="pt-2 border-t border-white/[0.07] flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-semibold flex items-center justify-center shrink-0">
                AR
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-white truncate">
                  Alex Rivera
                </div>
                <div className="text-[10px] text-zinc-500 truncate">
                  alex@chroniclehq.com
                </div>
              </div>
            </div>
            <Link
              href="/"
              title="Marketing Site"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>

      {/* Create Folder Modal */}
      {newFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14141f] border border-white/15 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderIcon className="w-4 h-4 text-violet-400" /> Create New Folder
              </h3>
              <button
                onClick={() => setNewFolderModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFolderIcon}
                  onChange={(e) => setNewFolderIcon(e.target.value)}
                  className="w-14 text-center py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-base"
                />
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g., Q4 Executive Reviews"
                  autoFocus
                  required
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewFolderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Templates Gallery Modal */}
      {templatesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-4xl rounded-2xl bg-[#13131d] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Start from a Curated Template
                </h3>
                <p className="text-xs text-zinc-400">
                  Select a proven presentation playbook to open directly in Chronicle Studio
                </p>
              </div>
              <button
                onClick={() => setTemplatesModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto grid md:grid-cols-2 gap-4">
              {SEED_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-xl bg-[#191926] border border-white/10 p-5 flex flex-col justify-between gap-4 hover:border-violet-500/50 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-medium">
                        {tpl.category}
                      </span>
                      <span className="text-zinc-400">{tpl.slideCount} slides</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{tpl.title}</h4>
                    <p className="text-xs text-zinc-400">{tpl.description}</p>
                  </div>
                  <button
                    onClick={() => handleUseTemplate(tpl.slug)}
                    className="w-full py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trash Modal */}
      {trashModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-2xl rounded-2xl bg-[#13131d] border border-white/15 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <h3 className="text-base font-bold text-white">Workspace Trash</h3>
              </div>
              <button
                onClick={() => setTrashModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {trashed.length === 0 ? (
                <div className="text-center py-12 text-xs text-zinc-500">
                  Trash is empty. Deleted presentations appear here for 30 days.
                </div>
              ) : (
                trashed.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {doc.title}
                      </div>
                      <div className="text-xs text-zinc-500">
                        Deleted by {doc.deletedBy || "Alex Rivera"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestoreDoc(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs text-rose-300"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Tab Settings Modal (General, Members, Billing, Chronicle MCP, Appearance, Editor) */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-4xl h-[560px] rounded-2xl bg-[#13131d] border border-white/15 shadow-2xl overflow-hidden flex">
            {/* Settings Sidebar */}
            <div className="w-56 border-r border-white/10 bg-[#0e0e16] p-4 space-y-1 text-xs">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Workspace Settings
              </div>
              {[
                { id: "general", label: "General", icon: Sliders },
                { id: "members", label: "Members", icon: Users },
                { id: "billing", label: "Plans & Billing", icon: CreditCard },
                { id: "mcp", label: "Chronicle MCP & API", icon: KeyRound },
                { id: "appearance", label: "Appearance", icon: SunMoon },
                { id: "editor", label: "Slide Editor", icon: Layers }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSettingsTab(t.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition ${
                    settingsTab === t.id
                      ? "bg-violet-600/20 text-white font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Settings Content */}
            <div className="flex-1 flex flex-col">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-base font-bold text-white capitalize">
                  {settingsTab === "mcp" ? "Chronicle MCP & Public API Keys" : `${settingsTab} Settings`}
                </h3>
                <button
                  onClick={() => setSettingsModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs">
                {settingsTab === "general" && (
                  <form onSubmit={handleSaveWorkspaceName} className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-zinc-300 font-medium">Workspace Name</label>
                      <input
                        type="text"
                        value={wsNameInput}
                        onChange={(e) => setWsNameInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-300 font-medium">Workspace ID</label>
                      <input
                        type="text"
                        readOnly
                        value={workspaceId}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-zinc-500 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                    >
                      Save Changes
                    </button>
                  </form>
                )}

                {settingsTab === "members" && (
                  <div className="space-y-6">
                    <form onSubmit={handleInviteMember} className="flex gap-2">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-white"
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-white"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="EDITOR">Editor</option>
                        <option value="MEMBER">Viewer</option>
                      </select>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                      >
                        Invite Member
                      </button>
                    </form>

                    <div className="space-y-2">
                      {(workspace?.members || []).map((m: any) => (
                        <div
                          key={m.id}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-white">
                              {m.user?.fullName || m.user?.email}
                            </div>
                            <div className="text-zinc-500">{m.user?.email}</div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {settingsTab === "billing" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/60 to-indigo-950/60 border border-violet-500/40 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">
                          Chronicle Max Plan (Active)
                        </div>
                        <div className="text-zinc-300">
                          {tokensLimit - tokensUsed} of {tokensLimit} AI tokens available
                        </div>
                      </div>
                      <button
                        onClick={handleTopUpTokens}
                        className="px-4 py-2 rounded-xl bg-white text-black font-semibold"
                      >
                        + Add 1,000 AI Tokens
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {PRICING_PLANS.map((p) => (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1"
                        >
                          <div className="font-bold text-white">
                            {p.name} — {p.price}
                          </div>
                          <div className="text-zinc-400">
                            {p.tokens} AI tokens • {p.badge}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {settingsTab === "mcp" && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                      <div className="font-semibold text-emerald-300">
                        Connect Chronicle to Claude Desktop, Cursor, or REST API
                      </div>
                      <p className="text-zinc-300">
                        Use your API key as a Bearer token against{" "}
                        <code className="text-emerald-200">POST /api/v1/decks</code> or inside your MCP configuration.
                      </p>
                    </div>

                    <form onSubmit={handleCreateApiKey} className="flex gap-2">
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Key label (e.g., Cursor Agent MCP)"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-[#0b0b10] border border-white/10 text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
                      >
                        + Generate API Key
                      </button>
                    </form>

                    {latestRawKey && (
                      <div className="p-3.5 rounded-xl bg-white/5 border border-emerald-500/40 flex items-center justify-between gap-2">
                        <code className="text-emerald-300 font-mono">{latestRawKey}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(latestRawKey);
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 1500);
                          }}
                          className="px-2.5 py-1 rounded bg-white/10 text-white inline-flex items-center gap-1"
                        >
                          {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedKey ? "Copied" : "Copy"}
                        </button>
                      </div>
                    )}

                    <div className="space-y-2">
                      {(workspace?.apiKeys || []).map((k: any) => (
                        <div
                          key={k.id}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-white">{k.name}</div>
                            <div className="text-zinc-400 font-mono">{k.maskedKey}</div>
                          </div>
                          <button
                            onClick={() => handleRevokeApiKey(k.id)}
                            className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {settingsTab === "appearance" && (
                  <div className="space-y-4">
                    <div className="font-semibold text-white">Studio Interface Theme</div>
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      <div className="p-4 rounded-xl bg-violet-600/20 border border-violet-500 text-white font-semibold">
                        Chronicle Dark Studio (Default)
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-zinc-400">
                        High-Contrast Midnight
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "editor" && (
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <span>Snap Smart Widgets to 12-Column Bento Grid</span>
                      <input type="checkbox" defaultChecked className="accent-violet-500" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <span>Show Ask Muse AI Copilot in Slide Canvas</span>
                      <input type="checkbox" defaultChecked className="accent-violet-500" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <span>Auto-save Slide Edits in Real Time</span>
                      <input type="checkbox" defaultChecked className="accent-violet-500" />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

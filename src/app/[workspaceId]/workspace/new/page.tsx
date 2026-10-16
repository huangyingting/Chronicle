"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Building2 } from "lucide-react";

export default function NewWorkspacePage({
  params
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const router = useRouter();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() })
    });
    const data = await res.json();
    if (data.workspace?.id) {
      router.push(`/${data.workspace.id}/home`);
    } else {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-[#12121b] border border-white/10 p-8 space-y-6 shadow-2xl">
        <Link
          href={`/${workspaceId}/home`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio
        </Link>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create a new workspace</h1>
          <p className="text-xs text-zinc-400">
            Workspaces have dedicated presentations, folders, Brand Kits, and MCP API keys.
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-300 font-medium">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Acme GTM Strategy"
              required
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0b10] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {creating ? "Creating Workspace..." : "Create Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}

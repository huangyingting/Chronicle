"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";
import { Copy, Sparkles, ArrowRight } from "lucide-react";

export default function DuplicateDocumentPage({
  params
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = use(params);
  const router = useRouter();
  const [doc, setDoc] = useState<any>(null);
  const [duplicating, setDuplicating] = useState(false);

  useEffect(() => {
    fetch(`/api/documents/${documentId}`)
      .then((r) => r.json())
      .then((d) => setDoc(d.document || null));
  }, [documentId]);

  async function handleDuplicateNow() {
    setDuplicating(true);
    const res = await fetch(`/api/documents/${documentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "duplicate",
        workspaceId: DEFAULT_WORKSPACE_ID
      })
    });
    const data = await res.json();
    if (data.document?.id) {
      router.push(`/${DEFAULT_WORKSPACE_ID}/document/${data.document.id}`);
    } else {
      setDuplicating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl bg-[#12121b] border border-white/10 p-8 space-y-6 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/40 text-violet-300 flex items-center justify-center mx-auto">
          <Copy className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Duplicate Presentation into Your Workspace
          </h1>
          <p className="text-xs text-zinc-400">
            {doc
              ? `Create an editable copy of "${doc.title}" (${doc.slides?.length || 0} slides) in Chronicle Studio.`
              : "Loading presentation metadata..."}
          </p>
        </div>

        <button
          onClick={handleDuplicateNow}
          disabled={duplicating}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          {duplicating ? "Duplicating Deck..." : "Duplicate & Open in Studio"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

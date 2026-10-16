'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { DEFAULT_WORKSPACE_ID } from '@/lib/seed-data';
import {
  Copy,
  MailPlus,
  RefreshCw,
  UserX,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Terminal,
} from 'lucide-react';

type Invitation = {
  id: string;
  email: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  invitedBy?: { id: string; name: string | null; fullName?: string | null; email?: string | null } | null;
  acceptedBy?: { id: string; name: string | null; fullName?: string | null; email?: string | null } | null;
};

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [pending, setPending] = useState(false);
  const [rowPending, setRowPending] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [latestLink, setLatestLink] = useState('');
  const [copied, setCopied] = useState(false);

  async function loadInvitations() {
    const res = await fetch('/api/admin/invitations');
    const data = await res.json();
    if (data.invitations) setInvitations(data.invitations);
  }

  useEffect(() => {
    loadInvitations();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError('');
    setLatestLink('');
    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create invitation.');
        return;
      }
      setEmail('');
      setExpiresAt('');
      if (data.acceptUrl) {
        setLatestLink(data.acceptUrl);
        setCopied(false);
      }
      await loadInvitations();
    } finally {
      setPending(false);
    }
  }

  async function handleRotate(id: string) {
    setRowPending(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/invitations/${encodeURIComponent(id)}/rotate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not rotate invitation.');
        return;
      }
      if (data.acceptUrl) {
        setLatestLink(data.acceptUrl);
        setCopied(false);
      }
      await loadInvitations();
    } finally {
      setRowPending(null);
    }
  }

  async function handleRevoke(id: string) {
    setRowPending(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/invitations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not revoke invitation.');
        return;
      }
      await loadInvitations();
    } finally {
      setRowPending(null);
    }
  }

  async function copyLink() {
    if (!latestLink) return;
    await navigator.clipboard.writeText(latestLink);
    setCopied(true);
  }

  return (
    <div className="min-h-screen bg-[#0c0a13] text-white">
      <header className="border-b border-white/10 bg-[#12101b]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/${DEFAULT_WORKSPACE_ID}/home`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Workspace
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2.5 font-bold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7c5cff] text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>Account Invitations (Invitation-Only Admission)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/invite/demo-invite-token-2026"
              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-semibold text-amber-300 hover:bg-amber-500/20"
            >
              Test Seeded Invite (/invite/demo-invite-token-2026) <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-semibold text-white/80 hover:bg-white/10"
            >
              Sign in page
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        {/* Deployment CLI Bootstrap Security Banner */}
        <section className="rounded-2xl border border-[#7c5cff]/30 bg-[#7c5cff]/10 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7c5cff]/25 text-[#b69dff]">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Root Administrator Bootstrap (CLI-Only Security Policy)
              </h2>
              <p className="mt-1 text-xs text-white/70">
                Bootstrap administrator accounts are never exposed over HTTP endpoints. Operators with host shell access can provision or promote an administrator via:
              </p>
              <code className="mt-2 inline-block rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-xs text-[#b69dff]">
                npm run bootstrap:admin -- --email admin@chroniclehq.com --password-stdin
              </code>
            </div>
          </div>
        </section>

        {/* Create Invitation Card */}
        <section className="rounded-2xl border border-white/10 bg-[#14121e] p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white">Create one-time invitation</h2>
          <p className="mt-1 text-xs text-white/50">
            Send a one-time registration link. Invitations expire after 7 days unless you choose a custom expiry date.
          </p>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-white/60">
                Recipient Email <span className="text-rose-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="founder@chroniclehq.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#7c5cff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-white/60">
                Custom Expiry (Optional)
              </label>
              <input
                name="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#7c5cff] focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c5cff] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6a48f5] disabled:opacity-60"
              >
                <MailPlus className="h-4 w-4" />
                {pending ? 'Creating link...' : 'Create invitation'}
              </button>
            </div>
          </form>

          {latestLink && (
            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  One-time invitation link ready (shown only once):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                  <Link
                    href={new URL(latestLink).pathname}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 bg-black/40 px-3 py-1 text-xs font-semibold text-emerald-200 hover:bg-black/60"
                  >
                    Open Invite Page ↗
                  </Link>
                </div>
              </div>
              <div className="mt-2 break-all rounded-lg border border-emerald-500/20 bg-black/40 px-3 py-2 font-mono text-xs text-emerald-100">
                {latestLink}
              </div>
            </div>
          )}
        </section>

        {/* Invitations Table */}
        <section className="rounded-2xl border border-white/10 bg-[#14121e] p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Account Invitations Ledger</h2>
              <p className="text-xs text-white/50">
                Rotate a pending invitation to generate a fresh one-time link or revoke it immediately.
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
              {invitations.length} total
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase text-white/40">
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Invited By</th>
                  <th className="pb-3 pr-4">Expires</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-4 font-medium text-white">{inv.email}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          inv.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : inv.status === 'ACCEPTED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : inv.status === 'REVOKED'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-white/60">
                      {inv.invitedBy?.name || inv.invitedBy?.fullName || 'Alex Rivera'}
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-white/50">
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-right">
                      {inv.status === 'PENDING' ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={rowPending === inv.id}
                            onClick={() => handleRotate(inv.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/80 hover:bg-white/10"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Rotate link
                          </button>
                          <button
                            type="button"
                            disabled={rowPending === inv.id}
                            onClick={() => handleRevoke(inv.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                          >
                            <UserX className="h-3 w-3" />
                            Revoke
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-white/40">
                          {inv.status === 'ACCEPTED' ? 'Claimed' : 'Closed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

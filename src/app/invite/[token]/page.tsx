'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DEFAULT_WORKSPACE_ID } from '@/lib/seed-data';
import {
  Sparkles,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

type InvitationView = {
  id: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired' | 'invalid';
  maskedEmail: string | null;
  email?: string;
  expiresAt: string | null;
};

export default function InvitationPage({
  params: rawParams,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = React.use(rawParams);
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationView | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/auth/invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setInvitation(data.invitation);
        if (data.invitation?.email) {
          setEmail(data.invitation.email);
        }
      })
      .catch(() => {
        if (active) setError('The invitation could not be checked.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }

    setPending(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'The invitation could not be accepted.');
        return;
      }
      router.push(data.redirectUrl || `/${DEFAULT_WORKSPACE_ID}/home`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'The invitation could not be accepted.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0c0a13] p-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#14121e] p-8 shadow-2xl">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c5cff] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>chronicle</span>
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-white">Accept your invitation</h1>
        <p className="mt-1 text-sm text-white/50">
          Create your password to finish joining Chronicle Studio.
        </p>

        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-2 py-8 text-sm text-white/50">
            <Loader2 className="h-4 w-4 animate-spin text-[#7c5cff]" />
            <span>Checking invitation…</span>
          </div>
        ) : invitation?.status !== 'pending' ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-medium text-rose-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {invitation?.status === 'accepted'
                  ? 'This invitation has already been used.'
                  : invitation?.status === 'revoked'
                  ? 'This invitation was revoked by an administrator.'
                  : invitation?.status === 'expired'
                  ? 'This invitation has expired.'
                  : 'This invitation is invalid or no longer active.'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <Link href="/login" className="font-semibold text-[#9d85ff] hover:underline">
                Go to Sign in →
              </Link>
              <Link href="/admin/invitations" className="text-white/60 hover:underline">
                Generate new invite in Admin Console
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>
                This invitation is active for <strong>{invitation.maskedEmail}</strong>.
              </span>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-300"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-white/60">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                autoComplete="name"
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#7c5cff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-white/60">
                Invited Email <span className="text-rose-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={320}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#7c5cff] focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-white/40">
                Enter the exact email address that received this invitation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-white/60">
                Password <span className="text-rose-400">*</span>
              </label>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 12 characters"
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#7c5cff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-white/60">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat password"
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#7c5cff] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c5cff] py-3 text-sm font-semibold text-white hover:bg-[#6a48f5] transition disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {pending ? 'Creating account...' : 'Accept invitation'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

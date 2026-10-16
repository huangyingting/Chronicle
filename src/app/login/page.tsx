'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_WORKSPACE_ID } from '@/lib/seed-data';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get('callbackUrl') || `/${DEFAULT_WORKSPACE_ID}/home`;

  const [email, setEmail] = useState('alex@chroniclehq.com');
  const [password, setPassword] = useState('chronicle-demo-2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/password/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign-in failed.');
        setLoading(false);
        return;
      }
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    setError('');
    await fetch('/api/auth/password/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alex@chroniclehq.com',
        password: 'chronicle-demo-2026',
      }),
    });
    await signIn('credentials', {
      email: 'alex@chroniclehq.com',
      password: 'chronicle-demo-2026',
      redirect: false,
    });
    router.push(callbackUrl);
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#08080c] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.18),transparent_60%)] pointer-events-none" />

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black font-bold">
            C
          </div>
          <span>chronicle</span>
        </Link>
        <Link
          href="/admin/invitations"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
        >
          <KeyRound className="h-3.5 w-3.5 text-[#9d85ff]" />
          Admin Invitations
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-[430px] rounded-2xl border border-white/10 bg-[#111119] p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-[#7c5cff]/40 bg-[#7c5cff]/15 px-3 py-1 text-[11px] font-semibold text-[#c5b3ff]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Invitation-Only Admission Mode
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">
              Sign in to Chronicle
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              AI-powered interactive storytelling, Brand Kits, and 34+ smart blocks.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            Continue as Alex Rivera (Max Plan Admin)
          </button>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-300"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">
                Work Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0b0b10] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-300 font-medium">
                  Password <span className="text-rose-400">*</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-violet-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0b0b10] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign in to Workspace'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs text-white/60">
            <div className="font-semibold text-white">Invitation-Only Registration</div>
            <p className="mt-1">
              New accounts require a one-time invitation link from an administrator.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-3 font-semibold">
              <Link href="/signup" className="text-[#9d85ff] hover:underline">
                Registration Policy →
              </Link>
              <Link
                href="/invite/demo-invite-token-2026"
                className="text-amber-300 hover:underline"
              >
                Try Demo Invite Link ↗
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#08080c]" />}>
      <LoginPageInner />
    </Suspense>
  );
}


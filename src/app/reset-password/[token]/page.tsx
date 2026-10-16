'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ResetPasswordPage({
  params: rawParams,
}: {
  params: Promise<{ token: string }>;
}) {
  const params = React.use(rawParams);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    const res = await fetch('/api/auth/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: params.token, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Reset failed.');
      return;
    }
    setDone(true);
    setTimeout(() => router.push('/login'), 1200);
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
        <h1 className="mt-6 text-2xl font-bold text-white">Choose a new password</h1>

        {done ? (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="mr-1 inline h-4 w-4 text-emerald-400" />
            Password updated! Redirecting to sign in...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertTriangle className="mr-1 inline h-4 w-4" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase text-white/60">
                New Password (12–128 chars)
              </label>
              <input
                type="password"
                minLength={12}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#7c5cff] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-white/60">
                Confirm New Password
              </label>
              <input
                type="password"
                minLength={12}
                maxLength={128}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#7c5cff] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#7c5cff] py-3 text-sm font-semibold text-white hover:bg-[#6a48f5]"
            >
              Save new password
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

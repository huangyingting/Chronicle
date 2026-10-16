'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('alex@chroniclehq.com');
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/password/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setResetUrl(data.resetUrl || null);
    setSubmitted(true);
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

        <h1 className="mt-6 text-2xl font-bold text-white">Reset your password</h1>
        <p className="mt-1 text-sm text-white/50">
          Enter your account email and we will generate a one-time password reset link.
        </p>

        {submitted ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Reset link generated</span>
              </div>
              <p className="mt-1">
                If a password account exists for <strong>{email}</strong>, a one-time reset token is ready.
              </p>
              {resetUrl && (
                <Link
                  href={new URL(resetUrl).pathname}
                  className="mt-3 block break-all rounded-lg border border-emerald-500/20 bg-black/40 p-2.5 font-mono text-[11px] text-[#9d85ff] underline"
                >
                  {resetUrl}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-white/60">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/15 bg-black/40 pl-9 pr-3 py-2.5 text-sm text-white focus:border-[#7c5cff] focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#7c5cff] py-3 text-sm font-semibold text-white hover:bg-[#6a48f5]"
            >
              Send reset link
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldAlert, KeyRound, ArrowLeft, LogIn } from 'lucide-react';
import { accountAdmissionMode } from '@/lib/account-admission';

export const metadata = {
  title: 'Create account — Chronicle',
  description: 'Create a Chronicle Studio account via one-time invitation.',
};

export default function SignupPage() {
  const isPublic = accountAdmissionMode() === 'public';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#08080c] p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.18),transparent_60%)] pointer-events-none" />
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111119] p-8 shadow-2xl relative z-10">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c5cff] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>chronicle</span>
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-white/50">
          Start building interactive board decks, investor storylines, and Brand Kit presentations.
        </p>

        {!isPublic ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                <span>Invitation-Only Admission</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-amber-200/80">
                Chronicle is currently invitation-only. Use the personal one-time invitation link sent by an administrator to create your account.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white/70 space-y-2">
              <div className="font-semibold text-white">
                Have an invitation or testing the flow?
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/invite/demo-invite-token-2026"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#7c5cff] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#6a48f5]"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Open Seeded Invitation (/invite/demo-invite-token-2026)
                </Link>
                <Link
                  href="/admin/invitations"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/85 hover:bg-white/10"
                >
                  Manage Invitations in Admin Console →
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-white/50">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 font-semibold text-[#9d85ff] hover:underline"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign in to existing account
              </Link>
              <Link href="/" className="inline-flex items-center gap-1 hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" /> Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-sm text-white/60">
            Public registration is enabled.
          </div>
        )}
      </div>
    </main>
  );
}


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";
import {
  Sparkles,
  ChevronDown,
  ArrowRight,
  Layers,
  Terminal,
  Cpu,
  LayoutGrid,
  GraduationCap,
  BookOpen,
  Briefcase,
  Rocket,
  Megaphone,
  Building2,
  FileCode2
} from "lucide-react";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#08080c] text-[#f4f4f6] flex flex-col">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-violet-950/70 via-indigo-950/70 to-violet-950/70 border-b border-white/10 py-2 px-4 text-center text-xs text-zinc-300">
        <span className="inline-flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 font-medium">
            NEW
          </span>
          <span>Chronicle 2.0 + Public REST API &amp; MCP Server is now live.</span>
          <Link
            href="/api-platform"
            className="text-white font-medium underline underline-offset-4 hover:text-violet-300 inline-flex items-center gap-1"
          >
            Explore API Platform <ArrowRight className="w-3 h-3" />
          </Link>
        </span>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#08080c]/80 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-zinc-300 text-black flex items-center justify-center font-bold text-sm shadow-sm">
                C
              </div>
              <span className="font-semibold tracking-tight text-lg text-white">
                chronicle
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 text-sm text-zinc-300">
              {/* Product dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOpenMenu("product")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white flex items-center gap-1.5 transition">
                  Product <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
                {openMenu === "product" && (
                  <div className="absolute left-0 top-full pt-2 w-72">
                    <div className="rounded-xl bg-[#12121a] border border-white/10 shadow-2xl p-2 space-y-1">
                      <Link
                        href="/ai-presentation-maker"
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition"
                      >
                        <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-white">AI Presentation Maker</div>
                          <div className="text-xs text-zinc-400">Turn rough thoughts into board-ready decks</div>
                        </div>
                      </Link>
                      <Link
                        href="/api-platform"
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition"
                      >
                        <Terminal className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-white">API &amp; MCP Platform</div>
                          <div className="text-xs text-zinc-400">Generate decks from Claude, Cursor &amp; REST</div>
                        </div>
                      </Link>
                      <Link
                        href="/integrations"
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition"
                      >
                        <Cpu className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-white">Integrations</div>
                          <div className="text-xs text-zinc-400">Embed Figma, Loom, Linear, YouTube &amp; live charts</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOpenMenu("resources")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white flex items-center gap-1.5 transition">
                  Resources <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
                {openMenu === "resources" && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="rounded-xl bg-[#12121a] border border-white/10 shadow-2xl p-2 space-y-1">
                      <Link
                        href="/gallery"
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition"
                      >
                        <LayoutGrid className="w-4 h-4 text-violet-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-white">Deck Gallery</div>
                          <div className="text-xs text-zinc-400">Real decks crafted in Chronicle</div>
                        </div>
                      </Link>
                      <Link
                        href="/academy"
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition"
                      >
                        <GraduationCap className="w-4 h-4 text-amber-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-white">Chronicle Academy</div>
                          <div className="text-xs text-zinc-400">Master visual storytelling</div>
                        </div>
                      </Link>
                      <Link
                        href="/blog"
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition"
                      >
                        <BookOpen className="w-4 h-4 text-pink-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-white">Blog</div>
                          <div className="text-xs text-zinc-400">Product updates &amp; design essays</div>
                        </div>
                      </Link>
                      <Link
                        href="/docs"
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition"
                      >
                        <FileCode2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-white">API Documentation</div>
                          <div className="text-xs text-zinc-400">REST endpoints &amp; MCP guide</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Use Cases dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOpenMenu("usecases")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white flex items-center gap-1.5 transition">
                  Use Cases <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
                {openMenu === "usecases" && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="rounded-xl bg-[#12121a] border border-white/10 shadow-2xl p-2 space-y-1">
                      <Link href="/sales" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                        <Briefcase className="w-4 h-4 text-violet-400" />
                        <span className="text-sm text-white">Sales &amp; GTM Teams</span>
                      </Link>
                      <Link href="/product-use-case" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                        <Layers className="w-4 h-4 text-sky-400" />
                        <span className="text-sm text-white">Product &amp; Strategy</span>
                      </Link>
                      <Link href="/marketing" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                        <Megaphone className="w-4 h-4 text-pink-400" />
                        <span className="text-sm text-white">Marketing Teams</span>
                      </Link>
                      <Link href="/agencies" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-white">Agencies &amp; Consultancies</span>
                      </Link>
                      <Link href="/startups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                        <Rocket className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-white">Founders &amp; Startups</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/templates" className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition">
                Templates
              </Link>
              <Link href="/enterprise" className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition">
                Enterprise
              </Link>
              <Link href="/pricing" className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition">
                Pricing
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/invitations"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-medium text-violet-200 hover:bg-violet-500/20 transition"
            >
              Invite Admin
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-2 text-sm text-zinc-300 hover:text-white transition"
            >
              Log in
            </Link>
            <Link
              href={`/${DEFAULT_WORKSPACE_ID}/home`}
              className="px-4 py-2 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition inline-flex items-center gap-1.5 shadow-sm"
            >
              Open Studio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060609] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold text-xs">
                C
              </div>
              <span className="font-semibold text-white text-base">chronicle</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
              Every great presenter has a secret. Chronicle combines AI storyline synthesis, 34+ interactive smart widgets, and automated brand governance.
            </p>
            <div className="text-xs text-zinc-500">
              © {new Date().getFullYear()} Chronicle HQ Inc. All rights reserved.
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider">Product</div>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/ai-presentation-maker" className="hover:text-white">AI Presentation Maker</Link></li>
              <li><Link href="/api-platform" className="hover:text-white">API &amp; MCP Platform</Link></li>
              <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
              <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider">Use Cases</div>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/solutions" className="hover:text-white">Solutions Overview</Link></li>
              <li><Link href="/sales" className="hover:text-white">Sales Decks</Link></li>
              <li><Link href="/product-use-case" className="hover:text-white">Product Roadmaps</Link></li>
              <li><Link href="/marketing" className="hover:text-white">Marketing Campaigns</Link></li>
              <li><Link href="/agencies" className="hover:text-white">Agencies</Link></li>
              <li><Link href="/startups" className="hover:text-white">Startups &amp; Pitch Decks</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider">Resources</div>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/gallery" className="hover:text-white">Presentation Gallery</Link></li>
              <li><Link href="/academy" className="hover:text-white">Storytelling Academy</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog &amp; Changelog</Link></li>
              <li><Link href="/docs" className="hover:text-white">Developer Docs</Link></li>
              <li><Link href="/enterprise" className="hover:text-white">Enterprise Security</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider">Compare</div>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/chronicle-vs-gamma" className="hover:text-white">Chronicle vs Gamma</Link></li>
              <li><Link href="/chronicle-vs-pitch" className="hover:text-white">Chronicle vs Pitch</Link></li>
              <li><Link href={`/${DEFAULT_WORKSPACE_ID}/home`} className="hover:text-white">Launch Web App</Link></li>
              <li><Link href="/invite/demo-invite-token-2026" className="text-amber-300 hover:underline">Accept Demo Invitation ↗</Link></li>
              <li><Link href="/admin/invitations" className="text-violet-300 hover:underline">Admin Invitations Console ↗</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

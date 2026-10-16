import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/account-admission/passwords";
import { hashOpaqueToken } from "../src/lib/account-admission/tokens";
import {
  DEFAULT_WORKSPACE_ID,
  DEFAULT_USER_ID,
  DOC_BOARD_ID,
  DOC_INTRO_ID,
  DOC_SERIES_B_ID,
  DOC_PRODUCT_ID,
  BOARD_MEETING_SLIDES,
  GETTING_STARTED_SLIDES,
  SERIES_B_SLIDES,
  PRODUCT_STRATEGY_SLIDES,
  generateStorylineOutline
} from "../src/lib/seed-data";

export async function runSeed() {
  console.log("Seeding Chronicle database...");

  // 1. Seed Demo Users (Admin + Member)
  const passwordHash = await bcrypt.hash("chronicle123", 10);
  const alex = await prisma.user.upsert({
    where: { email: "alex@chroniclehq.com" },
    update: {
      name: "Alex Rivera",
      fullName: "Alex Rivera",
      role: "ADMIN",
      emailVerified: new Date(),
      picture:
        "https://files.chroniclehq.com/edebe817-80a5-4f12-af88-9008371fc511-96756774_8229_47c4_bb0c_340830ac4a50_Favicon.svg"
    },
    create: {
      id: DEFAULT_USER_ID,
      email: "alex@chroniclehq.com",
      name: "Alex Rivera",
      passwordHash,
      fullName: "Alex Rivera",
      role: "ADMIN",
      emailVerified: new Date(),
      picture:
        "https://files.chroniclehq.com/edebe817-80a5-4f12-af88-9008371fc511-96756774_8229_47c4_bb0c_340830ac4a50_Favicon.svg",
      onboardingStatus: "COMPLETED",
      userConfigJson: JSON.stringify({
        smartRepositioningEnabled: true,
        smartResizingEnabled: true,
        showSnaplines: true,
        systemAppearance: "dark",
        roles: ["Founder / Executive", "Product"],
        useCases: ["Pitch decks", "Board updates", "Product strategy"]
      })
    }
  });

  // Seed scrypt PasswordCredential for Alex (supports both "chronicle-demo-2026" and legacy "chronicle123")
  const scryptDemoHash = await hashPassword("chronicle-demo-2026");
  await prisma.passwordCredential.upsert({
    where: { userId: alex.id },
    update: { passwordHash: scryptDemoHash },
    create: {
      userId: alex.id,
      passwordHash: scryptDemoHash
    }
  });

  // Seed AccountInvitations (accepted admin invitation + pending demo invitation token)
  const acceptedTokenHash = hashOpaqueToken("seed-accepted-alex-token");
  await prisma.accountInvitation.upsert({
    where: { id: "inv_accepted_alex" },
    update: {
      status: "ACCEPTED",
      activeForEmail: null,
      acceptedAt: new Date("2026-01-10T10:00:00.000Z"),
      acceptedBy: { connect: { id: alex.id } }
    },
    create: {
      id: "inv_accepted_alex",
      email: "alex@chroniclehq.com",
      normalizedEmail: "alex@chroniclehq.com",
      activeForEmail: null,
      status: "ACCEPTED",
      tokenHash: acceptedTokenHash,
      invitedBy: { connect: { id: alex.id } },
      acceptedBy: { connect: { id: alex.id } },
      acceptedAt: new Date("2026-01-10T10:00:00.000Z"),
      expiresAt: new Date("2027-01-10T10:00:00.000Z")
    }
  });

  const pendingDemoToken = "demo-invite-token-2026";
  await prisma.accountInvitation.upsert({
    where: { id: "inv_pending_demo" },
    update: {
      email: "invited@chroniclehq.com",
      normalizedEmail: "invited@chroniclehq.com",
      activeForEmail: "invited@chroniclehq.com",
      tokenHash: hashOpaqueToken(pendingDemoToken),
      status: "PENDING",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    create: {
      id: "inv_pending_demo",
      email: "invited@chroniclehq.com",
      normalizedEmail: "invited@chroniclehq.com",
      activeForEmail: "invited@chroniclehq.com",
      status: "PENDING",
      tokenHash: hashOpaqueToken(pendingDemoToken),
      invitedBy: { connect: { id: alex.id } },
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  const mayuresh = await prisma.user.upsert({
    where: { email: "mayuresh@chroniclehq.com" },
    update: {},
    create: {
      email: "mayuresh@chroniclehq.com",
      passwordHash,
      fullName: "Mayuresh Patole",
      picture: "",
      onboardingStatus: "COMPLETED"
    }
  });

  // 2. Load real Themes & Brand Kits from docs/reference
  let realThemes: any[] = [];
  let realBrandKits: any[] = [];
  try {
    const themesPath = path.join(process.cwd(), "docs/reference/real_themes.json");
    if (fs.existsSync(themesPath)) {
      realThemes = JSON.parse(fs.readFileSync(themesPath, "utf8"))?.data?.themesByIds || [];
    }
  } catch {}
  try {
    const bkPath = path.join(process.cwd(), "docs/reference/real_brandkits.json");
    if (fs.existsSync(bkPath)) {
      realBrandKits = JSON.parse(fs.readFileSync(bkPath, "utf8"))?.data?.brandKitsByIds || [];
    }
  } catch {}

  const defaultThemeId = realThemes[0]?.id || "theme-default-dark";

  // 3. Seed Default Workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: DEFAULT_WORKSPACE_ID },
    update: {
      name: "Chronicle Studio",
      defaultThemeId
    },
    create: {
      id: DEFAULT_WORKSPACE_ID,
      name: "Chronicle Studio",
      slug: "chronicle-studio",
      icon: "https://files.chroniclehq.com/edebe817-80a5-4f12-af88-9008371fc511-96756774_8229_47c4_bb0c_340830ac4a50_Favicon.svg",
      pricingPlanId: "e2860a7b-6550-4573-a1a0-bde7508be48b", // Max plan
      defaultThemeId,
      tokensUsed: 12,
      tokensLimit: 2000
    }
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: { workspaceId: workspace.id, userId: alex.id }
    },
    update: { role: "OWNER" },
    create: { workspaceId: workspace.id, userId: alex.id, role: "OWNER" }
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: { workspaceId: workspace.id, userId: mayuresh.id }
    },
    update: { role: "ADMIN" },
    create: { workspaceId: workspace.id, userId: mayuresh.id, role: "ADMIN" }
  });

  // 4. Seed Official 19 Themes
  for (let i = 0; i < realThemes.length; i++) {
    const t = realThemes[i];
    await prisma.theme.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        dataJson: JSON.stringify(t.data ?? t)
      },
      create: {
        id: t.id,
        workspaceId: workspace.id,
        name: t.name,
        isCustom: Boolean(t.isCustom),
        isDefault: i === 0,
        dataJson: JSON.stringify(t.data ?? t)
      }
    });
  }

  // Also add 2 custom themes ("New Theme 1", "New Theme 2") matching screenshot 11-brand-kit-page.png
  await prisma.theme.upsert({
    where: { id: "custom-theme-byte-labs" },
    update: {},
    create: {
      id: "custom-theme-byte-labs",
      workspaceId: workspace.id,
      name: "Byte Labs Executive",
      isCustom: true,
      isDefault: false,
      dataJson: JSON.stringify({
        background: "#09192b",
        surface: "#10253d",
        text: "#ffffff",
        accent: "#38bdf8",
        headingFont: "Inter",
        bodyFont: "Inter"
      })
    }
  });

  // 5. Seed Brand Kits (Google, Apple, OpenAI + official brand kits)
  const featuredBrandKits = [
    {
      id: "bk-google",
      name: "Google",
      isDefault: true,
      colors: ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#111827"],
      logos: [{ id: "lg-google", name: "Google", url: "https://www.google.com/favicon.ico" }]
    },
    {
      id: "bk-apple",
      name: "Apple",
      isDefault: false,
      colors: ["#000000", "#1d1d1f", "#f5f5f7", "#0071e3", "#86868b"],
      logos: [{ id: "lg-apple", name: "Apple", url: "https://www.apple.com/favicon.ico" }]
    },
    {
      id: "bk-openai",
      name: "OpenAI",
      isDefault: false,
      colors: ["#000000", "#10a37f", "#ffffff", "#202123", "#ececf1"],
      logos: [{ id: "lg-openai", name: "OpenAI", url: "https://openai.com/favicon.ico" }]
    }
  ];

  for (const bk of featuredBrandKits) {
    await prisma.brandKit.upsert({
      where: { id: bk.id },
      update: {},
      create: {
        id: bk.id,
        workspaceId: workspace.id,
        name: bk.name,
        isDefault: bk.isDefault,
        colorsJson: JSON.stringify(bk.colors),
        logosJson: JSON.stringify(bk.logos),
        themesJson: JSON.stringify(realThemes.slice(0, 2)),
        fontsJson: JSON.stringify([{ family: "Inter", weight: "600" }])
      }
    });
  }

  for (const rbk of realBrandKits.slice(0, 6)) {
    await prisma.brandKit.upsert({
      where: { id: rbk.id },
      update: {},
      create: {
        id: rbk.id,
        workspaceId: workspace.id,
        name: rbk.name,
        isDefault: false,
        colorsJson: JSON.stringify(rbk.colors || []),
        logosJson: JSON.stringify(rbk.logos || []),
        themesJson: JSON.stringify(rbk.themes || []),
        fontsJson: JSON.stringify(rbk.customFonts || [])
      }
    });
  }

  // 6. Seed Folders matching screenshot 01-home-my-decks.png
  const folderBoard = await prisma.folder.upsert({
    where: { id: "folder-1" },
    update: {},
    create: {
      id: "folder-1",
      workspaceId: workspace.id,
      name: "Board & Investor Decks",
      scope: "WORKSPACE",
      isShared: true
    }
  });

  const folderProduct = await prisma.folder.upsert({
    where: { id: "folder-2" },
    update: {},
    create: {
      id: "folder-2",
      workspaceId: workspace.id,
      name: "Product Strategy",
      scope: "WORKSPACE",
      isShared: false
    }
  });

  // 7. Seed Documents (Active + 1 Trashed Deck matching 06-home-trash.png)
  await prisma.document.upsert({
    where: { id: DOC_BOARD_ID },
    update: {
      slidesJson: JSON.stringify(BOARD_MEETING_SLIDES)
    },
    create: {
      id: DOC_BOARD_ID,
      workspaceId: workspace.id,
      authorId: alex.id,
      folderId: folderBoard.id,
      title: "Q3 Board Meeting & Investor Update",
      scope: "WORKSPACE",
      workspaceAccess: "EDIT",
      isPublic: true,
      isPublicDocumentDuplicationEnabled: true,
      themeId: defaultThemeId,
      brandKitId: "bk-google",
      previewUrl:
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      viewCount: 142,
      sortOrder: 0,
      slidesJson: JSON.stringify(BOARD_MEETING_SLIDES),
      collaboratorsJson: JSON.stringify([
        { id: alex.id, email: "alex@chroniclehq.com", fullName: "Alex Rivera", role: "OWNER" },
        { id: mayuresh.id, email: "mayuresh@chroniclehq.com", fullName: "Mayuresh Patole", role: "EDITOR" }
      ])
    }
  });

  await prisma.document.upsert({
    where: { id: DOC_INTRO_ID },
    update: {
      slidesJson: JSON.stringify(GETTING_STARTED_SLIDES)
    },
    create: {
      id: DOC_INTRO_ID,
      workspaceId: workspace.id,
      authorId: alex.id,
      folderId: folderProduct.id,
      title: "Getting started with Chronicle",
      scope: "WORKSPACE",
      workspaceAccess: "EDIT",
      isPublic: true,
      isPublicDocumentDuplicationEnabled: true,
      themeId: defaultThemeId,
      brandKitId: "bk-google",
      previewUrl:
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      viewCount: 89,
      sortOrder: 1,
      slidesJson: JSON.stringify(GETTING_STARTED_SLIDES)
    }
  });

  await prisma.document.upsert({
    where: { id: DOC_SERIES_B_ID },
    update: {
      slidesJson: JSON.stringify(SERIES_B_SLIDES)
    },
    create: {
      id: DOC_SERIES_B_ID,
      workspaceId: workspace.id,
      authorId: alex.id,
      folderId: folderBoard.id,
      title: "Series B Investor Pitch Deck",
      scope: "SHARED",
      workspaceAccess: "EDIT",
      isPublic: true,
      isPublicDocumentDuplicationEnabled: true,
      themeId: defaultThemeId,
      previewUrl:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80",
      viewCount: 318,
      sortOrder: 2,
      slidesJson: JSON.stringify(SERIES_B_SLIDES)
    }
  });

  await prisma.document.upsert({
    where: { id: DOC_PRODUCT_ID },
    update: {
      slidesJson: JSON.stringify(PRODUCT_STRATEGY_SLIDES)
    },
    create: {
      id: DOC_PRODUCT_ID,
      workspaceId: workspace.id,
      authorId: alex.id,
      folderId: folderProduct.id,
      title: "2026 Product Strategy & AI Roadmap",
      scope: "WORKSPACE",
      workspaceAccess: "EDIT",
      isPublic: true,
      isPublicDocumentDuplicationEnabled: true,
      themeId: defaultThemeId,
      previewUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
      viewCount: 64,
      sortOrder: 3,
      slidesJson: JSON.stringify(PRODUCT_STRATEGY_SLIDES)
    }
  });

  await prisma.document.upsert({
    where: { id: "doc-deleted-1" },
    update: {},
    create: {
      id: "doc-deleted-1",
      workspaceId: workspace.id,
      authorId: alex.id,
      title: "Archived Q2 Marketing Plan",
      scope: "WORKSPACE",
      workspaceAccess: "EDIT",
      isPublic: false,
      deletedAt: new Date("2026-10-10T10:00:00.000Z"),
      deletedBy: "Alex Rivera",
      previewUrl:
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      slidesJson: JSON.stringify(PRODUCT_STRATEGY_SLIDES)
    }
  });

  // 8. Seed Templates Gallery
  const templates = [
    {
      id: "tpl-board-meeting",
      slug: "board-meeting-deck",
      name: "Board Meeting Deck",
      description: "Executive board update and investor presentation with KPI scorecards, P&L tables, and strategic roadmap.",
      category: "Business Strategy",
      previewUrl:
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      slides: BOARD_MEETING_SLIDES
    },
    {
      id: "tpl-series-b",
      slug: "series-b-pitch-deck",
      name: "Series B Investor Pitch Deck",
      description: "Founder-tested fundraising narrative covering problem, product velocity, ARR growth, and cohort economics.",
      category: "Startups & Fundraising",
      previewUrl:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80",
      slides: SERIES_B_SLIDES
    },
    {
      id: "tpl-product-strategy",
      slug: "product-strategy-roadmap",
      name: "Product Strategy & Roadmap",
      description: "Align engineering, design, and leadership around quarterly bets, customer insights, and delivery milestones.",
      category: "Product",
      previewUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
      slides: PRODUCT_STRATEGY_SLIDES
    },
    {
      id: "tpl-getting-started",
      slug: "getting-started-with-chronicle",
      name: "Getting Started with Chronicle",
      description: "Interactive guide to Chronicle Smart Widgets, 1-click Remixing, Brand Kits, and Muse AI.",
      category: "Onboarding",
      previewUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
      slides: GETTING_STARTED_SLIDES
    },
    {
      id: "tpl-enterprise-sales",
      slug: "enterprise-sales-deck",
      name: "Enterprise Customer Pitch Deck",
      description: "High-converting B2B sales presentation with ROI calculator, before/after comparison, and case studies.",
      category: "Sales",
      previewUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
      slides: SERIES_B_SLIDES
    },
    {
      id: "tpl-agency-proposal",
      slug: "agency-creative-proposal",
      name: "Agency Brand & Creative Proposal",
      description: "Editorial pitch template for design studios and agencies presenting brand identity, scope, and timeline.",
      category: "Agencies",
      previewUrl:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80",
      slides: BOARD_MEETING_SLIDES
    }
  ];

  for (const tpl of templates) {
    await prisma.template.upsert({
      where: { slug: tpl.slug },
      update: {
        name: tpl.name,
        description: tpl.description,
        slidesJson: JSON.stringify(tpl.slides)
      },
      create: {
        id: tpl.id,
        slug: tpl.slug,
        name: tpl.name,
        description: tpl.description,
        category: tpl.category,
        previewUrl: tpl.previewUrl,
        themeId: defaultThemeId,
        slidesJson: JSON.stringify(tpl.slides)
      }
    });
  }

  // 9. Seed Media Library Assets matching 12-media-library-page.png
  const mediaItems = [
    {
      id: "media-1",
      url: "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      type: "IMAGE",
      source: "UPLOAD",
      mediaAccess: "WORKSPACE",
      fileName: "board-cover-bg.jpg",
      colors: JSON.stringify(["#0d2238", "#38bdf8", "#ffffff"])
    },
    {
      id: "media-2",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      type: "IMAGE",
      source: "GENERATED",
      mediaAccess: "WORKSPACE",
      fileName: "muse-abstract-gradient.jpg",
      colors: JSON.stringify(["#7c5cff", "#1e1b4b", "#c084fc"])
    },
    {
      id: "media-3",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      type: "IMAGE",
      source: "UPLOAD",
      mediaAccess: "PERSONAL",
      fileName: "q4-analytics-dashboard.jpg",
      colors: JSON.stringify(["#0f172a", "#10b981", "#e2e8f0"])
    }
  ];

  for (const m of mediaItems) {
    await prisma.mediaAsset.upsert({
      where: { id: m.id },
      update: {},
      create: {
        ...m,
        workspaceId: workspace.id
      }
    });
  }

  // 10. Seed Muse Chat Session matching 14-ai-chat-session.png
  const initialOutline = generateStorylineOutline(
    "Create a Q4 Board Meeting deck covering ARR growth, strategic priorities, and key risks.",
    8,
    "Update"
  );
  await prisma.museChatSession.upsert({
    where: { id: "chat-1" },
    update: {},
    create: {
      id: "chat-1",
      workspaceId: workspace.id,
      userId: alex.id,
      name: "Q4 Board Meeting & 2026 Strategy Storyline",
      prompt: "Create a Q4 Board Meeting deck covering ARR growth, strategic priorities, and key risks.",
      style: "Midnight",
      slideCount: 8,
      documentId: DOC_BOARD_ID,
      outlineJson: JSON.stringify(initialOutline),
      messagesJson: JSON.stringify([
        {
          id: "m1",
          role: "user",
          content: "Create a Q4 Board Meeting deck covering ARR growth, strategic priorities, and key risks.",
          createdAt: "2026-10-16T08:00:00.000Z"
        },
        {
          id: "m2",
          role: "assistant",
          content:
            "I've structured an 8-slide Board Meeting storyline with executive KPI scorecards, quarterly ARR trajectory, 2026 product priorities, and board resolutions. You can edit any section below or click 'Generate Deck' to open the live canvas.",
          createdAt: "2026-10-16T08:00:05.000Z"
        }
      ])
    }
  });

  // 11. Seed Chronicle MCP / API Key matching 08-modal-mcp-api-keys.png
  await prisma.apiKey.upsert({
    where: { id: "key-1" },
    update: {},
    create: {
      id: "key-1",
      workspaceId: workspace.id,
      userId: alex.id,
      name: "Production MCP Agent Key",
      maskedKey: "chr_live_••••••••••••9a4f",
      rawKeyHash: "chr_live_demo_token_2026_9a4f",
      lastUsedAt: new Date("2026-10-16T08:45:00.000Z")
    }
  });

  console.log("Chronicle database seeded successfully!");
}

if (require.main === module) {
  runSeed()
    .catch(e => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_USER_ID,
  DEFAULT_WORKSPACE_ID,
  GETTING_STARTED_SLIDES
} from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") || DEFAULT_WORKSPACE_ID;
  const includeDeleted = searchParams.get("includeDeleted") === "true";

  const documents = await prisma.document.findMany({
    where: {
      workspaceId,
      ...(includeDeleted ? {} : { deletedAt: null })
    },
    include: {
      folder: true,
      author: true
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
  });

  const trashed = await prisma.document.findMany({
    where: {
      workspaceId,
      NOT: { deletedAt: null }
    },
    orderBy: { deletedAt: "desc" }
  });

  const folders = await prisma.folder.findMany({
    where: { workspaceId },
    include: { documents: { where: { deletedAt: null }, select: { id: true, title: true } } },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json({ documents, trashed, folders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const workspaceId = body.workspaceId || DEFAULT_WORKSPACE_ID;
  const title = (body.title || "Untitled presentation").trim();

  const defaultSlides =
    body.slides ||
    [
      {
        id: `slide-${Date.now().toString(36)}-1`,
        title: "Cover",
        sectionGroup: "Cover",
        eyebrow: "NEW PRESENTATION",
        subtitle: "Created in Chronicle Studio",
        layoutVariant: "cover",
        background: {
          type: "gradient",
          preset: "dark",
          color: "#0b0b10",
          gradient:
            "radial-gradient(circle at 80% 20%, rgba(139,92,246,0.3), transparent 55%), linear-gradient(135deg, #0b0b10 0%, #141422 100%)"
        },
        widgets: [
          {
            id: `w-${Date.now().toString(36)}-1`,
            type: "heading",
            colSpan: 12,
            badge: "CHRONICLE STUDIO",
            title,
            subtitle: "Click any block to edit inline, or open '+ Insert' and 'Remix' in the bottom dock.",
            style: { headingLevel: "H1", fontSize: "3xl", bold: true }
          },
          {
            id: `w-${Date.now().toString(36)}-2`,
            type: "metric",
            colSpan: 4,
            badge: "METRIC 01",
            value: "$84.2M",
            delta: "+68% YoY",
            title: "Headline KPI",
            content: "Double-click to customize metric"
          },
          {
            id: `w-${Date.now().toString(36)}-3`,
            type: "box",
            colSpan: 4,
            badge: "KEY INSIGHT",
            title: "Core Strategic Thesis",
            content: "Summarize the most important takeaway for your audience."
          },
          {
            id: `w-${Date.now().toString(36)}-4`,
            type: "box",
            colSpan: 4,
            badge: "NEXT STEPS",
            title: "Execution & Timeline",
            content: "Add a roadmap, comparison matrix, or chart from the Insert dock."
          }
        ]
      },
      ...GETTING_STARTED_SLIDES.slice(1, 3)
    ];

  const doc = await prisma.document.create({
    data: {
      workspaceId,
      authorId: body.authorId || DEFAULT_USER_ID,
      folderId: body.folderId || null,
      title,
      scope: body.scope || "WORKSPACE",
      isPublic: true,
      themeId: body.themeId || null,
      brandKitId: body.brandKitId || "bk-google",
      previewUrl:
        body.previewUrl ||
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      slidesJson: JSON.stringify(defaultSlides)
    }
  });

  return NextResponse.json({ document: doc });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_USER_ID, DEFAULT_WORKSPACE_ID, GETTING_STARTED_SLIDES } from "@/lib/seed-data";

export async function GET() {
  const workspaces = await prisma.workspace.findMany({
    include: {
      members: { include: { user: true } },
      apiKeys: { where: { revokedAt: null }, include: { user: true }, orderBy: { createdAt: "desc" } },
      customFonts: true
    },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json({ workspaces });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = (body.name || "New Workspace").trim();
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6);

  const defaultWorkspace = await prisma.workspace.findUnique({
    where: { id: DEFAULT_WORKSPACE_ID }
  });

  const ws = await prisma.workspace.create({
    data: {
      name,
      slug,
      icon: body.icon || "",
      defaultThemeId: defaultWorkspace?.defaultThemeId || null,
      members: {
        create: {
          userId: body.userId || DEFAULT_USER_ID,
          role: "OWNER"
        }
      }
    }
  });

  await prisma.document.create({
    data: {
      workspaceId: ws.id,
      authorId: body.userId || DEFAULT_USER_ID,
      title: "Getting started with Chronicle",
      scope: "WORKSPACE",
      isPublic: true,
      slidesJson: JSON.stringify(GETTING_STARTED_SLIDES),
      previewUrl:
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg"
    }
  });

  return NextResponse.json({ workspace: ws });
}

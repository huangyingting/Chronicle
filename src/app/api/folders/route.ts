import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") || DEFAULT_WORKSPACE_ID;

  const folders = await prisma.folder.findMany({
    where: { workspaceId },
    include: {
      documents: { where: { deletedAt: null }, select: { id: true, title: true } }
    },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json({ folders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const folder = await prisma.folder.create({
    data: {
      workspaceId: body.workspaceId || DEFAULT_WORKSPACE_ID,
      name: (body.name || "Untitled Folder").trim(),
      scope: "WORKSPACE"
    },
    include: {
      documents: { where: { deletedAt: null }, select: { id: true, title: true } }
    }
  });
  return NextResponse.json({ folder });
}

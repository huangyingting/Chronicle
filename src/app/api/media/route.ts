import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_USER_ID, DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") || DEFAULT_WORKSPACE_ID;

  const assets = await prisma.mediaAsset.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    assets: assets.map((a) => {
      const dims = JSON.parse(a.dimensions || '{"width":1920,"height":1080}');
      return {
        ...a,
        name: a.fileName,
        scope: a.mediaAccess,
        width: dims.width || 1920,
        height: dims.height || 1080
      };
    })
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const workspaceId = body.workspaceId || DEFAULT_WORKSPACE_ID;

  const stockPool = [
    "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
    "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-2.jpg",
    "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-1.jpg",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80"
  ];

  const pickedUrl =
    body.url || stockPool[Math.floor(Math.random() * stockPool.length)];

  const asset = await prisma.mediaAsset.create({
    data: {
      workspaceId,
      fileName: (body.name || body.prompt || "Visual Asset.jpg").trim(),
      url: pickedUrl,
      type: "IMAGE",
      source: body.scope === "GENERATED" ? "AI" : "UPLOAD",
      mediaAccess: body.scope || "WORKSPACE"
    }
  });

  return NextResponse.json({
    asset: {
      ...asset,
      name: asset.fileName,
      scope: asset.mediaAccess,
      width: 1920,
      height: 1080
    }
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await prisma.mediaAsset.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

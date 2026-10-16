import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";
import { generateSlideVisualImage } from "@/lib/production-engine/ai-provider";

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

  if (body.scope === "GENERATED" || body.action === "generate") {
    const prompt = (
      body.prompt ||
      body.name?.replace(/\.(jpg|png|webp)$/i, "") ||
      "Executive 16:9 presentation visual"
    ).trim();

    const generated = await generateSlideVisualImage(prompt);
    const asset = await prisma.mediaAsset.create({
      data: {
        workspaceId,
        fileName: body.name || generated.fileName,
        url: generated.url,
        type: "IMAGE",
        source: "GENERATED",
        mediaAccess: "GENERATED",
        colors: JSON.stringify(generated.colors),
        dimensions: JSON.stringify({ width: 1920, height: 1080 })
      }
    });

    return NextResponse.json({
      asset: {
        ...asset,
        name: asset.fileName,
        scope: asset.mediaAccess,
        width: 1920,
        height: 1080,
        aiProvider: generated.provider,
        aiModel: generated.model
      }
    });
  }

  const pickedUrl =
    body.url ||
    "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg";

  const asset = await prisma.mediaAsset.create({
    data: {
      workspaceId,
      fileName: (body.name || body.prompt || "Visual Asset.jpg").trim(),
      url: pickedUrl,
      type: "IMAGE",
      source: "UPLOAD",
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

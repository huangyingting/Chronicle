import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_USER_ID, DEFAULT_WORKSPACE_ID, SEED_TEMPLATES } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const templates = await prisma.template.findMany({
    where: category && category !== "All" ? { category } : {},
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json({
    templates: templates.map((t) => {
      const slides = JSON.parse(t.slidesJson || "[]");
      return {
        ...t,
        title: t.name,
        authorName: t.author,
        slideCount: slides.length,
        slides
      };
    })
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const dbTemplate = await prisma.template.findFirst({
    where: {
      OR: [{ id: body.templateId || "" }, { slug: body.slug || "" }]
    }
  });

  const seedFallback = SEED_TEMPLATES.find(
    (t) => t.id === body.templateId || t.slug === body.slug
  );

  if (!dbTemplate && !seedFallback) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const doc = await prisma.document.create({
    data: {
      workspaceId: body.workspaceId || DEFAULT_WORKSPACE_ID,
      authorId: body.authorId || DEFAULT_USER_ID,
      title:
        body.title || dbTemplate?.name || seedFallback?.title || "Template Presentation",
      scope: "WORKSPACE",
      isPublic: true,
      previewUrl:
        dbTemplate?.previewUrl ||
        seedFallback?.previewUrl ||
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      slidesJson:
        dbTemplate?.slidesJson || JSON.stringify(seedFallback?.slides || [])
    }
  });

  return NextResponse.json({ document: doc });
}

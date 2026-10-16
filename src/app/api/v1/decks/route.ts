import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_USER_ID,
  DEFAULT_WORKSPACE_ID,
  generateSlidesFromOutline,
  generateStorylineOutline
} from "@/lib/seed-data";
import { callAzureOpenAiJson } from "@/lib/production-engine/ai-provider";
import { SlideSection } from "@/lib/types";

export async function GET() {
  const docs = await prisma.document.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      workspaceId: true,
      title: true,
      scope: true,
      isPublic: true,
      updatedAt: true
    },
    orderBy: { updatedAt: "desc" },
    take: 25
  });

  return NextResponse.json({
    object: "list",
    data: docs.map((d) => ({
      id: d.id,
      title: d.title,
      workspace_id: d.workspaceId,
      share_url: `/share/${d.workspaceId}/${d.id}/s1`,
      editor_url: `/${d.workspaceId}/document/${d.id}`,
      updated_at: d.updatedAt
    }))
  });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) {
      const keyRecord = await prisma.apiKey
        .findFirst({
          where: { rawKeyHash: token, revokedAt: null }
        })
        .catch(() => null);
      if (keyRecord) {
        await prisma.apiKey
          .update({
            where: { id: keyRecord.id },
            data: { lastUsedAt: new Date() }
          })
          .catch(() => null);
      }
    }
  }

  const body = await req.json();
  const prompt = (body.prompt || body.topic || "Executive Strategy Deck").trim();
  const slideCount = Math.min(
    12,
    Math.max(3, Number(body.slide_count || body.slideCount || 6))
  );
  const workspaceId =
    body.workspace_id || body.workspaceId || DEFAULT_WORKSPACE_ID;

  const outline = generateStorylineOutline(
    prompt,
    slideCount,
    body.tone || "Executive"
  );
  const fallbackSlides = generateSlidesFromOutline(prompt, outline);

  const aiDeck = await callAzureOpenAiJson<{
    slides: SlideSection[];
  }>(
    `You are Chronicle REST/MCP API Engine. Generate ${slideCount} 16:9 presentation slides in JSON {"slides": [...]} for the topic "${prompt}". Each slide must include id, title, sectionGroup, eyebrow, subtitle, layoutVariant, background, and 3-4 widgets (heading, metric, box, comparison-table, timeline, or bar-chart).`,
    JSON.stringify({ prompt, slideCount, tone: body.tone || "Executive" }),
    { slides: fallbackSlides }
  );

  const slides =
    Array.isArray(aiDeck.data.slides) && aiDeck.data.slides.length > 0
      ? aiDeck.data.slides.map((s, idx) => ({
          ...fallbackSlides[idx % fallbackSlides.length],
          ...s,
          id: s.id || `s${idx + 1}`,
          widgets:
            Array.isArray(s.widgets) && s.widgets.length > 0
              ? s.widgets
              : fallbackSlides[idx % fallbackSlides.length].widgets
        }))
      : fallbackSlides;

  const doc = await prisma.document.create({
    data: {
      workspaceId,
      authorId: DEFAULT_USER_ID,
      title: body.title || prompt.slice(0, 80),
      scope: "WORKSPACE",
      isPublic: true,
      brandKitId: body.brand_kit_id || "bk-google",
      themeId: "3929be33-c2d9-4ff4-a81c-a4d2ff3ee3a0",
      previewUrl:
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      slidesJson: JSON.stringify(slides)
    }
  });

  const firstSlideId = slides[0]?.id || "s1";

  return NextResponse.json({
    id: doc.id,
    object: "deck",
    title: doc.title,
    slide_count: slides.length,
    ai_provider: aiDeck.provider,
    ai_model: aiDeck.model,
    workspace_id: workspaceId,
    editor_url: `/${workspaceId}/document/${doc.id}/${firstSlideId}`,
    share_url: `/share/${workspaceId}/${doc.id}/${firstSlideId}`,
    slides
  });
}

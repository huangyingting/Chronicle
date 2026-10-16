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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const workspaceId = body.workspaceId || DEFAULT_WORKSPACE_ID;
  const prompt = (body.prompt || body.title || "AI Strategic Presentation").trim();
  const outline =
    Array.isArray(body.outline) && body.outline.length > 0
      ? body.outline
      : generateStorylineOutline(
          prompt,
          Number(body.slideCount || 6),
          body.tone || "Executive"
        );

  const fallbackSlides = generateSlidesFromOutline(prompt, outline);

  const aiDeck = await callAzureOpenAiJson<{
    slides: SlideSection[];
  }>(
    `You are Chronicle Studio Deck Engine. Transform the presentation prompt and storyline outline into an array of 16:9 interactive slides ("slides").
Each slide in "slides" MUST follow this structure:
{
  "id": "s1",
  "title": "Slide Headline",
  "sectionGroup": "01",
  "eyebrow": "UPPERCASE EYEBROW",
  "subtitle": "Concise executive takeaway",
  "layoutVariant": "cover | bento-3 | split | metrics-row | comparison | roadmap",
  "background": {
    "type": "gradient",
    "preset": "dark",
    "color": "#0b0b10",
    "gradient": "radial-gradient(circle at 80% 20%, rgba(124,92,255,0.28), transparent 55%), linear-gradient(135deg, #0b0b10 0%, #131320 100%)"
  },
  "widgets": [
    {
      "id": "w-1",
      "type": "heading | metric | box | bar-chart | area-chart | comparison-table | timeline | callout | quote",
      "colSpan": 4 | 6 | 12,
      "badge": "BADGE",
      "title": "Widget Title",
      "subtitle": "Optional subtitle",
      "content": "Concise body text",
      "value": "$42.8M",
      "delta": "+118% YoY",
      "columns": ["Dimension", "Chronicle", "Legacy"],
      "rows": [["Speed", "45s", "4 hrs"]],
      "items": [{"id": "i1", "label": "Q1", "value": "84", "description": "Milestone detail", "accent": "#8b5cf6"}]
    }
  ]
}
Ensure every slide has 3 to 4 rich widgets whose colSpan sums to 12 (or 12 + 4 + 4 + 4). Use realistic domain numbers and concrete insights for "${prompt}".`,
    JSON.stringify({ prompt, outline: outline.slice(0, 8) }),
    { slides: fallbackSlides },
    4000
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
      authorId: body.userId || DEFAULT_USER_ID,
      title: prompt.slice(0, 90),
      scope: "WORKSPACE",
      isPublic: true,
      brandKitId: body.brandKitId || "bk-google",
      themeId: body.themeId || "3929be33-c2d9-4ff4-a81c-a4d2ff3ee3a0",
      previewUrl:
        "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg",
      slidesJson: JSON.stringify(slides)
    }
  });

  if (body.sessionId) {
    await prisma.museChatSession
      .update({
        where: { id: body.sessionId },
        data: {
          documentId: doc.id
        }
      })
      .catch(() => null);
  }

  await prisma.workspace
    .update({
      where: { id: workspaceId },
      data: { tokensUsed: { increment: 25 } }
    })
    .catch(() => null);

  return NextResponse.json({
    document: {
      ...doc,
      slides
    },
    aiProvider: aiDeck.provider,
    aiModel: aiDeck.model
  });
}

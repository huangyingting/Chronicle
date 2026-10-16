import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_USER_ID,
  DEFAULT_WORKSPACE_ID,
  generateSlidesFromOutline,
  generateStorylineOutline
} from "@/lib/seed-data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const workspaceId = body.workspaceId || DEFAULT_WORKSPACE_ID;
  const prompt = (body.prompt || body.title || "AI Strategic Presentation").trim();
  const outline =
    Array.isArray(body.outline) && body.outline.length > 0
      ? body.outline
      : generateStorylineOutline(prompt, Number(body.slideCount || 6), body.tone || "Executive");

  const slides = generateSlidesFromOutline(prompt, outline);

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
    await prisma.museChatSession.update({
      where: { id: body.sessionId },
      data: {
        documentId: doc.id
      }
    });
  }

  // Increment workspace AI token usage
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
    }
  });
}

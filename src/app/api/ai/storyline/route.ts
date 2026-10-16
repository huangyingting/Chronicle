import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_USER_ID,
  DEFAULT_WORKSPACE_ID,
  generateStorylineOutline
} from "@/lib/seed-data";

function formatSession(session: any) {
  const rawOutline = JSON.parse(session.outlineJson || "[]");
  const storyline = rawOutline.map((item: any, idx: number) => ({
    id: item.id || `outline-${idx + 1}`,
    sectionGroup: item.sectionGroup || `0${idx + 1}`,
    sectionNumber: item.sectionNumber || String(idx + 1).padStart(2, "0"),
    title: item.title || "Strategic Section",
    summary: item.summary || "",
    suggestedLayout: item.suggestedLayout || "bento-3",
    suggestedWidgets: item.suggestedWidgets || ["heading", "metric", "box"],
    bullets: item.bullets || item.keyPoints || [
      "Core strategic takeaway",
      "Supporting metric & operational evidence"
    ]
  }));

  return {
    ...session,
    title: session.name,
    tone: session.style,
    messages: JSON.parse(session.messagesJson || "[]"),
    storyline
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const workspaceId = searchParams.get("workspaceId") || DEFAULT_WORKSPACE_ID;

  if (sessionId) {
    const session = await prisma.museChatSession.findUnique({
      where: { id: sessionId }
    });
    if (!session) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ session: formatSession(session) });
  }

  const sessions = await prisma.museChatSession.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({
    sessions: sessions.map(formatSession)
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prompt = (
    body.prompt || "Series B Investor Pitch Deck for Autonomous AI Infrastructure"
  ).trim();
  const slideCount = Number(body.slideCount || 6);
  const tone = body.tone || "Midnight";
  const category = body.category || "Pitch Deck";
  const workspaceId = body.workspaceId || DEFAULT_WORKSPACE_ID;

  const storyline = generateStorylineOutline(prompt, slideCount, category);

  const messages = [
    {
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString()
    },
    {
      role: "assistant",
      content: `I've structured a ${storyline.length}-slide storyline for "${prompt}". Review or reorder the sections below, then click "Generate Presentation" to build the full slide deck with smart widgets and brand kit styling.`,
      timestamp: new Date().toISOString()
    }
  ];

  const session = await prisma.museChatSession.create({
    data: {
      workspaceId,
      userId: body.userId || DEFAULT_USER_ID,
      name: prompt.slice(0, 80),
      prompt,
      style: tone,
      slideCount,
      messagesJson: JSON.stringify(messages),
      outlineJson: JSON.stringify(storyline)
    }
  });

  return NextResponse.json({
    session: formatSession(session)
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const session = await prisma.museChatSession.update({
    where: { id: body.sessionId },
    data: {
      ...(body.storyline
        ? { outlineJson: JSON.stringify(body.storyline) }
        : {}),
      ...(body.messages
        ? { messagesJson: JSON.stringify(body.messages) }
        : {}),
      ...(body.title ? { name: body.title } : {})
    }
  });

  return NextResponse.json({
    session: formatSession(session)
  });
}

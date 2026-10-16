import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_USER_ID,
  DEFAULT_WORKSPACE_ID,
  generateStorylineOutline
} from "@/lib/seed-data";
import { callAzureOpenAiJson } from "@/lib/production-engine/ai-provider";

function formatSession(session: any, extra?: Record<string, any>) {
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
    storyline,
    ...extra
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
    sessions: sessions.map((s) => formatSession(s))
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prompt = (
    body.prompt || "Series B Investor Pitch Deck for Autonomous AI Infrastructure"
  ).trim();
  const slideCount = Math.min(12, Math.max(3, Number(body.slideCount || 6)));
  const tone = body.tone || "Midnight";
  const category = body.category || "Pitch Deck";
  const workspaceId = body.workspaceId || DEFAULT_WORKSPACE_ID;

  const fallbackOutline = generateStorylineOutline(prompt, slideCount, category);

  const aiResult = await callAzureOpenAiJson<{
    assistantMessage: string;
    sections: Array<{
      id: string;
      sectionGroup: string;
      sectionNumber: string;
      title: string;
      summary: string;
      suggestedLayout: string;
      suggestedWidgets: string[];
      bullets: string[];
    }>;
  }>(
    `You are Chronicle Muse, an executive presentation storyline architect. Given a presentation prompt, slideCount (${slideCount}), tone (${tone}), and category (${category}), return JSON with:
{
  "assistantMessage": "1-2 sentence executive summary of the narrative arc you structured",
  "sections": [
    {
      "id": "outline-1",
      "sectionGroup": "01",
      "sectionNumber": "01",
      "title": "Concise Slide Headline",
      "summary": "1-sentence strategic purpose of this slide",
      "suggestedLayout": "cover | bento-3 | split | metrics-row | comparison | roadmap",
      "suggestedWidgets": ["heading", "metric", "bar-chart", "comparison-table", "timeline", "callout", "quote", "box"],
      "bullets": ["Specific domain insight or concrete KPI 1", "Specific domain insight or concrete KPI 2", "Specific domain insight 3"]
    }
  ]
}
Produce exactly ${slideCount} sections with specific, realistic domain numbers and sharp executive framing.`,
    JSON.stringify({ prompt, slideCount, tone, category }),
    {
      assistantMessage: `I've structured a ${fallbackOutline.length}-slide storyline for "${prompt}". Review or reorder the sections below, then click "Generate Presentation" to build the full slide deck.`,
      sections: fallbackOutline as any
    }
  );

  const storyline =
    Array.isArray(aiResult.data.sections) && aiResult.data.sections.length > 0
      ? aiResult.data.sections.map((sec, idx) => ({
          id: sec.id || `outline-${idx + 1}`,
          sectionGroup: sec.sectionGroup || String(idx + 1).padStart(2, "0"),
          sectionNumber: sec.sectionNumber || String(idx + 1).padStart(2, "0"),
          title: sec.title || `Section ${idx + 1}`,
          summary: sec.summary || "",
          suggestedLayout: sec.suggestedLayout || "bento-3",
          suggestedWidgets: Array.isArray(sec.suggestedWidgets)
            ? sec.suggestedWidgets
            : ["heading", "metric", "box"],
          bullets:
            Array.isArray(sec.bullets) && sec.bullets.length > 0
              ? sec.bullets
              : ["Core strategic takeaway", "Supporting operational metric"]
        }))
      : fallbackOutline;

  const messages = [
    {
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString()
    },
    {
      role: "assistant",
      content:
        aiResult.data.assistantMessage ||
        `I've structured a ${storyline.length}-slide storyline for "${prompt}". Review or reorder the sections below, then click "Generate Presentation" to build the full slide deck.`,
      timestamp: new Date().toISOString(),
      aiProvider: aiResult.provider,
      aiModel: aiResult.model
    }
  ];

  const session = await prisma.museChatSession.create({
    data: {
      workspaceId,
      userId: body.userId || DEFAULT_USER_ID,
      name: prompt.slice(0, 80),
      prompt,
      style: tone,
      slideCount: storyline.length,
      messagesJson: JSON.stringify(messages),
      outlineJson: JSON.stringify(storyline)
    }
  });

  return NextResponse.json({
    session: formatSession(session, {
      aiProvider: aiResult.provider,
      aiModel: aiResult.model
    }),
    aiProvider: aiResult.provider,
    aiModel: aiResult.model
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const existing = await prisma.museChatSession.findUnique({
    where: { id: body.sessionId }
  });
  if (!existing) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let nextOutline = body.storyline
    ? body.storyline
    : JSON.parse(existing.outlineJson || "[]");
  let nextMessages = body.messages
    ? body.messages
    : JSON.parse(existing.messagesJson || "[]");
  let aiProvider: "azure-openai" | "fallback" = "fallback";
  let aiModel = "local";

  if (body.userInstruction) {
    const instruction = String(body.userInstruction).trim();
    const aiUpdate = await callAzureOpenAiJson<{
      reply: string;
      sections: any[];
    }>(
      "You are Chronicle Muse. Update the presentation storyline outline according to the user's instruction. Return JSON {\"reply\": \"1-2 sentence explanation\", \"sections\": [...] } preserving the section fields (id, sectionGroup, sectionNumber, title, summary, suggestedLayout, suggestedWidgets, bullets).",
      JSON.stringify({
        instruction,
        currentSections: nextOutline
      }),
      {
        reply: `Updated the storyline outline to incorporate: "${instruction}".`,
        sections: nextOutline
      }
    );
    aiProvider = aiUpdate.provider;
    aiModel = aiUpdate.model;
    if (Array.isArray(aiUpdate.data.sections) && aiUpdate.data.sections.length > 0) {
      nextOutline = aiUpdate.data.sections;
    }
    nextMessages = [
      ...nextMessages,
      { role: "user", content: instruction, timestamp: new Date().toISOString() },
      {
        role: "assistant",
        content: aiUpdate.data.reply,
        timestamp: new Date().toISOString(),
        aiProvider,
        aiModel
      }
    ];
  }

  const session = await prisma.museChatSession.update({
    where: { id: body.sessionId },
    data: {
      outlineJson: JSON.stringify(nextOutline),
      messagesJson: JSON.stringify(nextMessages),
      ...(body.title ? { name: body.title } : {})
    }
  });

  return NextResponse.json({
    session: formatSession(session, { aiProvider, aiModel }),
    aiProvider,
    aiModel
  });
}

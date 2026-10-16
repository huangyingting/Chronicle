import { NextRequest, NextResponse } from "next/server";
import { SlideSection } from "@/lib/types";
import { callAzureOpenAiJson } from "@/lib/production-engine/ai-provider";
import { prisma } from "@/lib/prisma";

function buildDeterministicFallback(
  slide: SlideSection,
  action: string,
  prompt: string
): SlideSection {
  const updatedSlide: SlideSection = JSON.parse(JSON.stringify(slide));

  if (
    action === "executive" ||
    prompt.toLowerCase().includes("executive") ||
    prompt.toLowerCase().includes("concise")
  ) {
    updatedSlide.eyebrow = "EXECUTIVE SUMMARY";
    updatedSlide.widgets = updatedSlide.widgets.map((w) => ({
      ...w,
      title: w.title ? w.title.replace(/\.$/, "") : w.title,
      subtitle: w.subtitle
        ? `Key takeaway: ${w.subtitle.split(".")[0]}.`
        : w.subtitle,
      content: w.content
        ? `${w.content.split(".")[0]} — prioritized for board-level impact.`
        : w.content
    }));
  } else if (
    action === "metrics" ||
    prompt.toLowerCase().includes("metric") ||
    prompt.toLowerCase().includes("kpi")
  ) {
    updatedSlide.widgets.push({
      id: `muse-kpi-${Date.now().toString(36)}`,
      type: "metric",
      colSpan: 4,
      badge: "AI BENCHMARK",
      value: "4.6x",
      delta: "+142% YoY",
      title: "Net Efficiency Multiplier",
      content: "Synthesized by Chronicle Muse from slide context"
    });
  } else if (
    action === "timeline" ||
    prompt.toLowerCase().includes("roadmap") ||
    prompt.toLowerCase().includes("timeline")
  ) {
    updatedSlide.widgets.push({
      id: `muse-timeline-${Date.now().toString(36)}`,
      type: "timeline",
      colSpan: 12,
      badge: "EXECUTION ROADMAP",
      title: "Phased Rollout Plan",
      items: [
        {
          id: "m1",
          label: "Phase 1 • Weeks 1-4",
          value: "Architecture & Pilot",
          description: "Deploy core workflow with design partners",
          accent: "#8b5cf6"
        },
        {
          id: "m2",
          label: "Phase 2 • Weeks 5-8",
          value: "Enterprise Scale",
          description: "Automated brand governance & SOC2 controls",
          accent: "#3b82f6"
        },
        {
          id: "m3",
          label: "Phase 3 • Weeks 9-12",
          value: "Global Expansion",
          description: "Self-serve API & MCP agent orchestration",
          accent: "#10b981"
        }
      ]
    });
  } else if (
    action === "comparison" ||
    prompt.toLowerCase().includes("compare")
  ) {
    updatedSlide.widgets.push({
      id: `muse-cmp-${Date.now().toString(36)}`,
      type: "comparison-table",
      colSpan: 12,
      badge: "COMPETITIVE ADVANTAGE",
      title: "Strategic Differentiation Matrix",
      columns: ["Dimension", "Chronicle Studio", "Legacy Deck Tools"],
      rows: [
        ["Time to First Draft", "< 45 seconds", "4-6 hours"],
        ["Brand Governance", "Automatic Brand Kit tokens", "Manual formatting"],
        ["Interactive Widgets", "34+ responsive blocks", "Static text boxes"]
      ]
    });
  } else {
    updatedSlide.subtitle = prompt
      ? `Enhanced by Muse: ${prompt}`
      : `${updatedSlide.subtitle || ""} (Refined by Muse AI)`.trim();
    if (updatedSlide.widgets.length > 0) {
      updatedSlide.widgets[0] = {
        ...updatedSlide.widgets[0],
        subtitle: prompt
          ? `${updatedSlide.widgets[0].subtitle || ""} • ${prompt}`.trim()
          : updatedSlide.widgets[0].subtitle
      };
    }
  }
  return updatedSlide;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const action = body.action || "rewrite";
  const prompt = (body.prompt || "").trim();
  const slide: SlideSection = body.slide;

  if (!slide) {
    return NextResponse.json({ error: "Missing slide" }, { status: 400 });
  }

  const fallbackSlide = buildDeterministicFallback(slide, action, prompt);

  const aiResult = await callAzureOpenAiJson<{
    slide: SlideSection;
    message: string;
  }>(
    `You are Chronicle Muse AI Copilot embedded inside a 16:9 slide editor.
Given the current slide JSON, an action ("${action}"), and user prompt ("${prompt}"), return JSON:
{
  "message": "Concise 1-sentence summary of what you updated on the slide",
  "slide": { ...updated slide object preserving id, background, layoutVariant, and updating/adding widgets... }
}
Supported widget types: "heading", "metric", "box", "bar-chart", "area-chart", "pie-chart", "comparison-table", "timeline", "callout", "quote", "stat-pill".`,
    JSON.stringify({ action, prompt, currentSlide: slide }),
    {
      slide: fallbackSlide,
      message: `Muse applied "${prompt || action}" to "${fallbackSlide.title}".`
    }
  );

  const finalSlide: SlideSection =
    aiResult.data?.slide && Array.isArray(aiResult.data.slide.widgets)
      ? {
          ...slide,
          ...aiResult.data.slide,
          id: slide.id
        }
      : fallbackSlide;

  if (body.documentId) {
    const doc = await prisma.document
      .findUnique({ where: { id: body.documentId } })
      .catch(() => null);
    if (doc) {
      const allSlides: SlideSection[] = JSON.parse(doc.slidesJson || "[]");
      const nextSlides = allSlides.map((s) =>
        s.id === finalSlide.id ? finalSlide : s
      );
      await prisma.document
        .update({
          where: { id: doc.id },
          data: { slidesJson: JSON.stringify(nextSlides) }
        })
        .catch(() => null);
    }
  }

  return NextResponse.json({
    slide: finalSlide,
    message:
      aiResult.data?.message ||
      `Muse applied "${prompt || action}" to "${finalSlide.title}".`,
    aiProvider: aiResult.provider,
    aiModel: aiResult.model
  });
}

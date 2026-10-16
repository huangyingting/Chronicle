import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") || DEFAULT_WORKSPACE_ID;

  const themes = await prisma.theme.findMany({
    where: {
      OR: [{ isDefault: true }, { workspaceId }]
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }]
  });

  return NextResponse.json({
    themes: themes.map((t) => {
      const parsed = JSON.parse(t.dataJson || "{}");
      return {
        ...t,
        displayName: parsed.displayName || t.name,
        themeJson: parsed.theme || parsed
      };
    })
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const baseTheme = await prisma.theme.findFirst({ where: { isDefault: true } });
  const baseJson = baseTheme ? JSON.parse(baseTheme.dataJson) : {};
  const innerTheme = baseJson.theme || baseJson;
  const customJson = {
    ...innerTheme,
    colors: {
      ...(innerTheme.colors || {}),
      background: {
        ...(innerTheme.colors?.background || {}),
        default: body.backgroundColor || "#0b0b10"
      },
      accent: {
        ...(innerTheme.colors?.accent || {}),
        default: body.accentColor || "#8b5cf6"
      }
    }
  };

  const created = await prisma.theme.create({
    data: {
      workspaceId: body.workspaceId || DEFAULT_WORKSPACE_ID,
      name: (body.name || "Custom Theme").trim(),
      isCustom: true,
      isDefault: false,
      dataJson: JSON.stringify(customJson)
    }
  });

  return NextResponse.json({
    theme: {
      ...created,
      displayName: created.name,
      themeJson: customJson
    }
  });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_USER_ID, DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const operationName = body.operationName || "";

  if (operationName === "GetDefaultThemes" || operationName === "GetThemes") {
    const themes = await prisma.theme.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }]
    });
    return NextResponse.json({
      data: {
        getDefaultThemes: themes.map((t, idx) => {
          const parsed = JSON.parse(t.dataJson || "{}");
          return {
            id: t.id,
            name: t.name,
            displayName: parsed.displayName || t.name,
            order: idx,
            theme: parsed.theme || parsed
          };
        })
      }
    });
  }

  if (operationName === "GetDefaultBrandKits") {
    const kits = await prisma.brandKit.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    });
    return NextResponse.json({
      data: {
        getDefaultBrandKits: kits.map((k) => ({
          id: k.id,
          name: k.name,
          logos: JSON.parse(k.logosJson || "[]"),
          colors: JSON.parse(k.colorsJson || "[]")
        }))
      }
    });
  }

  const workspace = await prisma.workspace.findFirst({
    where: { id: DEFAULT_WORKSPACE_ID },
    include: { members: { include: { user: true } } }
  });
  const user = await prisma.user.findFirst({ where: { id: DEFAULT_USER_ID } });
  const documents = await prisma.document.findMany({
    where: { workspaceId: DEFAULT_WORKSPACE_ID, deletedAt: null },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({
    data: {
      operationName,
      currentUser: user,
      workspace,
      documents
    }
  });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_USER_ID } from "@/lib/seed-data";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await context.params;
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: { include: { user: true } },
      apiKeys: { where: { revokedAt: null }, include: { user: true }, orderBy: { createdAt: "desc" } },
      customFonts: true
    }
  });
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }
  return NextResponse.json({ workspace });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await context.params;
  const body = await req.json();

  if (body.action === "inviteMember") {
    const email = (body.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          fullName: email.split("@")[0],
          onboardingStatus: "COMPLETED"
        }
      });
    }
    await prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId, userId: user.id } },
      update: { role: body.role || "MEMBER" },
      create: { workspaceId, userId: user.id, role: body.role || "MEMBER" }
    });
  } else if (body.action === "createApiKey") {
    const rawKey = `chr_live_${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 8)}`;
    const suffix = rawKey.slice(-4);
    const apiKey = await prisma.apiKey.create({
      data: {
        workspaceId,
        userId: body.userId || DEFAULT_USER_ID,
        name: body.name || "Agent MCP Key",
        maskedKey: `chr_live_••••••••••••${suffix}`,
        rawKeyHash: rawKey,
        lastUsedAt: new Date()
      },
      include: { user: true }
    });
    return NextResponse.json({ apiKey, rawKey });
  } else if (body.action === "revokeApiKey") {
    await prisma.apiKey.update({
      where: { id: body.keyId },
      data: { revokedAt: new Date() }
    });
  } else if (body.action === "topUpTokens") {
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { tokensLimit: { increment: Number(body.amount || 500) } }
    });
  } else {
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.icon !== undefined ? { icon: body.icon } : {}),
        ...(body.defaultThemeId ? { defaultThemeId: body.defaultThemeId } : {}),
        ...(body.pricingPlanId ? { pricingPlanId: body.pricingPlanId } : {})
      }
    });
  }

  const updated = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: { include: { user: true } },
      apiKeys: { where: { revokedAt: null }, include: { user: true }, orderBy: { createdAt: "desc" } },
      customFonts: true
    }
  });
  return NextResponse.json({ workspace: updated });
}

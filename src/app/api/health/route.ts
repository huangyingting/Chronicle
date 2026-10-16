import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAzureOpenAiConfig } from "@/lib/production-engine/ai-provider";
import { accountAdmissionMode } from "@/lib/account-admission";

export async function GET() {
  const [users, workspaces, documents, themes, brandKits, templates, invitations] =
    await Promise.all([
      prisma.user.count(),
      prisma.workspace.count(),
      prisma.document.count({ where: { deletedAt: null } }),
      prisma.theme.count(),
      prisma.brandKit.count(),
      prisma.template.count(),
      prisma.accountInvitation.count()
    ]);

  const azureCfg = getAzureOpenAiConfig();

  return NextResponse.json({
    ok: true,
    service: "Chronicle Studio Production Engine",
    version: "2.0.0",
    database: {
      status: "connected",
      counts: {
        users,
        workspaces,
        documents,
        themes,
        brandKits,
        templates,
        invitations
      }
    },
    admissionMode: accountAdmissionMode(),
    azureOpenAi: {
      configured: Boolean(azureCfg),
      deployment: azureCfg?.deployment || null,
      apiVersion: azureCfg?.apiVersion || null
    },
    endpoints: [
      "GET  /api/health",
      "POST /api/auth/[...nextauth]",
      "GET  /api/auth/invitation",
      "POST /api/auth/register",
      "POST /api/auth/password/login",
      "POST /api/auth/password/forgot",
      "POST /api/auth/password/reset",
      "POST /api/auth/logout",
      "GET  /api/admin/invitations",
      "POST /api/admin/invitations",
      "DELETE /api/admin/invitations/[id]",
      "POST /api/admin/invitations/[id]/rotate",
      "GET  /api/ai/storyline",
      "POST /api/ai/storyline",
      "PATCH /api/ai/storyline",
      "POST /api/ai/generate-deck",
      "POST /api/ai/muse",
      "GET  /api/v1/decks",
      "POST /api/v1/decks",
      "POST /api/graphql",
      "GET  /api/workspaces",
      "POST /api/workspaces",
      "GET  /api/workspaces/[workspaceId]",
      "PATCH /api/workspaces/[workspaceId]",
      "GET  /api/documents",
      "POST /api/documents",
      "GET  /api/documents/[documentId]",
      "PATCH /api/documents/[documentId]",
      "DELETE /api/documents/[documentId]",
      "POST /api/documents/[documentId]/export",
      "GET  /api/folders",
      "POST /api/folders",
      "PATCH /api/folders/[folderId]",
      "DELETE /api/folders/[folderId]",
      "GET  /api/brand-kits",
      "POST /api/brand-kits",
      "DELETE /api/brand-kits",
      "GET  /api/themes",
      "POST /api/themes",
      "GET  /api/templates",
      "POST /api/templates",
      "GET  /api/media",
      "POST /api/media",
      "DELETE /api/media",
      "POST /api/uploads"
    ]
  });
}

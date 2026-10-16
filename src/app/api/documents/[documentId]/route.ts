import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await context.params;
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      folder: true,
      author: true,
      workspace: true
    }
  });
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
  return NextResponse.json({
    document: {
      ...document,
      slides: JSON.parse(document.slidesJson || "[]"),
      collaborators: JSON.parse(document.collaboratorsJson || "[]")
    }
  });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await context.params;
  const body = await req.json();

  if (body.action === "duplicate") {
    const existing = await prisma.document.findUnique({ where: { id: documentId } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const copy = await prisma.document.create({
      data: {
        workspaceId: body.workspaceId || existing.workspaceId,
        authorId: existing.authorId,
        folderId: existing.folderId,
        title: `${existing.title} (Copy)`,
        scope: existing.scope,
        workspaceAccess: existing.workspaceAccess,
        isPublic: existing.isPublic,
        themeId: existing.themeId,
        brandKitId: existing.brandKitId,
        previewUrl: existing.previewUrl,
        slidesJson: existing.slidesJson
      }
    });
    return NextResponse.json({ document: copy });
  }

  if (body.action === "softDelete") {
    const doc = await prisma.document.update({
      where: { id: documentId },
      data: {
        deletedAt: new Date(),
        deletedBy: body.deletedBy || "Alex Rivera"
      }
    });
    return NextResponse.json({ document: doc });
  }

  if (body.action === "restore") {
    const doc = await prisma.document.update({
      where: { id: documentId },
      data: {
        deletedAt: null,
        deletedBy: null
      }
    });
    return NextResponse.json({ document: doc });
  }

  const updateData: Record<string, any> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.folderId !== undefined) updateData.folderId = body.folderId;
  if (body.scope !== undefined) updateData.scope = body.scope;
  if (body.workspaceAccess !== undefined) updateData.workspaceAccess = body.workspaceAccess;
  if (body.isPublic !== undefined) updateData.isPublic = Boolean(body.isPublic);
  if (body.isPublicDocumentDuplicationEnabled !== undefined) {
    updateData.isPublicDocumentDuplicationEnabled = Boolean(body.isPublicDocumentDuplicationEnabled);
  }
  if (body.showWatermark !== undefined) updateData.showWatermark = Boolean(body.showWatermark);
  if (body.themeId !== undefined) updateData.themeId = body.themeId;
  if (body.brandKitId !== undefined) updateData.brandKitId = body.brandKitId;
  if (body.previewUrl !== undefined) updateData.previewUrl = body.previewUrl;
  if (body.slides !== undefined) updateData.slidesJson = JSON.stringify(body.slides);
  if (body.collaborators !== undefined) {
    updateData.collaboratorsJson = JSON.stringify(body.collaborators);
  }

  const updated = await prisma.document.update({
    where: { id: documentId },
    data: updateData
  });

  return NextResponse.json({
    document: {
      ...updated,
      slides: JSON.parse(updated.slidesJson || "[]"),
      collaborators: JSON.parse(updated.collaboratorsJson || "[]")
    }
  });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await context.params;
  await prisma.document.delete({ where: { id: documentId } });
  return NextResponse.json({ success: true });
}

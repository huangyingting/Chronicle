import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ folderId: string }> }
) {
  const { folderId } = await context.params;
  const body = await req.json();

  const folder = await prisma.folder.update({
    where: { id: folderId },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.scope !== undefined ? { scope: body.scope } : {}),
      ...(body.isShared !== undefined ? { isShared: Boolean(body.isShared) } : {})
    },
    include: {
      documents: { where: { deletedAt: null }, select: { id: true, title: true } }
    }
  });
  return NextResponse.json({ folder });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ folderId: string }> }
) {
  const { folderId } = await context.params;
  await prisma.document.updateMany({
    where: { folderId },
    data: { folderId: null }
  });
  await prisma.folder.delete({ where: { id: folderId } });
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exportDeckToFile } from "@/lib/production-engine/deck-exporter";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await context.params;
  const body = await req.json().catch(() => ({}));
  const format = (body.format || "pdf") as "pdf" | "png" | "html";

  const doc = await prisma.document.findUnique({
    where: { id: documentId }
  });

  if (!doc) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  const exported = await exportDeckToFile(doc, format);

  return NextResponse.json({
    ok: true,
    documentId: doc.id,
    title: doc.title,
    ...exported
  });
}

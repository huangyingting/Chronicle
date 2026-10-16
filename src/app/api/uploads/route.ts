import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import { prisma } from "@/lib/prisma";
import { DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const uploadDir = path.join(process.cwd(), "public", "uploads", "files");
    fs.mkdirSync(uploadDir, { recursive: true });

    let fileName = "";
    let fileUrl = "";
    let size = 0;
    let workspaceId = DEFAULT_WORKSPACE_ID;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const wsField = formData.get("workspaceId");
      if (typeof wsField === "string" && wsField.trim()) {
        workspaceId = wsField.trim();
      }
      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = (file.name || "upload.png").replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      fileName = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/files/${fileName}`;
      size = buffer.length;
    } else {
      const body = await request.json();
      workspaceId = body.workspaceId || DEFAULT_WORKSPACE_ID;
      const dataUrl: string = body.dataUrl || "";
      const rawName: string = body.fileName || "upload.png";
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json(
          { error: "Invalid dataUrl payload" },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(match[2], "base64");
      const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, "_");
      fileName = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/files/${fileName}`;
      size = buffer.length;
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        workspaceId,
        fileName,
        url: fileUrl,
        type: "IMAGE",
        source: "UPLOAD",
        mediaAccess: "WORKSPACE"
      }
    });

    return NextResponse.json({
      ok: true,
      url: fileUrl,
      fileName,
      size,
      asset
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "File upload failed" },
      { status: 500 }
    );
  }
}

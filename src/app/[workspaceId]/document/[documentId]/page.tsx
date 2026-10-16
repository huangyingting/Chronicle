"use client";

import React, { use } from "react";
import { SlideEditorStudio } from "@/components/editor/SlideEditorStudio";

export default function DocumentEditorPage({
  params
}: {
  params: Promise<{ workspaceId: string; documentId: string }>;
}) {
  const { workspaceId, documentId } = use(params);
  return (
    <SlideEditorStudio
      workspaceId={workspaceId}
      documentId={documentId}
    />
  );
}

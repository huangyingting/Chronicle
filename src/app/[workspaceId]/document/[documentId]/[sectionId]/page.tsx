"use client";

import React, { use } from "react";
import { SlideEditorStudio } from "@/components/editor/SlideEditorStudio";

export default function DocumentSectionEditorPage({
  params
}: {
  params: Promise<{
    workspaceId: string;
    documentId: string;
    sectionId: string;
  }>;
}) {
  const { workspaceId, documentId, sectionId } = use(params);
  return (
    <SlideEditorStudio
      workspaceId={workspaceId}
      documentId={documentId}
      initialSectionId={sectionId}
    />
  );
}

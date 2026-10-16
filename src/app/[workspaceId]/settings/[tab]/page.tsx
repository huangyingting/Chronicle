"use client";

import React, { use } from "react";
import WorkspaceHomePage from "@/app/[workspaceId]/home/page";

export default function SettingsRoutePage({
  params
}: {
  params: Promise<{ workspaceId: string; tab: string }>;
}) {
  const { workspaceId } = use(params);
  return <WorkspaceHomePage params={Promise.resolve({ workspaceId })} />;
}

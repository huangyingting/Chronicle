import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_WORKSPACE_ID } from "@/lib/seed-data";
import { crawlWebsiteBrandKit } from "@/lib/production-engine/live-crawler";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") || DEFAULT_WORKSPACE_ID;

  const brandKits = await prisma.brandKit.findMany({
    where: {
      OR: [{ isDefault: true }, { workspaceId }]
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });

  const customFonts = await prisma.customFont.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    brandKits: brandKits.map((bk) => {
      const logos = JSON.parse(bk.logosJson || "[]");
      return {
        ...bk,
        domain: `${bk.name.toLowerCase().replace(/\s+/g, "")}.com`,
        logoLightUrl:
          logos[0]?.url ||
          `https://www.google.com/s2/favicons?domain=${bk.name.toLowerCase()}.com&sz=128`,
        colors: JSON.parse(bk.colorsJson || "[]"),
        fonts: JSON.parse(bk.fontsJson || "{}")
      };
    }),
    customFonts
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.action === "uploadFont") {
    const font = await prisma.customFont.create({
      data: {
        workspaceId: body.workspaceId || DEFAULT_WORKSPACE_ID,
        name: (body.name || "Custom Display Sans").trim(),
        family: (body.family || body.name || "Custom Display Sans").trim(),
        weight: body.weight || "400-700",
        url: body.fileUrl || "/fonts/custom.woff2"
      }
    });
    return NextResponse.json({ customFont: font });
  }

  const rawDomain = body.domain || "chroniclehq.com";
  const crawled = await crawlWebsiteBrandKit(
    rawDomain,
    body.primaryColor || "#8B5CF6",
    body.secondaryColor || "#3B82F6"
  );

  const name = body.name || crawled.name;
  const logoUrl = body.logoLightUrl || crawled.logoUrl;

  const brandKit = await prisma.brandKit.create({
    data: {
      workspaceId: body.workspaceId || DEFAULT_WORKSPACE_ID,
      name,
      isDefault: false,
      logosJson: JSON.stringify([
        { name: "Primary Logo", url: logoUrl },
        ...(crawled.screenshotUrl
          ? [{ name: "Website Snapshot", url: crawled.screenshotUrl }]
          : [])
      ]),
      themesJson: JSON.stringify([]),
      colorsJson: JSON.stringify(body.colors || crawled.colors),
      fontsJson: JSON.stringify({
        heading: body.headingFont || crawled.fonts.heading || "Labil Grotesk",
        body: body.bodyFont || crawled.fonts.body || "Inter"
      })
    }
  });

  return NextResponse.json({
    brandKit: {
      ...brandKit,
      domain: crawled.domain,
      logoLightUrl: logoUrl,
      screenshotUrl: crawled.screenshotUrl,
      crawledLive: crawled.crawledLive,
      colors: JSON.parse(brandKit.colorsJson),
      fonts: JSON.parse(brandKit.fontsJson)
    }
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await prisma.brandKit.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

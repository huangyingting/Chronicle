import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright";

export interface BrandKitCrawlResult {
  domain: string;
  url: string;
  name: string;
  description: string;
  logoUrl: string;
  screenshotUrl: string | null;
  colors: Array<{ name: string; hex: string }>;
  fonts: {
    heading: string;
    body: string;
  };
  crawledLive: boolean;
}

export async function crawlWebsiteBrandKit(
  rawDomainOrUrl: string,
  fallbackPrimary = "#8B5CF6",
  fallbackSecondary = "#3B82F6"
): Promise<BrandKitCrawlResult> {
  const cleaned = (rawDomainOrUrl || "chroniclehq.com").trim();
  const normalizedUrl = /^https?:\/\//i.test(cleaned)
    ? cleaned
    : `https://${cleaned}`;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalizedUrl);
  } catch {
    parsedUrl = new URL("https://chroniclehq.com");
  }

  const domain = parsedUrl.hostname.replace(/^www\./, "");
  const slug = domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const defaultName = domain
    .split(".")[0]
    .replace(/^\w/, (c) => c.toUpperCase());

  const capturesDir = path.join(process.cwd(), "public", "uploads", "captures");
  fs.mkdirSync(capturesDir, { recursive: true });

  let browser = null;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    });
    const page = await context.newPage();
    await page.goto(parsedUrl.toString(), {
      waitUntil: "domcontentloaded",
      timeout: 12000
    });
    await page.waitForTimeout(500);

    const fileName = `brand-${slug}-${Date.now()}.png`;
    const filePath = path.join(capturesDir, fileName);
    await page.screenshot({ path: filePath }).catch(() => null);

    const extracted = await page.evaluate(() => {
      function rgbToHex(rgb: string): string | null {
        const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (!m) return null;
        const r = Number(m[1]);
        const g = Number(m[2]);
        const b = Number(m[3]);
        return (
          "#" +
          [r, g, b]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase()
        );
      }

      const rawTitle =
        document
          .querySelector('meta[property="og:site_name"]')
          ?.getAttribute("content")
          ?.trim() ||
        document.title?.split(/[|\-–—]/)[0]?.trim() ||
        window.location.hostname;

      const description =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content")
          ?.trim() || "";

      const iconHref =
        document
          .querySelector('link[rel="apple-touch-icon"]')
          ?.getAttribute("href") ||
        document.querySelector('link[rel*="icon"]')?.getAttribute("href") ||
        "";

      let resolvedLogo = "";
      if (iconHref) {
        try {
          resolvedLogo = new URL(iconHref, window.location.href).toString();
        } catch {
          resolvedLogo = "";
        }
      }

      const colorCounts = new Map<string, number>();
      const elements = Array.from(
        document.querySelectorAll("a, button, h1, h2, header, nav, [class*='btn']")
      ).slice(0, 80);

      for (const el of elements) {
        const st = window.getComputedStyle(el);
        for (const prop of [st.backgroundColor, st.color]) {
          const hex = rgbToHex(prop);
          if (
            hex &&
            ![
              "#000000",
              "#FFFFFF",
              "#F8FAFC",
              "#111827",
              "#0B0B10",
              "#333333"
            ].includes(hex)
          ) {
            colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
          }
        }
      }

      const topHexes = Array.from(colorCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([hex]) => hex);

      const h1 = document.querySelector("h1, h2");
      const headingFont = h1
        ? window
            .getComputedStyle(h1)
            .fontFamily.split(",")[0]
            .replace(/['"]/g, "")
            .trim()
        : "Labil Grotesk";
      const bodyFont = window
        .getComputedStyle(document.body)
        .fontFamily.split(",")[0]
        .replace(/['"]/g, "")
        .trim();

      return {
        rawTitle,
        description,
        resolvedLogo,
        topHexes,
        headingFont: headingFont || "Labil Grotesk",
        bodyFont: bodyFont || "Inter"
      };
    });

    const colors = [
      { name: "Primary", hex: extracted.topHexes[0] || fallbackPrimary },
      { name: "Secondary", hex: extracted.topHexes[1] || fallbackSecondary },
      { name: "Accent", hex: extracted.topHexes[2] || "#10B981" },
      { name: "Surface Dark", hex: "#0B0B10" }
    ];

    return {
      domain,
      url: parsedUrl.toString(),
      name: extracted.rawTitle.slice(0, 40) || defaultName,
      description: extracted.description,
      logoUrl:
        extracted.resolvedLogo ||
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      screenshotUrl: fs.existsSync(filePath)
        ? `/uploads/captures/${fileName}`
        : null,
      colors,
      fonts: {
        heading: extracted.headingFont,
        body: extracted.bodyFont
      },
      crawledLive: true
    };
  } catch {
    return {
      domain,
      url: parsedUrl.toString(),
      name: defaultName,
      description: `Brand identity tokens for ${domain}`,
      logoUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      screenshotUrl: null,
      colors: [
        { name: "Primary", hex: fallbackPrimary },
        { name: "Secondary", hex: fallbackSecondary },
        { name: "Surface Dark", hex: "#0B0B10" },
        { name: "Surface Light", hex: "#F8FAFC" }
      ],
      fonts: {
        heading: "Labil Grotesk",
        body: "Inter"
      },
      crawledLive: false
    };
  } finally {
    if (browser) await browser.close();
  }
}

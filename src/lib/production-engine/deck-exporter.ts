import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright";
import { SlideSection } from "@/lib/types";

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function escapeHtml(value: string): string {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDeckHtml(title: string, slides: SlideSection[]): string {
  const slidePages = slides
    .map((slide, idx) => {
      const bg =
        slide.background?.gradient ||
        slide.background?.color ||
        "linear-gradient(135deg, #0b0b10 0%, #141424 100%)";

      const widgetsHtml = (slide.widgets || [])
        .map((w) => {
          const span = Math.min(12, Math.max(3, Number(w.colSpan || 6)));
          let inner = "";
          if (w.type === "metric" || w.type === "numbers") {
            inner = `
              <div class="w-badge">${escapeHtml(w.badge || "METRIC")}</div>
              <div class="w-metric">${escapeHtml(w.value || "4.2x")}</div>
              ${w.delta ? `<div class="w-delta">${escapeHtml(w.delta)}</div>` : ""}
              <div class="w-title">${escapeHtml(w.title || "")}</div>
              <div class="w-body">${escapeHtml(w.content || w.subtitle || "")}</div>
            `;
          } else if (w.type === "comparison-table" && Array.isArray(w.rows)) {
            const headers = (w.columns || ["Dimension", "Chronicle", "Legacy"])
              .map((c) => `<th>${escapeHtml(c)}</th>`)
              .join("");
            const rows = w.rows
              .map(
                (r) =>
                  `<tr>${r.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
              )
              .join("");
            inner = `
              <div class="w-badge">${escapeHtml(w.badge || "COMPARISON")}</div>
              <div class="w-title">${escapeHtml(w.title || "Comparison Matrix")}</div>
              <table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>
            `;
          } else if (Array.isArray(w.items) && w.items.length > 0) {
            const items = w.items
              .slice(0, 4)
              .map(
                (it) => `
                <div class="w-item">
                  <div class="w-item-lbl">${escapeHtml(it.label || "")}</div>
                  <div class="w-item-val">${escapeHtml(String(it.value || ""))}</div>
                  ${it.description ? `<div class="w-item-desc">${escapeHtml(it.description)}</div>` : ""}
                </div>`
              )
              .join("");
            inner = `
              <div class="w-badge">${escapeHtml(w.badge || w.type.toUpperCase())}</div>
              <div class="w-title">${escapeHtml(w.title || "")}</div>
              <div class="w-items">${items}</div>
            `;
          } else {
            inner = `
              ${w.badge ? `<div class="w-badge">${escapeHtml(w.badge)}</div>` : ""}
              ${w.title ? `<div class="w-title">${escapeHtml(w.title)}</div>` : ""}
              ${w.subtitle ? `<div class="w-sub">${escapeHtml(w.subtitle)}</div>` : ""}
              ${w.content ? `<div class="w-body">${escapeHtml(w.content)}</div>` : ""}
            `;
          }

          return `<div class="widget span-${span}">${inner}</div>`;
        })
        .join("");

      return `
      <section class="slide" style="background: ${bg};">
        <div class="slide-header">
          <div>
            <div class="eyebrow">${escapeHtml(slide.eyebrow || slide.sectionGroup || `SLIDE 0${idx + 1}`)}</div>
            <h1 class="slide-title">${escapeHtml(slide.title || title)}</h1>
            ${slide.subtitle ? `<p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>` : ""}
          </div>
          <div class="slide-num">${String(idx + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}</div>
        </div>
        <div class="widgets-grid">
          ${widgetsHtml}
        </div>
        <div class="slide-footer">
          <span>${escapeHtml(title)}</span>
          <span>Made with Chronicle Studio</span>
        </div>
      </section>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: 1920px 1080px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; }
  body { background: #09090f; color: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .slide {
    width: 1920px;
    height: 1080px;
    padding: 72px 88px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    break-after: page;
    position: relative;
    overflow: hidden;
  }
  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }
  .eyebrow {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #a78bfa;
    margin-bottom: 10px;
  }
  .slide-title {
    font-size: 52px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  .slide-subtitle {
    font-size: 22px;
    color: rgba(255,255,255,0.68);
    margin-top: 8px;
  }
  .slide-num {
    font-size: 18px;
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .widgets-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px;
    align-content: start;
  }
  .widget {
    background: rgba(20, 20, 33, 0.82);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .span-3 { grid-column: span 3; }
  .span-4 { grid-column: span 4; }
  .span-6 { grid-column: span 6; }
  .span-8 { grid-column: span 8; }
  .span-12 { grid-column: span 12; }
  .w-badge {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #c4b5fd;
  }
  .w-metric {
    font-size: 54px;
    font-weight: 800;
    color: #ffffff;
  }
  .w-delta {
    font-size: 16px;
    font-weight: 600;
    color: #34d399;
  }
  .w-title {
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
  }
  .w-sub {
    font-size: 18px;
    color: rgba(255,255,255,0.75);
  }
  .w-body {
    font-size: 17px;
    line-height: 1.5;
    color: rgba(255,255,255,0.65);
  }
  .w-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
    margin-top: 8px;
  }
  .w-item {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 14px;
  }
  .w-item-lbl { font-size: 13px; color: #a78bfa; font-weight: 600; }
  .w-item-val { font-size: 18px; color: #fff; font-weight: 700; margin-top: 4px; }
  .w-item-desc { font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 16px; }
  th, td { border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 14px; text-align: left; }
  th { color: #a78bfa; font-weight: 700; }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    color: rgba(255,255,255,0.4);
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }
</style>
</head>
<body>
${slidePages}
</body>
</html>`;
}

export async function exportDeckToFile(
  document: { id: string; title: string; slidesJson: string },
  format: "pdf" | "png" | "html" = "pdf"
): Promise<{
  fileUrl: string;
  fileName: string;
  fileSize: string;
  format: "pdf" | "png" | "html";
  slideCount: number;
}> {
  const exportsDir = path.join(process.cwd(), "public", "uploads", "exports");
  fs.mkdirSync(exportsDir, { recursive: true });

  const slides: SlideSection[] = JSON.parse(document.slidesJson || "[]");
  const safeSlug = (document.title || "chronicle-deck")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

  const html = buildDeckHtml(document.title || "Chronicle Presentation", slides);
  const stamp = Date.now();

  if (format === "html") {
    const fileName = `${safeSlug}-${stamp}.html`;
    const filePath = path.join(exportsDir, fileName);
    fs.writeFileSync(filePath, html, "utf8");
    const stat = fs.statSync(filePath);
    return {
      fileUrl: `/uploads/exports/${fileName}`,
      fileName,
      fileSize: formatBytes(stat.size),
      format: "html",
      slideCount: slides.length
    };
  }

  let browser = null;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });
    await page.setContent(html, { waitUntil: "load" });

    if (format === "png") {
      const fileName = `${safeSlug}-slide1-${stamp}.png`;
      const filePath = path.join(exportsDir, fileName);
      await page.screenshot({
        path: filePath,
        clip: { x: 0, y: 0, width: 1920, height: 1080 }
      });
      const stat = fs.statSync(filePath);
      return {
        fileUrl: `/uploads/exports/${fileName}`,
        fileName,
        fileSize: formatBytes(stat.size),
        format: "png",
        slideCount: slides.length
      };
    }

    const fileName = `${safeSlug}-${stamp}.pdf`;
    const filePath = path.join(exportsDir, fileName);
    await page.pdf({
      path: filePath,
      width: "1920px",
      height: "1080px",
      printBackground: true
    });
    const stat = fs.statSync(filePath);
    return {
      fileUrl: `/uploads/exports/${fileName}`,
      fileName,
      fileSize: formatBytes(stat.size),
      format: "pdf",
      slideCount: slides.length
    };
  } finally {
    if (browser) await browser.close();
  }
}

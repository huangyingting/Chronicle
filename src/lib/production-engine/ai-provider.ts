import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright";

let envLoaded = false;

export function ensureEnvLoaded() {
  if (envLoaded) return;
  envLoaded = true;
  for (const file of [".env.local", ".env"]) {
    const p = path.join(process.cwd(), file);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const k = trimmed.slice(0, eqIdx).trim();
          const v = trimmed
            .slice(eqIdx + 1)
            .trim()
            .replace(/^['"]|['"]$/g, "");
          if (!process.env[k]) {
            process.env[k] = v;
          }
        }
      }
    }
  }
}

export function getAzureOpenAiConfig() {
  ensureEnvLoaded();
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim().replace(/\/+$/, "");
  const apiKey = process.env.AZURE_OPENAI_API_KEY?.trim();
  const deployment =
    process.env.AZURE_OPENAI_DEPLOYMENT?.trim() || "gpt-5-mini";
  const apiVersion =
    process.env.AZURE_OPENAI_API_VERSION?.trim() || "2025-01-01-preview";
  if (!endpoint || !apiKey) return null;
  return { endpoint, apiKey, deployment, apiVersion };
}

export async function callAzureOpenAiChat(
  systemPrompt: string,
  userPrompt: string,
  maxCompletionTokens = 3000
): Promise<{ ok: boolean; text: string; model: string }> {
  const cfg = getAzureOpenAiConfig();
  if (!cfg) {
    return { ok: false, text: "", model: "unconfigured" };
  }

  const url = `${cfg.endpoint}/openai/deployments/${cfg.deployment}/chat/completions?api-version=${cfg.apiVersion}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 35000);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": cfg.apiKey
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_completion_tokens: maxCompletionTokens
      }),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!res.ok) {
      return { ok: false, text: "", model: cfg.deployment };
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content?.trim() || "";
    return {
      ok: Boolean(content),
      text: content,
      model: data?.model || cfg.deployment
    };
  } catch {
    return { ok: false, text: "", model: cfg.deployment };
  }
}

export async function callAzureOpenAiJson<T>(
  systemPrompt: string,
  userPrompt: string,
  fallback: T,
  maxCompletionTokens = 3500
): Promise<{ data: T; provider: "azure-openai" | "fallback"; model: string }> {
  const res = await callAzureOpenAiChat(
    `${systemPrompt}\nRespond ONLY with valid JSON. Do not wrap in markdown code fences.`,
    userPrompt,
    maxCompletionTokens
  );
  if (!res.ok || !res.text) {
    return { data: fallback, provider: "fallback", model: res.model };
  }
  try {
    const cleaned = res.text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    return {
      data: JSON.parse(cleaned) as T,
      provider: "azure-openai",
      model: res.model
    };
  } catch {
    return { data: fallback, provider: "fallback", model: res.model };
  }
}

export async function generateSlideVisualImage(prompt: string): Promise<{
  url: string;
  fileName: string;
  colors: string[];
  provider: "azure-openai" | "playwright-studio";
  model: string;
}> {
  const genDir = path.join(process.cwd(), "public", "uploads", "generated");
  fs.mkdirSync(genDir, { recursive: true });

  const designSpec = await callAzureOpenAiJson<{
    headline: string;
    subheadline: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    badge: string;
    metricValue: string;
    metricLabel: string;
  }>(
    "You are Chronicle Studio Visual Art Director. Given an image prompt for a 16:9 presentation visual, return a JSON design specification with fields: headline (short 3-5 words), subheadline (1 concise sentence), primaryColor (hex), secondaryColor (hex), accentColor (hex), badge (2 words uppercase), metricValue (e.g. '99.98%' or '4.8x'), metricLabel (short label).",
    `Create a 16:9 presentation visual for: "${prompt}"`,
    {
      headline: prompt.slice(0, 48) || "Chronicle Visual Studio",
      subheadline: "High-contrast 16:9 presentation visual synthesized by Chronicle Muse.",
      primaryColor: "#7C5CFF",
      secondaryColor: "#0EA5E9",
      accentColor: "#10B981",
      badge: "MUSE VISUAL",
      metricValue: "16:9",
      metricLabel: "Studio Canvas"
    }
  );

  const spec = designSpec.data;
  const fileName = `muse-visual-${Date.now()}.png`;
  const filePath = path.join(genDir, fileName);

  let browser = null;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; }
  body {
    width: 1920px;
    height: 1080px;
    background: #07070c;
    color: #ffffff;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .orb-1 {
    position: absolute;
    width: 1100px;
    height: 1100px;
    border-radius: 50%;
    background: radial-gradient(circle, ${spec.primaryColor || "#7C5CFF"}66 0%, transparent 70%);
    top: -250px;
    left: -150px;
    filter: blur(50px);
  }
  .orb-2 {
    position: absolute;
    width: 950px;
    height: 950px;
    border-radius: 50%;
    background: radial-gradient(circle, ${spec.secondaryColor || "#0EA5E9"}55 0%, transparent 70%);
    bottom: -250px;
    right: -100px;
    filter: blur(60px);
  }
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 64px 64px;
  }
  .card {
    position: relative;
    z-index: 10;
    width: 1480px;
    height: 760px;
    border-radius: 36px;
    background: rgba(17, 17, 28, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 40px 120px rgba(0,0,0,0.75);
    padding: 88px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 22px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.16);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${spec.accentColor || "#A78BFA"};
    width: fit-content;
  }
  h1 {
    font-size: 84px;
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -0.03em;
    max-width: 1100px;
    margin-top: 28px;
  }
  p {
    font-size: 30px;
    line-height: 1.45;
    color: rgba(255,255,255,0.72);
    max-width: 960px;
    margin-top: 24px;
  }
  .footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 36px;
  }
  .metric-val {
    font-size: 64px;
    font-weight: 800;
    color: ${spec.primaryColor || "#7C5CFF"};
  }
  .metric-lbl {
    font-size: 20px;
    color: rgba(255,255,255,0.55);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
</style>
</head>
<body>
  <div class="orb-1"></div>
  <div class="orb-2"></div>
  <div class="grid-overlay"></div>
  <div class="card">
    <div>
      <div class="badge">${spec.badge || "MUSE AI VISUAL"}</div>
      <h1>${spec.headline}</h1>
      <p>${spec.subheadline}</p>
    </div>
    <div class="footer">
      <div>
        <div class="metric-val">${spec.metricValue || "16:9"}</div>
        <div class="metric-lbl">${spec.metricLabel || "Chronicle Visual Canvas"}</div>
      </div>
      <div style="font-size:20px;color:rgba(255,255,255,0.45)">Generated by Chronicle Muse (${designSpec.model})</div>
    </div>
  </div>
</body>
</html>`;
    await page.setContent(html, { waitUntil: "load" });
    await page.screenshot({ path: filePath, type: "png" });
  } finally {
    if (browser) await browser.close();
  }

  return {
    url: `/uploads/generated/${fileName}`,
    fileName,
    colors: [
      spec.primaryColor || "#7C5CFF",
      spec.secondaryColor || "#0EA5E9",
      spec.accentColor || "#10B981"
    ],
    provider: designSpec.provider === "azure-openai" ? "azure-openai" : "playwright-studio",
    model: designSpec.model
  };
}

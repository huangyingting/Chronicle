import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "docs",
        badge: "CHRONICLE DEVELOPER DOCS",
        title: "Chronicle Public REST API & MCP Server Reference",
        subtitle:
          "Integrate Chronicle deck generation into Claude Desktop, Cursor, or your own services using bearer API keys.",
        highlights: [
          {
            metric: "POST /api/v1/decks",
            title: "Create Deck from Prompt or Outline",
            description:
              "Synthesize a complete multi-slide presentation and receive live editor_url and share_url links."
          },
          {
            metric: "GET /api/v1/decks",
            title: "List & Inspect Workspace Decks",
            description:
              "Retrieve metadata, slide counts, and share links for all presentations in your workspace."
          },
          {
            metric: "MCP Server",
            title: "Model Context Protocol Ready",
            description:
              "Create keys in Settings → Chronicle MCP to allow AI agents to author decks on your behalf."
          }
        ]
      }}
    />
  );
}

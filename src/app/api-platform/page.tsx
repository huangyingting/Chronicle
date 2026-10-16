import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "api-platform",
        badge: "CHRONICLE API & MCP SERVER",
        title: "Generate presentations from any AI agent or workflow",
        subtitle:
          "Connect Claude Desktop, Cursor, or your backend services via Chronicle's REST API and Model Context Protocol (MCP) server.",
        highlights: [
          {
            metric: "REST v1",
            title: "Programmatic Deck Creation",
            description:
              "POST a topic or structured JSON outline to /api/v1/decks and receive live editor and share URLs."
          },
          {
            metric: "MCP",
            title: "Native Claude & Cursor Integration",
            description:
              "Generate workspace API keys in Settings → Chronicle MCP and let your coding or research agent build decks."
          },
          {
            metric: "<400ms",
            title: "Instant Theme & Brand Kit Binding",
            description:
              "Pass any brand_kit_id or theme_id to enforce corporate design tokens across automated reports."
          }
        ]
      }}
    />
  );
}

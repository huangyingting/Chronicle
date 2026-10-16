import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "chronicle-vs-gamma",
        badge: "CHRONICLE VS GAMMA",
        title: "Why design-forward leaders choose Chronicle over Gamma",
        subtitle:
          "Compare Chronicle's 16:9 precision bento grid, 34+ smart widgets, and 1-click Brand Kits against document-style AI tools.",
        highlights: [
          {
            title: "Boardroom-Ready 16:9 Precision",
            description:
              "Designed for high-stakes live presenting and crisp exports—never awkward scrolling web docs."
          },
          {
            title: "34+ Purpose-Built Smart Widgets",
            description:
              "Dedicated blocks for KPI metrics, comparison tables, Gantt charts, funnels, and SWOT grids."
          },
          {
            title: "Native REST API & MCP Server",
            description:
              "Generate and update decks directly from Claude, Cursor, or your own automation pipelines."
          }
        ]
      }}
    />
  );
}

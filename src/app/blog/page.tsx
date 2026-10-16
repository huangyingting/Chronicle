import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "blog",
        badge: "CHRONICLE BLOG & CHANGELOG",
        title: "Product updates, design essays, and storytelling playbooks",
        subtitle:
          "Read how we built Chronicle 2.0, the Smart Widget engine, and our public MCP server for AI agents.",
        highlights: [
          {
            metric: "Launch",
            title: "Introducing Chronicle 2.0 & AI Muse",
            description:
              "A new two-stage storyline generator paired with 19 official studio themes and 1-click Brand Kits."
          },
          {
            metric: "Engineering",
            title: "Why We Built 34+ Smart Widgets Instead of Freeform Boxes",
            description:
              "How responsive bento blocks eliminate manual alignment while preserving creative expression."
          },
          {
            metric: "Platform",
            title: "Chronicle MCP: Generate Slides Directly from Claude & Cursor",
            description:
              "Connect your AI assistant to Chronicle Studio with a workspace API key in under 60 seconds."
          }
        ]
      }}
    />
  );
}

import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "pricing",
        badge: "SIMPLE, TRANSPARENT PRICING",
        title: "Start free. Scale as your storytelling grows.",
        subtitle:
          "Every workspace includes our interactive Smart Widget canvas, 19 studio themes, and AI Muse storyline generation.",
        highlights: [
          {
            title: "Unlimited Presentations",
            description:
              "Create, organize in folders, and present unlimited decks across your workspace."
          },
          {
            title: "Generous AI Token Allowances",
            description:
              "Generate full decks, remix slide layouts, and co-author with Ask Muse."
          },
          {
            title: "Full REST API & MCP Access",
            description:
              "Included on Plus and Max plans so your agents can generate presentations on demand."
          }
        ]
      }}
    />
  );
}

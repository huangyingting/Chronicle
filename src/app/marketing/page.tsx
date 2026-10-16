import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "marketing",
        badge: "CHRONICLE FOR MARKETING",
        title: "Launch campaigns, GTM playbooks, and brand decks that stand out",
        subtitle:
          "Enforce 100% brand consistency across every campaign readout, partner pitch, and event keynote.",
        highlights: [
          {
            title: "Centralized Brand Kits & Custom Fonts",
            description:
              "Lock in approved logos, brand palettes, and custom WOFF2 typography for your entire team."
          },
          {
            title: "Funnel & Channel Performance Widgets",
            description:
              "Visualize conversion funnels, CAC payback, and pipeline attribution without spreadsheet screenshots."
          },
          {
            title: "Shared Media Library",
            description:
              "Access approved product screenshots, campaign visuals, and AI-generated imagery in one click."
          }
        ]
      }}
    />
  );
}

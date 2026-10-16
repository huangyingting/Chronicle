import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "ai-presentation-maker",
        badge: "AI PRESENTATION MAKER",
        title: "From rough prompt to board-ready deck in 30 seconds",
        subtitle:
          "Chronicle Muse synthesizes structured executive storylines, selects the right smart widgets for every slide, and applies your Brand Kit automatically.",
        highlights: [
          {
            metric: "30s",
            title: "Two-Stage Storyline Synthesis",
            description:
              "Edit and reorder section-by-section narrative outlines before generating visual slides."
          },
          {
            metric: "34+",
            title: "Smart Widget Selection",
            description:
              "Automatically chooses KPI metrics, comparison tables, timelines, or SWOT grids for each topic."
          },
          {
            metric: "100%",
            title: "Brand-Governed Output",
            description:
              "Every generated slide honors your brand colors, fonts, and dark/light surface rules."
          }
        ]
      }}
    />
  );
}

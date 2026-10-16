import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "chronicle-vs-pitch",
        badge: "CHRONICLE VS PITCH",
        title: "Next-generation AI storytelling vs legacy slide formatting",
        subtitle:
          "Stop spending hours dragging text boxes. Chronicle combines AI storyline synthesis with instant bento layout remixing.",
        highlights: [
          {
            title: "Zero Manual Alignment",
            description:
              "Every smart widget snaps cleanly into an intelligent 12-column grid and resizes automatically."
          },
          {
            title: "1-Click Slide Layout Remixing",
            description:
              "Switch any slide between 6 structural layouts without retyping a single word."
          },
          {
            title: "Built-In Ask Muse Copilot",
            description:
              "Rewrite for executives, inject KPI benchmarks, or generate timelines right on the canvas."
          }
        ]
      }}
    />
  );
}

import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "academy",
        badge: "CHRONICLE ACADEMY",
        title: "Master the art of high-conviction executive storytelling",
        subtitle:
          "Short, actionable lessons on structuring board decks, fundraising narratives, and visual hierarchy.",
        highlights: [
          {
            metric: "Module 01",
            title: "The Pyramid Principle for Slides",
            description:
              "Lead every slide with an assertive headline takeaway backed by 3 structured evidence blocks."
          },
          {
            metric: "Module 02",
            title: "Designing with Smart Bento Grids",
            description:
              "Combine metric cards, comparison matrices, and timelines without visual clutter."
          },
          {
            metric: "Module 03",
            title: "AI Co-Authoring with Muse",
            description:
              "Use Chronicle Muse to condense dense memos into sharp, scannable executive slides."
          }
        ]
      }}
    />
  );
}

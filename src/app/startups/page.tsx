import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "startups",
        badge: "CHRONICLE FOR FOUNDERS & STARTUPS",
        title: "Raise your next round with a pitch deck investors remember",
        subtitle:
          "Built on proven VC fundraising arcs—from problem & market wedge to unit economics and Series A/B milestones.",
        highlights: [
          {
            metric: "$2B+",
            title: "Raised with Chronicle Storylines",
            description:
              "Structured around the exact metrics and narrative flow top-tier investors look for."
          },
          {
            metric: "19",
            title: "Cinematic Dark & Light Themes",
            description:
              "Stand out from generic slide templates with signature dark-mode bento aesthetics."
          },
          {
            metric: "Instant",
            title: "Investor Update Templates",
            description:
              "Keep your board and angels aligned every quarter with reusable KPI & runway blocks."
          }
        ]
      }}
    />
  );
}

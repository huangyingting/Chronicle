import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "sales",
        badge: "CHRONICLE FOR SALES & GTM",
        title: "Close enterprise deals faster with tailored interactive decks",
        subtitle:
          "Generate account-specific proposals, ROI breakdowns, and competitive matrices governed by your Brand Kit.",
        highlights: [
          {
            metric: "3.4x",
            title: "Faster Proposal Turnaround",
            description:
              "Spin up customized executive readout decks immediately after discovery calls."
          },
          {
            metric: "1-Click",
            title: "Prospect Brand Kit Personalization",
            description:
              "Enter your prospect's domain to co-brand cover slides with their official logo and palette."
          },
          {
            metric: "Live",
            title: "Interactive Comparison Matrices",
            description:
              "Highlight your product differentiation with clean, scannable comparison tables."
          }
        ]
      }}
    />
  );
}

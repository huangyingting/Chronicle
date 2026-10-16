import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "gallery",
        badge: "CHRONICLE DECK GALLERY",
        title: "Explore real decks crafted by world-class storytellers",
        subtitle:
          "Inspect live board decks, Series B fundraising pitches, and product strategy roadmaps built in Chronicle Studio.",
        highlights: [
          {
            title: "Executive Board Updates",
            description:
              "See how hyper-growth leaders structure quarterly KPIs, retention cohorts, and strategic priorities."
          },
          {
            title: "Venture Fundraising Decks",
            description:
              "Study high-converting narrative arcs used to raise Seed, Series A, and Series B rounds."
          },
          {
            title: "1-Click Remix Ready",
            description:
              "Open any featured deck directly in Chronicle Studio or duplicate it into your workspace."
          }
        ]
      }}
    />
  );
}

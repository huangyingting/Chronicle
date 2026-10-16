import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "solutions",
        badge: "SOLUTIONS BY ROLE",
        title: "One storytelling engine for every team in your company",
        subtitle:
          "From founder pitch decks and enterprise sales proposals to quarterly product roadmaps and agency client deliverables.",
        highlights: [
          {
            title: "Founders & Executive Leadership",
            description:
              "Ship board updates, investor pitches, and all-hands keynotes in a fraction of the time."
          },
          {
            title: "Revenue & GTM Teams",
            description:
              "Personalize account-specific sales decks automatically with prospect Brand Kits."
          },
          {
            title: "Product, Design & Strategy",
            description:
              "Turn PRDs and strategy memos into interactive roadmaps with embedded Figma prototypes."
          }
        ]
      }}
    />
  );
}

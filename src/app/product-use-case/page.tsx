import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "product-use-case",
        badge: "CHRONICLE FOR PRODUCT TEAMS",
        title: "Turn PRDs and roadmaps into high-clarity product narratives",
        subtitle:
          "Align engineering, design, and leadership around quarterly priorities with interactive timelines, Gantt charts, and Figma embeds.",
        highlights: [
          {
            title: "Interactive Roadmap & Gantt Blocks",
            description:
              "Communicate quarterly milestones, dependencies, and launch phases clearly."
          },
          {
            title: "Live Figma & Loom Embeds",
            description:
              "Walk stakeholders through interactive prototypes and async video demos right on the slide."
          },
          {
            title: "Instant Executive Summaries",
            description:
              "Use Ask Muse to distill technical specifications into board-level takeaways."
          }
        ]
      }}
    />
  );
}

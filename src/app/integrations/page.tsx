import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "integrations",
        badge: "LIVE INTEGRATIONS & EMBEDS",
        title: "Bring your live product, data, and prototypes into every slide",
        subtitle:
          "Embed interactive Figma frames, Loom video walkthroughs, YouTube demos, X posts, and live web apps directly inside your presentation.",
        highlights: [
          {
            title: "Figma & Prototype Embeds",
            description:
              "Showcase live interactive product flows during design reviews without leaving your slide deck."
          },
          {
            title: "Loom & Video Storytelling",
            description:
              "Attach async video commentary or product demos directly inside split-screen smart widgets."
          },
          {
            title: "Live Charts & Web Iframes",
            description:
              "Bind real-time revenue charts, funnels, and comparison tables that update dynamically."
          }
        ]
      }}
    />
  );
}

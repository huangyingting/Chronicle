import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "agencies",
        badge: "CHRONICLE FOR AGENCIES & CONSULTANCIES",
        title: "Deliver studio-grade client decks in a fraction of the billable hours",
        subtitle:
          "Manage multiple client Brand Kits, switch themes instantly, and share interactive web presentations with custom branding.",
        highlights: [
          {
            metric: "Unlimited",
            title: "Multi-Client Brand Kits",
            description:
              "Import any client's domain to extract their logos, colors, and typography in seconds."
          },
          {
            metric: "5x",
            title: "Faster Pitch & Strategy Readouts",
            description:
              "Focus your team on strategic insights while Chronicle handles layout and visual polish."
          },
          {
            metric: "Zero",
            title: "Watermark-Free Client Sharing",
            description:
              "Deliver responsive web links or crisp PDF/PPTX exports tailored to each client."
          }
        ]
      }}
    />
  );
}

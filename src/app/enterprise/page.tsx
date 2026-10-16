import { MarketingPageView } from "@/components/marketing/MarketingPageView";

export default function Page() {
  return (
    <MarketingPageView
      config={{
        slug: "enterprise",
        badge: "CHRONICLE ENTERPRISE",
        title: "Enterprise-grade storytelling with brand governance and security",
        subtitle:
          "Deploy Chronicle across your organization with workspace role permissions, centralized Brand Kits, and private API/MCP automation.",
        highlights: [
          {
            title: "Workspace Access & Folder Permissions",
            description:
              "Control view, comment, edit, and no-access permissions at both the folder and document level."
          },
          {
            title: "Locked Corporate Brand Kits",
            description:
              "Ensure every deck created across sales, product, and leadership adheres to official brand tokens."
          },
          {
            title: "Dedicated MCP & REST API Keys",
            description:
              "Provision and revoke scoped API tokens for internal AI agents and reporting pipelines."
          }
        ]
      }}
    />
  );
}

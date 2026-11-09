import type { MetadataRoute } from "next";

const baseUrl = "https://www.spendshift.com.au";

const routes = [
  "/",
  "/how-it-works",
  "/why-spendshift",
  "/pricing",
  "/whats-included",
  "/save-money-australia",
  "/services",
  "/financial-information-ai-disclaimer",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cookies",
  "/refund-policy",
  "/audit",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}

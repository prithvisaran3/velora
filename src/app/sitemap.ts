import { MetadataRoute } from "next";
import { sareesFixture } from "@/model/fixtures/sarees";
import { configFixture } from "@/model/fixtures/config.fixture";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://velora-storefront.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/offers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/story`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const sareeRoutes: MetadataRoute.Sitemap = sareesFixture.map((saree) => ({
    url: `${baseUrl}/saree/${saree.slug}`,
    lastModified: new Date(saree.updatedAt),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const colourRoutes: MetadataRoute.Sitemap = Object.keys(configFixture.colours).map((key) => ({
    url: `${baseUrl}/colour/${key}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const occasionRoutes: MetadataRoute.Sitemap = Object.keys(configFixture.occasions).map((key) => ({
    url: `${baseUrl}/occasion/${key}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...sareeRoutes, ...colourRoutes, ...occasionRoutes];
}

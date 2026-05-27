import type { MetadataRoute } from "next";

const BASE_URL = "https://rentvsbuy-eta.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/methodology"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}

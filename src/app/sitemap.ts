import type { MetadataRoute } from "next";
import { HAZARD_SLUGS } from "@/lib/hazards";

const STATIC_PATHS = [
  "",
  "/hazards",
  "/map",
  "/shelters",
  "/report",
  "/relief",
  "/volunteer",
  "/explorer",
  "/quiz",
  "/games",
  "/games/lightning",
  "/games/go-bag",
  "/ferries",
  "/contacts",
  "/plan",
  "/progress",
  "/teacher",
  "/lite",
  "/privacy",
  "/terms",
  "/case-study",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paths = [...STATIC_PATHS, ...HAZARD_SLUGS.map((s) => `/hazards/${s}`), ...HAZARD_SLUGS.map((s) => `/quiz/${s}`), ...HAZARD_SLUGS.map((s) => `/teacher/${s}`)];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        en: `${base}${path}`,
        bn: `${base}/bn${path}`,
      },
    },
  }));
}

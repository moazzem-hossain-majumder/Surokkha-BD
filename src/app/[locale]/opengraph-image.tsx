import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY: Record<string, { title: string; tagline: string }> = {
  en: { title: "Surokkha BD", tagline: "Be ready, stay safe. Guides and help for every natural disaster in Bangladesh." },
  bn: { title: "সুরক্ষা বিডি", tagline: "প্রস্তুত থাকুন, নিরাপদ থাকুন। বাংলাদেশের প্রতিটি প্রাকৃতিক দুর্যোগের জন্য গাইড ও সহায়তা।" },
};

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = COPY[locale] ?? COPY.en;

  // Satori (the renderer behind ImageResponse) supports .ttf/.otf/.woff but
  // not .woff2, so this loads the one .woff file the Bangla font ships
  // (@fontsource ships variable-weight fonts as .woff2 only, which is why
  // the rest of the app can't reuse this exact file for regular text).
  const banglaFont = await readFile(
    path.join(process.cwd(), "node_modules/@fontsource/hind-siliguri/files/hind-siliguri-bengali-700-normal.woff")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0B1F1A",
          color: "#F5F8F7",
          fontFamily: locale === "bn" ? "Hind Siliguri" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: "#2FBF8F" }} />
          <div style={{ fontSize: 32, fontWeight: 700, color: "#2FBF8F" }}>{locale === "bn" ? "সুরক্ষা বিডি" : "Surokkha BD"}</div>
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, marginTop: 40, maxWidth: 1000 }}>{copy.title}</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 24, maxWidth: 900, color: "#C7D6D0" }}>{copy.tagline}</div>
      </div>
    ),
    {
      ...size,
      fonts: locale === "bn" ? [{ name: "Hind Siliguri", data: banglaFont, weight: 700, style: "normal" }] : [],
    }
  );
}

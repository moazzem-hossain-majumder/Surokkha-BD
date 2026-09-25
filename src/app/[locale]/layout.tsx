import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { BanglaPrompt } from "@/components/BanglaPrompt";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OfflineQueueBanner } from "@/components/OfflineQueueBanner";
import { ThemeScript } from "@/components/ThemeScript";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/anek-bangla";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: t("title"), template: `%s | ${t("siteName")}` },
    description: t("description"),
    alternates: { languages: { en: "/", bn: "/bn" } },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F8F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1419" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("header");

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:text-brand-ink"
          >
            {t("skip")}
          </a>
          <BanglaPrompt />
          <OfflineQueueBanner />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ServiceWorkerRegistration />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

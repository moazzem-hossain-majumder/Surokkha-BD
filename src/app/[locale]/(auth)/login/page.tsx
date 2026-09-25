import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "./LoginForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("loginTitle") };
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-3xl">{t("loginTitle")}</h1>
      <p className="mt-2 text-ink-2">{t("loginIntro")}</p>
      <Card className="mt-6 p-6">
        <LoginForm locale={locale} />
      </Card>
      <p className="mt-4 text-sm text-ink-2">
        {t("noAccount")} <Link href="/signup" className="font-semibold text-brand underline">{t("signUpLink")}</Link>
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { SignupForm } from "./SignupForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("signupTitle") };
}

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-3xl">{t("signupTitle")}</h1>
      <p className="mt-2 text-ink-2">{t("signupIntro")}</p>
      <Card className="mt-6 p-6">
        <SignupForm locale={locale} />
      </Card>
      <p className="mt-4 text-sm text-ink-2">
        {t("haveAccount")} <Link href="/login" className="font-semibold text-brand underline">{t("signInLink")}</Link>
      </p>
    </div>
  );
}

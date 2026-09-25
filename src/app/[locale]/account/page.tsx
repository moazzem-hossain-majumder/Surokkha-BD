import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { getDistrict } from "@/lib/districts";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { SignOutButton } from "./SignOutButton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("accountTitle") };
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect({ href: "/login", locale });
    return null;
  }

  const district = profile.district_code ? getDistrict(profile.district_code) : undefined;

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-3xl">{t("accountTitle")}</h1>
      <Card className="mt-6 space-y-3 p-6">
        <p>
          <span className="text-sm text-ink-3">{t("displayName")}</span>
          <br />
          <span className="font-semibold">{profile.display_name || "—"}</span>
        </p>
        <p>
          <span className="text-sm text-ink-3">{t("role")}</span>
          <br />
          <span className="font-semibold">{t(`roles.${profile.role}`)}</span>
        </p>
        {district && (
          <p>
            <span className="text-sm text-ink-3">{t("district")}</span>
            <br />
            <span className="font-semibold">{locale === "bn" ? district.name.bn : district.name.en}</span>
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          {(profile.role === "coordinator" || profile.role === "admin") && (
            <LinkButton href="/admin" variant="secondary">
              {t("goToAdmin")}
            </LinkButton>
          )}
          <SignOutButton locale={locale} />
        </div>
      </Card>
    </div>
  );
}

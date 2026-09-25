import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ShelterForm } from "./ShelterForm";
import { ActiveToggle } from "./ActiveToggle";

interface ShelterRow {
  id: string;
  name_en: string;
  name_bn: string;
  type: string;
  district_code: string;
  capacity: number | null;
  active: boolean;
}

export default async function AdminSheltersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const { data } = await supabase
    .from("shelters")
    .select("id, name_en, name_bn, type, district_code, capacity, active")
    .order("name_en")
    .limit(200);

  const shelters = (data ?? []) as ShelterRow[];

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-bold">{t("shelters.newShelter")}</h2>
        <div className="mt-4">
          <ShelterForm locale={locale} />
        </div>
      </Card>

      <section>
        <h2 className="text-xl font-bold">{t("shelters.existing")}</h2>
        <ul className="mt-4 space-y-2">
          {shelters.map((s) => (
            <li key={s.id}>
              <Card className={`flex flex-wrap items-center justify-between gap-3 p-4 ${!s.active ? "opacity-60" : ""}`}>
                <div>
                  <p className="font-semibold">{locale === "bn" ? s.name_bn : s.name_en}</p>
                  <p className="text-sm text-ink-2">
                    {t(`shelters.types.${s.type}`)} · {s.district_code} · {t("shelters.capacity")}: {s.capacity ?? "—"}
                  </p>
                </div>
                <ActiveToggle locale={locale} id={s.id} active={s.active} />
              </Card>
            </li>
          ))}
          {shelters.length === 0 && <p className="text-ink-2">{t("shelters.none")}</p>}
        </ul>
      </section>
    </div>
  );
}

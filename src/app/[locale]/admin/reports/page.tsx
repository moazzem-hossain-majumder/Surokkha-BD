import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getReportPhotoUrl } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";
import { REPORT_TYPE_LABELS, type ReportType } from "@/lib/reports";
import { ModerationActions } from "./ModerationActions";

interface ReportRow {
  id: string;
  type: ReportType;
  description: string;
  district_code: string | null;
  contact_optional: string | null;
  photo_path: string | null;
  status: string;
  created_at: string;
}

export default async function AdminReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const { data } = await supabase
    .from("reports")
    .select("id, type, description, district_code, contact_optional, photo_path, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(100);

  const reports = (data ?? []) as ReportRow[];
  const withPhotos = await Promise.all(
    reports.map(async (r) => ({ ...r, photoUrl: r.photo_path ? await getReportPhotoUrl(r.photo_path) : null }))
  );

  return (
    <div>
      <h2 className="text-xl font-bold">{t("reports.pending")}</h2>
      <ul className="mt-4 space-y-4">
        {withPhotos.map((r) => (
          <li key={r.id}>
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {locale === "bn" ? REPORT_TYPE_LABELS[r.type].bn : REPORT_TYPE_LABELS[r.type].en}
                    {r.district_code ? ` · ${r.district_code}` : ""}
                  </p>
                  <p className="mt-1 max-w-xl text-ink-2">{r.description}</p>
                  {r.contact_optional && <p className="mt-1 text-sm text-ink-3">{t("reports.contact")}: {r.contact_optional}</p>}
                  <p className="mt-1 text-xs text-ink-3">{new Date(r.created_at).toLocaleString(locale === "bn" ? "bn-BD" : "en-US")}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {r.photoUrl && <img src={r.photoUrl} alt="" className="h-24 w-24 rounded-card object-cover" />}
              </div>
              <div className="mt-3">
                <ModerationActions locale={locale} id={r.id} />
              </div>
            </Card>
          </li>
        ))}
        {withPhotos.length === 0 && <p className="text-ink-2">{t("reports.none")}</p>}
      </ul>
    </div>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getDistrict } from "@/lib/districts";
import { Card } from "@/components/ui/Card";
import { SKILL_LABELS, type PublicTask, type VolunteerProfileInput, type ApplicationStatus } from "@/lib/volunteers";
import { ProfileForm } from "./ProfileForm";
import { ApplyForm } from "./ApplyForm";

export default async function VolunteerHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("volunteer");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: tasksData }, { data: profileData }, { data: applicationsData }] = await Promise.all([
    supabase.from("volunteer_tasks_public").select("*").order("created_at", { ascending: false }).limit(50),
    user ? supabase.from("volunteers").select("skills, district_code, availability").eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? supabase.from("task_applications").select("task_id, status").eq("volunteer_id", user.id) : Promise.resolve({ data: null }),
  ]);

  const tasks = (tasksData ?? []) as PublicTask[];
  const profile = profileData
    ? ({ skills: profileData.skills, districtCode: profileData.district_code, availability: profileData.availability } as VolunteerProfileInput)
    : null;
  const applicationByTask = new Map<string, ApplicationStatus>();
  for (const a of (applicationsData ?? []) as { task_id: string; status: ApplicationStatus }[]) {
    applicationByTask.set(a.task_id, a.status);
  }

  return (
    <div className="mx-auto max-w-[900px] px-5 py-10">
      <h1 className="text-3xl">{t("title")}</h1>
      <p className="mt-2 text-ink-2">{t("intro")}</p>

      <Card className="mt-8 p-6">
        <h2 className="text-xl font-bold">{profile ? t("yourProfile") : t("becomeAVolunteer")}</h2>
        <div className="mt-4">
          <ProfileForm locale={locale} existing={profile} />
        </div>
      </Card>

      <section className="mt-10">
        <h2 className="text-xl font-bold">{t("openTasks")}</h2>
        <ul className="mt-4 space-y-4">
          {tasks.map((task) => {
            const district = getDistrict(task.district_code);
            const applicationStatus = applicationByTask.get(task.id);
            const full = task.slots_filled >= task.slots;
            return (
              <li key={task.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm text-ink-2">
                      {district ? (locale === "bn" ? district.name.bn : district.name.en) : task.district_code}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-ink-2">{task.description}</p>
                  <p className="mt-1 text-xs text-ink-3">{task.location}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {task.required_skills.map((s) => (
                      <span key={s} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold">
                        {locale === "bn" ? SKILL_LABELS[s].bn : SKILL_LABELS[s].en}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-ink-3">{t("slotsFilled", { filled: task.slots_filled, total: task.slots })}</p>

                  {applicationStatus ? (
                    <p className="mt-2 text-sm font-semibold">{t(`applicationStatus.${applicationStatus}`)}</p>
                  ) : full ? (
                    <p className="mt-2 text-sm text-ink-2">{t("taskFull")}</p>
                  ) : user ? (
                    <ApplyForm locale={locale} taskId={task.id} hasProfile={!!profile} />
                  ) : (
                    <p className="mt-2 text-sm text-ink-2">{t("signInToApply")}</p>
                  )}
                </Card>
              </li>
            );
          })}
          {tasks.length === 0 && <p className="text-ink-2">{t("noTasks")}</p>}
        </ul>
      </section>
    </div>
  );
}
